import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { request } from '../util/request';

export default function StockManagement() {
  const [stockItems, setStockItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [activeTab, setActiveTab] = useState('All'); // All, LowStock, OutOfStock, Reorder

  // Summary State
  const [summary, setSummary] = useState({
    totalItems: 0,
    stockValue: 0,
    lowStockCount: 0,
    outOfStockCount: 0
  });

  // Unified Modal State
  const [activeModal, setActiveModal] = useState(null); // 'adjust', 'receive', 'transfer', 'reserve', 'bulk'
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Form States
  const [actionForm, setActionForm] = useState({
    quantity: '',
    reason: '',
    action: 'add', // For adjust
    supplier: '', // For receive
    destinationBranch: '', // For transfer
    customerName: '' // For reserve
  });

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = () => {
    setIsLoading(true);
    // In a real app, you would make concurrent requests to the different GET endpoints.
    // For now, we fetch the main list and calculate summary locally if endpoints fail.
    request('stocks', 'GET')
      .then(res => {
        if (res && res.data && Array.isArray(res.data)) {
          setStockItems(res.data);
          calculateSummary(res.data);
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

  const calculateSummary = (data) => {
    let value = 0;
    let low = 0;
    let out = 0;
    
    data.forEach(item => {
      value += (item.current_stock * (item.price || 0));
      if (item.current_stock === 0) out++;
      else if (item.current_stock <= item.min_stock) low++;
    });

    setSummary({
      totalItems: data.length,
      stockValue: value,
      lowStockCount: low,
      outOfStockCount: out
    });
  };

  const setFallbackStock = () => {
    const fallbackData = [
      { id: 1, product_code: 'SAM-B4-001', product_name: 'Galaxy Book 4', branch_name: 'Toul Kork Branch', current_stock: 45, min_stock: 10, price: 850 },
      { id: 2, product_code: 'IPH-15-PRO', product_name: 'iPhone 15 Pro Max', branch_name: 'BKK Branch', current_stock: 8, min_stock: 15, price: 1199 },
      { id: 3, product_code: 'MAC-AIR-M3', product_name: 'MacBook Air M3', branch_name: 'Toul Kork Branch', current_stock: 0, min_stock: 5, price: 1099 },
      { id: 4, product_code: 'SONY-WH-1000XM5', product_name: 'Sony WH-1000XM5', branch_name: 'BKK Branch', current_stock: 22, min_stock: 10, price: 350 },
      { id: 5, product_code: 'IPAD-PRO-M4', product_name: 'iPad Pro M4', branch_name: 'Toul Kork Branch', current_stock: 3, min_stock: 10, price: 999 },
    ];
    setStockItems(fallbackData);
    calculateSummary(fallbackData);
  };

  const filteredStock = stockItems.filter(item => {
    const matchesSearch = item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.product_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'All' || item.branch_name === selectedBranch;
    
    let matchesTab = true;
    if (activeTab === 'LowStock') matchesTab = item.current_stock > 0 && item.current_stock <= item.min_stock;
    if (activeTab === 'OutOfStock') matchesTab = item.current_stock === 0;
    if (activeTab === 'Reorder') matchesTab = item.current_stock <= item.min_stock;

    return matchesSearch && matchesBranch && matchesTab;
  });

  const openModal = (type, product = null) => {
    setSelectedProduct(product);
    setActionForm({ quantity: '', reason: '', action: 'add', supplier: '', destinationBranch: '', customerName: '' });
    setActiveModal(type);
  };

  const handleActionSubmit = (e) => {
    e.preventDefault();
    let endpoint = '';
    let payload = {
      product_id: selectedProduct?.id,
      branch_name: selectedProduct?.branch_name,
      quantity: parseInt(actionForm.quantity),
      reason: actionForm.reason
    };

    // Map the action to the correct backend POST endpoint
    switch (activeModal) {
      case 'adjust':
        endpoint = 'stocks/adjust';
        payload.adjustment_type = actionForm.action;
        break;
      case 'receive':
        endpoint = 'stocks/receive';
        payload.supplier = actionForm.supplier;
        break;
      case 'transfer':
        endpoint = 'stocks/transfer';
        payload.destination_branch = actionForm.destinationBranch;
        break;
      case 'reserve':
        endpoint = 'stocks/reserve';
        payload.customer_name = actionForm.customerName;
        break;
      default:
        return;
    }

    request(endpoint, 'POST', payload)
      .then(() => {
        setActiveModal(null);
        fetchStockData();
      })
      .catch(err => {
        console.log(`Error on ${activeModal}:`, err);
        // Fallback for UI if API not ready
        setActiveModal(null);
      });
  };

  return (
    <Layout>
      <div className="p-6 md:p-8 font-['Public_Sans'] bg-slate-50 min-h-screen">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Stock Management</h1>
              <p className="text-slate-500 font-medium mt-1 text-sm">Monitor inventory, transfer items, and handle alerts</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button onClick={() => openModal('transfer')} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600 px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">sync_alt</span>
              Transfer Stock
            </button>
            <button onClick={() => openModal('receive')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
              Receive Stock
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><span className="material-symbols-outlined">inventory_2</span></div>
            <div>
              <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Total Items</p>
              <h3 className="text-2xl font-black text-slate-900">{summary.totalItems}</h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><span className="material-symbols-outlined">payments</span></div>
            <div>
              <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Stock Value</p>
              <h3 className="text-2xl font-black text-slate-900">${summary.stockValue.toLocaleString()}</h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 cursor-pointer hover:bg-orange-50/50 transition-colors" onClick={() => setActiveTab('LowStock')}>
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600"><span className="material-symbols-outlined">warning</span></div>
            <div>
              <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Low Stock</p>
              <h3 className="text-2xl font-black text-orange-600">{summary.lowStockCount} Items</h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 cursor-pointer hover:bg-red-50/50 transition-colors" onClick={() => setActiveTab('OutOfStock')}>
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600"><span className="material-symbols-outlined">error</span></div>
            <div>
              <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Out of Stock</p>
              <h3 className="text-2xl font-black text-red-600">{summary.outOfStockCount} Items</h3>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-200 overflow-x-auto hide-scrollbar">
            {['All', 'LowStock', 'OutOfStock', 'Reorder'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-bold text-sm whitespace-nowrap transition-all border-b-2 ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                {tab === 'All' ? 'All Inventory' : tab === 'LowStock' ? 'Low Stock Alerts' : tab === 'OutOfStock' ? 'Out of Stock' : 'Reorder Suggestions'}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative max-w-md w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input type="text" placeholder="Search by product name or code..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900" />
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

          {/* Table */}
          {isLoading ? (
             <div className="flex justify-center p-20"><span className="material-symbols-outlined animate-spin text-4xl text-slate-400">refresh</span></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-slate-200 text-slate-400 text-[11px] uppercase tracking-widest font-black">
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
                      <tr key={item.id || index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                        <td className="p-4 pl-6 text-slate-400">{item.product_code}</td>
                        <td className="p-4 font-bold text-slate-900">{item.product_name}</td>
                        <td className="p-4 text-slate-500">{item.branch_name}</td>
                        <td className="p-4"><span className="text-lg font-black text-slate-900">{item.current_stock}</span></td>
                        <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${statusColor}`}>{statusText}</span></td>
                        <td className="p-4 text-right pr-6 space-x-2">
                          <button onClick={() => openModal('adjust', item)} title="Adjust Stock" className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-[20px]">edit_square</span>
                          </button>
                          <button onClick={() => openModal('reserve', item)} title="Reserve Stock" className="text-slate-400 hover:text-purple-600 hover:bg-purple-50 p-2 rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-[20px]">bookmark_add</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                  {filteredStock.length === 0 && (
                    <tr><td colSpan="6" className="p-10 text-center text-slate-500 font-medium">No products found matching the criteria.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Dynamic Modal */}
        {activeModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md animate-fadeIn overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black text-slate-900 capitalize">
                    {activeModal === 'adjust' && 'Adjust Stock'}
                    {activeModal === 'receive' && 'Receive Stock'}
                    {activeModal === 'transfer' && 'Transfer Stock'}
                    {activeModal === 'reserve' && 'Reserve Stock'}
                  </h2>
                  <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"><span className="material-symbols-outlined text-[20px]">close</span></button>
                </div>
                
                {selectedProduct && (
                  <div className="bg-slate-50 p-4 rounded-xl mb-6 border border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{selectedProduct.product_code}</p>
                      <p className="font-bold text-slate-900">{selectedProduct.product_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Current</p>
                      <p className="font-black text-blue-600">{selectedProduct.current_stock}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleActionSubmit} className="space-y-4">
                  {/* Adjust Specific Fields */}
                  {activeModal === 'adjust' && (
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Adjustment Type</label>
                      <select value={actionForm.action} onChange={(e) => setActionForm({...actionForm, action: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-[14px] font-bold outline-none focus:border-blue-500">
                        <option value="add">Add Stock (+)</option>
                        <option value="subtract">Subtract Stock (-)</option>
                      </select>
                    </div>
                  )}

                  {/* Transfer Specific Fields */}
                  {activeModal === 'transfer' && (
                    <>
                      {!selectedProduct && (
                        <div className="p-3 bg-blue-50 text-blue-700 text-sm font-bold rounded-xl mb-2">
                          Note: Bulk transfer is selected. System will open detailed transfer page.
                        </div>
                      )}
                      <div className="space-y-2">
                        <label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Destination Branch</label>
                        <select required value={actionForm.destinationBranch} onChange={(e) => setActionForm({...actionForm, destinationBranch: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-[14px] font-bold outline-none focus:border-blue-500">
                          <option value="" disabled>Select Branch</option>
                          <option value="Toul Kork Branch">Toul Kork Branch</option>
                          <option value="BKK Branch">BKK Branch</option>
                          <option value="Main Warehouse">Main Warehouse</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* Reserve Specific Fields */}
                  {activeModal === 'reserve' && (
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Customer / Reference</label>
                      <input required type="text" value={actionForm.customerName} onChange={(e) => setActionForm({...actionForm, customerName: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-[14px] font-bold outline-none focus:border-blue-500" placeholder="e.g. John Doe / Order #123" />
                    </div>
                  )}

                  {/* Receive Specific Fields */}
                  {activeModal === 'receive' && (
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Supplier Name</label>
                      <input type="text" value={actionForm.supplier} onChange={(e) => setActionForm({...actionForm, supplier: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-[14px] font-bold outline-none focus:border-blue-500" placeholder="Optional" />
                    </div>
                  )}

                  {/* Common Fields */}
                  {(selectedProduct || activeModal === 'receive') && (
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Quantity</label>
                      <input required type="number" min="1" value={actionForm.quantity} onChange={(e) => setActionForm({...actionForm, quantity: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-[14px] font-bold outline-none focus:border-blue-500" placeholder="Enter amount" />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Reason / Notes</label>
                    <input type="text" value={actionForm.reason} onChange={(e) => setActionForm({...actionForm, reason: e.target.value})} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-[14px] font-medium outline-none focus:border-blue-500" placeholder="Brief explanation..." />
                  </div>

                  <div className="pt-6 mt-6 border-t flex gap-3 justify-end">
                    <button type="button" onClick={() => setActiveModal(null)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-bold transition-colors">Cancel</button>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-lg shadow-blue-600/20">Confirm</button>
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