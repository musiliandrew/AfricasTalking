import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const navigate = useNavigate();

  const paymentData = {
    amount: "IDR 1,000,000",
    refNumber: "000085752257",
    paymentTime: "25-02-2023, 13:22:16",
    paymentMethod: "Bank Transfer",
    senderName: "Antonio Roberto",
    adminFee: "IDR 193,00",
    totalPayment: "IDR 1,000,000",
    formattedDate: "25 Feb 2023, 13:22",
    recipientPhone: "+254712345678" // Add recipient phone number
  };

  const sendPaymentSMS = async () => {
    setIsSending(true);
    try {
      const message = `Payment Receipt\n\n` +
        `Amount: ${paymentData.totalPayment}\n` +
        `Ref: ${paymentData.refNumber}\n` +
        `Method: ${paymentData.paymentMethod}\n` +
        `Date: ${paymentData.formattedDate}\n\n` +
        `Thank you for your payment!`;
      
      // This would be replaced with actual API call to your backend
      const response = await fetch('https://api.africastalking.com/version1/messaging', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'apiKey': 'YOUR_API_KEY', // Replace with your actual API key
          'Accept': 'application/json'
        },
        body: new URLSearchParams({
          username: 'sandbox', // Or your Africa's Talking username
          to: paymentData.recipientPhone,
          message: message,
          from: '12220' // Your SMS shortcode or alphanumeric
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send SMS');
      }

      setIsSent(true);
      setTimeout(() => setIsSent(false), 3000);
    } catch (error) {
      console.error('SMS sending error:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleDownload = () => {
    // PDF generation logic would go here
    console.log('Generating PDF receipt...');
    sendPaymentSMS(); // Send SMS when downloading receipt
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
        {/* Receipt Header */}
        <div className="p-6 text-center border-b border-gray-700">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-2 rounded-full">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-green-400">Payment Successful!</h2>
          <p className="text-gray-400 mt-2">Your payment has been processed successfully</p>
        </div>

        {/* Receipt Body */}
        <div className="p-6">
          {/* Total Payment */}
          <div className="mb-8 text-center">
            <h3 className="text-gray-400 text-sm font-medium">Total Payment</h3>
            <p className="text-3xl font-bold text-white mt-2">{paymentData.totalPayment}</p>
          </div>

          {/* Payment Details */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Reference Number</span>
              <div className="text-right">
                <p className="text-white">{paymentData.refNumber}</p>
                <p className="text-gray-400 text-sm">{paymentData.formattedDate}</p>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-800">
              <span className="text-gray-400">Payment Method</span>
              <span className="text-white">{paymentData.paymentMethod}</span>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-800">
              <span className="text-gray-400">Sender Name</span>
              <span className="text-white">{paymentData.senderName}</span>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-800">
              <span className="text-gray-400">Admin Fee</span>
              <span className="text-white">{paymentData.adminFee}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            <button
              onClick={handleDownload}
              disabled={isSending}
              className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all ${isSending || isSent 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30'}`}
            >
              {isSending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Receipt...
                </>
              ) : isSent ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Receipt Sent!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  Download & Send Receipt
                </>
              )}
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 text-white bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-gray-800 px-6 py-4 text-center">
          <p className="text-gray-400 text-sm">A receipt has been sent to your email</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage