import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { request } from '../../util/request';

export default function StockMovement() {
  const [movements, setMovements] = useState([]);
  const [filterType, setFilterType] = useState('All');
  
  // States for the Transfer Modal
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferForm, setTransferForm] = useState({
    product_id: '',
    from_branch_id: '', 
    to_branch_id: '',
    quantity: '',
    notes: ''
  });

  // Types database 
  const movementTypes = [
    'All',
    'purchase', 
    'sale', 
    'transfer_in', 
    'transfer_out', 
    'adjustment_in', 
    'adjustment_out', 
    'return_to_supplier', 
    'return_from_customer', 
    'damage'
  ];

  // Mock lists for the dropdowns (In a real app, these come from API)
  const branches = ["Toul Kork Branch", "BKK Branch", "Main Warehouse"];
  const products = [
    { id: 1, name: "Galaxy Book 4" },
    { id: 2, name: "iPhone 15 Pro Max" }
  ];

  // បន្ថែម filterType ទៅក្នុង useEffect ដើម្បីឱ្យវាទាញទិន្នន័យរាល់ពេលយើងប្តូរ Dropdown
  useEffect(() => {
    fetchMovements();
  }, [filterType]);

  const fetchMovements = () => {
    let url = 'stock-movements';
    if (filterType !== 'All') {
      url += `?type=${filterType}`; // Backend expects the exact string
    }

    request(url, 'GET')
      .then(res => {
        if (res && res.data && Array.isArray(res.data)) {
          setMovements(res.data);
        } else {
          setFallbackMovements(); // Fallback for UI testing
        }
      })
      .catch(err => {
        console.log("Error fetching movements:", err);
        setFallbackMovements();
      });
  };

  const setFallbackMovements = () => {
    setMovements([
      { 
        id: 1, 
        product_name: "Galaxy Book 4", 
        branch: "Toul Kork Branch", 
        type: "purchase", 
        quantity_changed: 5, 
        reason: "New Arrival from Supplier",
        user: "Admin",
        created_at: "2026-05-24 10:30 AM"
      },
      { 
        id: 2, 
        product_name: "iPhone 15 Pro Max", 
        branch: "BKK Branch", 
        type: "transfer_out", 
        quantity_changed: -2, 
        reason: "Sent to Toul Kork",
        user: "Manager Sok",
        created_at: "2026-05-23 02:15 PM"
      },
      { 
        id: 3, 
        product_name: "MacBook Air M3", 
        branch: "Main Warehouse", 
        type: "damage", 
        quantity_changed: -1, 
        reason: "Screen cracked in warehouse",
        user: "Admin",
        created_at: "2026-05-22 09:00 AM"
      },
      { 
        id: 4, 
        product_name: "AirPods Pro 2", 
        branch: "Toul Kork Branch", 
        type: "return_from_customer", 
        quantity_changed: 1, 
        reason: "Customer changed mind",
        user: "Cashier Lina",
        created_at: "2026-05-21 14:00 PM"
      }
    ]);
  };

  // Frontend filtering logic (In case backend doesn't filter it)
  const filteredMovements = movements.filter(m => {
    if (filterType === 'All') return true;
    return m.type === filterType;
  });

  // មុខងារសម្រាប់ប្តូរអក្សរឱ្យស្អាត (ឧទាហរណ៍: transfer_in -> Transfer In)
  const formatTypeText = (type) => {
    if (type === 'All') return 'All Types';
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getTypeBadgeColor = (type) => {
    if (['purchase', 'transfer_in', 'adjustment_in', 'return_from_customer'].includes(type)) {
      return 'bg-green-100 text-green-700';
    }
    if (['sale', 'transfer_out', 'adjustment_out', 'return_to_supplier'].includes(type)) {
      return 'bg-blue-100 text-blue-700';
    }
    if (type === 'damage') {
      return 'bg-red-100 text-red-700';
    }
    return 'bg-slate-100 text-slate-700';
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    
    // Construct payload matching backend expectations
    const payload = {
      product_id: parseInt(transferForm.product_id),
      from_branch_id: transferForm.from_branch_id, 
      to_branch_id: transferForm.to_branch_id,
      quantity: parseInt(transferForm.quantity),
      notes: transferForm.notes
    };

    request('stock-movements/transfer', 'POST', payload)
      .then(res => {
        console.log("Transfer successful:", res);
        setIsTransferModalOpen(false);
        setTransferForm({ product_id: '', from_branch_id: '', to_branch_id: '', quantity: '', notes: '' });
        fetchMovements(); 
      })
      .catch(err => console.log("Error transferring stock:", err));
  };

  return (
    <div className="p-6 md:p-10 font-['Public_Sans'] bg-slate-50 min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        
        <div className="flex items-center gap-4">
          {/* Back to Dashboard Button */}
          <Link 
            to="/dashboard" 
            className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm shrink-0"
            title="Back to Dashboard"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
          </Link>

          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Stock Movement</h1>
            <p className="text-slate-500 font-medium mt-1">Track all stock transfers and manual adjustments</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsTransferModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">local_shipping</span>
          Transfer Stock
        </button>
      </div>

      {/* Main Content Box */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Dropdown Filter Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row md:items-center gap-4">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Filter By Movement Type:</p>
          <div className="relative w-full md:w-64">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-600 outline-none appearance-none cursor-pointer transition-all shadow-sm"
            >
              {movementTypes.map(type => (
                <option key={type} value={type}>
                  {formatTypeText(type)}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
          </div>
        </div>

        {/* Movement Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[12px] uppercase tracking-widest font-bold">
                <th className="p-4 pl-6">Date</th>
                <th className="p-4">Product</th>
                <th className="p-4">Branch</th>
                <th className="p-4">Type</th>
                <th className="p-4">Qty Changed</th>
                <th className="p-4">Reason / Notes</th>
                <th className="p-4">User</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-slate-700">
              {filteredMovements.length > 0 ? (
                filteredMovements.map((move, index) => {
                  const isPositive = move.quantity_changed > 0;
                  
                  return (
                    <tr key={move.id || index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-6 text-slate-500">{move.created_at}</td>
                      <td className="p-4 font-bold text-slate-900">{move.product_name}</td>
                      <td className="p-4 text-slate-500">{move.branch}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${getTypeBadgeColor(move.type)}`}>
                          {formatTypeText(move.type)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`font-black text-lg ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositive ? '+' : ''}{move.quantity_changed}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 max-w-[200px] truncate" title={move.reason}>{move.reason}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-[14px] text-slate-500">person</span>
                          </div>
                          <span className="text-slate-700 font-bold">{move.user}</span>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="7" className="p-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <span className="material-symbols-outlined text-5xl mb-4 text-slate-300">sync_alt</span>
                      <p className="text-lg font-bold text-slate-500">No stock movements found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transfer Stock Modal (ផ្ទៃខាងក្រោយមានភាពព្រិលស្អាត) */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-xl">
                    <span className="material-symbols-outlined text-blue-600">local_shipping</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">Transfer Stock</h2>
                </div>
                <button onClick={() => setIsTransferModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleTransferSubmit} className="space-y-5">
                
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-slate-700 uppercase tracking-widest">Select Product</label>
                  <select 
                    required
                    value={transferForm.product_id}
                    onChange={(e) => setTransferForm({...transferForm, product_id: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-bold text-slate-900 outline-none"
                  >
                    <option value="" disabled>Choose a product...</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-700 uppercase tracking-widest text-red-500">From Branch (Sender)</label>
                    <select 
                      required
                      value={transferForm.from_branch_id}
                      onChange={(e) => setTransferForm({...transferForm, from_branch_id: e.target.value})}
                      className="w-full bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-[14px] font-bold text-slate-900 outline-none"
                    >
                      <option value="" disabled>Select sender...</option>
                      {branches.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-700 uppercase tracking-widest text-green-500">To Branch (Receiver)</label>
                    <select 
                      required
                      value={transferForm.to_branch_id}
                      onChange={(e) => setTransferForm({...transferForm, to_branch_id: e.target.value})}
                      className="w-full bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-[14px] font-bold text-slate-900 outline-none"
                    >
                      <option value="" disabled>Select receiver...</option>
                      {branches.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-slate-700 uppercase tracking-widest">Transfer Quantity</label>
                  <input 
                    required 
                    type="number" 
                    min="1"
                    value={transferForm.quantity} 
                    onChange={(e) => setTransferForm({...transferForm, quantity: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] outline-none font-bold text-slate-900" 
                    placeholder="e.g. 10" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-slate-700 uppercase tracking-widest">Notes (Optional)</label>
                  <textarea 
                    rows="2"
                    value={transferForm.notes}
                    onChange={(e) => setTransferForm({...transferForm, notes: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] outline-none font-medium text-slate-900" 
                    placeholder="e.g. Emergency restock for weekend promotion..."
                  ></textarea>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex gap-3 justify-end">
                  <button type="button" onClick={() => setIsTransferModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-colors">Cancel</button>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-md shadow-blue-600/20">Confirm Transfer</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}