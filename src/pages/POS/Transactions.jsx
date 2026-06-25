import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout.jsx'; 
import { request } from '../../util/request';

export default function Transactions() {
  // State to hold the list of transactions
  const [transactions, setTransactions] = useState([]);
  
  // Loading state for fetching data
  const [isLoading, setIsLoading] = useState(true);
  
  // State for the search input field
  const [searchQuery, setSearchQuery] = useState('');
  
  // State to control the visibility of the export dropdown menu
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Fetch initial data when the component mounts
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Function to request transaction data from the backend API
  const fetchTransactions = () => {
    setIsLoading(true);
    request('transactions', 'GET')
      .then(res => {
        if (res && res.data && Array.isArray(res.data)) {
          setTransactions(res.data);
        } else {
          setFallbackData(); // Use fallback data if API is not ready
        }
      })
      .catch(err => {
        console.error("Error fetching transactions:", err);
        setFallbackData();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Mock data for UI development and testing
  const setFallbackData = () => {
    setTransactions([
      { id: 'INV-2026001', date: '2026-05-28 10:30 AM', customer: 'Walk-in Customer', total: 1250.00, method: 'Credit Card', status: 'Paid' },
      { id: 'INV-2026002', date: '2026-05-28 11:15 AM', customer: 'Sok Dara', total: 85.50, method: 'Cash', status: 'Paid' },
      { id: 'INV-2026003', date: '2026-05-27 02:20 PM', customer: 'Walk-in Customer', total: 45.00, method: 'Cash', status: 'Refunded' },
      { id: 'INV-2026004', date: '2026-05-27 04:05 PM', customer: 'Chan Minea', total: 320.00, method: 'Bank Transfer', status: 'Pending' },
      { id: 'INV-2026005', date: '2026-05-26 09:10 AM', customer: 'Tech Store Co.', total: 4500.00, method: 'Credit Card', status: 'Paid' }
    ]);
  };

  // Determine the styling for the status badge based on its value
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Refunded':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  // Filter the transactions array based on the search query (Invoice ID or Customer Name)
  const filteredTransactions = transactions.filter(t => 
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle the export functionality based on the selected format type
  const handleExport = (type) => {
    setShowExportMenu(false);
    
    // In a production environment, this should ideally be handled by the backend
    if (type === 'CSV') {
      let csvContent = "data:text/csv;charset=utf-8,Invoice ID,Date & Time,Customer,Payment Method,Total Amount,Status\n";
      
      filteredTransactions.forEach(t => {
        csvContent += `${t.id},${t.date},${t.customer},${t.method},${t.total},${t.status}\n`;
      });
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "transactions_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`Preparing ${type} file...\nThe backend team can connect the ${type} generation logic to this button.`);
    }
  };

  return (
    <Layout>
      <div className="p-6 md:p-10 max-w-[1400px] mx-auto font-sans bg-slate-50 min-h-screen">
        
        {/* Page Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          
          {/* Back Button and Title */}
          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard" 
              className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm shrink-0"
              title="Back to Dashboard"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Transactions & Invoices</h1>
              <p className="text-sm font-medium text-slate-500 mt-1">View and manage all sales history and receipts</p>
            </div>
          </div>

          {/* Export Report Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export Report
              <span className="material-symbols-outlined text-[18px]">
                {showExportMenu ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {/* Dropdown Menu Options */}
            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-0" onClick={() => setShowExportMenu(false)}></div>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-10 animate-fadeIn">
                  <button 
                    onClick={() => handleExport('CSV')} 
                    className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3 border-b border-slate-100 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px] text-green-600">description</span>
                    Export as CSV
                  </button>
                  <button 
                    onClick={() => handleExport('Excel')} 
                    className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3 border-b border-slate-100 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px] text-emerald-600">table_view</span>
                    Export as Excel
                  </button>
                  <button 
                    onClick={() => handleExport('PDF')} 
                    className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px] text-red-500">picture_as_pdf</span>
                    Export as PDF
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex items-center">
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input 
              type="text" 
              placeholder="Search by Invoice ID or Customer..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-600 outline-none transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Main Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <span className="material-symbols-outlined animate-spin text-4xl mb-4">refresh</span>
              <p className="font-bold">Loading transactions...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Method</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Total Amount</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold whitespace-nowrap">
                          <Link to={`/pos/invoice/${item.id}`} className="text-blue-600 hover:underline cursor-pointer">
                            {item.id}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-600 whitespace-nowrap">
                          {item.date}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">
                          {item.customer}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-500 whitespace-nowrap">
                          {item.method}
                        </td>
                        <td className="px-6 py-4 text-sm font-black text-slate-900 text-right whitespace-nowrap">
                          ${item.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <Link to={`/pos/invoice/${item.id}`} className="text-slate-400 hover:text-blue-600 transition-colors p-1 inline-flex" title="View Receipt">
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-slate-400 font-medium">
                        No transactions found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}