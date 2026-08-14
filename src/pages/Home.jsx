import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { request } from '../util/request';

export default function Home() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for managing the Contact Sales popup modal
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedPlanName, setSelectedPlanName] = useState('');

  // Fetch plans on component mount
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

  // Fallback mock data if API fails
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
        features_list: ["Basic POS", "Inventory Management"]
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
        features_list: ["Sales Reports", "Multi Branch"]
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
        features_list: ["Advanced Reports", "API Access", "Employee Management"]
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
        features_list: ["Unlimited Branches", "Custom API", "Priority Support", "Advanced Analytics"]
      }
    ]);
  };

  const safePlans = Array.isArray(plans) ? plans : [];

  // Handler for opening contact modal
  const handleContactSales = (planName) => {
    setSelectedPlanName(planName);
    setIsContactModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white font-['Public_Sans'] relative">
      
      {/* --- Contact Modal (Pop-up) --- */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up">
            {/* Modal Header */}
            <div className="bg-blue-600 p-6 text-center relative">
              <button 
                onClick={() => setIsContactModalOpen(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
                <span className="material-symbols-outlined text-white text-3xl">headset_mic</span>
              </div>
              <h3 className="text-xl font-black text-white mb-1">Let's setup your POS!</h3>
              <p className="text-blue-100 text-sm font-medium">
                Our team will help you configure the <strong className="text-white">{selectedPlanName}</strong> and arrange hardware.
              </p>
            </div>
            
            {/* Modal Body (Contact Options) */}
            <div className="p-6 space-y-4">
              <p className="text-center text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Choose a way to contact us</p>
              
              {/* Telegram Button */}
              <a 
                href="https://t.me/your_telegram_username" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl border border-sky-100 bg-sky-50/50 hover:bg-sky-50 transition-colors group"
              >
                <div className="w-12 h-12 bg-[#2AABEE] text-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined">send</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Message on Telegram</h4>
                  <p className="text-xs font-medium text-slate-500">Fastest response time (24/7)</p>
                </div>
              </a>

              {/* Phone Button */}
              <a 
                href="tel:+85512345678" 
                className="flex items-center gap-4 p-4 rounded-2xl border border-green-100 bg-green-50/50 hover:bg-green-50 transition-colors group"
              >
                <div className="w-12 h-12 bg-green-500 text-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined">call</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Call Us Directly</h4>
                  <p className="text-xs font-medium text-slate-500">+855 12 345 678</p>
                </div>
              </a>

              {/* Email Button */}
              <a 
                href="mailto:sales@saasflow.com?subject=Interested in SaaSFlow POS" 
                className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors group"
              >
                <div className="w-12 h-12 bg-slate-800 text-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Send an Email</h4>
                  <p className="text-xs font-medium text-slate-500">sales@saasflow.com</p>
                </div>
              </a>
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400">Our business hours: 8:00 AM - 5:00 PM (Mon-Sat)</p>
            </div>
          </div>
        </div>
      )}

      {/* --- Main Header --- */}
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
          <button onClick={() => handleContactSales("General Inquiry")} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all">Get Started</button>
        </div>
      </header>

      {/* --- Hero Section --- */}
      <main className="px-8 pt-16 pb-12 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
          Manage your business with <br className="hidden md:block" />
          <span className="text-blue-600">Confidence</span>
        </h1>
        <p className="text-base text-slate-500 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          The all-in-one POS dashboard for modern businesses. Track sales, manage inventory, and grow your revenue in one place.
        </p>
      </main>

      {/* --- Pricing Section --- */}
      <section className="px-6 pb-20 max-w-[1300px] mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-slate-900 mb-3">Choose Your Plan</h2>
          <p className="text-slate-500 text-sm font-medium">Simple, transparent pricing that grows with you.</p>
        </div>

        <div className="flex flex-col items-center justify-center mb-10">
          <div className="bg-slate-100 p-1 rounded-full flex items-center mb-3">
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Billed monthly
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${billingCycle === 'yearly' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Billed yearly
            </button>
          </div>
          <div className="bg-blue-50 text-blue-600 text-[11px] font-black tracking-wide px-3 py-1 rounded-full flex items-center gap-1">
            <span>✨</span> SAVE 17% ANNUALLY
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <span className="material-symbols-outlined animate-spin text-4xl mb-4">refresh</span>
            <p className="font-bold">Loading plans...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {safePlans.map((plan, index) => {
              const isPopular = plan?.plan_name === "Standard Plan";
              const monthlyPrice = plan?.monthly_price || 0;
              const yearlyPriceNum = parseFloat(plan?.yearly_price);
              const calculatedYearly = !isNaN(yearlyPriceNum) ? yearlyPriceNum : parseFloat((monthlyPrice * 12 * 0.83).toFixed(2));
              
              const currentPrice = billingCycle === 'monthly' ? monthlyPrice : calculatedYearly;
              const subtext = billingCycle === 'monthly' ? `$${calculatedYearly}/year` : `$${monthlyPrice}/month`;

              return (
                <div 
                  key={plan?.plan_id || `plan-${index}`} 
                  className={`relative bg-white rounded-2xl p-6 flex flex-col transition-all ${isPopular ? 'border-2 border-blue-600 shadow-xl shadow-blue-900/5 scale-105 z-10' : 'border border-slate-200 hover:border-slate-300 hover:shadow-md'}`}
                >
                  {isPopular && (
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-bl-xl rounded-tr-xl">
                      Most Popular
                    </div>
                  )}
                  
                  <h3 className="text-xl font-black text-slate-900 mb-1.5">{plan?.plan_name || "Unknown Plan"}</h3>
                  <p className="text-slate-500 text-sm mb-6 min-h-[40px] pr-2 leading-relaxed">{plan?.description || "Start growing your business."}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-slate-900">${currentPrice}</span>
                      <span className="text-slate-500 text-sm font-bold">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                    </div>
                    <p className="text-slate-400 text-xs font-medium mt-1">{subtext}</p>
                  </div>
                  
                  <ul className="space-y-3.5 mb-8 flex-1">
                    {plan?.limits_list?.map((limit, idx) => (
                      <li key={`limit-${idx}`} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                        <span className="material-symbols-outlined text-blue-600 text-[18px]">{limit.icon}</span>
                        {limit.text}
                      </li>
                    ))}
                  </ul>

                  <div className="mb-8 border-t border-slate-100 pt-6 mt-auto">
                    <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-4">Features</h4>
                    <ul className="space-y-3">
                      {plan?.features_list?.map((feature, idx) => (
                        <li key={`feat-${idx}`} className="flex items-start gap-2.5 text-sm font-medium text-slate-600">
                          <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* --- Contact Sales Button --- */}
                  <button 
                    onClick={() => handleContactSales(plan?.plan_name)}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all ${isPopular ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                  >
                    Contact Sales
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* --- Gallery Section --- */}
      <section className="max-w-[1300px] mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl overflow-hidden h-64 md:h-80 shadow-sm border border-slate-100">
            <img src="/images/gallery-1.jpg" alt="Retail POS" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden h-64 md:h-80 shadow-sm border border-slate-100">
            <img src="/images/gallery-2.jpg" alt="Customer Checkout" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden h-64 md:h-80 shadow-sm border border-slate-100">
            <img src="/images/gallery-3.jpg" alt="Managing Store" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section className="max-w-[1100px] mx-auto px-6 pb-24 space-y-24 md:space-y-32">
        
        {/* Point of sale */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <img src="/images/feature-pos.jpg" alt="Point of Sale" className="w-full h-auto rounded-xl shadow-sm" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">Point of sale</h2>
            <p className="text-slate-500 font-medium mb-6 leading-relaxed">
              Transform your smartphone or tablet into an easy-to-use point of sale.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                <span className="text-sm font-medium text-slate-700">Issue printed or electronic receipts</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                <span className="text-sm font-medium text-slate-700">Apply discounts and issue refunds</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                <span className="text-sm font-medium text-slate-700">Keep recording sales even when offline</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                <span className="text-sm font-medium text-slate-700">Connect a receipt printer, barcode scanner, and cash drawer</span>
              </li>
            </ul>
            <Link to="/features/pos" className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:text-blue-700 transition-colors">
              Explore SaaSFlow Point of Sale <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Inventory management */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Inventory management</h2>
            <p className="text-slate-500 font-medium mb-6 leading-relaxed">
              Never run out of stock. Track everything in real-time across multiple locations.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                <span className="text-sm font-medium text-slate-700">Track stock levels in real time</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                <span className="text-sm font-medium text-slate-700">Receive automatic low stock alerts</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                <span className="text-sm font-medium text-slate-700">Send orders to suppliers and track stock receipts</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                <span className="text-sm font-medium text-slate-700">Transfer stock between your stores</span>
              </li>
            </ul>
            <Link to="/features/inventory" className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:text-blue-700 transition-colors">
              Explore inventory management <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 order-1 md:order-2">
            <img src="/images/feature-stock.jpg" alt="Inventory Management" className="w-full h-auto rounded-xl shadow-sm" />
          </div>
        </div>

        {/* Sales analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <img src="/images/feature-report.jpg" alt="Sales Analytics" className="w-full h-auto rounded-xl shadow-sm" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">Sales analytics</h2>
            <p className="text-slate-500 font-medium mb-6 leading-relaxed">
              Access your reports from a smartphone, tablet or computer anytime, anywhere.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                <span className="text-sm font-medium text-slate-700">View revenue, average sale and profit</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                <span className="text-sm font-medium text-slate-700">Track sales trends and react to changes promptly</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                <span className="text-sm font-medium text-slate-700">Determine best-selling items and categories</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                <span className="text-sm font-medium text-slate-700">Export sales data to spreadsheets</span>
              </li>
            </ul>
            <Link to="/features/analytics" className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:text-blue-700 transition-colors">
              Explore SaaSFlow Back Office <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>

      </section>

      {/* --- SaaS Fat Footer Section --- */}
      <footer className="bg-[#0b0f19] pt-20 pb-10 border-t border-slate-800">
        
        {/* Banner CTA inside Footer */}
        <div className="max-w-[1100px] mx-auto px-6 mb-20">
          <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-3xl p-10 md:p-12 border border-blue-800/50 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-black text-white mb-3">Ready to upgrade your store?</h2>
              <p className="text-blue-100/80 font-medium max-w-md">Join thousands of businesses managing their sales and inventory effortlessly.</p>
            </div>
            <button 
              onClick={() => handleContactSales("General Inquiry")}
              className="shrink-0 bg-white hover:bg-slate-50 text-blue-900 px-8 py-4 rounded-xl text-base font-black transition-all flex items-center gap-2 shadow-lg"
            >
              <span className="material-symbols-outlined">support_agent</span>
              Talk to Sales Team
            </button>
          </div>
        </div>

        {/* Mega Footer Links */}
        <div className="max-w-[1300px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-blue-600 p-1.5 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-lg">rocket_launch</span>
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                SaaS<span className="text-blue-500">Flow</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-8">
              The modern Point of Sale system built to scale with your business. Powerful analytics, seamless inventory, and unmatched reliability.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-lg">thumb_up</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-lg">smart_display</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-lg">forum</span>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link to="#" className="text-slate-400 hover:text-white text-sm transition-colors">Point of Sale</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-white text-sm transition-colors">Inventory</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-white text-sm transition-colors">Analytics</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-white text-sm transition-colors">Pricing</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-white text-sm transition-colors">Hardware</Link></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><Link to="#" className="text-slate-400 hover:text-white text-sm transition-colors">Help Center</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-white text-sm transition-colors">Video Tutorials</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-white text-sm transition-colors">API Documentation</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2">Blog <span className="bg-slate-800 text-xs px-2 py-0.5 rounded text-slate-300">New</span></Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link to="#" className="text-slate-400 hover:text-white text-sm transition-colors">About Us</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-white text-sm transition-colors">Careers</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-white text-sm transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-white text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="max-w-[1300px] mx-auto px-6 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs font-medium">© {new Date().getFullYear()} SaaSFlow Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <span>Made with <span className="text-red-500">♥</span> in Cambodia</span>
            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> System Operational</span>
          </div>
        </div>

      </footer>

    </div>
  );
}