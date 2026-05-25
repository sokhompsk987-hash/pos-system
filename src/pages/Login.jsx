import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Make sure you have api.js in your services folder
import api from '../services/api'; 

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-['Public_Sans']">
      
      {/* Main Login Box */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[480px]">
          <div className="bg-white border border-slate-200 rounded-[32px] shadow-2xl overflow-hidden">
            <div className="p-10 md:p-14">
              
              {/* Logo Box */}
              <div className="mb-10 flex flex-col items-center text-center">
                <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-blue-600/30">
                  <span className="material-symbols-outlined text-white text-3xl">rocket_launch</span>
                </div>
                <h1 className="text-3xl font-[900] text-slate-900 tracking-tight">
                  SaaS<span className="text-blue-600">Flow</span>
                </h1>
              </div>

              {/* Error Message Box */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold rounded-r-xl">
                  {error}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-6">
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

                {/* Submit Button */}
                <button 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-blue-600/20 mt-6 text-[15px]" 
                  type="submit"
                >
                  {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                </button>
              </form>
            </div>

            {/* Bottom Register Link */}
            <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
              <p className="text-slate-600 font-medium text-sm">
                New user? 
                <Link className="text-blue-600 hover:text-blue-700 font-black ml-2 transition-colors underline underline-offset-4 decoration-2" to="/register">
                  Create an account
                </Link>
              </p>
            </div>
            
          </div>
        </div>
      </main>
      
    </div>
  );
}