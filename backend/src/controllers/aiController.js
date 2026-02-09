const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const fs = require('fs');
const Car = require('../models/Car');
const Booking = require('../models/Booking');
const User = require('../models/User');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to find matching cars based on natural language
const findMatchingCars = async (message, availableCars) => {
  const criteria = {
    budget: null,
    passengers: null,
    type: null,
    purpose: null,
    transmission: null
  };

  // Budget detection
  const budgetMatch = message.match(/under[₹\s]*(\d+)|below[₹\s]*(\d+)|budget[₹\s]*(\d+)|around[₹\s]*(\d+)/i);
  if (budgetMatch) {
    criteria.budget = parseInt(budgetMatch[1] || budgetMatch[2] || budgetMatch[3] || budgetMatch[4]);
  }

  // Passenger count
  const passengerMatch = message.match(/(\d+)\s*(?:people|passengers|persons|seater)/i);
  if (passengerMatch) {
    criteria.passengers = parseInt(passengerMatch[1]);
  }

  // Car type detection
  if (/suv|big|spacious|large|xuv/i.test(message)) criteria.type = 'SUV';
  if (/sedan|comfortable|smooth|city/i.test(message)) criteria.type = 'Sedan';
  if (/hatchback|small|compact/i.test(message)) criteria.type = 'Hatchback';
  if (/luxury|premium|business|expensive|mercedes|bmw|audi/i.test(message)) criteria.type = 'Luxury';

  // Transmission
  if (/automatic|auto/i.test(message)) criteria.transmission = 'Automatic';
  if (/manual/i.test(message)) criteria.transmission = 'Manual';

  // Purpose detection
  if (/family|trip|vacation|goa|highway|outstation/i.test(message)) criteria.purpose = 'family_trip';
  if (/business|meeting|client|professional/i.test(message)) criteria.purpose = 'business';
  if (/city|daily|commute|office/i.test(message)) criteria.purpose = 'city';
  if (/cheap|budget|affordable|economical|cheapest/i.test(message)) criteria.purpose = 'budget';

  // Filter cars based on criteria
  let matches = [...availableCars];

  if (criteria.budget) {
    matches = matches.filter(car => car.pricePerDay <= criteria.budget);
  }

  if (criteria.passengers) {
    matches = matches.filter(car => car.seats >= criteria.passengers);
  }

  if (criteria.type) {
    matches = matches.filter(car => 
      car.category && car.category.toLowerCase() === criteria.type.toLowerCase()
    );
  }

  if (criteria.transmission) {
    matches = matches.filter(car => 
      car.transmission.toLowerCase() === criteria.transmission.toLowerCase()
    );
  }

  // Sort by relevance
  matches = matches.sort((a, b) => {
    let scoreA = 0, scoreB = 0;
    
    if (criteria.purpose === 'budget') {
      scoreA = -a.pricePerDay;
      scoreB = -b.pricePerDay;
    } else if (criteria.purpose === 'luxury' || criteria.purpose === 'business') {
      scoreA = a.pricePerDay + (a.rating || 0) * 100;
      scoreB = b.pricePerDay + (b.rating || 0) * 100;
    } else {
      scoreA = (a.rating || 0) * 100 - a.pricePerDay;
      scoreB = (b.rating || 0) * 100 - b.pricePerDay;
    }
    
    return scoreB - scoreA;
  });

  return { matches: matches.slice(0, 3), criteria };
};

// @desc    Chat with AI Assistant
// @route   POST /api/ai/chat
// @access  Private
exports.chatWithAI = async (req, res) => {
  try {
    const { message, chatHistory = [] } = req.body;

    // Validate message
    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    console.log('📨 AI Chat Request:', {
      userId: req.user.id,
      userName: req.user.name,
      message: message.substring(0, 50) + '...'
    });

    // Get user details
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's recent bookings
    const userBookings = await Booking.find({ user: req.user.id })
      .populate('car')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get available cars
    const availableCars = await Car.find({ available: true })
      .limit(20)
      .select('brand model type pricePerDay fuelType seatingCapacity features transmission rating images');

    console.log('📊 Context:', {
      availableCars: availableCars.length,
      userBookings: userBookings.length
    });

    // Smart car matching
    const { matches, criteria } = await findMatchingCars(message, availableCars);

    // Build enhanced system context
    const systemContext = `
You are an AI assistant for RentRide Car Rental service in India. You help users find and rent cars.

GUIDELINES:
- Be friendly, helpful, and conversational
- Keep responses concise (under 150 words)
- **INTELLIGENT MATCHING**: Analyze user needs (budget, passengers, purpose, preferences)
- When recommending cars, suggest 2-3 options with clear reasoning
- Always use Indian Rupees (₹) for prices
- Ask clarifying questions if needed (budget, duration, passengers)
- Provide alternatives if exact match not available
- Mention key features that match user needs

RECOMMENDATION STRATEGY:
- Budget trips → Prioritize fuel efficiency and low price
- Family trips → Focus on space (7-seater), comfort, reliability
- Business → Suggest luxury, professional appearance, chauffeur option
- City commute → Compact, automatic, fuel-efficient, easy parking

USER INFO:
- Name: ${user.name}
- Email: ${user.email}
- Total Bookings: ${userBookings.length}
${userBookings.length > 0 ? `- Previous: ${userBookings[0].car.brand} ${userBookings[0].car.model}` : ''}

AVAILABLE CARS (${availableCars.length} total):
${availableCars.slice(0, 15).map(car => 
  `• ${car.brand} ${car.model} (${car.category}) - ₹${car.pricePerDay}/day - ${car.fuelType} - ${car.transmission} - ${car.seats} seats - Rating: ${car.rating || 'N/A'}/5`
).join('\n')}


${matches.length > 0 ? `\n🎯 BEST MATCHES FOR USER QUERY:\n${matches.map(car => 
  `⭐ ${car.brand} ${car.model} - ₹${car.pricePerDay}/day (${car.seatingCapacity} seats, ${car.transmission})`
).join('\n')}` : ''}

IMPORTANT: 
- When user asks about availability, recommend from the list above
- Match cars to their specific needs (budget, passengers, trip type)
- Explain WHY each car is suitable
- If asking about insurance, damage, or bookings - provide helpful guidance
`;

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-latest',
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
      }
    });

    // Build conversation history (last 8 messages for context)
    const conversationHistory = [
      {
        role: 'user',
        parts: [{ text: systemContext }]
      },
      {
        role: 'model',
        parts: [{ text: `Hello ${user.name}! I'm your RentRide AI assistant. I can help you find the perfect car for your needs. Whether it's a budget trip, family vacation, or business meeting - I've got you covered! How can I assist you today?` }]
      },
      ...chatHistory.slice(-8).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }))
    ];

    // Start chat with context
    const chat = model.startChat({
      history: conversationHistory
    });

    // Send user message and get AI response
    const result = await chat.sendMessage(message);
    const aiResponse = result.response.text();

    console.log('✅ AI Response Generated:', aiResponse.substring(0, 100) + '...');

    // Prepare suggestions based on context
    const suggestions = [];
    if (/car|available|show|need/i.test(message) && matches.length > 0) {
      suggestions.push('Tell me more about the Toyota Fortuner');
      suggestions.push('What are the cheapest options?');
      suggestions.push('Show me automatic cars');
    } else if (/insurance|damage|protect/i.test(message)) {
      suggestions.push('Do I need insurance?');
      suggestions.push('What add-ons are available?');
    } else {
      suggestions.push('Show me available cars');
      suggestions.push('I need a car for 5 people');
      suggestions.push('Budget friendly options?');
    }


res.status(200).json({
  success: true,
  data: {
    message: aiResponse,
    timestamp: new Date(),
    suggestions: suggestions.slice(0, 3),
    matchedCars: matches.length > 0 ? matches.map(car => ({
      id: car._id,
      name: `${car.brand} ${car.model}`,
      category: car.category,  
      price: car.pricePerDay,
      seats: car.seats,         
      transmission: car.transmission,
      image: car.images && car.images[0] ? car.images[0] : 'default'
    })) : []
  }
});


  } catch (error) {
    console.error('❌ AI Chat Error:', error.message);
    console.error('Error details:', error);

    // Fallback response if AI service fails
    const fallbackMessage = `I'm sorry, I'm having some trouble right now. Here's what I can help you with:

🚗 **Find Cars** - Browse our available vehicles
🛡️ **Insurance Help** - Get advice on rental insurance
📸 **Image Search** - Identify cars from photos
🔧 **Report Damage** - Guide you through damage reporting

You can also browse our cars manually or contact support at support@rentride.com for immediate assistance!`;

    res.status(200).json({
      success: true,
      data: {
        message: fallbackMessage,
        timestamp: new Date(),
        isFallback: true,
        suggestions: [
          'Show me available cars',
          'I need insurance advice',
          'How do I report damage?'
        ]
      }
    });
  }
};

// @desc    Identify car from image and find similar available cars
// @route   POST /api/ai/identify-car
// @access  Private
exports.identifyCarFromImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    console.log('📸 Car identification request:', req.file.originalname);

    // Read image file
    const imageBuffer = fs.readFileSync(req.file.path);
    
    try {
      // Use HuggingFace Image Classification
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/microsoft/resnet-50',
        imageBuffer,
        {
          headers: {
            'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/octet-stream'
          },
          timeout: 30000
        }
      );

      const predictions = response.data;
      console.log('🔍 AI Predictions:', predictions.slice(0, 3));

      // Extract car-related labels
      const carLabels = predictions
        .filter(p => /car|vehicle|sedan|suv|hatchback|auto|jeep|van|truck/i.test(p.label))
        .sort((a, b) => b.score - a.score);

      // Get available cars from database
      const availableCars = await Car.find({ available: true })
        .select('brand model type pricePerDay fuelType seatingCapacity features transmission rating images');

      // Find similar cars based on detected type
      let similarCars = availableCars;
      let detectedType = 'car';
      
      if (carLabels.length > 0) {
        detectedType = carLabels[0].label;
        
        if (/suv|jeep|truck/i.test(detectedType)) {
          similarCars = availableCars.filter(car => car.type === 'SUV');
        } else if (/sedan|limousine/i.test(detectedType)) {
          similarCars = availableCars.filter(car => car.type === 'Sedan');
        } else if (/hatchback|compact/i.test(detectedType)) {
          similarCars = availableCars.filter(car => car.type === 'Hatchback');
        }
      }

      // If no type-specific match, return top rated
      if (similarCars.length === 0) {
        similarCars = availableCars;
      }

      // Sort by rating and limit to top 3
      similarCars = similarCars
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 3);

      // Clean up uploaded file
      fs.unlinkSync(req.file.path);

      res.status(200).json({
        success: true,
        data: {
          detected: {
            label: detectedType,
            confidence: carLabels[0]?.score || 0.8,
            allPredictions: carLabels.slice(0, 3)
          },
          similarCars: similarCars.map(car => ({
            _id: car._id,
            brand: car.brand,
            model: car.model,
            type: car.type,
            pricePerDay: car.pricePerDay,
            seatingCapacity: car.seatingCapacity,
            fuelType: car.fuelType,
            transmission: car.transmission,
            rating: car.rating,
            images: car.images,
            features: car.features
          })),
          message: `Detected: ${detectedType}. Found ${similarCars.length} similar vehicles available!`
        }
      });

    } catch (aiError) {
      console.error('AI API Error:', aiError.message);
      
      // Fallback: Just return popular cars
      const popularCars = await Car.find({ availability: true })
        .sort({ rating: -1 })
        .limit(3)
        .select('brand model type pricePerDay seatingCapacity fuelType transmission rating images features');

      // Clean up uploaded file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(200).json({
        success: true,
        data: {
          detected: {
            label: 'car',
            confidence: 0.7,
            note: 'Using fallback detection'
          },
          similarCars: popularCars,
          message: 'Here are our popular vehicles that might interest you!'
        }
      });
    }

  } catch (error) {
    console.error('❌ Car identification error:', error.message);
    
    // Clean up file if exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Failed to identify car from image. Please try again.'
    });
  }
};

// @desc    Get chat history
// @route   GET /api/ai/history
// @access  Private
exports.getChatHistory = async (req, res) => {
  try {
    // TODO: Implement chat history storage in database if needed
    res.status(200).json({
      success: true,
      data: {
        history: [],
        message: 'Chat history feature coming soon'
      }
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat history'
    });
  }
};
