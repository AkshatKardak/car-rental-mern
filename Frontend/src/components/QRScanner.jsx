import React, { useEffect, useState } from 'react';
import { QrCode, CheckCircle, AlertCircle, Smartphone, Copy, RefreshCw, Loader, ExternalLink, Zap, XCircle } from 'lucide-react';
import { paymentService } from '../services/paymentService';

const QRScanner = ({ theme, amount, bookingId, onSuccess }) => {
  const [error, setError] = useState('');
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showManualConfirm, setShowManualConfirm] = useState(false);
  const [upiTransactionId, setUpiTransactionId] = useState('');

  // Generate UPI QR Code
  const generateUPIQR = async () => {
    try {
      setLoading(true);
      setError('');
      setPaymentSuccess(false);

      const response = await paymentService.createQRPayment({
        amount: amount,
        bookingId: bookingId || 'temp_' + Date.now()
      });

      if (response.success) {
        console.log('✅ UPI QR Generated:', response.qrCode);
        setQrData(response.qrCode);
        
        // Show manual confirm option after 10 seconds
        setTimeout(() => {
          setShowManualConfirm(true);
        }, 10000);
      } else {
        setError('Failed to generate payment QR code');
      }
    } catch (err) {
      console.error('❌ Error generating QR:', err);
      setError(err.response?.data?.message || 'Failed to generate payment QR code');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateUPIQR();
  }, [amount]);

  const copyUPIId = () => {
    if (qrData?.upiId) {
      navigator.clipboard.writeText(qrData.upiId);
      alert('UPI ID copied to clipboard!');
    }
  };

  const copyTransactionRef = () => {
    if (qrData?.transactionRef) {
      navigator.clipboard.writeText(qrData.transactionRef);
      alert('Transaction reference copied to clipboard!');
    }
  };

  const handleManualConfirm = async () => {
    if (!upiTransactionId.trim()) {
      alert('Please enter your UPI transaction ID');
      return;
    }

    try {
      setChecking(true);
      const response = await paymentService.confirmUPIPayment({
        transactionRef: qrData.transactionRef,
        upiTransactionId: upiTransactionId
      });

      if (response.success) {
        setPaymentSuccess(true);
        if (onSuccess) {
          onSuccess({
            transactionRef: qrData.transactionRef,
            upiTransactionId: upiTransactionId,
            amount: amount
          });
        }
      }
    } catch (err) {
      console.error('❌ Error confirming payment:', err);
      setError('Failed to confirm payment. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  const simulatePayment = async () => {
    setChecking(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock UPI transaction ID
    const mockUpiTxnId = `TEST${Date.now().toString().slice(-8)}`;
    setUpiTransactionId(mockUpiTxnId);
    
    // Auto-confirm payment
    try {
      const response = await paymentService.confirmUPIPayment({
        transactionRef: qrData.transactionRef,
        upiTransactionId: mockUpiTxnId
      });
      
      if (response.success) {
        setPaymentSuccess(true);
        if (onSuccess) {
          onSuccess({
            transactionRef: qrData.transactionRef,
            upiTransactionId: mockUpiTxnId,
            amount: amount
          });
        }
      }
    } catch (err) {
      console.error('❌ Error in simulated payment:', err);
      setError('Failed to simulate payment');
    } finally {
      setChecking(false);
    }
  };

  const openUPIApp = (app) => {
    if (!qrData?.upiUrl) return;

    const deepLinks = {
      gpay: `tez://upi/pay?${qrData.upiUrl.split('?')[1]}`,
      phonepe: `phonepe://pay?${qrData.upiUrl.split('?')[1]}`,
      paytm: `paytmmp://pay?${qrData.upiUrl.split('?')[1]}`,
      bhim: qrData.upiUrl,
      generic: qrData.upiUrl
    };

    window.location.href = deepLinks[app] || deepLinks.generic;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="font-bold text-lg" style={{ color: theme.text }}>
          Pay via UPI
        </p>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
          <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : paymentSuccess ? 'bg-green-500' : 'bg-blue-500'}`}></div>
          <span className="text-xs font-bold text-green-500">
            {loading ? 'Generating...' : paymentSuccess ? 'Payment Received!' : 'Ready to Pay'}
          </span>
        </div>
      </div>

      <p className="text-sm" style={{ color: theme.textSecondary }}>
        {qrData?.testMode ? 'Test Mode: Use simulator button to test payment flow' : 'Scan QR code with any UPI app or tap quick pay button'}
      </p>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Payment Success */}
      {paymentSuccess && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-green-600">Payment Confirmed!</p>
            <p className="text-xs text-green-500 mt-1">Transaction ID: {upiTransactionId}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl border-2" style={{ backgroundColor: theme.inputBg, borderColor: theme.border }}>
          <Loader className="w-12 h-12 text-green-500 animate-spin mb-4" />
          <p className="text-sm" style={{ color: theme.textSecondary }}>Generating payment QR code...</p>
        </div>
      ) : qrData ? (
        <div className="space-y-4">
          {/* Test Mode Banner */}
          {qrData.testMode && (
            <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-yellow-600">Test Mode Active</p>
                <p className="text-xs text-yellow-600 mt-0.5">Use the "Simulate Payment" button below to test the flow</p>
              </div>
            </div>
          )}

          {/* Amount Box */}
          <div className="rounded-xl border p-4 bg-green-500/5 text-center" style={{ borderColor: 'rgba(34, 197, 94, 0.3)' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-1 text-green-600">Amount to Pay</p>
            <p className="font-black text-3xl text-green-500">₹{amount.toLocaleString()}</p>
            {qrData.testMode && (
              <p className="text-xs text-yellow-600 mt-1">(Test Mode - No Real Payment)</p>
            )}
          </div>

          {/* Test Mode Payment Simulator */}
          {qrData.testMode && (
            <div className="p-4 rounded-xl border bg-purple-500/5" style={{ borderColor: 'rgba(168, 85, 247, 0.3)' }}>
              <p className="text-sm font-bold text-purple-600 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Quick Test Payment
              </p>
              <p className="text-xs mb-3" style={{ color: theme.textSecondary }}>
                In production, users would scan QR with GPay/PhonePe. For testing, click below:
              </p>
              <button
                onClick={simulatePayment}
                disabled={checking || paymentSuccess}
                className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                {checking ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Processing Test Payment...
                  </>
                ) : paymentSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Payment Completed
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Simulate Successful Payment
                  </>
                )}
              </button>
            </div>
          )}

          {/* Quick Pay Buttons */}
          <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.inputBg, borderColor: theme.border }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: theme.textSecondary }}>
              Quick Pay (Production Only)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => openUPIApp('gpay')}
                disabled={qrData.testMode}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all font-bold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ExternalLink className="w-4 h-4" />
                Google Pay
              </button>
              <button
                onClick={() => openUPIApp('phonepe')}
                disabled={qrData.testMode}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all font-bold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ExternalLink className="w-4 h-4" />
                PhonePe
              </button>
              <button
                onClick={() => openUPIApp('paytm')}
                disabled={qrData.testMode}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all font-bold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ExternalLink className="w-4 h-4" />
                Paytm
              </button>
              <button
                onClick={() => openUPIApp('generic')}
                disabled={qrData.testMode}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 transition-all font-bold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ExternalLink className="w-4 h-4" />
                Other UPI
              </button>
            </div>
            {qrData.testMode && (
              <p className="text-xs text-yellow-600 mt-2 text-center">
                ⚠️ These buttons will work only in production mode
              </p>
            )}
          </div>

          {/* OR Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px" style={{ backgroundColor: theme.border }}></div>
            <span className="text-xs font-bold uppercase" style={{ color: theme.textSecondary }}>OR SCAN QR</span>
            <div className="flex-1 h-px" style={{ backgroundColor: theme.border }}></div>
          </div>

          {/* QR Code */}
          <div className="rounded-2xl border-2 p-6" style={{ backgroundColor: theme.inputBg, borderColor: theme.border }}>
            <div className="flex flex-col items-center">
              {qrData.testMode && (
                <p className="text-xs font-bold text-yellow-600 mb-3 text-center">
                  ⚠️ This QR won't work in test mode. Use "Simulate Payment" button above.
                </p>
              )}
              <div className={`bg-white p-6 rounded-2xl shadow-xl border-4 border-green-500/20 relative ${qrData.testMode ? 'opacity-50' : ''}`}>
                <img 
                  src={qrData.imageUrl}
                  alt="UPI QR Code"
                  className="w-64 h-64"
                />
                {qrData.testMode && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-2xl">
                    <span className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold text-xs">
                      TEST MODE
                    </span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={generateUPIQR}
                    className="p-2 rounded-lg bg-white shadow-md hover:bg-gray-100 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="text-center mt-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 mb-2">
                  <Smartphone className="w-4 h-4 text-green-500" />
                  <p className="text-xs font-bold text-green-500">
                    {qrData.testMode ? 'Demo QR Code' : 'Scan with Phone Camera'}
                  </p>
                </div>
                <p className="text-xs mt-2" style={{ color: theme.textSecondary }}>
                  {qrData.testMode ? 'In production, this will open UPI app automatically' : 'Your UPI app will open automatically'}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="p-4 rounded-xl border space-y-3" style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: theme.textSecondary }}>UPI ID</p>
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-sm" style={{ color: theme.text }}>{qrData.upiId}</p>
                <button onClick={copyUPIId} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Copy className="w-4 h-4" style={{ color: theme.textSecondary }} />
                </button>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: theme.textSecondary }}>Transaction Reference</p>
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-xs break-all" style={{ color: theme.text }}>{qrData.transactionRef}</p>
                <button onClick={copyTransactionRef} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Copy className="w-4 h-4" style={{ color: theme.textSecondary }} />
                </button>
              </div>
            </div>
          </div>

          {/* Manual Confirmation */}
          {showManualConfirm && !paymentSuccess && !qrData.testMode && (
            <div className="p-4 rounded-xl border bg-blue-500/5" style={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}>
              <p className="text-sm font-bold text-blue-600 mb-3">Already Paid?</p>
              <p className="text-xs mb-3" style={{ color: theme.textSecondary }}>
                If you've completed the payment, enter your UPI transaction ID below:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter UPI Transaction ID"
                  value={upiTransactionId}
                  onChange={(e) => setUpiTransactionId(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border text-sm"
                  style={{ 
                    backgroundColor: theme.inputBg,
                    borderColor: theme.border,
                    color: theme.text
                  }}
                />
                <button
                  onClick={handleManualConfirm}
                  disabled={checking}
                  className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {checking ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  {checking ? 'Verifying...' : 'Confirm'}
                </button>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="rounded-xl border p-4 space-y-3" style={{ backgroundColor: theme.inputBg, borderColor: theme.border }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textSecondary }}>
              {qrData.testMode ? 'How It Works (Production)' : 'How to Pay'}
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-500">
                  <span className="text-white font-bold text-xs">1</span>
                </div>
                <p className="text-sm" style={{ color: theme.text }}>
                  Tap a "Quick Pay" button or scan the QR code
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-500">
                  <span className="text-white font-bold text-xs">2</span>
                </div>
                <p className="text-sm" style={{ color: theme.text }}>
                  Your UPI app will open with amount prefilled
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-500">
                  <span className="text-white font-bold text-xs">3</span>
                </div>
                <p className="text-sm" style={{ color: theme.text }}>
                  Verify amount and enter your UPI PIN
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-500">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
                <p className="text-sm" style={{ color: theme.text }}>
                  Payment confirmed - booking complete!
                </p>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="rounded-xl border p-4 bg-blue-500/5 text-center" style={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}>
            <p className="text-xs font-bold text-blue-600 mb-1">
              🔒 Secured by Razorpay
            </p>
            <p className="text-xs" style={{ color: theme.textSecondary }}>
              PCI DSS compliant • 256-bit SSL encryption
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default QRScanner;
