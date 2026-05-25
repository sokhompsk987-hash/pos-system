import React from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  // បើ isOpen ស្មើ false គឺមិនបាច់បង្ហាញផ្ទាំងនេះទេ
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* ប្រអប់ពណ៌សនៅកណ្តាល */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
        
        {/* ផ្នែកខាងលើនៃផ្ទាំង (Header) */}
        <div className="flex justify-between items-center border-b px-4 py-3">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 font-bold text-2xl transition-colors"
          >
            &times;
          </button>
        </div>
        
        {/* ផ្នែកសាច់រឿងខាងក្នុង (Body) ដែលយើងអាចដាក់អីក៏បាន */}
        <div className="p-4 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
        
      </div>
    </div>
  );
}