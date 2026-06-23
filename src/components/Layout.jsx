import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  // State to control the visibility of the logout confirmation dialog
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // State to control sidebar collapse/expand on Desktop
  const [isCollapsed, setIsCollapsed] = useState(false);

  // State to control sidebar open/close on Mobile devices
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State to control the profile dropdown menu
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // State for dark mode toggle UI (visual only for now)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Ensure currentPath is always a valid string for route matching
  const currentPath = location && location.pathname ? location.pathname : '/';
  
  // Update: Make Transactions button stay active when viewing an Invoice
  const isActive = (path) => {
    if (path === '/transactions' && currentPath.includes('/pos/invoice')) return true;
    return currentPath === path;
  };

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
    // Automatically close the menu on mobile after clicking a link
    setIsMobileMenuOpen(false);
  };

  // FIXED: robust page title mapping instead of string manipulation
  const getPageTitle = (path) => {
    if (path.includes('/pos/invoice')) return 'Invoice Details';
    
    // Map known routes to specific formatted titles
    const routeTitles = {
      '/': 'Dashboard',
      '/dashboard': 'Dashboard',
      '/pos': 'Point of Sale',
      '/transactions': 'Transactions',
      '/products': 'Products',
      '/category': 'Categories',
      '/suppliers': 'Suppliers',
      '/inventory': 'Stock Management',
      '/stock-movement': 'Stock Movement',
      '/users': 'Users & Staff',
      '/branch': 'Branch Management',
      '/reports': 'Reports',
      '/subscription': 'Subscription'
    };

    // Return the mapped title, or a default fallback
    return routeTitles[path] || 'SaaSFlow';
  };

  const pageTitle = getPageTitle(currentPath);

  // Action to trigger logout confirmation from the profile dropdown
  const handleSignOutClick = () => {
    setShowProfileMenu(false);
    setShowLogoutConfirm(true);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden relative">
      
      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm animate-fadeIn" 
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar Container - Dynamic Width & Mobile Off-canvas */}
      <aside className={`
        fixed md:relative top-0 left-0 h-full z-50 bg-slate-900 text-white flex flex-col border-r border-slate-800 
        transition-all duration-300 shrink-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'md:w-20' : 'md:w-64'} w-64
      `}>
        
        {/* Application Logo & Toggle Button */}
        <div className={`p-6 border-b border-slate-800 flex items-center h-[89px] shrink-0 ${isCollapsed ? 'md:justify-center px-4' : 'justify-between'}`}>
          <h1 className={`text-2xl font-black tracking-tight text-white flex items-center gap-2 truncate ${isCollapsed ? 'md:hidden' : ''}`}>
            <span className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-600/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[22px]">rocket_launch</span>
            </span>
            SaaS<span className="text-blue-500">Flow</span>
          </h1>
          
          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800 items-center justify-center shrink-0"
            title={isCollapsed ? "Expand Menu" : "Collapse Menu"}
          >
            <span className="material-symbols-outlined text-[26px]">
              {isCollapsed ? 'menu' : 'menu_open'}
            </span>
          </button>
          
          {/* Mobile Close Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800 flex items-center justify-center shrink-0"
          >
            <span className="material-symbols-outlined text-[26px]">close</span>
          </button>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 py-6 space-y-4 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/40 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/60">
          
          <div className="px-4">
            <Link 
              to="/dashboard" 
              onClick={handleMenuClick}
              className={`flex items-center gap-3 py-3 rounded-xl font-bold transition-all ${isActive('/dashboard') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'md:justify-center px-2' : 'px-4'}`}
              title="Dashboard"
            >
              <span className="material-symbols-outlined text-[22px]">dashboard</span>
              <span className={`text-[15px] ${isCollapsed ? 'md:hidden' : ''}`}>Dashboard</span>
            </Link>
          </div>

          {/* Sales & POS Module */}
          <div>
            <p className={`px-8 text-[12px] font-bold uppercase tracking-widest text-slate-500 mb-2 mt-4 ${isCollapsed ? 'md:hidden' : ''}`}>Sales & POS</p>
            {isCollapsed && <div className="hidden md:block h-8 border-t border-slate-800 mx-4 mt-4 mb-2"></div>}
            
            <div className="space-y-1 px-4">
              <Link to="/pos" onClick={handleMenuClick} title="POS" className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/pos') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'md:justify-center px-2' : 'px-4'}`}>
                <span className="material-symbols-outlined text-[20px]">point_of_sale</span>
                <span className={`text-[14px] ${isCollapsed ? 'md:hidden' : ''}`}>POS</span>
              </Link>
              <Link to="/transactions" onClick={handleMenuClick} title="Transactions" className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/transactions') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'md:justify-center px-2' : 'px-4'}`}>
                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                <span className={`text-[14px] ${isCollapsed ? 'md:hidden' : ''}`}>Transactions</span>
              </Link>
            </div>
          </div>

          {/* Inventory Module */}
          <div>
            <p className={`px-8 text-[12px] font-bold uppercase tracking-widest text-slate-500 mb-2 mt-4 ${isCollapsed ? 'md:hidden' : ''}`}>Inventory</p>
            {isCollapsed && <div className="hidden md:block h-8 border-t border-slate-800 mx-4 mt-4 mb-2"></div>}
            
            <div className="space-y-1 px-4">
              <Link to="/products" onClick={handleMenuClick} title="Products" className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/products') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'md:justify-center px-2' : 'px-4'}`}>
                <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                <span className={`text-[14px] ${isCollapsed ? 'md:hidden' : ''}`}>Products</span>
              </Link>
              <Link to="/category" onClick={handleMenuClick} title="Categories" className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/category') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'md:justify-center px-2' : 'px-4'}`}>
                <span className="material-symbols-outlined text-[20px]">category</span>
                <span className={`text-[14px] ${isCollapsed ? 'md:hidden' : ''}`}>Categories</span>
              </Link>
              
              <Link to="/suppliers" onClick={handleMenuClick} title="Suppliers" className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/suppliers') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'md:justify-center px-2' : 'px-4'}`}>
                <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                <span className={`text-[14px] ${isCollapsed ? 'md:hidden' : ''}`}>Suppliers</span>
              </Link>

              <Link to="/inventory" onClick={handleMenuClick} title="Stock Management" className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/inventory') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'md:justify-center px-2' : 'px-4'}`}>
                <span className="material-symbols-outlined text-[20px]">warehouse</span>
                <span className={`text-[14px] ${isCollapsed ? 'md:hidden' : ''}`}>Stock Management</span>
              </Link>
              <Link to="/stock-movement" onClick={handleMenuClick} title="Stock Movement" className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/stock-movement') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'md:justify-center px-2' : 'px-4'}`}>
                <span className="material-symbols-outlined text-[20px]">sync_alt</span>
                <span className={`text-[14px] ${isCollapsed ? 'md:hidden' : ''}`}>Stock Movement</span>
              </Link>
            </div>
          </div>

          {/* Administration Module */}
          <div>
            <p className={`px-8 text-[12px] font-bold uppercase tracking-widest text-slate-500 mb-2 mt-4 ${isCollapsed ? 'md:hidden' : ''}`}>Administration</p>
            {isCollapsed && <div className="hidden md:block h-8 border-t border-slate-800 mx-4 mt-4 mb-2"></div>}
            
            <div className="space-y-1 px-4">
              <Link to="/users" onClick={handleMenuClick} title="Users & Staff" className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/users') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'md:justify-center px-2' : 'px-4'}`}>
                <span className="material-symbols-outlined text-[20px]">group</span>
                <span className={`text-[14px] ${isCollapsed ? 'md:hidden' : ''}`}>Users & Staff</span>
              </Link>
              <Link to="/branch" onClick={handleMenuClick} title="Branches" className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/branch') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'md:justify-center px-2' : 'px-4'}`}>
                <span className="material-symbols-outlined text-[20px]">store</span>
                <span className={`text-[14px] ${isCollapsed ? 'md:hidden' : ''}`}>Branches</span>
              </Link>
              <Link to="/reports" onClick={handleMenuClick} title="Reports" className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/reports') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'md:justify-center px-2' : 'px-4'}`}>
                <span className="material-symbols-outlined text-[20px]">bar_chart</span>
                <span className={`text-[14px] ${isCollapsed ? 'md:hidden' : ''}`}>Reports</span>
              </Link>
            </div>
          </div>

          {/* System Settings Module */}
          <div>
            <p className={`px-8 text-[12px] font-bold uppercase tracking-widest text-slate-500 mb-2 mt-4 ${isCollapsed ? 'md:hidden' : ''}`}>System</p>
            {isCollapsed && <div className="hidden md:block h-8 border-t border-slate-800 mx-4 mt-4 mb-2"></div>}
            
            <div className="space-y-1 px-4 mb-4">
              <Link to="/subscription" onClick={handleMenuClick} title="My Subscription" className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/subscription') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'md:justify-center px-2' : 'px-4'}`}>
                <span className="material-symbols-outlined text-[20px]">card_membership</span>
                <span className={`text-[14px] ${isCollapsed ? 'md:hidden' : ''}`}>My Subscription</span>
              </Link>
            </div>
          </div>

        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            title="Log Out"
            className={`flex items-center gap-3 py-3 rounded-xl font-bold text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors w-full ${isCollapsed ? 'md:justify-center px-2' : 'px-4'}`}
          >
            <span className="material-symbols-outlined text-[22px]">logout</span>
            <span className={`text-[15px] ${isCollapsed ? 'md:hidden' : ''}`}>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative flex flex-col min-w-0">
        
        {/* Dynamic Header (Hidden on Subscription page) */}
        {!isActive('/subscription') && (
          <header className="bg-white h-[89px] border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 shrink-0">
            
            {/* Mobile Menu Button & Page Title */}
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
            
            {/* User Profile Section with Dropdown */}
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

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <>
                  {/* Invisible backdrop to close dropdown when clicking outside */}
                  <div className="fixed inset-0 z-20" onClick={() => setShowProfileMenu(false)}></div>
                  
                  <div className="absolute right-0 mt-4 w-[280px] bg-white rounded-[24px] shadow-2xl shadow-slate-200/50 border border-slate-100 z-30 overflow-hidden animate-fadeIn pb-2">
                    
                    {/* Top Menu Actions */}
                    <div className="p-2 space-y-1">
                      <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-[20px] text-slate-400">person</span>
                          <span className="text-[14px] font-bold">View profile</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-1.5 py-0.5 rounded">⌘P</span>
                      </button>
                      
                      <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-[20px] text-slate-400">settings</span>
                          <span className="text-[14px] font-bold">Settings</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-1.5 py-0.5 rounded">⌘S</span>
                      </button>

                      <div 
                        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer" 
                        onClick={() => setIsDarkMode(!isDarkMode)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-[20px] text-slate-400">dark_mode</span>
                          <span className="text-[14px] font-bold">Dark mode</span>
                        </div>
                        {/* Toggle Switch UI */}
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

                    {/* Switch Account Section */}
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

                    {/* Sign Out Button */}
                    <div className="px-4 pt-2 pb-1">
                      <button 
                        onClick={handleSignOutClick}
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