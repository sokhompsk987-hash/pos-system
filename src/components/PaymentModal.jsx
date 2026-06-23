import React, { useState, useEffect } from 'react';

export default function PaymentModal({ isOpen, onClose, totalAmount, onPaymentSuccess }) {
  // State for managing payment method and UI flow
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [amountGiven, setAmountGiven] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle', 'processing', 'success', 'error'

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPaymentMethod('Cash');
      setAmountGiven('');
      setPaymentStatus('idle');
    }
  }, [isOpen]);

  // Return null if modal is not supposed to be open
  if (!isOpen) return null;

  // Calculate change for cash payments
  const change = amountGiven ? parseFloat(amountGiven) - totalAmount : 0;
  const isCashSufficient = amountGiven && parseFloat(amountGiven) >= totalAmount;

  // Handle the payment processing logic
  const handleProcessPayment = () => {
    if (paymentMethod === 'Cash' && !isCashSufficient) {
      // Prevent processing if cash is not enough
      return; 
    }

    setPaymentStatus('processing');

    // Simulate API call and network delay
    setTimeout(() => {
      // Simulate 95% success rate for demo purposes
      const isSuccess = Math.random() > 0.05; 
      
      if (isSuccess) {
        setPaymentStatus('success');
      } else {
        setPaymentStatus('error');
      }
    }, 1500);
  };

  // Render the Success Screen
  if (paymentStatus === 'success') {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden text-center p-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <span className="material-symbols-outlined text-green-600 text-5xl">check_circle</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Payment Successful!</h2>
          <p className="text-slate-500 font-medium mb-6">The transaction has been completed securely.</p>
          
          <div className="bg-slate-50 rounded-2xl p-4 mb-8">
            <div className="flex justify-between items-center mb-2 text-sm text-slate-600">
              <span>Amount Paid</span>
              <span className="font-bold text-slate-900">${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>Payment Method</span>
              <span className="font-bold text-slate-900">{paymentMethod}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => {
                onPaymentSuccess();
                onClose();
              }}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition-all"
            >
              New Order
            </button>
            <button 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render the Main Payment Interface
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row h-[600px] max-h-[90vh]">
        
        {/* Left Side: Order Summary & Keypad (Optional) */}
        <div className="w-full md:w-2/5 bg-slate-50 border-r border-slate-100 p-6 md:p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <button onClick={onClose} className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <h2 className="text-xl font-black text-slate-900">Checkout</h2>
          </div>

          <div className="flex-1">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Total Amount Due</p>
            <div className="text-5xl font-black text-blue-600 mb-8">
              ${totalAmount.toFixed(2)}
            </div>

            {/* Quick Cash Buttons */}
            {paymentMethod === 'Cash' && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[10, 20, 50, 100].map(val => (
                  <button 
                    key={val}
                    onClick={() => setAmountGiven(val.toString())}
                    className="bg-white border border-slate-200 py-3 rounded-xl font-bold text-slate-700 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm"
                  >
                    ${val}
                  </button>
                ))}
                <button 
                  onClick={() => setAmountGiven(totalAmount.toString())}
                  className="col-span-2 bg-blue-50 border border-blue-200 py-3 rounded-xl font-bold text-blue-700 hover:bg-blue-100 transition-all"
                >
                  Exact Amount
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Payment Methods */}
        <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col bg-white">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Select Payment Method</h3>
          
          <div className="grid grid-cols-3 gap-3 mb-8">
            {['Cash', 'Credit Card', 'QR Code'].map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`py-4 rounded-xl font-bold flex flex-col items-center justify-center gap-2 border-2 transition-all ${
                  paymentMethod === method 
                    ? 'border-blue-600 bg-blue-50 text-blue-700' 
                    : 'border-slate-100 bg-white text-slate-500 hover:border-slate-300'
                }`}
              >
                <span className="material-symbols-outlined text-[28px]">
                  {method === 'Cash' ? 'payments' : method === 'Credit Card' ? 'credit_card' : 'qr_code_scanner'}
                </span>
                <span className="text-[13px]">{method}</span>
              </button>
            ))}
          </div>

          {/* Dynamic Content based on selected method */}
          <div className="flex-1 flex flex-col justify-center">
            
            {paymentMethod === 'Cash' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-700">Amount Received ($)</label>
                  <input 
                    type="number" 
                    value={amountGiven}
                    onChange={(e) => setAmountGiven(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-2xl font-black text-slate-900 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
                
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-bold">Change Due</span>
                    <span className={`text-3xl font-black ${change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      ${change >= 0 ? change.toFixed(2) : '0.00'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'Credit Card' && (
              <div className="text-center animate-fadeIn py-8">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-4xl text-slate-400">contactless</span>
                </div>
                <p className="text-slate-600 font-bold text-lg mb-2">Ready to scan or insert card</p>
                <p className="text-slate-400 text-sm">Please ask the customer to use the terminal.</p>
              </div>
            )}

            {paymentMethod === 'QR Code' && (
              <div className="text-center animate-fadeIn">
                <div className="inline-block p-4 bg-white border-2 border-slate-100 rounded-3xl shadow-sm mb-4">
                  {/* Placeholder for KHQR or any Payment QR */}
                  <div className="w-48 h-48 bg-slate-900 rounded-xl flex flex-col items-center justify-center text-white relative overflow-hidden">
                    <span className="material-symbols-outlined text-6xl mb-2">qr_code_2</span>
                    <span className="font-bold tracking-widest uppercase text-xs">Scan to Pay</span>
                    {/* Decorative scanner line */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse"></div>
                  </div>
                </div>
                <p className="text-slate-600 font-bold">Waiting for customer to scan...</p>
              </div>
            )}

          </div>

          {/* Error Message */}
          {paymentStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mt-4 flex items-center gap-2 animate-fadeIn">
              <span className="material-symbols-outlined">error</span>
              <span className="text-sm font-bold">Transaction failed. Please try again.</span>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-6 mt-6 border-t border-slate-100">
            <button 
              onClick={handleProcessPayment}
              disabled={paymentStatus === 'processing' || (paymentMethod === 'Cash' && !isCashSufficient)}
              className={`w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2 ${
                paymentStatus === 'processing'
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : paymentMethod === 'Cash' && !isCashSufficient
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20'
              }`}
            >
              {paymentStatus === 'processing' ? (
                <>
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  Processing...
                </>
              ) : (
                `Confirm Payment of $${totalAmount.toFixed(2)}`
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}