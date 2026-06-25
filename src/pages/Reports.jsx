import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { request } from '../util/request';

export default function Reports() {
  // State for time filter selection
  const [timeFilter, setTimeFilter] = useState('This Week');

  // State to store real data from backend
  const [dashboardData, setDashboardData] = useState({
    kpis: [],
    chart: [],
    topProducts: []
  });
  
  // Loading and Error states
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch report data whenever the timeFilter changes
  useEffect(() => {
    fetchReportData(timeFilter);
  }, [timeFilter]);

  // Function to get real data from the API
  const fetchReportData = (filter) => {
    setIsLoading(true);
    
    // Construct the endpoint, potentially passing the filter as a query parameter
    // Example: request(`reports/dashboard?timeframe=${encodeURIComponent(filter)}`, 'GET')
    request('reports/dashboard', 'GET') 
      .then(res => {
        // Assume backend returns an object with kpis, chart, and topProducts arrays
        if (res?.data) {
          setDashboardData(res.data);
        }
      })
      .catch(err => {
        console.error("Failed to fetch report data:", err);
        // Load fallback mock data if API fails during development
        loadFallbackData();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Function to handle exporting the report
  const handleExport = () => {
    setIsExporting(true);
    
    // Request backend to generate and return a downloadable file URL or blob
    request('reports/export', 'GET')
      .then(res => {
        // If backend returns a URL to download:
        if (res?.data?.downloadUrl) {
           window.open(res.data.downloadUrl, '_blank');
        } else {
           alert("Export successful, but no file link provided.");
        }
      })
      .catch(err => {
        console.error("Failed to export report:", err);
        alert("Export failed. Please ensure the backend export endpoint is ready.");
      })
      .finally(() => {
        setIsExporting(false);
      });
  };

  // Fallback data function to keep UI intact if backend is down
  const loadFallbackData = () => {
    setDashboardData({
      kpis: [
        { title: 'Total Revenue', value: '$4,250.00', trend: '+12.5%', isUp: true, icon: 'attach_money', color: 'bg-green-100 text-green-600' },
        { title: 'Total Orders', value: '156', trend: '+5.2%', isUp: true, icon: 'shopping_bag', color: 'bg-blue-100 text-blue-600' },
        { title: 'Average Order Value', value: '$27.24', trend: '-1.4%', isUp: false, icon: 'receipt_long', color: 'bg-amber-100 text-amber-600' },
        { title: 'New Customers', value: '32', trend: '+8.1%', isUp: true, icon: 'group_add', color: 'bg-purple-100 text-purple-600' }
      ],
      chart: [
        { day: 'Mon', sales: 450, height: '45%' },
        { day: 'Tue', sales: 620, height: '62%' },
        { day: 'Wed', sales: 380, height: '38%' },
        { day: 'Thu', sales: 850, height: '85%' },
        { day: 'Fri', sales: 920, height: '92%' },
        { day: 'Sat', sales: 1100, height: '100%' },
        { day: 'Sun', sales: 780, height: '78%' }
      ],
      topProducts: [
        { id: 1, name: 'Newborn Diapers M Size', category: 'Diapers', sold: 145, revenue: '$2,610.00' },
        { id: 2, name: 'Baby Milk Powder', category: 'Milk', sold: 82, revenue: '$2,050.00' },
        { id: 3, name: 'Baby Wipes (80 pcs)', category: 'Wipes', sold: 230, revenue: '$805.00' },
        { id: 4, name: 'Baby Shampoo 200ml', category: 'Bath', sold: 54, revenue: '$334.80' }
      ]
    });
  };

  // Safely extract data for rendering
  const { kpis = [], chart = [], topProducts = [] } = dashboardData;

  return (
    <Layout>
      <div className="p-6 md:p-10 max-w-[1400px] mx-auto font-sans bg-slate-50 min-h-screen">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Sales Reports</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Analyze your business performance and metrics</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Time Filter Dropdown */}
            <select 
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              disabled={isLoading}
              className="bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer shadow-sm disabled:opacity-50"
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="This Year">This Year</option>
            </select>
            
            {/* Export Button */}
            <button 
              onClick={handleExport}
              disabled={isExporting || isLoading}
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[18px] ${isExporting ? 'animate-bounce' : ''}`}>
                {isExporting ? 'hourglass_empty' : 'download'}
              </span>
              {isExporting ? 'Exporting...' : 'Export'}
            </button>
          </div>
        </div>

        {/* Loading Overlay State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <span className="material-symbols-outlined animate-spin text-4xl mb-4">refresh</span>
            <p className="font-bold">Loading report data...</p>
          </div>
        ) : (
          <>
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {kpis.map((kpi, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-blue-300 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.color || 'bg-slate-100 text-slate-600'}`}>
                      <span className="material-symbols-outlined text-[24px]">{kpi.icon || 'analytics'}</span>
                    </div>
                    {kpi.trend && (
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${kpi.isUp !== false ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        <span className="material-symbols-outlined text-[14px]">
                          {kpi.isUp !== false ? 'trending_up' : 'trending_down'}
                        </span>
                        {kpi.trend}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-500 mb-1">{kpi.title}</h3>
                    <p className="text-2xl font-black text-slate-900">{kpi.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              
              {/* Main Chart Area */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-lg font-black text-slate-800">Revenue Overview</h2>
                  <button className="text-slate-400 hover:text-blue-600">
                    <span className="material-symbols-outlined">more_horiz</span>
                  </button>
                </div>
                
                {/* Chart Container */}
                <div className="flex-1 min-h-[250px] flex items-end justify-between gap-2 pt-4">
                  {chart.length === 0 ? (
                    <div className="w-full text-center text-slate-400 font-medium">No chart data available</div>
                  ) : (
                    chart.map((data, index) => (
                      <div key={index} className="flex flex-col items-center w-full group cursor-pointer">
                        {/* Tooltip (Visible on hover) */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded mb-2 whitespace-nowrap">
                          ${data.sales || 0}
                        </div>
                        {/* Bar */}
                        <div className="w-full max-w-[40px] bg-blue-100 rounded-t-lg relative overflow-hidden h-48 flex items-end">
                          <div 
                            className="w-full bg-blue-600 group-hover:bg-blue-500 transition-all duration-500 rounded-t-lg"
                            style={{ height: data.height || '0%' }}
                          ></div>
                        </div>
                        {/* Label */}
                        <span className="text-xs font-bold text-slate-500 mt-3">{data.day || ''}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Top Products Table */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-black text-slate-800">Top Products</h2>
                  <Link to="/products" className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</Link>
                </div>
                
                <div className="flex-1 flex flex-col gap-4">
                  {topProducts.length === 0 ? (
                    <div className="text-center text-slate-400 font-medium mt-10">No products data found</div>
                  ) : (
                    topProducts.map((product, index) => (
                      <div key={product.id || index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-black text-slate-500">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{product.name}</h4>
                            <span className="text-xs text-slate-500">{product.category}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black text-slate-900">{product.revenue || '$0.00'}</div>
                          <div className="text-xs font-bold text-green-600">{product.sold || 0} sold</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </>
        )}

      </div>
    </Layout>
  );
}