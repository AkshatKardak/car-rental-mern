import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  Camera,
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  Loader,
  ArrowLeft,
  Image as ImageIcon
} from 'lucide-react';
import axios from 'axios';

const ReportDamage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [images, setImages] = useState([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const theme = {
    bg: isDarkMode ? '#0f172a' : '#f8f9fa',
    cardBg: isDarkMode ? '#1e293b' : '#ffffff',
    text: isDarkMode ? '#f1f5f9' : '#1F2937',
    textSecondary: isDarkMode ? '#cbd5e1' : '#6B7280',
    border: isDarkMode ? '#334155' : '#e5e7eb',
    inputBg: isDarkMode ? '#0f172a' : '#f8f9fa',
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36)
    }));

    setImages(prev => [...prev, ...newImages]);
    setError('');
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const analyzeWithAI = async () => {
    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    try {
      setAnalyzing(true);
      setError('');

      const formData = new FormData();
      images.forEach(img => {
        formData.append('images', img.file);
      });

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/damages/analyze-ai`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        setAiAnalysis(response.data.data);
      }
    } catch (err) {
      console.error('AI Analysis error:', err);
      setError('Failed to analyze images. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    if (!description.trim()) {
      setError('Please provide a description');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('bookingId', bookingId);
      formData.append('description', description);
      
      if (aiAnalysis) {
        formData.append('aiAnalysis', JSON.stringify(aiAnalysis));
      }

      images.forEach(img => {
        formData.append('images', img.file);
      });

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/damages`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/mybookings');
        }, 2000);
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.message || 'Failed to submit damage report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen pb-12 transition-colors duration-300"
      style={{ backgroundColor: theme.bg }}
    >
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 mb-6 transition font-medium hover:text-green-500"
          style={{ color: theme.textSecondary }}
        >
          <ArrowLeft size={20} /> Back
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ color: theme.text }}>
            Report Vehicle Damage
          </h1>
          <p style={{ color: theme.textSecondary }}>
            Upload photos and describe the damage. Our AI will help assess the situation.
          </p>
        </motion.div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border p-8 text-center"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.border
            }}
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2" style={{ color: theme.text }}>
              Report Submitted Successfully!
            </h2>
            <p style={{ color: theme.textSecondary }}>
              Our team will review your report and contact you soon.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Image Upload Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border p-6 mb-6"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.border
              }}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: theme.text }}>
                <Camera className="w-5 h-5 text-green-500" />
                Upload Damage Photos
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {images.map(img => (
                  <div key={img.id} className="relative group">
                    <img 
                      src={img.preview}
                      alt="Damage"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {images.length < 5 && (
                  <label 
                    className="h-32 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition-colors"
                    style={{ borderColor: theme.border }}
                  >
                    <Upload className="w-8 h-8 mb-2" style={{ color: theme.textSecondary }} />
                    <span className="text-sm font-medium" style={{ color: theme.textSecondary }}>
                      Upload Photo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <p className="text-xs" style={{ color: theme.textSecondary }}>
                Upload up to 5 photos. Supported formats: JPG, PNG. Max size: 5MB per image.
              </p>

              {images.length > 0 && !aiAnalysis && (
                <button
                  type="button"
                  onClick={analyzeWithAI}
                  disabled={analyzing}
                  className="mt-4 px-6 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {analyzing ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-5 h-5" />
                      Analyze with AI
                    </>
                  )}
                </button>
              )}
            </motion.div>

            {/* AI Analysis Results */}
            {aiAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border p-6 mb-6 bg-blue-500/5"
                style={{
                  borderColor: 'rgba(59, 130, 246, 0.3)'
                }}
              >
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-blue-600">
                  <CheckCircle className="w-5 h-5" />
                  AI Analysis Complete
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-bold" style={{ color: theme.textSecondary }}>
                      Damage Type:
                    </span>
                    <p className="font-semibold" style={{ color: theme.text }}>
                      {aiAnalysis.damageType}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-bold" style={{ color: theme.textSecondary }}>
                      Severity:
                    </span>
                    <p className="font-semibold" style={{ color: theme.text }}>
                      {aiAnalysis.severity}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-bold" style={{ color: theme.textSecondary }}>
                      Estimated Cost:
                    </span>
                    <p className="font-semibold text-green-500">
                      ₹{aiAnalysis.estimatedCost?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-bold" style={{ color: theme.textSecondary }}>
                      Description:
                    </span>
                    <p className="text-sm mt-1" style={{ color: theme.text }}>
                      {aiAnalysis.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border p-6 mb-6"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.border
              }}
            >
              <h2 className="text-xl font-bold mb-4" style={{ color: theme.text }}>
                Describe the Damage
              </h2>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide details about what happened, when it occurred, and any other relevant information..."
                rows={6}
                className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition-colors resize-none"
                style={{
                  backgroundColor: theme.inputBg,
                  borderColor: theme.border,
                  color: theme.text
                }}
              />
            </motion.div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl border p-4 mb-6 bg-red-500/10 flex items-center gap-3" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading || images.length === 0}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-4 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Submitting Report...
                </>
              ) : (
                'Submit Damage Report'
              )}
            </motion.button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportDamage;
