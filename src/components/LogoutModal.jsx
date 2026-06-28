import React from 'react';

export default function LogoutModal({ showLogoutConfirm, setShowLogoutConfirm, confirmLogout }) {
  if (!showLogoutConfirm) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-100 p-6 text-center transform transition-all">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-red-500 rounded-full mb-5">
          <span className="material-symbols-outlined text-[36px]">logout</span>
        </div>
        <h3 className="text-[20px] font-black text-slate-900 mb-2">Confirm Sign Out</h3>
        <p className="text-[15px] font-medium text-slate-500 mb-8 px-2">
          Are you sure you want to log out of your account?
        </p>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowLogoutConfirm(false)}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[15px] py-3.5 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={confirmLogout}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[15px] py-3.5 rounded-xl transition-all shadow-lg shadow-red-600/20"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}