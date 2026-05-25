import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout.jsx'; 
import { request } from '../../util/request';

export default function Subscription() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [availablePlans, setAvailablePlans] = useState([]);
  
  const [currentSub, setCurrentSub] = useState({
    status: "Loading",
    next_billing_date: "...",
    plan: {
      plan_name: "Loading...",
      monthly_price: 0
    }
  });

  useEffect(() => {
    request('subscriptions/current', 'GET')
      .then(res => {
        if (res && res.data && res.data.plan) {
          setCurrentSub(res.data);
        } else {
          setCurrentSub({
            status: "Inactive",
            next_billing_date: "N/A",
            plan: {
              plan_name: "No Active Plan",
              monthly_price: 0
            }
          });
        }
      })
      .catch(err => {
        console.log("Error loading current plan:", err);
        setCurrentSub({
          status: "Error",
          next_billing_date: "N/A",
          plan: { plan_name: "No Active Plan", monthly_price: 0 }
        });
      });

    request('subscriptions', 'GET')
      .then(res => {
        if (res && res.data && Array.isArray(res.data)) {
          setAvailablePlans(res.data);
        } else {
          setFallbackPlans();
        }
      })
      .catch(err => {
        console.log("Error loading plans:", err);
        setFallbackPlans();
      });
  }, []);

  const setFallbackPlans = () => {
    setAvailablePlans([
      {
        plan_id: "1",
        plan_name: "Starter Plan",
        description: "Basic POS for small shops",
        monthly_price: 9.99,
        yearly_price: 99.99,
        limits_list: [
          { icon: 'domain', text: '1 Branch' },
          { icon: 'group', text: '3 Users' },
          { icon: 'desktop_windows', text: '1 POS Terminal' }
        ],
        features_list: [
          "Basic POS",
          "Inventory Management"
        ]
      },
      {
        plan_id: "2",
        plan_name: "Standard Plan",
        description: "POS for growing businesses",
        monthly_price: 24.99,
        yearly_price: 249.99,
        limits_list: [
          { icon: 'domain', text: '3 Branches' },
          { icon: 'group', text: '10 Users' },
          { icon: 'desktop_windows', text: '5 POS Terminals' },
          { icon: 'bar_chart', text: 'Analytics Dashboard' }
        ],
        features_list: [
          "Sales Reports",
          "Multi Branch"
        ]
      },
      {
        plan_id: "3",
        plan_name: "Premium Plan",
        description: "Advanced POS with analytics",
        monthly_price: 49.99,
        yearly_price: 499.99,
        limits_list: [
          { icon: 'domain', text: '10 Branches' },
          { icon: 'group', text: '50 Users' },
          { icon: 'desktop_windows', text: '20 POS Terminals' },
          { icon: 'bar_chart', text: 'Analytics Dashboard' },
          { icon: 'code', text: 'API Access' }
        ],
        features_list: [
          "Advanced Reports",
          "API Access",
          "Employee Management"
        ]
      },
      {
        plan_id: "4",
        plan_name: "Enterprise Plan",
        description: "Unlimited enterprise solution",
        monthly_price: 99.99,
        yearly_price: 999.99,
        limits_list: [
          { icon: 'domain', text: 'Unlimited Branches' },
          { icon: 'group', text: 'Unlimited Users' },
          { icon: 'desktop_windows', text: 'Unlimited POS' },
          { icon: 'bar_chart', text: 'Analytics Dashboard' },
          { icon: 'code', text: 'API Access' }
        ],
        features_list: [
          "Unlimited Branches",
          "Custom API",
          "Priority Support",
          "Advanced Analytics"
        ]
      }
    ]);
  };

  const safePlans = Array.isArray(availablePlans) ? availablePlans : [];

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-[1300px] mx-auto font-['Public_Sans'] bg-slate-50 min-h-screen">
        
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Account</span>
            <span className="text-slate-400">&rsaquo;</span>
            <span className="font-bold text-slate-900 text-lg">My Subscription</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <button className="text-sm font-medium text-slate-600 hover:text-slate-900">Dashboard</button>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors">
              <span>+</span> Create New
            </button>
          </div>
        </div>

        {/* Current Active Plan Banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm mb-10">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl text-blue-600">workspace_premium</span>
            </div>
            <div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Current Plan</p>
              <div className="flex items-center gap-3">
                 <h2 className="text-xl font-black text-slate-900">{currentSub?.plan?.plan_name || "No Plan"}</h2>
                 <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${currentSub?.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-600'}`}>
                   <span className="material-symbols-outlined text-[12px]">
                     {currentSub?.status === 'active' ? 'check_circle' : 'info'}
                   </span>
                   {currentSub?.status || "Inactive"}
                 </span>
              </div>
              <p className="text-slate-500 text-xs mt-1">
                Next billing date: <strong className="text-slate-700">{currentSub?.next_billing_date || "N/A"}</strong>
              </p>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col items-end w-full md:w-auto">
            <p className="text-2xl font-black text-slate-900">${currentSub?.plan?.monthly_price || 0}<span className="text-sm text-slate-500 font-medium">/mo</span></p>
          </div>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="bg-slate-200 p-1 rounded-full flex items-center mb-2">
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Billed monthly
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${billingCycle === 'yearly' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Billed yearly
            </button>
          </div>
          <div className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span>✨</span> SAVE 17% ANNUALLY
          </div>
        </div>

        {/* Pricing Cards Grid (Made Smaller & More Compact) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 justify-center items-stretch">
          {safePlans.map((plan) => {
            const isPopular = plan?.plan_name === "Standard Plan";
            const isCurrent = currentSub?.plan?.plan_name === plan?.plan_name;
            
            const monthlyPrice = plan?.monthly_price || 0;
            const calculatedYearly = plan?.yearly_price || (monthlyPrice * 12 * 0.83).toFixed(2);
            
            const currentPrice = billingCycle === 'monthly' ? monthlyPrice : calculatedYearly;
            const subtext = billingCycle === 'monthly' ? `$${calculatedYearly}/year` : `$${monthlyPrice}/month`;

            return (
              <div 
                key={plan?.plan_id || Math.random()} 
                // Changed padding from p-6 to p-5, rounded from 2xl to xl
                className={`relative bg-white rounded-xl p-5 flex flex-col transition-all ${isPopular ? 'border-2 border-blue-600 shadow-lg shadow-blue-900/5' : 'border border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
              >
                {/* Most Popular Badge */}
                {isPopular && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-bl-xl rounded-tr-xl">
                    Most Popular
                  </div>
                )}
                
                {/* Header Section */}
                <h3 className="text-lg font-bold text-slate-900 mb-1">{plan?.plan_name || "Unknown Plan"}</h3>
                <p className="text-slate-500 text-xs mb-4 min-h-[32px] pr-2 leading-tight">{plan?.description || "Start growing your business."}</p>
                
                {/* Price Section */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">${currentPrice}</span>
                    <span className="text-slate-500 text-xs font-medium">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                  <p className="text-slate-400 text-[10px] mt-0.5">{subtext}</p>
                </div>
                
                {/* Limits Section (Blue Icons) - Reduced margins & text size */}
                <ul className="space-y-2.5 mb-5 flex-1">
                  {plan?.limits_list?.map((limit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <span className="material-symbols-outlined text-blue-600 text-[16px]">{limit.icon}</span>
                      {limit.text}
                    </li>
                  ))}
                </ul>

                {/* Divider Line */}
                <hr className="border-slate-100 mb-4 mt-auto" />

                {/* Features Section (Green Checks) */}
                <div className="mb-5">
                  <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-900 mb-3">Features</h4>
                  <ul className="space-y-2">
                    {plan?.features_list?.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-600">
                        <span className="material-symbols-outlined text-green-500 text-[14px]">check_circle</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Action button */}
                <button 
                  disabled={isCurrent}
                  className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all ${
                    isCurrent 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : isPopular 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isCurrent ? 'Current Plan' : 'Choose Plan'}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </Layout>
  );
}