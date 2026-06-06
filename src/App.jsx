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

// Import the newly created POS and Transactions pages
import POS from './pages/POS/POS.jsx';
import Transactions from './pages/POS/Transactions.jsx';

function App() {
  return (
    <div className="min-h-screen bg-pos-bg">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/category" element={<Category />} />
        <Route path="/products" element={<Products />} />
        <Route path="/branch" element={<Branch />} />
        <Route path="/stock-movement" element={<StockMovement />} />
        <Route path="/subscription" element={<Subscription />} />
        
        <Route path="/inventory" element={<StockManagement />} />
        
        {/* Routes for the Sales & POS module */}
        <Route path="/pos" element={<POS />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </div>
  );
}

export default App;