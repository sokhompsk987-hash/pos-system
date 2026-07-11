import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import { request } from '../../util/request';
import PaymentModal from '../../components/PaymentModal.jsx';

export default function POS() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  const searchInputRef = useRef(null);

  useEffect(() => {
    fetchProducts();
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const fetchProducts = () => {
    request('products', 'GET')
      .then(res => {
        if (res && res.data && Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          setFallbackProducts();
        }
      })
      .catch(err => {
        console.error("Error loading products:", err);
        setFallbackProducts();
      });
  };

  const setFallbackProducts = () => {
    setProducts([
      { id: 1, name: 'Baby Milk Powder', price: 25.00, category: 'Milk', code: 'P001', stock: 15, image: '' },
      { id: 2, name: 'Baby Wipes (80 pcs)', price: 3.50, category: 'Wipes', code: 'P002', stock: 42, image: '' },
      { id: 3, name: 'Newborn Diapers M Size', price: 18.00, category: 'Diapers', code: 'P003', stock: 20, image: '' },
      { id: 4, name: 'Baby Shampoo 200ml', price: 6.20, category: 'Bath', code: 'P004', stock: 8, image: '' },
      { id: 5, name: 'Feeding Bottle 250ml', price: 8.50, category: 'Accessories', code: 'P005', stock: 12, image: '' },
      { id: 6, name: 'Baby Cotton Onesie', price: 12.00, category: 'Clothing', code: 'P006', stock: 5, image: '' }
    ]);
  };

  const getCategoryFallback = (category) => {
    switch (category) {
      case 'Milk': return { icon: 'baby_changing_station', bg: 'bg-blue-50 text-blue-500' };
      case 'Diapers': return { icon: 'child_care', bg: 'bg-teal-50 text-teal-500' };
      case 'Wipes': return { icon: 'clean_hands', bg: 'bg-indigo-50 text-indigo-500' };
      case 'Bath': return { icon: 'bathtub', bg: 'bg-cyan-50 text-cyan-500' };
      case 'Accessories': return { icon: 'toys', bg: 'bg-amber-50 text-amber-500' };
      default: return { icon: 'stroller', bg: 'bg-pink-50 text-pink-500' };
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    if (searchInputRef.current) {
       searchInputRef.current.focus();
    }
  };

  const updateQuantity = (id, amount) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + amount;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalDiscount = (subtotal * (discount / 100));
  const tax = (subtotal - totalDiscount) * 0.1;
  const totalAmount = subtotal - totalDiscount + tax;
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.code.includes(searchQuery);
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenPayment = () => {
    if (cart.length === 0) return alert("Please add items to the cart first.");
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setCart([]);
    setDiscount(0);
    setIsMobileCartOpen(false);
    if (searchInputRef.current) {
       searchInputRef.current.focus();
    }
  };

  return (
    <Layout>
      <div className="absolute inset-0 flex bg-slate-100 font-sans overflow-hidden">
        
        <div className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 overflow-hidden">
          <div className="flex flex-col sm:flex-row gap-4 mb-6 shrink-0">
            <Link 
              to="/dashboard" 
              className="hidden sm:flex w-[42px] h-[42px] bg-white border border-slate-200 rounded-xl items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm shrink-0"
              title="Back to Dashboard"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
            </Link>

            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search products by name or barcode scan..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-1 max-w-full whitespace-nowrap scrollbar-hide">
              {['All', 'Milk', 'Diapers', 'Wipes', 'Bath', 'Accessories'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 pb-24 lg:pb-6">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 content-start">
              {filteredProducts.map(product => {
                const fallback = getCategoryFallback(product.category);
                return (
                  <div 
                    key={product.id} 
                    onClick={() => addToCart(product)}
                    className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between group overflow-hidden"
                  >
                    <div className="w-full h-24 sm:h-32 rounded-xl overflow-hidden mb-3 bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 relative">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className={`w-full h-full flex flex-col items-center justify-center ${fallback.bg} gap-1 group-hover:scale-105 transition-transform duration-300`}>
                          <span className="material-symbols-outlined text-[24px] sm:text-[32px]">{fallback.icon}</span>
                          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider opacity-60">{product.category}</span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-slate-900/60 backdrop-blur-sm text-white font-mono text-[9px] px-1.5 py-0.5 rounded-md">
                        #{product.code}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[32px]">
                        {product.name}
                      </h3>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 pt-2 border-t border-slate-50 gap-1 sm:gap-0">
                        <span className="text-sm font-black text-slate-900">${product.price.toFixed(2)}</span>
                        <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full inline-block w-fit ${product.stock > 10 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                          Qty: {product.stock}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {isMobileCartOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 animate-fadeIn"
            onClick={() => setIsMobileCartOpen(false)}
          ></div>
        )}

        <div className={`
          fixed inset-y-0 right-0 w-[85%] sm:w-[400px] bg-white flex flex-col shadow-2xl z-40
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:w-[400px] lg:shadow-xl lg:z-10 lg:border-l lg:border-slate-200
          ${isMobileCartOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-[20px]">shopping_basket</span>
              Current Order
            </h2>
            <div className="flex items-center gap-3">
              <span className="bg-blue-100 text-blue-700 font-bold text-xs px-2.5 py-1 rounded-full">
                {totalItems} Items
              </span>
              <button onClick={() => setIsMobileCartOpen(false)} className="lg:hidden w-8 h-8 flex items-center justify-center bg-slate-200 rounded-full text-slate-600">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length > 0 ? (
              cart.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="flex-1 min-w-0 pr-3">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{item.name}</h4>
                    <span className="text-xs font-black text-slate-500 mt-1 block">${item.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 shadow-sm font-bold text-sm">-</button>
                    <span className="text-xs font-black w-6 text-center text-slate-800">{item.quantity}</span>
                    <button onClick={() => addToCart(item)} className="w-7 h-7 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 shadow-sm font-bold text-sm">+</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                <span className="material-symbols-outlined text-[48px] text-slate-300">production_quantity_limits</span>
                <p className="text-sm font-medium">Cart is currently empty</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3 shrink-0">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
              <span>Discount (%)</span>
              <input 
                type="number" 
                min="0" 
                max="100"
                value={discount || ''} 
                onChange={(e) => setDiscount(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg text-right text-xs font-black outline-none focus:border-blue-500" 
              />
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>VAT (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
              <span className="text-sm font-black text-slate-800">Total Payable</span>
              <span className="text-xl font-black text-blue-600">${totalAmount.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleOpenPayment}
              disabled={cart.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black text-sm py-3 rounded-xl shadow-md shadow-blue-600/10 transition-all mt-2 text-center flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">payments</span>
              Proceed to Payment
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsMobileCartOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 bg-slate-900 text-white rounded-full p-4 shadow-2xl flex items-center justify-center z-20 hover:bg-slate-800 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[28px]">shopping_basket</span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-slate-100 shadow-sm">
              {totalItems}
            </span>
          )}
        </button>

        <PaymentModal 
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          totalAmount={totalAmount}
          onPaymentSuccess={handlePaymentSuccess}
        />

      </div>
    </Layout>
  );
}