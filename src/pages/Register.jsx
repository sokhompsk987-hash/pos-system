import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company_name: '',
    business_type: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/register', formData);
      console.log("Registration Success:", response.data);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-['Public_Sans']">
      
      <main className="flex-1 flex items-center justify-center p-8 py-12">
        <div className="w-full max-w-[600px]">
          <div className="bg-white border border-slate-200 rounded-[32px] shadow-2xl overflow-hidden">
            <div className="p-8 md:p-12">
              
              {/* Logo Box */}
              <div className="mb-10 flex flex-col items-center text-center">
                <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-blue-600/30">
                  <span className="material-symbols-outlined text-white text-3xl">rocket_launch</span>
                </div>
                <h1 className="text-3xl font-[900] text-slate-900 tracking-tight">
                  SaaS<span className="text-blue-600">Flow</span>
                </h1>
                <p className="text-slate-500 font-medium mt-2">Create your account to get started</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm font-bold rounded-xl border border-red-100">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-5">
                
                {/* Two Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-700 flex items-center gap-2 uppercase tracking-widest">
                      <span className="material-symbols-outlined text-[16px] text-blue-600">domain</span>
                      Company Name
                    </label>
                    <input name="company_name" required onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900" placeholder="Acme Corp" type="text" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-700 flex items-center gap-2 uppercase tracking-widest">
                      <span className="material-symbols-outlined text-[16px] text-blue-600">category</span>
                      Business Type
                    </label>
                    <select name="business_type" required onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900">
                      <option value="">Select Industry</option>
                      <option value="tech">Technology</option>
                      <option value="ecommerce">E-commerce</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-700 flex items-center gap-2 uppercase tracking-widest">
                      <span className="material-symbols-outlined text-[16px] text-blue-600">mail</span>
                      Email Address
                    </label>
                    <input name="email" required onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900" placeholder="name@gmail.com" type="email" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-700 flex items-center gap-2 uppercase tracking-widest">
                      <span className="material-symbols-outlined text-[16px] text-blue-600">call</span>
                      Phone Number
                    </label>
                    <input name="phone" required onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900" placeholder="+855 ..." type="tel" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-slate-700 flex items-center gap-2 uppercase tracking-widest">
                    <span className="material-symbols-outlined text-[16px] text-blue-600">person</span>
                    Username
                  </label>
                  <input name="username" required onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900" placeholder="johndoe123" type="text" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-700 flex items-center gap-2 uppercase tracking-widest">
                      <span className="material-symbols-outlined text-[16px] text-blue-600">lock</span>
                      Password
                    </label>
                    <input name="password" required onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900" placeholder="••••••••" type="password" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-700 flex items-center gap-2 uppercase tracking-widest">
                      <span className="material-symbols-outlined text-[16px] text-blue-600">verified_user</span>
                      Confirm Password
                    </label>
                    <input name="password_confirmation" required onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900" placeholder="••••••••" type="password" />
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-blue-600/20 mt-6 text-[15px]" 
                  type="submit"
                >
                  {loading ? 'Creating Account...' : 'Register Now'}
                </button>
              </form>
            </div>

            {/* Bottom Login Link */}
            <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
              <p className="text-slate-600 font-medium text-sm">
                Already have an account? 
                <Link className="text-blue-600 hover:text-blue-700 font-black ml-2 transition-colors underline underline-offset-4 decoration-2" to="/login">
                  Log in here
                </Link>
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}