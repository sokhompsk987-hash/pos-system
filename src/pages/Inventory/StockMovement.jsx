import React, { useState, useEffect } from 'react';
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

  // Mock lists for the dropdowns (In a real app, these come from API)
  const branches = ["Toul Kork Branch", "BKK Branch", "Main Warehouse"];
  const products = [
    { id: 1, name: "Galaxy Book 4" },
    { id: 2, name: "iPhone 15 Pro Max" }
  ];

  useEffect(() => {
    fetchMovements();
  }, []);

  const fetchMovements = () => {
    // We can pass params if we want to filter on the backend side
    let url = 'stock-movements';
    if (filterType !== 'All') {
      url += `?type=${filterType.toLowerCase()}`;
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

  // Re-fetch when filter changes if we do backend filtering
  // Or just filter frontend array (doing frontend filter below for demo)

  const setFallbackMovements = () => {
    setMovements([
      { 
        id: 1, 
        product_name: "Galaxy Book 4", 
        branch: "Toul Kork Branch", 
        type: "Adjustment", 
        quantity_changed: 5, 
        reason: "New Arrival",
        user: "Admin",
        created_at: "2026-05-24 10:30 AM"
      },
      { 
        id: 2, 
        product_name: "iPhone 15 Pro Max", 
        branch: "BKK Branch", 
        type: "Transfer", 
        quantity_changed: -2, 
        reason: "Sent to Toul Kork",
        user: "Manager Sok",
        created_at: "2026-05-23 02:15 PM"
      },
      { 
        id: 3, 
        product_name: "MacBook Air M3", 
        branch: "Main Warehouse", 
        type: "Adjustment", 
        quantity_changed: -1, 
        reason: "Damaged Item",
        user: "Admin",
        created_at: "2026-05-22 09:00 AM"
      }
    ]);
  };

  // Frontend filtering logic
  const filteredMovements = movements.filter(m => {
    if (filterType === 'All') return true;
    return m.type.toLowerCase() === filterType.toLowerCase();
  });

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

    // Make the POST request to the endpoint shown in the Postman 
    request('stock-movements/transfer', 'POST', payload)
      .then(res => {
        console.log("Transfer successful:", res);
        setIsTransferModalOpen(false);
        setTransferForm({ product_id: '', from_branch_id: '', to_branch_id: '', quantity: '', notes: '' });
        fetchMovements(); // Refresh the list
      })
      .catch(err => console.log("Error transferring stock:", err));
  };

  return (
    <div className="p-6 md:p-10 font-['Public_Sans'] bg-slate-50 min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Stock Movement</h1>
          <p className="text-slate-500 font-medium mt-1">Track all stock transfers and manual adjustments</p>
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
        
        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Filter By:</p>
          <div className="flex gap-2 bg-slate-200/50 p-1 rounded-lg">
            {['All', 'Transfer', 'Adjustment'].map(type => (
              <button 
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${filterType === type ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {type}
              </button>
            ))}
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
                        <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${move.type.toLowerCase() === 'transfer' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                          {move.type}
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

      {/* Transfer Stock Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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

                <div className="grid grid-cols-2 gap-4 relative">
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
                  
                  {/* Arrow Icon in the middle */}
                  <div className="absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-sm border border-slate-100">
                    <span className="material-symbols-outlined text-slate-400 text-lg">arrow_forward</span>
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