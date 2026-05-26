import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Ensure currentPath is always a valid string for route matching
  const currentPath = location && location.pathname ? location.pathname : '/';
  const isActive = (path) => currentPath === path;

  // Handle user logout and clear authentication token
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Dynamically format the page title based on the current route path
  let pageTitle = 'Dashboard';
  if (currentPath.length > 1) {
    pageTitle = currentPath.substring(1).split('-').join(' ');
  }

  return (
    <div className="flex h-screen bg-slate-50 font-['Public_Sans'] overflow-hidden">
      
      {/* Sidebar Container */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex h-full border-r border-slate-800">
        
        {/* Application Logo */}
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-600/30">
              <span className="material-symbols-outlined text-white text-[20px]">rocket_launch</span>
            </span>
            SaaS<span className="text-blue-500">Flow</span>
          </h1>
        </div>
        
        {/* Navigation Menu with Custom Scrollbar Styling */}
        <nav className="flex-1 px-4 py-6 space-y-4 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-600">
          
          <Link 
            to="/dashboard" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive('/dashboard') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </Link>

          {/* Sales & POS Module */}
          <div>
            <p className="px-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2 mt-4">Sales & POS</p>
            <div className="space-y-1">
              <Link to="/pos" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold transition-all ${isActive('/pos') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <span className="material-symbols-outlined text-[18px]">point_of_sale</span>
                POS 
              </Link>
              <Link to="/transactions" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold transition-all ${isActive('/transactions') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                Transactions
              </Link>
            </div>
          </div>

          {/* Inventory Module */}
          <div>
            <p className="px-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2 mt-4">Inventory</p>
            <div className="space-y-1">
              <Link to="/products" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold transition-all ${isActive('/products') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                Products
              </Link>
              <Link to="/category" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold transition-all ${isActive('/category') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <span className="material-symbols-outlined text-[18px]">category</span>
                Categories
              </Link>
              <Link to="/inventory" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold transition-all ${isActive('/inventory') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <span className="material-symbols-outlined text-[18px]">warehouse</span>
                Stock Management
              </Link>
              <Link to="/stock-movement" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold transition-all ${isActive('/stock-movement') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <span className="material-symbols-outlined text-[18px]">sync_alt</span>
                Stock Movement
              </Link>
            </div>
          </div>

          {/* Administration Module */}
          <div>
            <p className="px-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2 mt-4">Administration</p>
            <div className="space-y-1">
              <Link to="/users" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold transition-all ${isActive('/users') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <span className="material-symbols-outlined text-[18px]">group</span>
                Users & Staff
              </Link>
              <Link to="/branch" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold transition-all ${isActive('/branch') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <span className="material-symbols-outlined text-[18px]">store</span>
                Branches
              </Link>
              <Link to="/reports" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold transition-all ${isActive('/reports') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <span className="material-symbols-outlined text-[18px]">bar_chart</span>
                Reports
              </Link>
            </div>
          </div>

          {/* System Settings Module */}
          <div>
            <p className="px-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2 mt-4">System</p>
            <div className="space-y-1">
              <Link to="/subscription" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold transition-all ${isActive('/subscription') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <span className="material-symbols-outlined text-[18px]">card_membership</span>
                My Subscription
              </Link>
            </div>
          </div>

        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <span className="material-symbols-outlined">logout</span>
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        
        {/* Dynamic Header (Hidden on Subscription page) */}
        {!isActive('/subscription') && (
          <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
            <h2 className="text-lg font-bold text-slate-800 capitalize">
              {pageTitle}
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-600">Admin User</span>
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-500 text-sm">person</span>
              </div>
            </div>
          </header>
        )}
        
        {/* Inject Page Content */}
        {children}
      </main>
      
    </div>
  );
}