import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function BranchReport({ timeFilter }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const fetchBranchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token') || '';
        const headers = { Authorization: `Bearer ${token}` };
        
        // NOTE FOR BACKEND TEAM: Check this endpoint matching
        const response = await axios.get(`/api/v1/reports/branch-comparison?filter=${timeFilter}`, { headers });
        
        // Handling nested structure according to previous JSON sample
        const branchData = response.data.data.comparison?.branches || response.data.data.branches?.branches || [];
        setBranches(branchData);
        
      } catch (err) {
        console.error("Error fetching branch data:", err);
        setError("Failed to load branch data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranchData();
  }, [timeFilter]);

  if (isLoading) return <div className="text-center py-10 text-slate-500 font-medium">Loading Branch Data...</div>;
  if (error) return <div className="text-center py-10 text-red-500 font-medium">{error}</div>;

  // Need to ensure array for mapping, if backend returns objects representing branches instead of arrays.
  const branchList = Array.isArray(branches) ? branches : Object.values(branches);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden animate-fade-in">
      <div className="p-5 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Branch Performance Comparison</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200 text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <th className="py-4 px-6">Branch Name</th>
              <th className="py-4 px-6 text-center">Transactions</th>
              <th className="py-4 px-6 text-right">Total Revenue</th>
              <th className="py-4 px-6 text-right">Growth Rate</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700">
            {branchList.map((branch, idx) => (
              <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-medium text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <span className="material-symbols-outlined text-[16px]">store</span>
                    </div>
                    {branch.branch_name}
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">{branch.transaction_count}</span>
                </td>
                <td className="py-4 px-6 text-right font-bold text-slate-900">${branch.total_revenue?.toLocaleString() || '0'}</td>
                <td className="py-4 px-6 text-right flex justify-end">
                    <div className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 w-fit ${branch.growth_vs_prev_period?.percent >= 0 ? 'bg-green-100/50 text-green-700' : 'bg-red-100/50 text-red-700'}`}>
                      <span className="material-symbols-outlined text-[14px]">
                        {branch.growth_vs_prev_period?.percent >= 0 ? 'trending_up' : 'trending_down'}
                      </span>
                      {branch.growth_vs_prev_period?.percent >= 0 ? '+' : ''}{branch.growth_vs_prev_period?.percent || 0}%
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}