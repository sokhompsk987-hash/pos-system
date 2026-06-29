import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import LogoutModal from './LogoutModal';
import ProfileDropdown from './ProfileDropdown';
export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userPermissions, setUserPermissions] = useState(null);

  useEffect(() => {
    try {
      const storedPerms = localStorage.getItem('user_permissions');
      if (storedPerms) {
        setUserPermissions(JSON.parse(storedPerms));
      } else {
        setUserPermissions({
          dashboard: { view: true },
          pos: { view: true },
          transactions: { view: true },
          products: { view: true },
          stock: { view: true },
          users: { view: true },
          reports: { view: true }
        });
      }
    } catch (error) {
      console.error("Failed to parse user permissions");
    }
  }, []);

  const canAccess = (moduleId) => {
    if (!userPermissions) return false;
    return userPermissions[moduleId]?.view === true;
  };

  const currentPath = location && location.pathname ? location.pathname : '/';
  
  const isActive = (path) => {
    if (path === '/transactions' && currentPath.includes('/pos/invoice')) return true;
    return currentPath === path;
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_permissions');
    setShowLogoutConfirm(false);
    navigate('/login');
  };

  const handleMenuClick = () => {
    if (isCollapsed) setIsCollapsed(false);
    setIsMobileMenuOpen(false);
  };

  const getPageTitle = (path) => {
    if (path.includes('/pos/invoice')) return 'Invoice Details';
    
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
      '/roles': 'User Roles',
      '/branch': 'Branch Management',
      '/reports': 'Reports',
      '/subscription': 'Subscription'
    };

    return routeTitles[path] || 'SaaSFlow';
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden relative">
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        canAccess={canAccess}
        isActive={isActive}
        handleMenuClick={handleMenuClick}
        setShowLogoutConfirm={setShowLogoutConfirm}
      />

      <main className="flex-1 overflow-y-auto relative flex flex-col min-w-0">
        {!isActive('/subscription') && (
          <Header 
            pageTitle={getPageTitle(currentPath)}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            handleSignOutClick={() => setShowLogoutConfirm(true)}
          />
        )}
        <div className="flex-1 relative">
          {children}
        </div>
      </main>

      <LogoutModal 
        showLogoutConfirm={showLogoutConfirm} 
        setShowLogoutConfirm={setShowLogoutConfirm} 
        confirmLogout={confirmLogout} 
      />
    </div>
  );
}