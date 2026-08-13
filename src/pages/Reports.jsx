import React, { useState } from 'react';
import Layout from '../components/Layout.jsx'; 
// Import Components
import SalesReport from '../components/SalesReport';
import BranchReport from '../components/BranchReport';
import SystemActivity from '../components/SystemActivity'; 

export default function Reports() {
  const [activeTab, setActiveTab] = useState('Sales Report');
  const tabs = ['Sales Report', 'Inventory Report', 'Branch Report', 'System Activity'];
  
  const [timeFilter, setTimeFilter] = useState('This Month');
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (exportType, fileType) => {
    setIsExporting(true);
    setExportDropdownOpen(false);
    // ... API Logic សម្រាប់ Export ទៅកាន់ Backend
    setTimeout(() => setIsExporting(false), 1000);
  };

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
            
            {/* Export Dropdown Menu */}
            <div className="relative w-full sm:w-auto">
              <button 
                onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                disabled={isExporting}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className={`material-symbols-outlined text-[20px] ${isExporting ? 'animate-bounce' : ''}`}>
                  {isExporting ? 'hourglass_empty' : 'download'}
                </span>
                {isExporting ? 'Exporting...' : 'Export'}
              </button>

              {exportDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden py-1">
                  <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Download As</div>
                  <button onClick={() => handleExport('kpi', 'pdf')} className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-3 transition-colors">
                    <span className="material-symbols-outlined text-red-500 text-[20px]">picture_as_pdf</span> KPI Report (PDF)
                  </button>
                  <button onClick={() => handleExport('kpi', 'excel')} className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-3 transition-colors">
                    <span className="material-symbols-outlined text-green-600 text-[20px]">table_view</span> KPI Report (Excel)
                  </button>
                  <button onClick={() => handleExport('top-products', 'excel')} className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-3 transition-colors">
                    <span className="material-symbols-outlined text-green-600 text-[20px]">table_view</span> Top Products (Excel)
                  </button>
                </div>
              )}
            </div>
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

        {/* --- Render Content Based on Active Tab --- */}
        <div className="animate-fade-in">
          {activeTab === 'Sales Report' && <SalesReport timeFilter={timeFilter} handleExport={handleExport} />}
          {activeTab === 'Branch Report' && <BranchReport timeFilter={timeFilter} />}
          
          {/* Placeholder for Inventory */}
          {activeTab === 'Inventory Report' && (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200/60 border-dashed text-center">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[32px]">inventory_2</span>
              </div>
              <h2 className="text-lg font-bold text-slate-800">Inventory Data Coming Soon</h2>
            </div>
          )}

          {/* System Activity Component */}
          {activeTab === 'System Activity' && <SystemActivity />}
        </div>

      </div>
    </Layout>
  );
}