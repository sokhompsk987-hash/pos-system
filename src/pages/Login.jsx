import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api'; 

export default function Login() {
  const navigate = useNavigate();
  
  // Manage which view is currently active: 'login', 'forgot', 'otp', 'reset', or 'success'
  const [currentView, setCurrentView] = useState('login');

  // State for the standard login form
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  // States for the password reset flow
  const [resetEmail, setResetEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Added Confirmation Password State

  // Global states for loading and error handling across all views
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle standard login input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Process standard user login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/login', formData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      navigate('/'); // Redirect to Dashboard after success
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 1: Request OTP by providing email
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Backend integration: Call API to send OTP to resetEmail
      // await api.post('/forgot-password', { email: resetEmail });
      
      // Simulate network delay for UI testing
      setTimeout(() => {
        setCurrentView('otp');
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please check your email.');
      setLoading(false);
    }
  };

  // STEP 2: Verify the OTP code sent to email
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Backend integration: Call API to verify OTP
      // await api.post('/verify-otp', { email: resetEmail, otp: otpCode });
      
      // Simulate network delay for UI testing
      setTimeout(() => {
        setCurrentView('reset');
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP code. Please try again.');
      setLoading(false);
    }
  };

  // STEP 3: Submit the new password with confirmation validation
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    // Validation to ensure both passwords match perfectly
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    setLoading(true);

    try {
      // Backend integration: Call API to update the password
      // await api.post('/reset-password', { email: resetEmail, otp: otpCode, newPassword });
      
      // Simulate network delay for UI testing
      setTimeout(() => {
        // Load the Success UI View instead of a browser alert
        setCurrentView('success');
        setFormData({ ...formData, password: '' }); // Clear old password
        setNewPassword('');
        setConfirmPassword('');
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
      
      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[480px]">
          <div className="bg-white border border-slate-200 rounded-[32px] shadow-2xl overflow-hidden relative">
            <div className="p-10 md:p-14">
              
              {/* Branding Header (Hidden on Success View for better UX) */}
              {currentView !== 'success' && (
                <div className="mb-10 flex flex-col items-center text-center">
                  <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-blue-600/30">
                    <span className="material-symbols-outlined text-white text-3xl">
                      {currentView === 'login' ? 'rocket_launch' : 'lock_reset'}
                    </span>
                  </div>
                  <h1 className="text-3xl font-[900] text-slate-900 tracking-tight">
                    {currentView === 'login' ? (
                      <>SaaS<span className="text-blue-600">Flow</span></>
                    ) : currentView === 'forgot' ? 'Reset Password'
                      : currentView === 'otp' ? 'Enter OTP'
                      : 'Create New Password'
                    }
                  </h1>
                  {currentView !== 'login' && (
                    <p className="text-slate-500 text-sm mt-2 font-medium">
                      {currentView === 'forgot' ? "Enter your email to receive an OTP code."
                      : currentView === 'otp' ? `We sent a code to ${resetEmail || 'your email'}.`
                      : "Enter your secure new password below."}
                    </p>
                  )}
                </div>
              )}

              {/* Error Message Display Area */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold rounded-r-xl animate-fadeIn">
                  {error}
                </div>
              )}

              {/* ========================================= */}
              {/* VIEW 1: STANDARD LOGIN FORM               */}
              {/* ========================================= */}
              {currentView === 'login' && (
                <form onSubmit={handleLogin} className="space-y-6 animate-fadeIn">
                  <div className="space-y-3">
                    <label className="text-[13px] font-bold text-slate-700 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-blue-600">mail</span>
                      Email Address
                    </label>
                    <input 
                      name="email"
                      type="email" 
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-slate-900 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-[15px]" 
                      placeholder="name@example.com" 
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[13px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-blue-600">lock</span>
                        Password
                      </label>
                      <button 
                        type="button"
                        onClick={() => { setError(''); setCurrentView('forgot'); }}
                        className="text-[13px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <input 
                      name="password"
                      type="password" 
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-slate-900 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-[15px]" 
                      placeholder="••••••••" 
                    />
                  </div>

                  <button 
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-blue-600/20 mt-6 text-[15px]" 
                    type="submit"
                  >
                    {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                  </button>
                </form>
              )}

              {/* ========================================= */}
              {/* VIEW 2: FORGOT PASSWORD (EMAIL INPUT)     */}
              {/* ========================================= */}
              {currentView === 'forgot' && (
                <form onSubmit={handleForgotPassword} className="space-y-6 animate-fadeIn">
                  <div className="space-y-3">
                    <label className="text-[13px] font-bold text-slate-700 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-blue-600">mail</span>
                      Account Email
                    </label>
                    <input 
                      type="email" 
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-slate-900 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-[15px]" 
                      placeholder="Enter the email associated with your account" 
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <button 
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-blue-600/20 text-[15px]" 
                      type="submit"
                    >
                      {loading ? 'Sending...' : 'Send OTP Code'}
                    </button>
                    <button 
                      type="button"
                      disabled={loading}
                      onClick={() => setCurrentView('login')}
                      className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl transition-all text-[15px]" 
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              )}

              {/* ========================================= */}
              {/* VIEW 3: OTP VERIFICATION INPUT            */}
              {/* ========================================= */}
              {currentView === 'otp' && (
                <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fadeIn">
                  <div className="space-y-3">
                    <label className="text-[13px] font-bold text-slate-700 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-blue-600">pin</span>
                      6-Digit OTP Code
                    </label>
                    <input 
                      type="text" 
                      required
                      maxLength="6"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-slate-900 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-bold text-center tracking-[0.5em] text-xl" 
                      placeholder="••••••" 
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <button 
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-blue-600/20 text-[15px]" 
                      type="submit"
                    >
                      {loading ? 'Verifying...' : 'Verify Code'}
                    </button>
                    <button 
                      type="button"
                      disabled={loading}
                      onClick={() => setCurrentView('forgot')}
                      className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl transition-all text-[15px]" 
                    >
                      Change Email
                    </button>
                  </div>
                </form>
              )}

              {/* ========================================= */}
              {/* VIEW 4: CREATE NEW PASSWORD               */}
              {/* ========================================= */}
              {currentView === 'reset' && (
                <form onSubmit={handleResetPassword} className="space-y-5 animate-fadeIn">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-700 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-blue-600">key</span>
                      New Password
                    </label>
                    <input 
                      type="password" 
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-slate-900 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-[15px]" 
                      placeholder="Enter new password" 
                    />
                  </div>
                  
                  {/* Added Confirmation Password Input */}
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-700 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-blue-600">verified_user</span>
                      Confirm Password
                    </label>
                    <input 
                      type="password" 
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-slate-900 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-[15px]" 
                      placeholder="Confirm your new password" 
                    />
                  </div>

                  <div className="pt-4">
                    <button 
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-blue-600/20 text-[15px]" 
                      type="submit"
                    >
                      {loading ? 'Saving...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              )}

              {/* ========================================= */}
              {/* VIEW 5: SUCCESSFUL RESET SCREEN           */}
              {/* ========================================= */}
              {currentView === 'success' && (
                <div className="text-center animate-fadeIn py-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-500 rounded-full mb-6">
                    <span className="material-symbols-outlined text-[48px]">check_circle</span>
                  </div>
                  <h2 className="text-2xl font-[900] text-slate-900 mb-2">Password Reset Successful!</h2>
                  <p className="text-slate-500 font-medium mb-8 px-4">
                    Your password has been changed successfully. You can now log in to your account with your new credentials.
                  </p>
                  <button 
                    onClick={() => setCurrentView('login')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-blue-600/20 text-[15px]" 
                  >
                    Back to Login
                  </button>
                </div>
              )}

            </div>

            {/* Bottom Register Link - Only shown on main login view */}
            {currentView === 'login' && (
              <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
                <p className="text-slate-600 font-medium text-sm">
                  New user? 
                  <Link className="text-blue-600 hover:text-blue-700 font-black ml-2 transition-colors underline underline-offset-4 decoration-2" to="/register">
                    Create an account
                  </Link>
                </p>
              </div>
            )}
            
          </div>
        </div>
      </main>
      
    </div>
  );
}