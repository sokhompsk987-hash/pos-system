import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileMenuOpen, setIsMobileMenuOpen, canAccess, isActive, handleMenuClick, setShowLogoutConfirm }) {
  return (
    <>
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm animate-fadeIn" 
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      <aside className={`fixed md:relative top-0 left-0 h-full z-50 bg-slate-900 text-white flex flex-col border-r border-slate-800 transition-all duration-300 shrink-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} ${isCollapsed ? 'md:w-20' : 'md:w-64'} w-64`}>
        
        <div className={`p-6 border-b border-slate-800 flex items-center h-[89px] shrink-0 ${isCollapsed ? 'md:justify-center px-4' : 'justify-between'}`}>
          <h1 className={`text-2xl font-black tracking-tight text-white flex items-center gap-2 truncate ${isCollapsed ? 'md:hidden' : ''}`}>
            <span className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-600/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[22px]">rocket_launch</span>
            </span>
            SaaS<span className="text-blue-500">Flow</span>
          </h1>
          
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden md:flex text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800 items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">{isCollapsed ? 'menu' : 'menu_open'}</span>
          </button>
          
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">close</span>
          </button>
        </div>
        
        <nav className="flex-1 py-6 space-y-4 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/40 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/60">
          
          {canAccess('dashboard') && (
            <div className="px-4">
              <Link to="/dashboard" onClick={handleMenuClick} className={`flex items-center gap-3 py-3 rounded-xl font-bold transition-all ${isActive('/dashboard') || isActive('/') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'md:justify-center px-2' : 'px-4'}`}>
                <span className="material-symbols-outlined text-[22px]">dashboard</span>
                <span className={`text-[15px] ${isCollapsed ? 'md:hidden' : ''}`}>Dashboard</span>
              </Link>
            </div>
          )}

          {(canAccess('pos') || canAccess('transactions')) && (
            <div>
              <p className={`px-8 text-[12px] font-bold uppercase tracking-widest text-slate-500 mb-2 mt-4 ${isCollapsed ? 'md:hidden' : ''}`}>Sales & POS</p>
              {isCollapsed && <div className="hidden md:block h-8 border-t border-slate-800 mx-4 mt-4 mb-2"></div>}
              <div className="space-y-1 px-4">
                {canAccess('pos') && (
                  <Link to="/pos" onClick={handleMenuClick} className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/pos') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'md:justify-center px-2' : 'px-4'}`}>
                    <span className="material-symbols-outlined text-[20px]">point_of_sale</span>
                    <span className={`text-[14px] ${isCollapsed ? 'md:hidden' : ''}`}>POS</span>
                  </Link>
                )}
                {canAccess('transactions') && (
                  <Link to="/transactions" onClick={handleMenuClick} className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/transactions') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'md:justify-center px-2' : 'px-4'}`}>
                    <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                    <span className={`text-[14px] ${isCollapsed ? 'md:hidden' : ''}`}>Transactions</span>
                  </Link>
                )}
              </div>
            </div>
          )}

          {(canAccess('products') || canAccess('stock')) && (
            <div>
              <p className={`px-8 text-[12px] font-bold uppercase tracking-widest text-slate-500 mb-2 mt-4 ${isCollapsed ? 'md:hidden' : ''}`}>Inventory</p>
              {isCollapsed && <div className="hidden md:block h-8 border-t border-slate-800 mx-4 mt-4 mb-2"></div>}
              <div className="space-y-1 px-4">
                {canAccess('products') && (
                  <>
                    <Link to="/products" onClick={handleMenuClick} className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/products') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'md:justify-center px-2' : 'px-4'}`}>
                      <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                      <span className={`text-[14px] ${isCollapsed ? 'md:hidden' : ''}`}>Products</span>
                    </Link>
                    <Link to="/category" onClick={handleMenuClick} className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/category') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'md:justify-center px-2' : 'px-4'}`}>
                      <span className="material-symbols-outlined text-[20px]">category</span>
                      <span className={`text-[14px] ${isCollapsed ? 'md:hidden' : ''}`}>Categories</span>
                    </Link>
                  </>
                )}
                {canAccess('stock') && (
                  <>
                    <Link to="/suppliers" onClick={handleMenuClick} className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/suppliers') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'md:justify-center px-2' : 'px-4'}`}>
                      <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                      <span className={`text-[14px] ${isCollapsed ? 'md:hidden' : ''}`}>Suppliers</span>
                    </Link>
                    <Link to="/inventory" onClick={handleMenuClick} className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/inventory') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'md:justify-center px-2' : 'px-4'}`}>
                      <span className="material-symbols-outlined text-[20px]">warehouse</span>
                      <span className={`text-[14px] ${isCollapsed ? 'md:hidden' : ''}`}>Stock Management</span>
                    </Link>
                    <Link to="/stock-movement" onClick={handleMenuClick} className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/stock-movement') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'md:justify-center px-2' : 'px-4'}`}>
                      <span className="material-symbols-outlined text-[20px]">sync_alt</span>
                      <span className={`text-[14px] ${isCollapsed ? 'md:hidden' : ''}`}>Stock Movement</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}

          {(canAccess('users') || canAccess('reports')) && (
            <div>
              <p className={`px-8 text-[12px] font-bold uppercase tracking-widest text-slate-500 mb-2 mt-4 ${isCollapsed ? 'md:hidden' : ''}`}>Administration</p>
              {isCollapsed && <div className="hidden md:block h-8 border-t border-slate-800 mx-4 mt-4 mb-2"></div>}
              <div className="space-y-1 px-4">
                {canAccess('users') && (
                  <>
                    <Link to="/users" onClick={handleMenuClick} className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/users') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'md:justify-center px-2' : 'px-4'}`}>
                      <span className="material-symbols-outlined text-[20px]">group</span>
                      <span className={`text-[14px] ${isCollapsed ? 'md:hidden' : ''}`}>Users & Staff</span>
                    </Link>
                    <Link to="/roles" onClick={handleMenuClick} className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/roles') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'md:justify-center px-2' : 'px-4'}`}>
                      <span className="material-symbols-outlined text-[20px]">badge</span>
                      <span className={`text-[14px] ${isCollapsed ? 'md:hidden' : ''}`}>User Roles</span>
                    </Link>
                    <Link to="/branch" onClick={handleMenuClick} className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/branch') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'md:justify-center px-2' : 'px-4'}`}>
                      <span className="material-symbols-outlined text-[20px]">store</span>
                      <span className={`text-[14px] ${isCollapsed ? 'md:hidden' : ''}`}>Branches</span>
                    </Link>
                  </>
                )}
                {canAccess('reports') && (
                  <Link to="/reports" onClick={handleMenuClick} className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/reports') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'md:justify-center px-2' : 'px-4'}`}>
                    <span className="material-symbols-outlined text-[20px]">bar_chart</span>
                    <span className={`text-[14px] ${isCollapsed ? 'md:hidden' : ''}`}>Reports</span>
                  </Link>
                )}
              </div>
            </div>
          )}

          <div>
            <p className={`px-8 text-[12px] font-bold uppercase tracking-widest text-slate-500 mb-2 mt-4 ${isCollapsed ? 'md:hidden' : ''}`}>System</p>
            {isCollapsed && <div className="hidden md:block h-8 border-t border-slate-800 mx-4 mt-4 mb-2"></div>}
            <div className="space-y-1 px-4 mb-4">
              <Link to="/subscription" onClick={handleMenuClick} className={`flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all ${isActive('/subscription') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'} ${isCollapsed ? 'md:justify-center px-2' : 'px-4'}`}>
                <span className="material-symbols-outlined text-[20px]">card_membership</span>
                <span className={`text-[14px] ${isCollapsed ? 'md:hidden' : ''}`}>My Subscription</span>
              </Link>
            </div>
          </div>

        </nav>

        <div className="p-4 border-t border-slate-800 shrink-0">
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className={`flex items-center gap-3 py-3 rounded-xl font-bold text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors w-full ${isCollapsed ? 'md:justify-center px-2' : 'px-4'}`}
          >
            <span className="material-symbols-outlined text-[22px]">logout</span>
            <span className={`text-[15px] ${isCollapsed ? 'md:hidden' : ''}`}>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}