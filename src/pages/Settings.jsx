import React, { useState } from 'react';
import Layout from '../components/Layout'; 

export default function Settings() {
  const [settings, setSettings] = useState({
    storeName: 'Baby Shop POS',
    currency: 'USD',
    timezone: 'Asia/Phnom_Penh',
    taxRate: '10',
    receiptMessage: 'Thank you for your purchase!',
    emailAlerts: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
    setSaveSuccess(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveSuccess(false);
    
    // BACKEND TEAM: Insert API call here to update store settings
    // Example: request('/api/settings', 'PUT', settings).then(...)
    
    setTimeout(() => {
      console.log("Saved settings:", settings);
      setIsLoading(false);
      setSaveSuccess(true);
      
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000); // Simulated network delay
  };

  return (
    <Layout>
      <div className="p-6 md:p-10 font-['Public_Sans'] bg-slate-50 min-h-screen">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-slate-500 font-medium mt-1">Configure your store preferences and system behaviors</p>
        </div>

        <form onSubmit={handleSave} className="max-w-4xl space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-black text-slate-800">Store Details</h2>
              <p className="text-sm text-slate-500 font-medium">Basic information about your business</p>
            </div>
            
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Store Name</label>
                <input 
                  type="text" 
                  name="storeName"
                  value={settings.storeName} 
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-bold outline-none focus:border-blue-500 transition-colors" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Currency</label>
                <select 
                  name="currency"
                  value={settings.currency} 
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-bold outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="USD">USD ($)</option>
                  <option value="KHR">KHR (៛)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Timezone</label>
                <select 
                  name="timezone"
                  value={settings.timezone} 
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-bold outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="Asia/Phnom_Penh">Indochina Time (Phnom Penh)</option>
                  <option value="Asia/Bangkok">Indochina Time (Bangkok)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-black text-slate-800">Receipt Configuration</h2>
              <p className="text-sm text-slate-500 font-medium">Customize how your printed invoices look</p>
            </div>
            
            <div className="p-6 md:p-8 grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Default Tax Rate (%)</label>
                <input 
                  type="number" 
                  name="taxRate"
                  min="0"
                  max="100"
                  value={settings.taxRate} 
                  onChange={handleInputChange}
                  className="w-full md:w-1/2 bg-white border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-bold outline-none focus:border-blue-500 transition-colors" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Receipt Footer Message</label>
                <textarea 
                  name="receiptMessage"
                  rows="3"
                  value={settings.receiptMessage} 
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-medium outline-none focus:border-blue-500 transition-colors resize-none" 
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-black text-slate-800">Email Notifications</h3>
                <p className="text-[13px] text-slate-500 font-medium mt-1">Receive daily summary reports and low stock alerts</p>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="emailAlerts"
                  checked={settings.emailAlerts}
                  onChange={handleInputChange}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-2">
            {saveSuccess && (
              <span className="text-emerald-600 font-bold text-sm flex items-center gap-1 animate-fadeIn">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Settings saved successfully!
              </span>
            )}
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span>
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
          
        </form>
      </div>
    </Layout>
  );
}