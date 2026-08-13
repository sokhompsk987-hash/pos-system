import React, { useState, useEffect } from 'react';
import axios from 'axios'; 

export default function SalesReport({ timeFilter, handleExport }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState({
    kpis: null,
    trends: [],
    products: [],
    dailyReportsList: []
  });

  // Fetch data whenever the time filter changes
  useEffect(() => {
    const fetchSalesData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // NOTE FOR BACKEND TEAM: Adjust these endpoints to match your actual route definitions
        const token = localStorage.getItem('token') || '';
        const headers = { Authorization: `Bearer ${token}` };
        
        // Use Promise.all to fetch all sales-related data concurrently for maximum speed
        const [kpiRes, productsRes, trendsRes, dailyRes] = await Promise.all([
          axios.get(`/api/v1/reports/kpis?filter=${timeFilter}`, { headers }),
          axios.get(`/api/v1/reports/top-products?filter=${timeFilter}`, { headers }),
          axios.get(`/api/v1/reports/trends?filter=${timeFilter}`, { headers }),
          axios.get(`/api/v1/reports/daily?filter=${timeFilter}`, { headers })
        ]);

        // Map the responses accurately to the state based on the API JSON structures
        setReportData({
          kpis: kpiRes.data.data,
          products: productsRes.data.data.products || [],
          trends: trendsRes.data.data.trends || [],
          dailyReportsList: dailyRes.data.data || [] // Assuming data.data holds the array
        });
      } catch (err) {
        console.error("Error fetching sales data:", err);
        setError("Failed to load sales data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesData();
  }, [timeFilter]);

  if (isLoading) return <div className="text-center py-10 text-slate-500 font-medium">Loading Sales Data...</div>;
  if (error) return <div className="text-center py-10 text-red-500 font-medium">{error}</div>;

  const { kpis, trends, products, dailyReportsList } = reportData;
  const maxChartRevenue = trends.length > 0 ? Math.max(...trends.map(t => t.total_revenue)) : 1;

  const kpiCards = [
    { title: "Total Sales", value: `$${kpis?.sales_kpis?.total_sales?.toLocaleString() || '0.00'}`, icon: 'payments', iconColor: 'text-green-500', bgIcon: 'bg-green-50', trend: 'Active', isUp: true },
    { title: "Total Profit", value: `$${kpis?.profitability_kpis?.total_profit?.toLocaleString() || '0.00'}`, icon: 'account_balance_wallet', iconColor: 'text-blue-500', bgIcon: 'bg-blue-50', trend: `${kpis?.profitability_kpis?.profit_margin_percent || 0}%`, isUp: true },
    { title: "Customer Visits", value: `${kpis?.customer_kpis?.customer_visits?.toLocaleString() || '0'}`, icon: 'groups', iconColor: 'text-amber-500', bgIcon: 'bg-amber-50', trend: 'Active', isUp: true },
    { title: "Pending Invoices", value: `$${kpis?.invoice_kpis?.pending_amount?.toLocaleString() || '0.00'}`, icon: 'receipt_long', iconColor: 'text-red-500', bgIcon: 'bg-red-50', trend: 'Needs action', isUp: false },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpiCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-slate-500">{card.title}</h3>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.bgIcon}`}>
                <span className={`material-symbols-outlined text-[22px] ${card.iconColor}`}>{card.icon}</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">{card.value}</div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 ${card.isUp ? 'bg-green-100/50 text-green-700' : 'bg-red-100/50 text-red-700'}`}>
                <span className="material-symbols-outlined text-[14px]">{card.isUp ? 'trending_up' : 'trending_down'}</span>
                {card.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Revenue Trends Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Revenue Overview</h2>
          <div className="flex items-end justify-between h-64 pt-4 border-b border-slate-100 pb-2 relative">
            <div className="absolute left-0 top-0 h-full w-full flex flex-col justify-between z-0">
               <div className="border-t border-slate-100 border-dashed w-full"></div>
               <div className="border-t border-slate-100 border-dashed w-full"></div>
               <div className="border-t border-slate-100 border-dashed w-full"></div>
            </div>
            {trends.map((data, idx) => {
              const heightPercent = maxChartRevenue > 0 ? (data.total_revenue / maxChartRevenue) * 100 : 0;
              return (
                <div key={idx} className="flex flex-col items-center group relative z-10 w-full h-full justify-end cursor-pointer">
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-slate-800 text-white text-xs font-semibold py-1.5 px-3 rounded-lg whitespace-nowrap transition-all shadow-lg scale-95 group-hover:scale-100 pointer-events-none z-20">
                    ${data.total_revenue?.toLocaleString() || 0}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                  </div>
                  <div className="w-6 md:w-8 bg-blue-50 rounded-t-md flex items-end h-full">
                    <div className="w-full bg-blue-600 group-hover:bg-blue-500 transition-all duration-300 rounded-t-md shadow-sm" style={{ height: `${heightPercent}%` }}></div>
                  </div>
                  <span className="text-xs font-medium text-slate-400 mt-3">{data.period ? new Date(data.period).getDate() : ''}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Products List */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Top Products</h2>
          <div className="flex-1 flex flex-col gap-5 overflow-y-auto pr-2">
            {products.map((prod, idx) => (
              <div key={idx} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm shrink-0">#{idx + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 truncate">{prod.category}</div>
                  <h4 className="text-sm font-bold text-slate-800 truncate">{prod.product_name}</h4>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-slate-900">${prod.total_revenue?.toFixed(2) || '0.00'}</div>
                  <div className="text-xs font-medium text-green-600 mt-0.5">{prod.total_quantity} sold</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Sales Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
          <h2 className="text-lg font-bold text-slate-900">Daily Sales Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">Report Date</th>
                <th className="py-4 px-6">Branch</th>
                <th className="py-4 px-6 text-right">Gross Profit</th>
                <th className="py-4 px-6 text-right">Total Sales</th>
                <th className="py-4 px-6 text-center">Transactions</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700">
              {dailyReportsList.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-900">{row.report_date_formatted || row.report_date}</td>
                  <td className="py-4 px-6 flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-slate-400">storefront</span>{row.branch?.branch_name || 'N/A'}</td>
                  <td className="py-4 px-6 text-right font-medium text-green-600">${row.gross_profit?.toFixed(2) || '0.00'}</td>
                  <td className="py-4 px-6 text-right font-bold text-slate-900">${row.total_sales?.toFixed(2) || '0.00'}</td>
                  <td className="py-4 px-6 text-center"><span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">{row.transaction_count || 0}</span></td>
                  <td className="py-4 px-6 text-center">
                    <button onClick={() => handleExport(row.report_id, 'pdf')} className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all" title="Download Report">
                      <span className="material-symbols-outlined text-[20px] block">download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}