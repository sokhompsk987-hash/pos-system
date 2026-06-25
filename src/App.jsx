import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import core application view pages
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

// Import management core administration modules
import Category from './pages/Category.jsx';
import Branch from './pages/Branch.jsx';
import Products from './pages/Products.jsx'; 
import StockManagement from './pages/StockManagement.jsx';
import StockMovement from './pages/Inventory/StockMovement.jsx';
import Subscription from './pages/Billing/Subscription.jsx';
import Users from './pages/Users.jsx';
import Suppliers from './pages/Suppliers.jsx';

// Import the newly created POS and Transactions pages
import POS from './pages/POS/POS.jsx';
import Transactions from './pages/POS/Transactions.jsx';
import InvoiceDetails from './pages/POS/InvoiceDetails.jsx'; 

// Import the Reports page
import Reports from './pages/Reports.jsx'; 

// IMPORT THE SECURITY ELEMENT FOR GATEKEEPING REVENUE PERMISSIONS
import FeatureGuard from './components/FeatureGuard.jsx';

function App() {
  return (
    <div className="min-h-screen bg-pos-bg">
      <Routes>
        {/* Public and unprotected routes accessible by anyone */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/subscription" element={<Subscription />} />
        
        {/* Protected routes wrapped with FeatureGuard gating authorization level */}
        <Route path="/dashboard" element={<FeatureGuard><Dashboard /></FeatureGuard>} />
        <Route path="/category" element={<FeatureGuard><Category /></FeatureGuard>} />
        <Route path="/products" element={<FeatureGuard><Products /></FeatureGuard>} />
        <Route path="/branch" element={<FeatureGuard><Branch /></FeatureGuard>} />
        <Route path="/stock-movement" element={<FeatureGuard><StockMovement /></FeatureGuard>} />
        <Route path="/users" element={<FeatureGuard><Users /></FeatureGuard>} />
        <Route path="/inventory" element={<FeatureGuard><StockManagement /></FeatureGuard>} />
        <Route path="/suppliers" element={<FeatureGuard><Suppliers /></FeatureGuard>} />
        
        {/* Route for the Reports module */}
        <Route path="/reports" element={<FeatureGuard><Reports /></FeatureGuard>} />
        
        {/* Routes for the Sales & POS module */}
        <Route path="/pos" element={<FeatureGuard><POS /></FeatureGuard>} />
        <Route path="/transactions" element={<FeatureGuard><Transactions /></FeatureGuard>} />
        <Route path="/pos/invoice/:id" element={<FeatureGuard><InvoiceDetails /></FeatureGuard>} />
      </Routes>
    </div>
  );
}

export default App;