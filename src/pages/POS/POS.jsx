import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import { request } from '../../util/request';

export default function POS() {
  // State for products list and UI interaction
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal toggle states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Payment process formulation states
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [amountReceived, setAmountReceived] = useState('');
  const [discount, setDiscount] = useState(0);

  // Fetch product listings when component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    request('products', 'GET')
      .then(res => {
        if (res && res.data && Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          setFallbackProducts(); // Mock database data for immediate visualization
        }
      })
      .catch(err => {
        console.error("Error loading products:", err);
        setFallbackProducts();
      });
  };

  const setFallbackProducts = () => {
    // Added mock image URLs to simulated data to test visualization
    setProducts([
      { id: 1, name: 'Baby Milk Powder', price: 25.00, category: 'Milk', code: 'P001', stock: 15, image: '' },
      { id: 2, name: 'Baby Wipes (80 pcs)', price: 3.50, category: 'Wipes', code: 'P002', stock: 42, image: '' },
      { id: 3, name: 'Newborn Diapers M Size', price: 18.00, category: 'Diapers', code: 'P003', stock: 20, image: '' },
      { id: 4, name: 'Baby Shampoo 200ml', price: 6.20, category: 'Bath', code: 'P004', stock: 8, image: '' },
      { id: 5, name: 'Feeding Bottle 250ml', price: 8.50, category: 'Accessories', code: 'P005', stock: 12, image: '' },
      { id: 6, name: 'Baby Cotton Onesie', price: 12.00, category: 'Clothing', code: 'P006', stock: 5, image: '' }
    ]);
  };

  // Helper function to return fallback icons and background colors based on category
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

  // Cart operations: Add, update item quantity, or remove item
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
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

  // Dynamic calculations for subtotal, discount, tax, and final amount
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalDiscount = (subtotal * (discount / 100));
  const tax = (subtotal - totalDiscount) * 0.1; // Standard 10% VAT calculation
  const totalAmount = subtotal - totalDiscount + tax;
  const changeDue = amountReceived ? parseFloat(amountReceived) - totalAmount : 0;

  // Filter products based on search input and selected category tab
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.code.includes(searchQuery);
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenPayment = () => {
    if (cart.length === 0) return alert("Please add items to the cart first.");
    setAmountReceived(totalAmount.toFixed(2));
    setShowPaymentModal(true);
  };

  const handleCompletePayment = () => {
    if (parseFloat(amountReceived) < totalAmount) {
      return alert("Received amount cannot be less than total payable amount.");
    }
    setShowPaymentModal(false);
    setShowReceiptModal(true);
  };

  const handleClearSale = () => {
    setCart([]);
    setDiscount(0);
    setAmountReceived('');
    setPaymentMethod('Cash');
    setShowReceiptModal(false);
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-89px)] bg-slate-100 font-sans overflow-hidden">
        
        {/* Left Side: Product Selection Grid */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col min-w-0">
          
          {/* Top Bar: Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 shrink-0">
            
            {/* Back to Dashboard Button */}
            <Link 
              to="/dashboard" 
              className="w-[42px] h-[42px] bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm shrink-0"
              title="Back to Dashboard"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
            </Link>

            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input 
                type="text" 
                placeholder="Search products by name or barcode scan..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 max-w-full whitespace-nowrap [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
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

          {/* Product Cards Layout */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-1 flex-1">
            {filteredProducts.map(product => {
              const fallback = getCategoryFallback(product.category);
              return (
                <div 
                  key={product.id} 
                  onClick={() => addToCart(product)}
                  className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between group overflow-hidden"
                >
                  {/* Product Visual Container (Image or Fallback) */}
                  <div className="w-full h-32 rounded-xl overflow-hidden mb-3 bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 relative">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className={`w-full h-full flex flex-col items-center justify-center ${fallback.bg} gap-1 group-hover:scale-105 transition-transform duration-300`}>
                        <span className="material-symbols-outlined text-[32px]">{fallback.icon}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{product.category}</span>
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-slate-900/60 backdrop-blur-sm text-white font-mono text-[9px] px-1.5 py-0.5 rounded-md">
                      #{product.code}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[32px]">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                      <span className="text-sm font-black text-slate-900">${product.price.toFixed(2)}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${product.stock > 10 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                        Qty: {product.stock}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Current Checkout Bill (Cart Panel) */}
        <div className="w-[400px] bg-white border-l border-slate-200 flex flex-col h-full shadow-xl shrink-0">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-[20px]">shopping_basket</span>
              Current Order
            </h2>
            <span className="bg-blue-100 text-blue-700 font-bold text-xs px-2.5 py-1 rounded-full">
              {cart.reduce((sum, i) => sum + i.quantity, 0)} Items
            </span>
          </div>

          {/* Added Items Container */}
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

          {/* Bill Pricing Formulations */}
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
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black text-sm py-3 rounded-xl shadow-md shadow-blue-600/10 transition-all mt-2 text-center"
            >
              Proceed to Payment
            </button>
          </div>
        </div>

        {/* MODAL 1: STEP-IN PAYMENT DIALOG */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all border border-slate-100">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-base font-black text-slate-800">Finalize Payment</h3>
                <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Select Method</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Cash', 'KHQR Scan', 'Card'].map(method => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`py-3 rounded-xl text-xs font-bold border flex flex-col items-center gap-1.5 transition-all ${paymentMethod === method ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {method === 'Cash' ? 'payments' : method === 'KHQR Scan' ? 'qr_code_2' : 'credit_card'}
                        </span>
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Amount Payable</label>
                  <div className="text-2xl font-black text-slate-900 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-center">
                    ${totalAmount.toFixed(2)}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Amount Received ($)</label>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    className="w-full text-center text-xl font-black px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
                {paymentMethod === 'Cash' && (
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <span className="text-xs font-bold text-slate-500">Change Due:</span>
                    <span className={`text-base font-black ${changeDue >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      ${changeDue >= 0 ? changeDue.toFixed(2) : '0.00'}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button onClick={() => setShowPaymentModal(false)} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm py-2.5 rounded-xl transition-all">Cancel</button>
                <button onClick={handleCompletePayment} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-sm">Validate Invoice</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: PRINTABLE CUSTOM RECEIPT SLIP */}
        {showReceiptModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transform transition-all border border-slate-100">
              <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                
                {/* Print Invoice Header */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full text-green-600 mb-2">
                    <span className="material-symbols-outlined text-[28px]">check_circle</span>
                  </div>
                  <h3 className="text-base font-black text-slate-800">Transaction Successful</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Order ID: #INV-2026-0941</p>
                </div>

                {/* Simulated Slip Content */}
                <div className="border-t border-b border-dashed border-slate-200 py-3 my-2 text-xs font-medium text-slate-600 space-y-2">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Items</span>
                    <span>Subtotal</span>
                  </div>
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name} (x{item.quantity})</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-100 pt-2 flex justify-between">
                    <span>Discount ({discount}%)</span>
                    <span>-${totalDiscount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-slate-900 pt-1">
                    <span>Total Bill</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between"><span>Payment Method:</span><span className="font-bold text-slate-700">{paymentMethod}</span></div>
                  <div className="flex justify-between"><span>Amount Paid:</span><span className="font-bold text-slate-700">${parseFloat(amountReceived).toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Change Given:</span><span className="font-bold text-slate-700">${changeDue > 0 ? changeDue.toFixed(2) : '0.00'}</span></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button onClick={() => window.print()} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm py-2.5 rounded-xl transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">print</span>Print Slip
                </button>
                <button onClick={handleClearSale} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-sm">New Sale</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}