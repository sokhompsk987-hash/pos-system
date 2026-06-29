import React, { useState } from 'react';
import Layout from '../components/Layout'; 

export default function Profile() {
  const [profileData, setProfileData] = useState({
    firstName: 'Sokhom',
    lastName: 'Prom',
    email: 'sokhom.prom@saasflow.com',
    phone: '+855 12 345 678',
    role: 'Administrator',
    branch: 'Main Headquarters'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // BACKEND TEAM: Insert API call here to save profile updates
    // Example: request('/api/users/profile', 'PUT', profileData).then(...)
    
    setTimeout(() => {
      console.log("Saved profile data:", profileData);
      setIsLoading(false);
      setIsEditing(false);
    }, 1000); // Simulated network delay
  };

  return (
    <Layout>
      <div className="p-6 md:p-10 font-['Public_Sans'] bg-slate-50 min-h-screen">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your personal information and security settings</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden max-w-4xl">
          
          <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400 relative">
            <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold">
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              Change Cover
            </button>
          </div>

          <div className="px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12 mb-8">
              <div className="relative group">
                <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md">
                  <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-blue-600 border border-slate-200 overflow-hidden">
                    <span className="material-symbols-outlined text-[40px]">person</span>
                  </div>
                </div>
                <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full shadow-lg transition-colors border-2 border-white">
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-black text-slate-900">{profileData.firstName} {profileData.lastName}</h2>
                <p className="text-slate-500 font-medium">{profileData.role} • {profileData.branch}</p>
              </div>

              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">edit_square</span>
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleSave}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">First Name</label>
                  <input 
                    type="text" 
                    name="firstName"
                    value={profileData.firstName} 
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-bold outline-none focus:border-blue-500 disabled:opacity-70 transition-colors" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Last Name</label>
                  <input 
                    type="text" 
                    name="lastName"
                    value={profileData.lastName} 
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-bold outline-none focus:border-blue-500 disabled:opacity-70 transition-colors" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={profileData.email} 
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-medium outline-none focus:border-blue-500 disabled:opacity-70 transition-colors" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={profileData.phone} 
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-medium outline-none focus:border-blue-500 disabled:opacity-70 transition-colors" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    Role
                    <span className="text-[10px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full normal-case">Contact IT to change</span>
                  </label>
                  <input 
                    type="text" 
                    value={profileData.role} 
                    disabled 
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-bold text-slate-500 cursor-not-allowed" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Branch</label>
                  <input 
                    type="text" 
                    value={profileData.branch} 
                    disabled 
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-bold text-slate-500 cursor-not-allowed" 
                  />
                </div>
              </div>

              {isEditing && (
                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                    className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              )}
            </form>

          </div>
        </div>
      </div>
    </Layout>
  );
}