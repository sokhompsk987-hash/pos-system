import React from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  // បើ isOpen ស្មើ false គឺមិនបាច់បង្ហាញផ្ទាំងនេះទេ
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      {/* ប្រអប់ពណ៌សនៅកណ្តាល ដែលមានចលនាលោតចេញមក */}
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* ផ្នែកខាងលើនៃផ្ទាំង (Header) */}
        {title && (
          <div className="flex justify-between items-center border-b border-slate-100 px-6 md:px-8 py-5">
            <h3 className="text-xl font-black text-slate-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        )}
        
        {/* ផ្នែកសាច់រឿងខាងក្នុង (Body) ដែលយើងអាចដាក់អីក៏បាន */}
        <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
        
      </div>
    </div>
  );
}