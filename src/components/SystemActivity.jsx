import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SystemActivity({ timeFilter }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activityData, setActivityData] = useState({
    summary: null,
    logs: []
  });

  useEffect(() => {
    const fetchActivityData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token') || '';
        const headers = { Authorization: `Bearer ${token}` };

        // NOTE FOR BACKEND TEAM: Adjust endpoints as defined in your route files
        const [summaryRes, logsRes] = await Promise.all([
          axios.get(`/api/v1/system-activity/summary?filter=${timeFilter}`, { headers }),
          axios.get(`/api/v1/system-activity/logs?filter=${timeFilter}`, { headers })
        ]);
        
        setActivityData({
          summary: summaryRes.data.data,
          logs: logsRes.data.data.logs || []
        });
      } catch (err) {
        console.error("Error fetching activity data:", err);
        setError("Failed to load activity logs.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivityData();
  }, [timeFilter]);

  if (isLoading) return <div className="text-center py-10 text-slate-500 font-medium">Loading System Activity...</div>;
  if (error) return <div className="text-center py-10 text-red-500 font-medium">{error}</div>;
  if (!activityData.summary) return null;

  const { summary, logs } = activityData;
  const failureList = summary.recent_failures ? Object.values(summary.recent_failures) : [];
  const actionTypesList = summary.actions_by_type ? Object.entries(summary.actions_by_type).sort((a, b) => b[1] - a[1]) : []; 

  const kpiCards = [
    { title: "Total Actions", value: summary.total_actions?.toLocaleString() || 0, icon: 'touch_app', iconColor: 'text-blue-500', bgIcon: 'bg-blue-50', subtext: `${summary.period_days || 0} Days Period` },
    { title: "Success Rate", value: `${summary.success_rate_percent || 0}%`, icon: 'check_circle', iconColor: 'text-green-500', bgIcon: 'bg-green-50', subtext: `${summary.successful_actions || 0} successful` },
    { title: "Failed Actions", value: summary.failed_actions || 0, icon: 'warning', iconColor: 'text-red-500', bgIcon: 'bg-red-50', subtext: "Requires attention" },
    { title: "Active Users", value: summary.top_users?.length || 0, icon: 'manage_accounts', iconColor: 'text-amber-500', bgIcon: 'bg-amber-50', subtext: "In top ranking" },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      
      {/* --- KPI Cards Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpiCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-slate-500">{card.title}</h3>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.bgIcon}`}>
                <span className={`material-symbols-outlined text-[22px] ${card.iconColor}`}>{card.icon}</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">{card.value}</div>
            <div className="text-xs text-slate-400 font-medium">{card.subtext}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* --- Left Column: Audit Logs Table --- */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden flex-1">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
              <div>
                <h2 className="text-lg font-bold text-slate-900">System Audit Logs</h2>
                <p className="text-sm text-slate-500 mt-1">Detailed history of user and system actions.</p>
              </div>
              <button className="text-sm font-semibold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="py-4 px-6">Timestamp</th>
                    <th className="py-4 px-6">Action</th>
                    <th className="py-4 px-6">User / Email</th>
                    <th className="py-4 px-6">IP Address</th>
                    <th className="py-4 px-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-700">
                  {logs.map((log, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 text-slate-500 font-medium">{log.timestamp}</td>
                      <td className="py-4 px-6 font-semibold text-slate-800">{log.action}</td>
                      <td className="py-4 px-6">{log.user_email}</td>
                      <td className="py-4 px-6 text-slate-500 text-xs font-mono">{log.ip_address}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${log.status === 'success' ? 'bg-green-100/50 text-green-700' : 'bg-red-100/50 text-red-700'}`}>
                          {log.status?.toUpperCase() || 'UNKNOWN'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --- Right Column: Alerts & Analytics --- */}
        <div className="xl:col-span-1 flex flex-col gap-8">
          
          {/* Recent Failures Alert Box */}
          {failureList.length > 0 && (
            <div className="bg-red-50 rounded-2xl border border-red-100 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-md font-bold text-red-800 flex items-center gap-2">
                  <span className="material-symbols-outlined">gpp_maybe</span> Security Alerts
                </h2>
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{failureList.length} New</span>
              </div>
              <div className="flex flex-col gap-3">
                {failureList.map((fail, idx) => (
                  <div key={idx} className="bg-white/60 rounded-xl p-3 border border-red-100/50">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-red-700 text-sm">{fail.action}</span>
                      <span className="text-[10px] text-red-400 font-medium">{fail.timestamp?.split(' ')[1]}</span>
                    </div>
                    <p className="text-xs text-red-600/80">{fail.error}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Active Users Leaderboard */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-900">Top Active Users</h2>
              <span className="material-symbols-outlined text-blue-500">military_tech</span>
            </div>
            <div className="flex flex-col gap-4">
              {summary.top_users?.map((user, idx) => (
                <div key={idx} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{user.username}</h4>
                      <p className="text-xs text-slate-400">ID: {user.user_id?.substring(0, 8)}...</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-blue-600">{user.log_count}</div>
                    <div className="text-[10px] font-medium text-slate-400 uppercase">Actions</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions Breakdown Progress Bars */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-5">Actions Breakdown</h2>
            <div className="flex flex-col gap-4">
              {actionTypesList.map(([actionType, count], idx) => {
                const percent = summary.total_actions > 0 ? Math.round((count / summary.total_actions) * 100) : 0;
                return (
                  <div key={idx}>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                      <span className="capitalize">{actionType.replace('_', ' ')}</span>
                      <span>{count} ({percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}