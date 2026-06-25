import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx'; // Added Layout
import { request } from '../util/request';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    product_name: '',
    product_code: '',
    category_id: '',
    base_price: '',
    cost_price: '',
    stock_quantity: '',
    description: ''
  });
  
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setIsLoading(true);
    request('products', 'GET')
      .then(res => {
        if (res && res.data) {
          setProducts(Array.isArray(res.data) ? res.data : []);
        } else if (Array.isArray(res)) {
          setProducts(res);
        } else {
          setProducts([]);
        }
      })
      .catch(err => {
        console.log("Error fetching products:", err);
        setProducts([]);
      })
      .finally(() => {
        setIsLoading(false); // Stop loading spinner
      });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    
    const dataToSend = new FormData();
    dataToSend.append('product_name', formData.product_name);
    dataToSend.append('product_code', formData.product_code);
    dataToSend.append('category_id', formData.category_id);
    dataToSend.append('base_price', formData.base_price);
    dataToSend.append('cost_price', formData.cost_price);
    dataToSend.append('stock_quantity', formData.stock_quantity);
    dataToSend.append('description', formData.description);
    
    if (imageFile) {
      dataToSend.append('image', imageFile); 
    }

    request('products', 'POST', dataToSend)
      .then(res => {
        console.log("Success:", res);
        setIsModalOpen(false); 
        setFormData({
          product_name: '', product_code: '', category_id: '',
          base_price: '', cost_price: '', stock_quantity: '', description: ''
        });
        setImageFile(null);
        fetchProducts(); 
      })
      .catch(err => console.log("Error saving product:", err));
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const filteredProducts = products.filter(p => 
    p?.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p?.product_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-6 md:p-10 font-['Public_Sans'] bg-slate-50 min-h-screen">
        
        {/* Header section with Back Button, Title and Add Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          
          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard" 
              className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm shrink-0"
              title="Back to Dashboard"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
            </Link>

            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Products List</h1>
              <p className="text-slate-500 font-medium mt-1">Manage your store inventory, pricing, and images</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 shrink-0"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add New Product
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          
          {/* Search Bar */}
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <div className="relative max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input 
                type="text" 
                placeholder="Search by name or code..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Loading or Products Data Table */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <span className="material-symbols-outlined animate-spin text-4xl mb-4">refresh</span>
              <p className="font-bold">Loading products...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[12px] uppercase tracking-widest font-bold">
                    <th className="p-4 pl-6">Code</th>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Cost Price</th>
                    <th className="p-4">Sell Price</th>
                    <th className="p-4">Stock</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium text-slate-700">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                      <tr key={product?.product_id || index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 pl-6 text-slate-400">{product?.product_code || '---'}</td>
                        <td className="p-4">
                          <div 
                            className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 p-2 rounded-lg transition-colors w-fit"
                            onClick={() => handleViewDetails(product)}
                            title="Click to view details"
                          >
                            {product?.image_url ? (
                               <img src={`http://localhost:8000${product.image_url}`} alt="product" className="w-10 h-10 rounded-lg object-cover border border-slate-200"/>
                            ) : (
                               <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
                                 <span className="material-symbols-outlined text-slate-400 text-[18px]">image</span>
                               </div>
                            )}
                            <span className="text-slate-900 font-bold hover:text-blue-600">{product?.product_name || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-500">${product?.cost_price || '0.00'}</td>
                        <td className="p-4 text-blue-600 font-bold">${product?.base_price || '0.00'}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${product?.stock_quantity > 10 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                            {product?.stock_quantity || '0'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-16 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center">
                          <span className="material-symbols-outlined text-5xl mb-4 text-slate-300">inventory_2</span>
                          <p className="text-lg font-bold text-slate-500">No products found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add New Product Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 md:p-8">
                
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-xl">
                      <span className="material-symbols-outlined text-blue-600">inventory_2</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">Add New Product</h2>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors">
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-slate-700 uppercase tracking-widest">Product Name</label>
                      <input required name="product_name" value={formData.product_name} onChange={handleInputChange} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900" placeholder="e.g. Galaxy Book 4" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-slate-700 uppercase tracking-widest">Product Code</label>
                      <input required name="product_code" value={formData.product_code} onChange={handleInputChange} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900" placeholder="e.g. SAM-BOOK4-001" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-5">
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-slate-700 uppercase tracking-widest">Cost Price ($)</label>
                      <input required name="cost_price" value={formData.cost_price} onChange={handleInputChange} type="number" step="0.01" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900" placeholder="1100.00" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-slate-700 uppercase tracking-widest">Sell Price ($)</label>
                      <input required name="base_price" value={formData.base_price} onChange={handleInputChange} type="number" step="0.01" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900" placeholder="1350.00" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-slate-700 uppercase tracking-widest">Initial Stock</label>
                      <input required name="stock_quantity" value={formData.stock_quantity} onChange={handleInputChange} type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900" placeholder="20" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-slate-700 uppercase tracking-widest">Category ID</label>
                      <input required name="category_id" value={formData.category_id} onChange={handleInputChange} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900" placeholder="Paste ID here for now" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-slate-700 uppercase tracking-widest">Product Image</label>
                      <input onChange={handleImageChange} type="file" accept="image/*" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-700 uppercase tracking-widest">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900" placeholder="Lightweight Samsung laptop..."></textarea>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex gap-3 justify-end">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-colors">Cancel</button>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-md shadow-blue-600/20">Upload & Save</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Product Details Modal */}
        {isDetailModalOpen && selectedProduct && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              
              <div className="h-48 bg-slate-100 relative border-b border-slate-200 flex justify-center items-center overflow-hidden">
                {selectedProduct?.image_url ? (
                  <img src={`http://localhost:8000${selectedProduct.image_url}`} alt="product detail" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-7xl text-slate-300">image</span>
                )}
                <button 
                  onClick={() => setIsDetailModalOpen(false)} 
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white text-slate-700 p-2 rounded-full backdrop-blur-md transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="p-6 md:p-8">
                <div className="mb-6">
                  <p className="text-slate-400 font-bold text-sm mb-1">{selectedProduct?.product_code || 'No Code'}</p>
                  <h2 className="text-2xl font-black text-slate-900">{selectedProduct?.product_name || 'Unknown Product'}</h2>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sell Price</p>
                    <p className="text-xl font-black text-blue-600">${selectedProduct?.base_price || '0.00'}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">In Stock</p>
                    <p className={`text-xl font-black ${selectedProduct?.stock_quantity > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                      {selectedProduct?.stock_quantity || '0'} Units
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 col-span-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Description</p>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                      {selectedProduct?.description || 'No description available for this product.'}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setIsDetailModalOpen(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-colors"
                >
                  Close Details
                </button>
              </div>
              
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}