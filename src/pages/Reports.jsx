import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';

export default function Reports() {
  // --- Updated UI States to match Sidebar Menus ---
  const [activeTab, setActiveTab] = useState('Sales Report');
  const tabs = ['Sales Report', 'Inventory Report', 'Branch Report', 'System Activity'];
  
  const [timeFilter, setTimeFilter] = useState('This Month');
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const [reportData, setReportData] = useState({
    kpis: null,
    trends: [],
    products: [],
    dailyReportsList: [],
    branches: []
  });

  useEffect(() => {
    fetchData();
  }, [timeFilter]);

  const fetchData = () => {
    setIsLoading(true);
    setTimeout(() => {
      loadMockData();
      setIsLoading(false);
    }, 800);
  };

  const handleExport = async (exportType, fileType) => {
    setIsExporting(true);
    setExportDropdownOpen(false);
    // ... API Logic (Kept same as before)
    setTimeout(() => setIsExporting(false), 1000);
  };

  const loadMockData = () => {
    // ... Same mock data mapping from previous step
    setReportData({
      kpis: {
        sales_kpis: { total_sales: 12482.50, total_transactions: 156 },
        profitability_kpis: { total_profit: 4120.00, profit_margin_percent: 90 },
        invoice_kpis: { pending_amount: 420.15 }, 
        customer_kpis: { customer_visits: 3845 } 
      },
      trends: [
        { period: '2026-07-25', total_revenue: 4800 },
        { period: '2026-07-26', total_revenue: 2100 },
        { period: '2026-07-27', total_revenue: 3800 },
        { period: '2026-07-28', total_revenue: 4200 },
        { period: '2026-07-29', total_revenue: 2500 }
      ],
      products: [
        { product_id: "1", product_name: "Little One Baby Wipes", category: "Baby Wet Wipes", total_quantity: 145, total_revenue: 290.00 },
        { product_id: "2", product_name: "Newborn Diapers M Size", category: "Diapers", total_quantity: 82, total_revenue: 1230.00 },
      ],
      dailyReportsList: [
        { report_id: "1", report_date_formatted: "30 Jul 2026", branch: { branch_name: "Tuol Kork Branch" }, total_sales: 1250.50, transaction_count: 15, gross_profit: 300.00 },
      ],
      branches: [
        { branch_id: "1", branch_name: "Tuol Kork Branch", total_revenue: 12482.50, transaction_count: 156, growth_vs_prev_period: { percent: 100 } },
        { branch_id: "2", branch_name: "Siem Reap teminal", total_revenue: 8400.00, transaction_count: 98, growth_vs_prev_period: { percent: -2.4 } }
      ]
    });
  };

  const { kpis, trends, products, dailyReportsList, branches } = reportData;
  const maxChartRevenue = trends.length > 0 ? Math.max(...trends.map(t => t.total_revenue)) : 1;

  const kpiCards = [
    { title: "Total Sales", value: `$${kpis?.sales_kpis?.total_sales?.toLocaleString() || '0.00'}`, icon: 'payments', iconColor: 'text-green-500', bgIcon: 'bg-green-50', trend: 'Active', isUp: true },
    { title: "Total Profit", value: `$${kpis?.profitability_kpis?.total_profit?.toLocaleString() || '0.00'}`, icon: 'account_balance_wallet', iconColor: 'text-blue-500', bgIcon: 'bg-blue-50', trend: `${kpis?.profitability_kpis?.profit_margin_percent || 0}%`, isUp: true },
    { title: "Customer Visits", value: `${kpis?.customer_kpis?.customer_visits?.toLocaleString() || '0'}`, icon: 'groups', iconColor: 'text-amber-500', bgIcon: 'bg-amber-50', trend: 'Active', isUp: true },
    { title: "Pending Invoices", value: `$${kpis?.invoice_kpis?.pending_amount?.toLocaleString() || '0.00'}`, icon: 'receipt_long', iconColor: 'text-red-500', bgIcon: 'bg-red-50', trend: 'Needs action', isUp: false },
  ];

  return (
    <Layout>
      <div className="p-6 md:p-8 bg-slate-50/50 min-h-screen font-sans text-slate-800">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{activeTab}</h1>
            <p className="text-sm text-slate-500 mt-1">Monitor and analyze your system data.</p>
          </div>
          
          {/* Filters & Export */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select 
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg px-4 py-2.5 outline-none shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
            {/* Export button UI remains unchanged */}
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">download</span> Export
            </button>
          </div>
        </div>

        {/* 4 Main Tabs Navigation */}
        <div className="flex gap-8 border-b border-slate-200 mb-8 overflow-x-auto custom-scrollbar">
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? 'border-blue-600 text-blue-700' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* --- 1. SALES REPORT TAB --- */}
        {activeTab === 'Sales Report' && (
          <div className="animate-fade-in flex flex-col gap-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
               {/* Map KPI cards here... (Same as previous code) */}
            </div>

            {/* Trends and Top Products */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Trends Chart (col-span-2) */}
              <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Revenue Overview</h2>
                {/* Chart code... */}
              </div>

              {/* Top Products (col-span-1) */}
              <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Top Products</h2>
                {/* Top products code... */}
              </div>
            </div>

            {/* Daily Sales Table included in Sales Report */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Daily Sales Records</h2>
              {/* Table code... */}
            </div>
          </div>
        )}

        {/* --- 2. BRANCH REPORT TAB --- */}
        {activeTab === 'Branch Report' && (
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden animate-fade-in">
             <div className="p-5 border-b border-slate-100">
               <h2 className="text-lg font-bold text-slate-900">Branch Performance Comparison</h2>
             </div>
             {/* Branch comparison table code... */}
          </div>
        )}

        {/* --- 3. INVENTORY REPORT TAB (Placeholder) --- */}
        {activeTab === 'Inventory Report' && (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200/60 border-dashed animate-fade-in text-center">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[32px]">inventory_2</span>
            </div>
            <h2 className="text-lg font-bold text-slate-800">Inventory Data Coming Soon</h2>
            <p className="text-slate-500 mt-2 text-sm max-w-md">The backend team is working on providing inventory insights. This module will be available shortly.</p>
          </div>
        )}

        {/* --- 4. SYSTEM ACTIVITY TAB (Placeholder) --- */}
        {activeTab === 'System Activity' && (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200/60 border-dashed animate-fade-in text-center">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[32px]">history</span>
            </div>
            <h2 className="text-lg font-bold text-slate-800">Activity Logs Coming Soon</h2>
            <p className="text-slate-500 mt-2 text-sm max-w-md">Track user actions, system updates, and logs here once the backend integration is complete.</p>
          </div>
        )}

      </div>
    </Layout>
  );
}