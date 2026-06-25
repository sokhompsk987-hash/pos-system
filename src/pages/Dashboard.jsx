import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx'; 
import { request } from '../util/request';

export default function Dashboard() {
  // Added Loading State
  const [isLoading, setIsLoading] = useState(true);

  // States initialized with default empty/zero values
  const [stats, setStats] = useState({
    todaySales: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStockItems: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [weeklySales, setWeeklySales] = useState([]);

  // Fetch data when component mounts
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    setIsLoading(true);
    // Assuming 'dashboard' is your endpoint for all dashboard metrics
    request('dashboard', 'GET')
      .then(res => {
        if (res && res.data) {
          // If server provides data, use it; otherwise fallback to defaults
          setStats(res.data.stats || getFallbackStats());
          setRecentTransactions(res.data.recentTransactions || getFallbackTransactions());
          setTopProducts(res.data.topProducts || getFallbackTopProducts());
          setWeeklySales(res.data.weeklySales || getFallbackWeeklySales());
        } else {
          setFallbackData();
        }
      })
      .catch(err => {
        console.error("Error fetching dashboard data:", err);
        setFallbackData(); // Use sample data if network error occurs
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // --- Fallback Data Helpers (Your original mock data) ---
  const getFallbackStats = () => ({ todaySales: 1250.00, totalOrders: 45, totalProducts: 124, lowStockItems: 5 });
  
  const getFallbackTransactions = () => [
    { id: 'INV-2026001', time: '10:30 AM', customer: 'Walk-in Customer', total: 1250.00, status: 'Paid' },
    { id: 'INV-2026002', time: '11:15 AM', customer: 'Sok Dara', total: 85.50, status: 'Paid' },
    { id: 'INV-2026003', time: '02:20 PM', customer: 'Walk-in Customer', total: 45.00, status: 'Refunded' },
    { id: 'INV-2026004', time: '04:05 PM', customer: 'Chan Minea', total: 320.00, status: 'Pending' }
  ];

  const getFallbackTopProducts = () => [
    { name: 'Baby Milk Powder', sold: 45, percentage: 85 },
    { name: 'Newborn Diapers M Size', sold: 38, percentage: 70 },
    { name: 'Baby Wipes (80 pcs)', sold: 30, percentage: 55 },
    { name: 'Baby Shampoo 200ml', sold: 15, percentage: 30 },
  ];

  const getFallbackWeeklySales = () => [
    { day: 'Mon', amount: 400, height: '40%' },
    { day: 'Tue', amount: 600, height: '60%' },
    { day: 'Wed', amount: 350, height: '35%' },
    { day: 'Thu', amount: 800, height: '80%' },
    { day: 'Fri', amount: 950, height: '95%' },
    { day: 'Sat', amount: 1200, height: '100%' }, 
    { day: 'Sun', amount: 850, height: '85%' },
  ];

  const setFallbackData = () => {
    setStats(getFallbackStats());
    setRecentTransactions(getFallbackTransactions());
    setTopProducts(getFallbackTopProducts());
    setWeeklySales(getFallbackWeeklySales());
  };

  return (
    <Layout>
      <div className="p-6 md:p-10 font-['Public_Sans'] bg-slate-50 min-h-screen">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back, VKTH! 👋</h1>
            <p className="text-slate-500 font-medium mt-1">Here is what's happening with your store today.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/pos" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">point_of_sale</span>
              Open POS
            </Link>
          </div>
        </div>

        {/* Loading State Check */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
            <span className="material-symbols-outlined animate-spin text-4xl mb-4">refresh</span>
            <p className="font-bold">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* 4 Summary Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              
              {/* Sales Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full blur-2xl"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Today's Sales</p>
                    <h3 className="text-3xl font-black text-slate-900 mt-1">${stats.todaySales.toFixed(2)}</h3>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">payments</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm font-bold text-green-600">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  +12.5% <span className="text-slate-400 font-medium ml-1">from yesterday</span>
                </div>
              </div>

              {/* Orders Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-50 rounded-full blur-2xl"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Orders</p>
                    <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.totalOrders}</h3>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm font-bold text-green-600">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  +5.2% <span className="text-slate-400 font-medium ml-1">from yesterday</span>
                </div>
              </div>

              {/* Products Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full blur-2xl"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Products</p>
                    <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.totalProducts}</h3>
                  </div>
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-slate-500">
                  Across 6 categories
                </div>
              </div>

              {/* Alerts Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-50 rounded-full blur-2xl"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Low Stock Alerts</p>
                    <h3 className="text-3xl font-black text-red-600 mt-1">{stats.lowStockItems}</h3>
                  </div>
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">warning</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline cursor-pointer">
                  <Link to="/products">View items</Link> <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </div>
              </div>

            </div>

            {/* Middle Section: Chart and Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              
              {/* Sales Chart (CSS based) */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-black text-slate-900">Weekly Sales Overview</h2>
                  <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 outline-none">
                    <option>This Week</option>
                    <option>Last Week</option>
                  </select>
                </div>
                
                <div className="h-64 flex items-end justify-between gap-2 pt-4 relative">
                  {/* Background grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between border-b border-slate-100 pb-8 z-0 pointer-events-none">
                    <div className="border-t border-slate-100 border-dashed w-full"></div>
                    <div className="border-t border-slate-100 border-dashed w-full"></div>
                    <div className="border-t border-slate-100 border-dashed w-full"></div>
                    <div className="border-t border-slate-100 border-dashed w-full"></div>
                  </div>
                  
                  {/* Bars */}
                  {weeklySales.map((data, index) => (
                    <div key={index} className="flex flex-col items-center flex-1 z-10 group">
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[11px] font-bold py-1 px-2 rounded-md mb-2 pointer-events-none">
                        ${data.amount}
                      </div>
                      {/* The Bar */}
                      <div className="w-full max-w-[40px] bg-blue-100 rounded-t-lg relative group-hover:bg-blue-200 transition-colors" style={{ height: '200px' }}>
                        <div 
                          className="absolute bottom-0 left-0 right-0 bg-blue-600 rounded-t-lg shadow-sm group-hover:bg-blue-700 transition-all" 
                          style={{ height: data.height }}
                        ></div>
                      </div>
                      {/* X-Axis Label */}
                      <span className="text-xs font-bold text-slate-500 mt-3">{data.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Products List */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-lg font-black text-slate-900 mb-6">Top Selling Products</h2>
                <div className="space-y-5">
                  {topProducts.map((product, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-bold text-slate-800 truncate pr-4">{product.name}</span>
                        <span className="text-xs font-black text-slate-500">{product.sold} sold</span>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${product.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/products">
                  <button className="w-full mt-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-sm rounded-xl border border-slate-200 transition-colors">
                    View Full Report
                  </button>
                </Link>
              </div>

            </div>

            {/* Bottom Section: Recent Transactions */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-black text-slate-900">Recent Transactions</h2>
                <Link to="/transactions" className="text-sm font-bold text-blue-600 hover:underline">View All</Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500 text-[12px] uppercase tracking-widest font-bold">
                      <th className="py-3 pr-4">Invoice ID</th>
                      <th className="py-3 px-4">Time</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 pl-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-medium text-slate-700">
                    {recentTransactions.map((tx, index) => (
                      <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="py-3 pr-4 font-bold text-blue-600">{tx.id}</td>
                        <td className="py-3 px-4 text-slate-500">{tx.time}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{tx.customer}</td>
                        <td className="py-3 px-4 text-right font-black text-slate-900">${tx.total.toFixed(2)}</td>
                        <td className="py-3 pl-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                            tx.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                            tx.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-red-100 text-red-700'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}