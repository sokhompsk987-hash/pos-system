import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import { Button, Flex, Tooltip } from 'antd';
import { request } from '../services/request'; // Import the new request tool

// Reusable template for the stat cards
const StatCard = ({ title, value, icon, iconBg, iconColor, trendText, trendIcon, trendColor }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider">{title}</h3>
      <div className={`${iconBg} p-2.5 rounded-xl`}>
        <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
      </div>
    </div>
    <p className="text-3xl font-black text-slate-900">{value}</p>
    <p className={`text-sm ${trendColor} font-bold mt-3 flex items-center gap-1`}>
      <span className="material-symbols-outlined text-[16px]">{trendIcon}</span>
      {trendText}
    </p>
  </div>
);

export default function Dashboard() {
  // Initial state with some default data so the UI doesn't break before API loads
  const [statsData, setStatsData] = useState([
    {
      id: 1,
      title: 'Total Sales',
      value: '...',
      icon: 'payments',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      trendText: 'Loading...',
      trendIcon: 'sync',
      trendColor: 'text-slate-400'
    },
    {
      id: 2,
      title: 'Total Orders',
      value: '...',
      icon: 'shopping_cart',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      trendText: 'Loading...',
      trendIcon: 'sync',
      trendColor: 'text-slate-400'
    },
    {
      id: 3,
      title: 'Total Products',
      value: '...',
      icon: 'inventory_2',
      iconBg: 'bg-orange-100',
      iconColor: 'text-[#ec5b13]',
      trendText: 'Loading...',
      trendIcon: 'sync',
      trendColor: 'text-slate-400'
    },
    {
      id: 4,
      title: 'Active Staff',
      value: '...',
      icon: 'group',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      trendText: 'Loading...',
      trendIcon: 'sync',
      trendColor: 'text-slate-400'
    }
  ]);

  // Use the standard request to fetch real data from backend
  useEffect(() => {
    request('dashboard-stats', 'GET')
      .then(response => {
         // Update the state only if we receive valid data without errors
         if(response && !response.errors && response.length > 0) {
             setStatsData(response);
         }
      })
      .catch(error => console.log("Error loading dashboard data:", error));
  }, []);

  return (
    <Layout>
      <div className="p-4 md:p-8 space-y-6 md:space-y-8">
        
        {/* Top Big Banner */}
        <div className="bg-[#eef2ff] rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between border border-[#e0e7ff] shadow-sm gap-4 md:gap-0">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-2 md:mb-3">SaaSFlow</h1>
            <h2 className="text-lg md:text-3xl font-bold text-slate-700 uppercase tracking-widest">POS Dashboard</h2>
          </div>
          <div className="hidden md:flex bg-white p-6 rounded-2xl shadow-sm">
            <span className="material-symbols-outlined text-7xl text-blue-500">pie_chart</span>
          </div>
        </div>

        {/* Main Functions: Dynamic Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {statsData.map(stat => (
            <StatCard key={stat.id} {...stat} />
          ))}
        </div>

        {/* Two Columns Layout for the bottom part */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          
          {/* Recent Products List */}
          <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
              <h3 className="text-lg md:text-xl font-bold text-slate-900">Recent Products</h3>
              <button className="text-sm border border-slate-200 px-4 py-2 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors w-full sm:w-auto">
                View all
              </button>
            </div>
            
            <div className="p-0 overflow-x-auto flex-1">
              <table className="w-full text-left min-w-[500px]">
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 md:p-5 flex items-center gap-3 md:gap-4">
                      <div className="bg-slate-100 p-2 md:p-3 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-600">inventory_2</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-[14px] md:text-[15px]">Premium Wireless Headphones</p>
                        <p className="text-xs md:text-sm text-slate-500 mt-0.5">Added Today</p>
                      </div>
                    </td>
                    <td className="p-4 md:p-5 font-bold text-slate-700 whitespace-nowrap">$129.00</td>
                    <td className="p-4 md:p-5 text-right">
                      <button className="text-slate-400 hover:text-[#ec5b13] font-bold text-sm">Edit</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 md:p-5 flex items-center gap-3 md:gap-4">
                      <div className="bg-slate-100 p-2 md:p-3 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-600">inventory_2</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-[14px] md:text-[15px]">Ergonomic Office Chair</p>
                        <p className="text-xs md:text-sm text-slate-500 mt-0.5">Added Yesterday</p>
                      </div>
                    </td>
                    <td className="p-4 md:p-5 font-bold text-slate-700 whitespace-nowrap">$249.00</td>
                    <td className="p-4 md:p-5 text-right">
                      <button className="text-slate-400 hover:text-[#ec5b13] font-bold text-sm">Edit</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* System Status & Quick Actions */}
          <div className="space-y-6 md:space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">System Status</h3>
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="bg-green-100 p-2 rounded-full flex items-center justify-center min-w-[40px] h-[40px]">
                  <span className="material-symbols-outlined text-green-600 text-xl">check_circle</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">All Services Online</h4>
                  <p className="text-sm text-slate-500 font-medium mt-0.5">Last checked: Just now</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-[#ec5b13] hover:bg-orange-50 transition-all group">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-[#ec5b13]">add_circle</span>
                    <span className="font-bold text-slate-700 group-hover:text-[#ec5b13]">New Product</span>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-[#ec5b13]">chevron_right</span>
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-500">receipt_long</span>
                    <span className="font-bold text-slate-700 group-hover:text-blue-500">Create Invoice</span>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-blue-500">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </Layout>
  );
}