// @desc    Get insurance recommendations based on trip details
// @route   POST /api/ai/insurance-advice
// @access  Private
exports.getInsuranceAdvice = async (req, res) => {
  try {
    const { tripType, duration, driverExperience, carType, carPrice } = req.body;

    console.log('🛡️ Insurance advice request:', { tripType, duration, driverExperience, carType });

    // Validate inputs
    const validTripTypes = ['city', 'highway', 'outstation', 'mountain', 'offroad', 'business'];
    const validExperience = ['beginner', 'intermediate', 'experienced'];

    // Define insurance packages with dynamic pricing
    const insuranceOptions = {
      basic: {
        name: 'Basic CDW (Collision Damage Waiver)',
        price: 200,
        pricePerDay: 200,
        coverage: 'Covers accidental damage up to ₹50,000',
        description: 'Essential protection for minor damages',
        recommended: true,
        priority: 1
      },
      comprehensive: {
        name: 'Comprehensive Insurance',
        price: 400,
        pricePerDay: 400,
        coverage: 'Full damage coverage + theft protection up to ₹5,00,000',
        description: 'Complete peace of mind for all damages',
        recommended: tripType === 'highway' || tripType === 'outstation' || tripType === 'mountain',
        priority: 2
      },
      theftProtection: {
        name: 'Theft Protection',
        price: 50,
        pricePerDay: 50,
        coverage: 'Covers complete vehicle theft',
        description: 'Protection against car theft',
        recommended: tripType === 'city' || tripType === 'outstation',
        priority: 3
      },
      mountainPackage: {
        name: 'Mountain/Off-road Package',
        price: 300,
        pricePerDay: 300,
        coverage: 'Specialized coverage for hilly terrain and off-road damage',
        description: 'Essential for mountain drives',
        recommended: tripType === 'mountain' || tripType === 'offroad',
        priority: 4
      },
      zeroDep: {
        name: 'Zero Depreciation',
        price: 500,
        pricePerDay: 500,
        coverage: 'No depreciation deducted on claim amount',
        description: 'Full claim value without depreciation',
        recommended: carType === 'luxury' || carType === 'premium' || (carPrice && carPrice > 5000),
        priority: 5
      },
      personalAccident: {
        name: 'Personal Accident Cover',
        price: 100,
        pricePerDay: 100,
        coverage: 'Medical expenses up to ₹5,00,000 for driver and passengers',
        description: 'Medical coverage for accidents',
        recommended: driverExperience === 'beginner' || tripType === 'highway',
        priority: 6
      }
    };

    // Add-ons with smart recommendations
    const addons = {
      gps: {
        name: 'GPS Navigator',
        price: 100,
        type: 'one-time',
        pricePerDay: 0,
        description: 'Real-time navigation and traffic updates',
        recommended: tripType === 'outstation' || tripType === 'highway' || tripType === 'mountain',
        icon: '🗺️'
      },
      dashcam: {
        name: 'Dashcam',
        price: 150,
        type: 'per-day',
        pricePerDay: 150,
        description: 'Record your journey for evidence',
        recommended: driverExperience === 'beginner' || tripType === 'city',
        icon: '📹'
      },
      childSeat: {
        name: 'Child Seat',
        price: 50,
        type: 'per-day',
        pricePerDay: 50,
        description: 'Safety seat for children',
        recommended: false,
        icon: '👶'
      },
      wifi: {
        name: 'Portable WiFi',
        price: 100,
        type: 'per-day',
        pricePerDay: 100,
        description: 'Stay connected on the go',
        recommended: tripType === 'business' || tripType === 'outstation',
        icon: '📶'
      },
      chauffeur: {
        name: 'Professional Chauffeur',
        price: 800,
        type: 'per-day',
        pricePerDay: 800,
        description: 'Experienced driver for your trip',
        recommended: tripType === 'business' || carType === 'luxury' || driverExperience === 'beginner',
        icon: '👨‍✈️'
      },
      fuelPass: {
        name: 'Fuel Prepaid Pass',
        price: 500,
        type: 'one-time',
        pricePerDay: 0,
        description: 'Prepaid fuel credit',
        recommended: tripType === 'outstation',
        icon: '⛽'
      },
      emergencyKit: {
        name: 'Emergency Road Kit',
        price: 50,
        type: 'one-time',
        pricePerDay: 0,
        description: 'First aid and basic tools',
        recommended: tripType === 'mountain' || tripType === 'offroad',
        icon: '🧰'
      }
    };

    // Calculate recommendations
    const recommendedInsurance = Object.entries(insuranceOptions)
      .filter(([key, ins]) => ins.recommended)
      .sort((a, b) => a[1].priority - b[1].priority)
      .map(([key, ins]) => ({
        key,
        ...ins,
        totalCost: ins.pricePerDay * (duration || 1)
      }));

    const optionalInsurance = Object.entries(insuranceOptions)
      .filter(([key, ins]) => !ins.recommended)
      .map(([key, ins]) => ({
        key,
        ...ins,
        totalCost: ins.pricePerDay * (duration || 1)
      }));

    const recommendedAddons = Object.entries(addons)
      .filter(([key, addon]) => addon.recommended)
      .map(([key, addon]) => ({
        key,
        ...addon,
        totalCost: addon.type === 'per-day' ? addon.pricePerDay * (duration || 1) : addon.price
      }));

    const optionalAddons = Object.entries(addons)
      .filter(([key, addon]) => !addon.recommended)
      .map(([key, addon]) => ({
        key,
        ...addon,
        totalCost: addon.type === 'per-day' ? addon.pricePerDay * (duration || 1) : addon.price
      }));

    // Calculate totals
    const totalInsurancePerDay = recommendedInsurance.reduce((sum, ins) => sum + ins.pricePerDay, 0);
    const totalInsurance = recommendedInsurance.reduce((sum, ins) => sum + ins.totalCost, 0);
    
    const totalAddonsPerDay = recommendedAddons.reduce((sum, addon) => 
      sum + (addon.type === 'per-day' ? addon.pricePerDay : 0), 0
    );
    const totalAddons = recommendedAddons.reduce((sum, addon) => sum + addon.totalCost, 0);

    const grandTotal = totalInsurance + totalAddons;
    const perDayTotal = totalInsurancePerDay + totalAddonsPerDay;

    // Generate personalized explanation
    let explanation = '';
    if (tripType === 'city') {
      explanation = `For city driving in Thane/Mumbai, basic coverage is usually sufficient. However, theft protection is recommended due to urban parking.`;
    } else if (tripType === 'highway' || tripType === 'outstation') {
      explanation = `For highway/outstation trips, comprehensive insurance is highly recommended. Long-distance driving carries higher risks.`;
    } else if (tripType === 'mountain' || tripType === 'offroad') {
      explanation = `Mountain/off-road trips require specialized coverage due to terrain challenges. Road assistance is crucial.`;
    } else if (tripType === 'business') {
      explanation = `For business purposes, premium coverage ensures professional reliability and peace of mind during client meetings.`;
    } else {
      explanation = `Based on your ${duration || 1}-day ${tripType || 'rental'}, here's what we recommend for optimal protection.`;
    }

    // Safety tips based on experience
    const safetyTips = [];
    if (driverExperience === 'beginner') {
      safetyTips.push('Consider hiring a chauffeur for peace of mind');
      safetyTips.push('Dashcam recommended for beginner drivers');
      safetyTips.push('Take time to familiarize yourself with the car before starting');
    }
    if (tripType === 'mountain') {
      safetyTips.push('Check brake condition before mountain drives');
      safetyTips.push('Emergency kit essential for hilly areas');
    }
    if (tripType === 'highway') {
      safetyTips.push('Ensure comprehensive insurance for high-speed driving');
      safetyTips.push('GPS navigation helps avoid wrong turns');
    }

    res.status(200).json({
      success: true,
      data: {
        summary: {
          tripType: tripType || 'standard',
          duration: duration || 1,
          driverExperience: driverExperience || 'intermediate',
          perDayTotal: `₹${perDayTotal}`,
          grandTotal: `₹${grandTotal}`,
          explanation
        },
        insurance: {
          recommended: recommendedInsurance,
          optional: optionalInsurance,
          totalPerDay: `₹${totalInsurancePerDay}`,
          total: `₹${totalInsurance}`
        },
        addons: {
          recommended: recommendedAddons,
          optional: optionalAddons,
          totalPerDay: `₹${totalAddonsPerDay}`,
          total: `₹${totalAddons}`
        },
        safetyTips: safetyTips.length > 0 ? safetyTips : ['Drive safely and follow traffic rules'],
        breakdown: {
          insurancePerDay: totalInsurancePerDay,
          addonsPerDay: totalAddonsPerDay,
          totalPerDay: perDayTotal,
          duration: duration || 1,
          grandTotal: grandTotal
        }
      }
    });

  } catch (error) {
    console.error('❌ Insurance advice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate insurance advice. Please try again.'
    });
  }
};
