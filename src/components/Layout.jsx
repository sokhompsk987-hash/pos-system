import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  // State to control the visibility of the logout confirmation dialog
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // State to control sidebar collapse/expand
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Ensure currentPath is always a valid string for route matching
  const currentPath = location && location.pathname ? location.pathname : '/';
  const isActive = (path) => currentPath === path;

  // Function to perform the logout action after user confirmation
  const confirmLogout = () => {
    localStorage.removeItem('token');
    setShowLogoutConfirm(false);
    navigate('/login');
  };

  // Feature: Automatically expand the sidebar when a menu item is clicked
  const handleMenuClick = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  };

  // Dynamically format the page title based on the current route path
  let pageTitle = 'Dashboard';
  if (currentPath.length > 1) {
    pageTitle = currentPath.substring(1).split('-').join(' ');
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* Sidebar Container - Dynamic Width */}
      <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-slate-900 text-white flex flex-col hidden md:flex h-full border-r border-slate-800 transition-all duration-300 shrink-0 z-20`}>
        
        {/* Application Logo & Toggle Button */}
        <div className={`p-6 border-b border-slate-800 flex items-center h-[89px] shrink-0 ${isCollapsed ? 'justify-center px-4' : 'justify-between'}`}>
          {!isCollapsed && (
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2 truncate">
              <span className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-600/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[22px]">rocket_launch</span>
              </span>
              SaaS<span className="text-blue-500">Flow</span>
            </h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800 flex items-center justify-center shrink-0"
            title={isCollapsed ? "Expand Menu" : "Collapse Menu"}
          >
            <span className="material-symbols-outlined text-[26px]">
              {isCollapsed ? 'menu' : 'menu_open'}
            </span>
          </button>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 py-6 space-y-4 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/40 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/60">
          
          <div className="px-4">
            <Link 
              to="/dashboard" 
              onClick={handleMenuClick}
              className={`flex items-center gap-3 py-3 rounded-xl font-bold transition-all ${isActive('/dashboard') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'justify-center px-2' : 'px-4'}`}
              title="Dashboard"
            >
              <span className="material-symbols-outlined text-[22px]">dashboard</span>
              {!isCollapsed && <span className="text-[15px]">Dashboard</span>}
            </Link>
          </div>

          {/* Sales & POS Module */}
          <div>
            {!isCollapsed ? (
              <p className="px-8 text-[12px] font-bold uppercase tracking-widest text-slate-500 mb-2 mt-4">Sales & POS</p>
            ) : (
              <div className="h-8 border-t border-slate-800 mx-4 mt-4 mb-2"></div>
            )}
            <div className="space-y-1 px-4">
              <Link to="/pos" onClick={handleMenuClick} title="POS" className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/pos') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'justify-center px-2' : 'px-4'}`}>
                <span className="material-symbols-outlined text-[20px]">point_of_sale</span>
                {!isCollapsed && <span className="text-[14px]">POS</span>}
              </Link>
              <Link to="/transactions" onClick={handleMenuClick} title="Transactions" className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/transactions') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'justify-center px-2' : 'px-4'}`}>
                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                {!isCollapsed && <span className="text-[14px]">Transactions</span>}
              </Link>
            </div>
          </div>

          {/* Inventory Module */}
          <div>
            {!isCollapsed ? (
              <p className="px-8 text-[12px] font-bold uppercase tracking-widest text-slate-500 mb-2 mt-4">Inventory</p>
            ) : (
              <div className="h-8 border-t border-slate-800 mx-4 mt-4 mb-2"></div>
            )}
            <div className="space-y-1 px-4">
              <Link to="/products" onClick={handleMenuClick} title="Products" className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/products') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'justify-center px-2' : 'px-4'}`}>
                <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                {!isCollapsed && <span className="text-[14px]">Products</span>}
              </Link>
              <Link to="/category" onClick={handleMenuClick} title="Categories" className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/category') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'justify-center px-2' : 'px-4'}`}>
                <span className="material-symbols-outlined text-[20px]">category</span>
                {!isCollapsed && <span className="text-[14px]">Categories</span>}
              </Link>
              <Link to="/inventory" onClick={handleMenuClick} title="Stock Management" className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/inventory') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'justify-center px-2' : 'px-4'}`}>
                <span className="material-symbols-outlined text-[20px]">warehouse</span>
                {!isCollapsed && <span className="text-[14px]">Stock Management</span>}
              </Link>
              <Link to="/stock-movement" onClick={handleMenuClick} title="Stock Movement" className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/stock-movement') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'justify-center px-2' : 'px-4'}`}>
                <span className="material-symbols-outlined text-[20px]">sync_alt</span>
                {!isCollapsed && <span className="text-[14px]">Stock Movement</span>}
              </Link>
            </div>
          </div>

          {/* Administration Module */}
          <div>
            {!isCollapsed ? (
              <p className="px-8 text-[12px] font-bold uppercase tracking-widest text-slate-500 mb-2 mt-4">Administration</p>
            ) : (
              <div className="h-8 border-t border-slate-800 mx-4 mt-4 mb-2"></div>
            )}
            <div className="space-y-1 px-4">
              <Link to="/users" onClick={handleMenuClick} title="Users & Staff" className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/users') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'justify-center px-2' : 'px-4'}`}>
                <span className="material-symbols-outlined text-[20px]">group</span>
                {!isCollapsed && <span className="text-[14px]">Users & Staff</span>}
              </Link>
              <Link to="/branch" onClick={handleMenuClick} title="Branches" className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/branch') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'justify-center px-2' : 'px-4'}`}>
                <span className="material-symbols-outlined text-[20px]">store</span>
                {!isCollapsed && <span className="text-[14px]">Branches</span>}
              </Link>
              <Link to="/reports" onClick={handleMenuClick} title="Reports" className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/reports') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'justify-center px-2' : 'px-4'}`}>
                <span className="material-symbols-outlined text-[20px]">bar_chart</span>
                {!isCollapsed && <span className="text-[14px]">Reports</span>}
              </Link>
            </div>
          </div>

          {/* System Settings Module */}
          <div>
            {!isCollapsed ? (
              <p className="px-8 text-[12px] font-bold uppercase tracking-widest text-slate-500 mb-2 mt-4">System</p>
            ) : (
              <div className="h-8 border-t border-slate-800 mx-4 mt-4 mb-2"></div>
            )}
            <div className="space-y-1 px-4 mb-4">
              <Link to="/subscription" onClick={handleMenuClick} title="My Subscription" className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/subscription') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'justify-center px-2' : 'px-4'}`}>
                <span className="material-symbols-outlined text-[20px]">card_membership</span>
                {!isCollapsed && <span className="text-[14px]">My Subscription</span>}
              </Link>
            </div>
          </div>

        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            title="Log Out"
            className={`flex items-center gap-3 py-3 rounded-xl font-bold text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors w-full ${isCollapsed ? 'justify-center px-2' : 'px-4'}`}
          >
            <span className="material-symbols-outlined text-[22px]">logout</span>
            {!isCollapsed && <span className="text-[15px]">Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative flex flex-col min-w-0">
        
        {/* Dynamic Header (Hidden on Subscription page) */}
        {!isActive('/subscription') && (
          <header className="bg-white h-[89px] border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
            <h2 className="text-[22px] font-black text-slate-800 capitalize tracking-tight">
              {pageTitle}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-[15px] font-bold text-slate-600 hidden sm:block">Admin User</span>
              <div className="w-11 h-11 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-200 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-blue-600 text-[22px]">person</span>
              </div>
            </div>
          </header>
        )}
        
        {/* Inject Page Content */}
        <div className="flex-1 relative">
          {children}
        </div>
      </main>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
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
      )}
      
    </div>
  );
}
