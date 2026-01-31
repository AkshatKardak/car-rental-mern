import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, Camera, CheckCircle, AlertCircle, Smartphone, Copy, RefreshCw, Loader } from 'lucide-react';
import { paymentService } from '../services/paymentService';

const QRScanner = ({ theme, amount, bookingId }) => {
  const [scanner, setScanner] = useState(null);
  const [scanMode, setScanMode] = useState('display'); // Start with display mode
  const [scannedData, setScannedData] = useState('');
  const [error, setError] = useState('');
  const [qrData, setQrData] = useState('');
  const [loading, setLoading] = useState(false);
  const [razorpayOrder, setRazorpayOrder] = useState(null);

  // Generate Razorpay QR Code
 // In the generateRazorpayQR function, update this part:

const generateRazorpayQR = async () => {
  try {
    setLoading(true);
    setError('');

    const response = await paymentService.createQRPayment({
      amount: amount,
      bookingId: bookingId || 'temp_' + Date.now(),
      currency: 'INR'
    });

    if (response.success) {
      setQrData(response.qrData); // This will be the payment link short_url
      setRazorpayOrder(response.paymentLink); // Store the payment link object
    } else {
      setError('Failed to generate payment QR code');
    }
  } catch (err) {
    console.error('Error generating QR:', err);
    setError('Failed to generate payment QR code. Please try again.');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (scanMode === 'display') {
      generateRazorpayQR();
    }
  }, [scanMode, amount]);

  useEffect(() => {
    if (scanMode === 'camera') {
      const html5QrcodeScanner = new Html5QrcodeScanner(
        'qr-reader-camera',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
        },
        false
      );

      html5QrcodeScanner.render(
        (decodedText, decodedResult) => {
          console.log('QR Code scanned:', decodedText);
          setScannedData(decodedText);
        },
        (errorMessage) => {
          if (errorMessage.includes('NotAllowedError') || 
              errorMessage.includes('Permission')) {
            setScanMode('display');
            setError('Camera access denied. Showing payment QR code instead.');
          }
        }
      );

      setScanner(html5QrcodeScanner);

      return () => {
        if (html5QrcodeScanner) {
          html5QrcodeScanner.clear().catch(err => console.error('Error clearing scanner:', err));
        }
      };
    }
  }, [scanMode]);

  const switchToDisplay = () => {
    if (scanner) {
      scanner.clear().catch(err => console.error('Error clearing scanner:', err));
    }
    setScanMode('display');
  };

  const switchToCamera = () => {
    setScanMode('camera');
    setError('');
  };

  const copyPaymentLink = () => {
    if (qrData) {
      navigator.clipboard.writeText(qrData);
      alert('Payment link copied to clipboard!');
    }
  };

  const refreshQR = () => {
    generateRazorpayQR();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="font-bold text-lg" style={{ color: theme.text }}>
          {scanMode === 'camera' ? 'Scan QR Code' : 'Pay via Razorpay QR'}
        </p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
            <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-xs font-bold text-green-500">
              {loading ? 'Generating...' : 'Razorpay Secure'}
            </span>
          </div>
        </div>
      </div>

      {/* Toggle Buttons */}
      <div 
        className="flex gap-2 p-1 rounded-xl"
        style={{
          backgroundColor: theme.inputBg,
          borderWidth: 1,
          borderColor: theme.border
        }}
      >
        <button
          onClick={switchToDisplay}
          className={`flex-1 px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            scanMode === 'display'
              ? 'bg-green-500 text-white shadow-sm'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          style={{ color: scanMode === 'display' ? 'white' : theme.textSecondary }}
        >
          <QrCode className="w-4 h-4" />
          Show QR Code
        </button>
        <button
          onClick={switchToCamera}
          className={`flex-1 px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            scanMode === 'camera'
              ? 'bg-green-500 text-white shadow-sm'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          style={{ color: scanMode === 'camera' ? 'white' : theme.textSecondary }}
        >
          <Camera className="w-4 h-4" />
          Use Camera
        </button>
      </div>

      <p className="text-sm" style={{ color: theme.textSecondary }}>
        {scanMode === 'camera' 
          ? 'Position the UPI QR code within the frame to scan' 
          : 'Scan this Razorpay QR code to complete payment securely'}
      </p>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          <p className="text-sm text-yellow-600">{error}</p>
        </div>
      )}

      {/* Scanned Data Success */}
      {scannedData && (
        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-green-500">QR Code Scanned!</p>
            <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
              {scannedData.substring(0, 50)}...
            </p>
          </div>
        </div>
      )}

      {/* Camera Scanner */}
      {scanMode === 'camera' && (
        <div 
          className="rounded-xl overflow-hidden border-2 border-dashed"
          style={{ borderColor: theme.border }}
        >
          <div id="qr-reader-camera" className="w-full"></div>
        </div>
      )}

      {/* Razorpay QR Code Display */}
      {scanMode === 'display' && (
        <div 
          className="rounded-2xl border-2 p-6 md:p-8"
          style={{ 
            backgroundColor: theme.inputBg,
            borderColor: theme.border,
          }}
        >
          {/* Amount Display */}
          {amount && (
            <div 
              className="rounded-xl border p-4 bg-green-500/5 mb-6 text-center"
              style={{
                borderColor: 'rgba(34, 197, 94, 0.3)'
              }}
            >
              <p className="text-xs font-bold uppercase tracking-wider mb-1 text-green-600">
                Amount to Pay
              </p>
              <p className="font-black text-3xl text-green-500">
                ₹{amount}
              </p>
            </div>
          )}

          {/* QR Code Image */}
          <div className="flex flex-col items-center justify-center">
            {loading ? (
              <div className="w-64 h-64 flex items-center justify-center">
                <Loader className="w-12 h-12 text-green-500 animate-spin" />
              </div>
            ) : qrData ? (
              <>
                <div 
                  className="bg-white p-6 rounded-2xl shadow-xl mb-4 border-4 border-green-500/20 relative"
                >
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}&bgcolor=ffffff&color=000000&format=png&margin=10`}
                    alt="Razorpay Payment QR Code"
                    className="w-64 h-64"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={refreshQR}
                      className="p-2 rounded-lg bg-white shadow-md hover:bg-gray-100 transition-colors"
                      title="Refresh QR Code"
                    >
                      <RefreshCw className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 mb-2">
                    <Smartphone className="w-4 h-4 text-green-500" />
                    <p className="text-xs font-bold text-green-500">
                      Scan with Phone Camera
                    </p>
                  </div>
                  <p className="text-xs mt-2" style={{ color: theme.textSecondary }}>
                    Or open any UPI app and scan this Razorpay QR code
                  </p>
                </div>

                {/* Payment Link ID Display */}
                {razorpayOrder && (
                 <div 
                className="w-full rounded-xl border p-3 mt-2"
                 style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.border
                 }}
                >
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: theme.textSecondary }}>
                Payment Reference
                </p>
                <p className="font-mono text-xs break-all" style={{ color: theme.text }}>
                {razorpayOrder.reference_id || razorpayOrder.id}
                 </p>
                </div>
                )}


                {/* Copy Link Button */}
                <button
                  onClick={copyPaymentLink}
                  className="w-full mt-4 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-500 hover:bg-green-500/20 transition-colors font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Payment Link
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <p className="text-sm font-semibold" style={{ color: theme.text }}>
                  Failed to generate QR code
                </p>
                <button
                  onClick={refreshQR}
                  className="mt-3 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors text-sm font-bold"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div 
        className="rounded-xl border p-4 space-y-3"
        style={{
          backgroundColor: theme.inputBg,
          borderColor: theme.border
        }}
      >
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textSecondary }}>
          How to Pay via Razorpay
        </p>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-green-500">
              <span className="text-white font-bold text-xs">1</span>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: theme.text }}>
                Open UPI App
              </p>
              <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                Google Pay, PhonePe, Paytm, or any UPI app
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-green-500">
              <span className="text-white font-bold text-xs">2</span>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: theme.text }}>
                Scan Razorpay QR
              </p>
              <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                Point camera at the QR code above
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-green-500">
              <span className="text-white font-bold text-xs">3</span>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: theme.text }}>
                Verify & Pay
              </p>
              <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                Check amount (₹{amount}) and enter UPI PIN
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-green-500">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: theme.text }}>
                Payment Confirmed
              </p>
              <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                Razorpay will verify and confirm your booking
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Badge */}
      <div 
        className="rounded-xl border p-4 bg-blue-500/5 text-center"
        style={{
          borderColor: 'rgba(59, 130, 246, 0.3)'
        }}
      >
        <p className="text-xs font-bold text-blue-600 mb-1">
          🔒 Secured by Razorpay
        </p>
        <p className="text-xs" style={{ color: theme.textSecondary }}>
          PCI DSS compliant • 256-bit SSL encryption
        </p>
      </div>

      {/* Supported Apps */}
      <div 
        className="rounded-xl border p-4"
        style={{
          backgroundColor: theme.cardBg,
          borderColor: theme.border
        }}
      >
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: theme.textSecondary }}>
          Supported UPI Apps
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-green-500/10 text-green-600 border border-green-500/20">
            Google Pay
          </span>
          <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-500/10 text-purple-600 border border-purple-500/20">
            PhonePe
          </span>
          <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
            Paytm
          </span>
          <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-500/10 text-orange-600 border border-orange-500/20">
            BHIM
          </span>
          <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-500/10 border border-gray-500/20" style={{ color: theme.textSecondary }}>
            All UPI Apps
          </span>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
