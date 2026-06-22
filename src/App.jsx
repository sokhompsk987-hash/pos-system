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

// Import the newly created POS and Transactions pages
import POS from './pages/POS/POS.jsx';
import Transactions from './pages/POS/Transactions.jsx';
// បន្ថែមការហៅទំព័រ Invoice មកប្រើ
import InvoiceDetails from './pages/POS/InvoiceDetails.jsx'; 

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
        <Route path="/users" element={<Users />} />
        <Route path="/inventory" element={<StockManagement />} />
        
        {/* Routes for the Sales & POS module */}
        <Route path="/pos" element={<POS />} />
        <Route path="/transactions" element={<Transactions />} />
        
        {/* បន្ថែមផ្លូវសម្រាប់ទំព័រ Invoice */}
        <Route path="/pos/invoice/:id" element={<InvoiceDetails />} />
      </Routes>
    </div>
  );
}

export default App;