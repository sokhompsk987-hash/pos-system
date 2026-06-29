import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

import Category from './pages/Category.jsx';
import Branch from './pages/Branch.jsx';
import Products from './pages/Products.jsx'; 
import StockManagement from './pages/StockManagement.jsx';
import StockMovement from './pages/Inventory/StockMovement.jsx';
import Subscription from './pages/Billing/Subscription.jsx';
import Users from './pages/Users.jsx';
import Suppliers from './pages/Suppliers.jsx';

import POS from './pages/POS/POS.jsx';
import Transactions from './pages/POS/Transactions.jsx';
import InvoiceDetails from './pages/POS/InvoiceDetails.jsx'; 

import Reports from './pages/Reports.jsx'; 

import FeatureGuard from './components/FeatureGuard.jsx';

import Roles from './pages/Roles.jsx';
import Profile from './pages/Profile.jsx'; 

function App() {
  return (
    <div className="min-h-screen bg-pos-bg">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/subscription" element={<Subscription />} />
        
        <Route path="/dashboard" element={<FeatureGuard><Dashboard /></FeatureGuard>} />
        <Route path="/category" element={<FeatureGuard><Category /></FeatureGuard>} />
        <Route path="/products" element={<FeatureGuard><Products /></FeatureGuard>} />
        <Route path="/branch" element={<FeatureGuard><Branch /></FeatureGuard>} />
        <Route path="/stock-movement" element={<FeatureGuard><StockMovement /></FeatureGuard>} />
        <Route path="/users" element={<FeatureGuard><Users /></FeatureGuard>} />
        <Route path="/inventory" element={<FeatureGuard><StockManagement /></FeatureGuard>} />
        <Route path="/suppliers" element={<FeatureGuard><Suppliers /></FeatureGuard>} />
        <Route path="/roles" element={<FeatureGuard><Roles /></FeatureGuard>} />
        
        {/* Profile Route Added Here */}
        <Route path="/profile" element={<FeatureGuard><Profile /></FeatureGuard>} />
        
        <Route path="/reports" element={<FeatureGuard><Reports /></FeatureGuard>} />
        
        <Route path="/pos" element={<FeatureGuard><POS /></FeatureGuard>} />
        <Route path="/transactions" element={<FeatureGuard><Transactions /></FeatureGuard>} />
        <Route path="/pos/invoice/:id" element={<FeatureGuard><InvoiceDetails /></FeatureGuard>} />
      </Routes>
    </div>
  );
}

export default App;