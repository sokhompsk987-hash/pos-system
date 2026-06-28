import React from 'react';
import ProfileDropdown from './ProfileDropdown';

export default function Header({ pageTitle, setIsMobileMenuOpen, isDarkMode, setIsDarkMode, handleSignOutClick }) {
  return (
    <header className="bg-white h-[89px] border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-3">
        <button 
          className="md:hidden w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <span className="material-symbols-outlined text-[26px]">menu</span>
        </button>
        <h2 className="text-[20px] md:text-[22px] font-black text-slate-800 tracking-tight truncate">
          {pageTitle}
        </h2>
      </div>
      
      <ProfileDropdown 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        handleSignOutClick={handleSignOutClick} 
      />
    </header>
  );
}