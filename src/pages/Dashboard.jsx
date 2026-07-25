import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx'; 
import { request } from '../util/request';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState({
    todaySales: 0,
    salesGrowth: 0,
    grossProfit: 0,
    grossGrowth: 0,
    netProfit: 0,
    netGrowth: 0,
    discounts: 0,
    discountGrowth: 0,
    activeCashier: '',
    cashFloat: 0,
    openRegisters: ''
  });
  
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    setIsLoading(true);
    request('dashboard', 'GET')
      .then(res => {
        if (res && res.data) {
          setStats(res.data.stats || getFallbackStats());
          setMonthlyRevenue(res.data.monthlyRevenue || getFallbackMonthlyRevenue());
          setRecentTransactions(res.data.recentTransactions || getFallbackTransactions());
          setTopProducts(res.data.topProducts || getFallbackTopProducts());
        } else {
          setFallbackData();
        }
      })
      .catch(err => {
        console.error("Error fetching dashboard data:", err);
        setFallbackData(); 
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getFallbackStats = () => ({
    todaySales: 12482.50,
    salesGrowth: 12.5,
    grossProfit: 4120.00,
    grossGrowth: 8.2,
    netProfit: 3845.20,
    netGrowth: 5.4,
    discounts: 420.15,
    discountGrowth: -2.1,
    activeCashier: 'Sarah Jenkins',
    cashFloat: 500.00,
    openRegisters: '2/3'
  });

  const getFallbackMonthlyRevenue = () => [
    { month: 'Jan', revenue: 4800 },
    { month: 'Feb', revenue: 2100 },
    { month: 'Mar', revenue: 3800 },
    { month: 'Apr', revenue: 4200 },
    { month: 'May', revenue: 2500 },
    { month: 'Jun', revenue: 1800 },
    { month: 'Jul', revenue: 1900 },
    { month: 'Aug', revenue: 3100 },
    { month: 'Sep', revenue: 2800 },
    { month: 'Oct', revenue: 1500 },
  ];
  
  const getFallbackTransactions = () => [
    { id: 'INV-2026001', time: '10:30 AM', customer: 'Walk-in Customer', total: 1250.00, paymentMethod: 'KHQR', status: 'Paid' },
    { id: 'INV-2026002', time: '11:15 AM', customer: 'Sok Dara', total: 85.50, paymentMethod: 'Cash', status: 'Paid' },
    { id: 'INV-2026003', time: '02:20 PM', customer: 'Walk-in Customer', total: 45.00, paymentMethod: 'Cash', status: 'Refunded' },
    { id: 'INV-2026004', time: '04:05 PM', customer: 'Chan Minea', total: 320.00, paymentMethod: 'KHQR', status: 'Pending' }
  ];

  const getFallbackTopProducts = () => [
    { name: 'Baby Milk Powder', sold: 45, profitMargin: '30%' },
    { name: 'Newborn Diapers M Size', sold: 38, profitMargin: '25%' },
    { name: 'Baby Wipes (80 pcs)', sold: 30, profitMargin: '45%' },
    { name: 'Baby Shampoo 200ml', sold: 15, profitMargin: '50%' },
  ];

  const setFallbackData = () => {
    setStats(getFallbackStats());
    setMonthlyRevenue(getFallbackMonthlyRevenue());
    setRecentTransactions(getFallbackTransactions());
    setTopProducts(getFallbackTopProducts());
  };

  const calculateHeight = (value) => {
    const maxTarget = 5000;
    const percentage = (value / maxTarget) * 100;
    return `${percentage > 100 ? 100 : percentage}%`;
  };

  return (
    <Layout>
      <div className="p-4 sm:p-6 md:p-10 font-['Public_Sans'] bg-slate-50 min-h-screen">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Welcome back, VKTH! 👋</h1>
            <p className="text-slate-500 font-medium mt-1 text-sm sm:text-base">Real-time store performance for July 24, 2026</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Link to="/reports" className="w-full md:w-auto justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">bar_chart</span>
              View Report
            </Link>
            <Link to="/pos" className="w-full md:w-auto justify-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">point_of_sale</span>
              Open POS
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
            <span className="material-symbols-outlined animate-spin text-4xl mb-4">refresh</span>
            <p className="font-bold">Loading dashboard...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-bold text-slate-600">Today's Total Sales</span>
                  <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900">${stats.todaySales.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
                  <div className={`flex items-center gap-1 text-xs font-bold mt-2 ${stats.salesGrowth >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {stats.salesGrowth >= 0 ? 'trending_up' : 'trending_down'}
                    </span>
                    {stats.salesGrowth > 0 ? '+' : ''}{stats.salesGrowth}% vs yesterday
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-bold text-slate-600">Gross Profit</span>
                  <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900">${stats.grossProfit.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
                  <div className={`flex items-center gap-1 text-xs font-bold mt-2 ${stats.grossGrowth >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {stats.grossGrowth >= 0 ? 'trending_up' : 'trending_down'}
                    </span>
                    {stats.grossGrowth > 0 ? '+' : ''}{stats.grossGrowth}% vs yesterday
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-bold text-slate-600">Net Profit</span>
                  <div className="w-8 h-8 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">savings</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900">${stats.netProfit.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
                  <div className={`flex items-center gap-1 text-xs font-bold mt-2 ${stats.netGrowth >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {stats.netGrowth >= 0 ? 'trending_up' : 'trending_down'}
                    </span>
                    {stats.netGrowth > 0 ? '+' : ''}{stats.netGrowth}% vs yesterday
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-bold text-slate-600">Discounts</span>
                  <div className="w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">sell</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900">${stats.discounts.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
                  <div className={`flex items-center gap-1 text-xs font-bold mt-2 ${stats.discountGrowth >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {stats.discountGrowth >= 0 ? 'trending_up' : 'trending_down'}
                    </span>
                    {stats.discountGrowth > 0 ? '+' : ''}{stats.discountGrowth}% vs yesterday
                  </div>
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              
              {/* Revenue Chart */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Total Revenue</h2>
                  </div>
                  <div className="relative">
                    <select className="appearance-none bg-blue-50 border border-blue-100 text-blue-600 rounded-lg pl-4 pr-8 py-1.5 text-xs font-bold outline-none cursor-pointer">
                      <option>2026</option>
                      <option>2025</option>
                    </select>
                    <span className="material-symbols-outlined text-[16px] text-blue-600 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
                  </div>
                </div>
                
                <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
                  <div className="flex min-w-[500px]">
                    <div className="w-10 flex flex-col justify-between text-[10px] font-bold text-slate-400 py-4 h-[300px] shrink-0 text-right pr-3">
                      <span>5k</span>
                      <span>4k</span>
                      <span>3k</span>
                      <span>2k</span>
                      <span>1k</span>
                      <span className="text-slate-600">0</span>
                    </div>

                    <div className="flex-1 relative h-[300px] py-4">
                      <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none z-0">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className={`border-t w-full ${i === 5 ? 'border-slate-300' : 'border-slate-100'}`}></div>
                        ))}
                      </div>
                      
                      <div className="absolute inset-0 px-6 py-4 flex justify-between pointer-events-none z-0">
                        {monthlyRevenue.map((_, i) => (
                          <div key={`v-grid-${i}`} className="border-l border-slate-50 h-full"></div>
                        ))}
                      </div>

                      <div className="absolute inset-0 py-4 px-4 flex justify-around items-end z-10">
                        {monthlyRevenue.map((data, index) => (
                          <div key={index} className="h-full relative flex flex-col justify-end items-center group w-10">
                            <div 
                              className="w-3 bg-blue-600 rounded-full transition-all group-hover:bg-blue-700 group-hover:w-4 relative"
                              style={{ height: calculateHeight(data.revenue) }}
                            >
                              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-1.5 rounded font-bold pointer-events-none z-20 whitespace-nowrap">
                                ${data.revenue}
                              </div>
                            </div>
                            <span className="absolute -bottom-6 text-xs font-bold text-slate-400">{data.month}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* NEW Live Shift Status Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-lg font-black text-slate-900">Live Shift Status</h2>
                  <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full shadow-[0_0_0_4px_rgba(5,150,105,0.1)]"></div>
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden shrink-0">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${stats.activeCashier.replace(' ', '+')}&background=eff6ff&color=2563eb&bold=true`} 
                      alt="Cashier" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Cashier</p>
                    <h3 className="text-lg font-black text-slate-900 leading-none">{stats.activeCashier}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 mt-auto">
                  <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Open Registers</p>
                    <h4 className="text-xl font-black text-slate-700">{stats.openRegisters}</h4>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Exp. Cash Float</p>
                    <h4 className="text-xl font-black text-slate-900">${stats.cashFloat.toFixed(2)}</h4>
                  </div>
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                <div>
                  <h2 className="text-lg font-black text-slate-900 mb-6">Top Selling Products</h2>
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex-1 min-w-0 pr-3">
                          <h4 className="text-sm font-bold text-slate-800 truncate">{product.name}</h4>
                          <span className="text-xs font-medium text-slate-500 mt-1 block">Margin: {product.profitMargin}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-sm font-black text-emerald-600 block">{product.sold}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Sold</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-black text-slate-900">Live Transaction Feed</h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 text-[12px] uppercase tracking-widest font-bold">
                        <th className="py-3 pr-4 whitespace-nowrap">Invoice ID</th>
                        <th className="py-3 px-4 whitespace-nowrap">Time</th>
                        <th className="py-3 px-4 whitespace-nowrap">Customer</th>
                        <th className="py-3 px-4 text-center whitespace-nowrap">Payment</th>
                        <th className="py-3 px-4 text-right whitespace-nowrap">Amount</th>
                        <th className="py-3 pl-4 text-center whitespace-nowrap">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-medium text-slate-700">
                      {recentTransactions.map((tx, index) => (
                        <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 pr-4 whitespace-nowrap">
                            <Link to="/transactions" className="font-bold text-blue-600 hover:underline">
                              {tx.id}
                            </Link>
                          </td>
                          <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{tx.time}</td>
                          <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">{tx.customer}</td>
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                              {tx.paymentMethod || 'Cash'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-black text-slate-900 whitespace-nowrap">${tx.total.toFixed(2)}</td>
                          <td className="py-3 pl-4 text-center whitespace-nowrap">
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

            </div>

          </>
        )}
      </div>
    </Layout>
  );
}