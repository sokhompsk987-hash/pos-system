import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { request } from '../util/request';

export default function Home() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Pro Fix: Added loading state

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = () => {
    setIsLoading(true);
    request('subscriptions', 'GET')
      .then(res => {
        if (res && res.data && Array.isArray(res.data)) {
          setPlans(res.data);
        } else {
          setFallbackPlans();
        }
      })
      .catch(err => {
        console.error("Error loading public plans:", err);
        setFallbackPlans();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const setFallbackPlans = () => {
    setPlans([
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

  const safePlans = Array.isArray(plans) ? plans : [];

  return (
    <div className="min-h-screen bg-slate-50 font-['Public_Sans']">
      
      <header className="w-full px-8 md:px-16 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-xl">rocket_launch</span>
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">
            SaaS<span className="text-blue-600">Flow</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">Log In</Link>
          <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all">Get Started</Link>
        </div>
      </header>

      <main className="px-8 py-16 md:py-24 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
          Manage your business with <br className="hidden md:block" />
          <span className="text-blue-600">Confidence</span>
        </h1>
        <p className="text-base text-slate-500 max-w-2xl mx-auto mb-10 font-medium">
          The all-in-one POS dashboard for modern businesses. Track sales, manage inventory, and grow your revenue in one place.
        </p>
      </main>

      <section className="px-6 pb-24 max-w-[1300px] mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-slate-900 mb-3">Choose Your Plan</h2>
          <p className="text-slate-500 text-sm font-medium">Simple, transparent pricing that grows with you.</p>
        </div>

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

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <span className="material-symbols-outlined animate-spin text-4xl mb-4">refresh</span>
            <p className="font-bold">Loading plans...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {safePlans.map((plan, index) => {
              const isPopular = plan?.plan_name === "Standard Plan";
              const monthlyPrice = plan?.monthly_price || 0;
              // Ensure consistent number types for prices
              const yearlyPriceNum = parseFloat(plan?.yearly_price);
              const calculatedYearly = !isNaN(yearlyPriceNum) ? yearlyPriceNum : parseFloat((monthlyPrice * 12 * 0.83).toFixed(2));
              
              const currentPrice = billingCycle === 'monthly' ? monthlyPrice : calculatedYearly;
              const subtext = billingCycle === 'monthly' ? `$${calculatedYearly}/year` : `$${monthlyPrice}/month`;

              return (
                /* Pro Fix: Avoid Math.random() in keys. Use plan_id or array index. */
                <div 
                  key={plan?.plan_id || `plan-${index}`} 
                  className={`relative bg-white rounded-xl p-5 flex flex-col transition-all ${isPopular ? 'border-2 border-blue-600 shadow-lg shadow-blue-900/5' : 'border border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
                >
                  {isPopular && (
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-bl-xl rounded-tr-xl">
                      Most Popular
                    </div>
                  )}
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{plan?.plan_name || "Unknown Plan"}</h3>
                  <p className="text-slate-500 text-xs mb-4 min-h-[32px] pr-2 leading-tight">{plan?.description || "Start growing your business."}</p>
                  
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900">${currentPrice}</span>
                      <span className="text-slate-500 text-xs font-medium">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                    </div>
                    <p className="text-slate-400 text-[10px] mt-0.5">{subtext}</p>
                  </div>
                  
                  <ul className="space-y-2.5 mb-5 flex-1">
                    {plan?.limits_list?.map((limit, idx) => (
                      <li key={`limit-${idx}`} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                        <span className="material-symbols-outlined text-blue-600 text-[16px]">{limit.icon}</span>
                        {limit.text}
                      </li>
                    ))}
                  </ul>

                  <hr className="border-slate-100 mb-4 mt-auto" />

                  <div className="mb-5">
                    <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-900 mb-3">Features</h4>
                    <ul className="space-y-2">
                      {plan?.features_list?.map((feature, idx) => (
                        <li key={`feat-${idx}`} className="flex items-start gap-2 text-xs font-medium text-slate-600">
                          <span className="material-symbols-outlined text-green-500 text-[14px]">check_circle</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Pro Fix: Pass plan_id and billing cycle to the register page via URL parameters */}
                  <Link 
                    to={`/register?plan=${plan?.plan_id || ''}&cycle=${billingCycle}`}
                    className={`w-full block text-center py-2.5 rounded-lg text-sm font-bold transition-all ${isPopular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                  >
                    Choose Plan
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}