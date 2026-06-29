import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProfileDropdown({ isDarkMode, setIsDarkMode, handleSignOutClick }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const onSignOut = () => {
    setShowProfileMenu(false);
    handleSignOutClick();
  };

  const closeMenu = () => {
    setShowProfileMenu(false);
  };

  return (
    <div className="relative">
      <div 
        className="flex items-center gap-4 cursor-pointer select-none" 
        onClick={() => setShowProfileMenu(!showProfileMenu)}
      >
        <span className="text-[15px] font-bold text-slate-600 hidden sm:block">Admin User</span>
        <div className="w-11 h-11 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-100 transition-colors">
          <span className="material-symbols-outlined text-blue-600 text-[22px]">person</span>
        </div>
      </div>

      {showProfileMenu && (
        <>
          <div className="fixed inset-0 z-20" onClick={closeMenu}></div>
          
          <div className="absolute right-0 mt-4 w-[280px] bg-white rounded-[24px] shadow-2xl border border-slate-100 z-30 overflow-hidden animate-fadeIn pb-2">
            
            <div className="p-2 space-y-1">
              <Link to="/profile" onClick={closeMenu} className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] text-slate-400">person</span>
                  <span className="text-[14px] font-bold">View profile</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-1.5 py-0.5 rounded">⌘P</span>
              </Link>
              
              <Link to="/settings" onClick={closeMenu} className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] text-slate-400">settings</span>
                  <span className="text-[14px] font-bold">Settings</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-1.5 py-0.5 rounded">⌘S</span>
              </Link>

              <div 
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer" 
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] text-slate-400">dark_mode</span>
                  <span className="text-[14px] font-bold">Dark mode</span>
                </div>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${isDarkMode ? 'bg-blue-600' : 'bg-slate-200'}`}>
                  <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${isDarkMode ? 'right-0.5' : 'left-0.5'}`}></div>
                </div>
              </div>

              <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] text-slate-400">help</span>
                  <span className="text-[14px] font-bold">Support</span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-slate-400">chevron_right</span>
              </button>
            </div>

            <div className="border-t border-slate-100 my-1"></div>

            <div className="p-2">
              <p className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">Switch Account</p>
              
              <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px]">AU</div>
                  <span className="text-[14px] font-bold text-slate-800">Admin User</span>
                </div>
                <div className="w-4 h-4 rounded-full border-[4px] border-blue-600 bg-white"></div>
              </button>
              
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
                <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-[10px]">SP</div>
                <span className="text-[14px] font-bold">Sokhom Prom</span>
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 text-slate-500 transition-colors mt-1">
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span className="text-[14px] font-bold">Add account</span>
              </button>
            </div>

            <div className="px-4 pt-2 pb-1">
              <button 
                onClick={onSignOut}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-700 font-bold text-[14px] transition-all"
              >
                <span className="material-symbols-outlined text-[18px] text-slate-400">logout</span>
                Sign out
              </button>
            </div>

          </div>
        </>
      )}
    </div>
  );
}