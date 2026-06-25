import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { request } from '../util/request';

export default function StockManagement() {
  const [stockItems, setStockItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustForm, setAdjustForm] = useState({
    action: 'add',
    quantity: '',
    reason: 'New Arrival'
  });

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = () => {
    setIsLoading(true);
    request('stocks', 'GET')
      .then(res => {
        if (res && res.data && Array.isArray(res.data)) {
          setStockItems(res.data);
        } else {
          setFallbackStock();
        }
      })
      .catch(err => {
        console.log("Error fetching stock:", err);
        setFallbackStock();
      })
      .finally(() => setIsLoading(false));
  };

  const setFallbackStock = () => {
    setStockItems([
      { id: 1, product_code: 'SAM-B4-001', product_name: 'Galaxy Book 4', branch_name: 'Toul Kork Branch', current_stock: 45, min_stock: 10 },
      { id: 2, product_code: 'IPH-15-PRO', product_name: 'iPhone 15 Pro Max', branch_name: 'BKK Branch', current_stock: 8, min_stock: 15 },
      { id: 3, product_code: 'MAC-AIR-M3', product_name: 'MacBook Air M3', branch_name: 'Toul Kork Branch', current_stock: 0, min_stock: 5 },
      { id: 4, product_code: 'SONY-WH-1000XM5', product_name: 'Sony WH-1000XM5', branch_name: 'BKK Branch', current_stock: 22, min_stock: 10 },
    ]);
  };

  const filteredStock = stockItems.filter(item => {
    const matchesSearch = item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.product_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'All' || item.branch_name === selectedBranch;
    return matchesSearch && matchesBranch;
  });

  const handleOpenAdjustModal = (product) => {
    setSelectedProduct(product);
    setAdjustForm({ action: 'add', quantity: '', reason: 'New Arrival' });
    setIsAdjustModalOpen(true);
  };

  const handleSaveAdjustment = (e) => {
    e.preventDefault();
    const payload = {
      product_id: selectedProduct.id,
      branch_name: selectedProduct.branch_name,
      adjustment_type: adjustForm.action,
      quantity: parseInt(adjustForm.quantity),
      reason: adjustForm.reason
    };

    request('stocks/adjust', 'POST', payload)
      .then(res => {
        setIsAdjustModalOpen(false);
        fetchStock();
      })
      .catch(err => console.log("Error adjusting stock:", err));
  };

  return (
    <Layout>
      <div className="p-6 md:p-10 font-['Public_Sans'] bg-slate-50 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
            </Link>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Stock Management</h1>
              <p className="text-slate-500 font-medium mt-1">Monitor inventory levels and make manual stock adjustments</p>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-400 text-lg">storefront</span>
            <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer">
              <option value="All">All Branches</option>
              <option value="Toul Kork Branch">Toul Kork Branch</option>
              <option value="BKK Branch">BKK Branch</option>
            </select>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <div className="relative max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input type="text" placeholder="Search by product name or code..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900" />
            </div>
          </div>

          {isLoading ? (
             <div className="flex justify-center p-20"><span className="material-symbols-outlined animate-spin text-4xl text-slate-400">refresh</span></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[12px] uppercase tracking-widest font-bold">
                    <th className="p-4 pl-6">Code</th>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Branch</th>
                    <th className="p-4">Current Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium text-slate-700">
                  {filteredStock.map((item, index) => {
                    let statusText = "In Stock";
                    let statusColor = "bg-green-100 text-green-600";
                    if (item.current_stock === 0) { statusText = "Out of Stock"; statusColor = "bg-red-100 text-red-600"; }
                    else if (item.current_stock <= item.min_stock) { statusText = "Low Stock"; statusColor = "bg-orange-100 text-orange-600"; }
                    return (
                      <tr key={item.id || index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 pl-6 text-slate-400">{item.product_code}</td>
                        <td className="p-4 font-bold text-slate-900">{item.product_name}</td>
                        <td className="p-4 text-slate-500">{item.branch_name}</td>
                        <td className="p-4"><span className="text-lg font-black text-slate-900">{item.current_stock}</span></td>
                        <td className="p-4"><span className={`px-3 py-1.5 rounded-full text-[12px] font-bold ${statusColor}`}>{statusText}</span></td>
                        <td className="p-4 text-right pr-6">
                          <button onClick={() => handleOpenAdjustModal(item)} className="text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg font-bold text-xs">Adjust Stock</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {isAdjustModalOpen && selectedProduct && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black text-slate-900">Adjust Stock</h2>
                  <button onClick={() => setIsAdjustModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full"><span className="material-symbols-outlined text-[20px]">close</span></button>
                </div>
                <form onSubmit={handleSaveAdjustment} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-slate-700 uppercase">Action</label>
                      <select value={adjustForm.action} onChange={(e) => setAdjustForm({...adjustForm, action: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-[14px] font-bold">
                        <option value="add">Add (+)</option>
                        <option value="subtract">Subtract (-)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-slate-700 uppercase">Quantity</label>
                      <input required type="number" min="1" value={adjustForm.quantity} onChange={(e) => setAdjustForm({...adjustForm, quantity: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-[14px] font-bold" placeholder="e.g. 5" />
                    </div>
                  </div>
                  <div className="pt-6 border-t flex gap-3 justify-end">
                    <button type="button" onClick={() => setIsAdjustModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-bold">Cancel</button>
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold">Confirm Adjust</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}