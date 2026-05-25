import React, { useState, useEffect } from 'react';
import { request } from '../util/request';

export default function StockManagement() {
  // State variables for storing stock list, search keyword, and selected branch
  const [stockItems, setStockItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  
  // State variables for handling the stock adjustment popup
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustForm, setAdjustForm] = useState({
    action: 'add',
    quantity: '',
    reason: 'New Arrival'
  });

  // Automatically load stock data when the page is opened
  useEffect(() => {
    fetchStock();
  }, []);

  // Function to get stock information from the server
  const fetchStock = () => {
    request('stocks', 'GET')
      .then(res => {
        // Check if the server returned a valid array of data
        if (res && res.data && Array.isArray(res.data)) {
          setStockItems(res.data);
        } else {
          setFallbackStock(); // Use sample data if server data is empty
        }
      })
      .catch(err => {
        console.log("Error fetching stock:", err);
        setFallbackStock(); // Use sample data if there is a network error
      });
  };

  // Sample data to show on the screen before the real backend is fully ready
  const setFallbackStock = () => {
    setStockItems([
      { id: 1, product_code: 'SAM-B4-001', product_name: 'Galaxy Book 4', branch_name: 'Toul Kork Branch', current_stock: 45, min_stock: 10 },
      { id: 2, product_code: 'IPH-15-PRO', product_name: 'iPhone 15 Pro Max', branch_name: 'BKK Branch', current_stock: 8, min_stock: 15 },
      { id: 3, product_code: 'MAC-AIR-M3', product_name: 'MacBook Air M3', branch_name: 'Toul Kork Branch', current_stock: 0, min_stock: 5 },
      { id: 4, product_code: 'SONY-WH-1000XM5', product_name: 'Sony WH-1000XM5', branch_name: 'BKK Branch', current_stock: 22, min_stock: 10 },
    ]);
  };

  // Filter the list based on what the user types in the search box and the selected branch
  const filteredStock = stockItems.filter(item => {
    const matchesSearch = item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.product_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'All' || item.branch_name === selectedBranch;
    return matchesSearch && matchesBranch;
  });

  // Prepare data and open the popup when the user clicks "Adjust Stock"
  const handleOpenAdjustModal = (product) => {
    setSelectedProduct(product);
    setAdjustForm({ action: 'add', quantity: '', reason: 'New Arrival' });
    setIsAdjustModalOpen(true);
  };

  // Send the updated stock amount to the server when the user clicks "Confirm"
  const handleSaveAdjustment = (e) => {
    e.preventDefault();
    
    // Package the data exactly how the server expects it
    const payload = {
      product_id: selectedProduct.id,
      branch_name: selectedProduct.branch_name,
      adjustment_type: adjustForm.action,
      quantity: parseInt(adjustForm.quantity),
      reason: adjustForm.reason
    };

    // Send the information to the server
    request('stocks/adjust', 'POST', payload)
      .then(res => {
        console.log("Stock adjusted successfully:", res);
        setIsAdjustModalOpen(false); // Close the popup
        fetchStock(); // Reload the table to show the new amount
      })
      .catch(err => {
        console.log("Error adjusting stock:", err);
        setIsAdjustModalOpen(false); // Close the popup even if there is an error
      });
  };

  return (
    <div className="p-6 md:p-10 font-['Public_Sans'] bg-slate-50 min-h-screen">
      
      {/* Header section with page title and branch selection dropdown */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Stock Management</h1>
          <p className="text-slate-500 font-medium mt-1">Monitor inventory levels and make manual stock adjustments</p>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-400 text-lg">storefront</span>
          <select 
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer"
          >
            <option value="All">All Branches</option>
            <option value="Toul Kork Branch">Toul Kork Branch</option>
            <option value="BKK Branch">BKK Branch</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Search input field */}
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              type="text" 
              placeholder="Search by product name or code..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900"
            />
          </div>
        </div>

        {/* Table to display the stock information */}
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
              {/* Loop through the filtered items to create table rows */}
              {filteredStock.length > 0 ? (
                filteredStock.map((item, index) => {
                  
                  // Decide the color and text for the stock status based on the quantity
                  let statusText = "In Stock";
                  let statusColor = "bg-green-100 text-green-600";
                  
                  if (item.current_stock === 0) {
                    statusText = "Out of Stock";
                    statusColor = "bg-red-100 text-red-600";
                  } else if (item.current_stock <= item.min_stock) {
                    statusText = "Low Stock";
                    statusColor = "bg-orange-100 text-orange-600";
                  }

                  return (
                    <tr key={item.id || index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-6 text-slate-400">{item.product_code}</td>
                      <td className="p-4 font-bold text-slate-900">{item.product_name}</td>
                      <td className="p-4 text-slate-500">{item.branch_name}</td>
                      <td className="p-4">
                        <span className="text-lg font-black text-slate-900">{item.current_stock}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-1 w-max ${statusColor}`}>
                          <span className="material-symbols-outlined text-[14px]">
                            {item.current_stock === 0 ? 'error' : item.current_stock <= item.min_stock ? 'warning' : 'check_circle'}
                          </span>
                          {statusText}
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <button 
                          onClick={() => handleOpenAdjustModal(item)}
                          className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors"
                        >
                          Adjust Stock
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                /* Show this message if the table is completely empty */
                <tr>
                  <td colSpan="6" className="p-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <span className="material-symbols-outlined text-5xl mb-4 text-slate-300">inventory</span>
                      <p className="text-lg font-bold text-slate-500">No stock records found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup form for modifying the stock numbers */}
      {isAdjustModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8">
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-slate-900">Adjust Stock</h2>
                <button onClick={() => setIsAdjustModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Display the selected product's information */}
              <div className="bg-slate-50 p-4 rounded-xl mb-6 border border-slate-100">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">{selectedProduct.branch_name}</p>
                <p className="font-black text-slate-900 text-lg">{selectedProduct.product_name}</p>
                <p className="text-sm text-slate-500 mt-1">Current Stock: <strong className="text-blue-600 text-lg">{selectedProduct.current_stock}</strong></p>
              </div>

              {/* The form area */}
              <form onSubmit={handleSaveAdjustment} className="space-y-5">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-700 uppercase tracking-widest">Action</label>
                    <select 
                      value={adjustForm.action} 
                      onChange={(e) => setAdjustForm({...adjustForm, action: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-bold text-slate-900 outline-none"
                    >
                      <option value="add">Add (+)</option>
                      <option value="subtract">Subtract (-)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-700 uppercase tracking-widest">Quantity</label>
                    <input 
                      required 
                      type="number" 
                      min="1"
                      value={adjustForm.quantity} 
                      onChange={(e) => setAdjustForm({...adjustForm, quantity: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] outline-none font-bold text-slate-900" 
                      placeholder="e.g. 5" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-slate-700 uppercase tracking-widest">Reason</label>
                  <select 
                    value={adjustForm.reason} 
                    onChange={(e) => setAdjustForm({...adjustForm, reason: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-bold text-slate-900 outline-none"
                  >
                    <option value="New Arrival">New Arrival</option>
                    <option value="Stock Audit">Stock Audit / Counting</option>
                    <option value="Damaged Item">Damaged Item</option>
                    <option value="Lost/Stolen">Lost / Stolen</option>
                    <option value="Internal Use">Internal Use</option>
                  </select>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex gap-3 justify-end">
                  <button type="button" onClick={() => setIsAdjustModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-colors">Cancel</button>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-md shadow-blue-600/20">Confirm Adjust</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}