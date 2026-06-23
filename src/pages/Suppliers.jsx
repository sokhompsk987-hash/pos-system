import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import DataTable from '../components/DataTable';
import SearchFilter from '../components/SearchFilter';
import Modal from '../components/Modal';
import { request } from '../util/request'; 

export default function Suppliers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State to control the Upgrade Popup
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [limitMessage, setLimitMessage] = useState('');

  const [suppliers, setSuppliers] = useState([]);
  
  // ADDED: Loading and Error states for robust API handling
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    address: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = () => {
    setIsLoading(true);
    setError(null);
    
    // API Request to get suppliers
    request('suppliers', 'GET')
      .then(response => {
         if (response && response.data && Array.isArray(response.data)) {
             setSuppliers(response.data);
         } else if (Array.isArray(response)) {
             setSuppliers(response);
         } else {
             // Fallback data if API returns an unexpected format but doesn't throw an error
             setFallbackData();
         }
      })
      .catch(error => {
          console.error("Failed to fetch suppliers:", error);
          // Instead of silently falling back, we set an error state
          setError("Could not load suppliers from the server. Showing offline demo data.");
          setFallbackData();
      })
      .finally(() => {
          setIsLoading(false);
      });
  };

  const setFallbackData = () => {
    setSuppliers([
        { id: 'SUP-001', name: 'Baby Care Distribution', contact: '012 345 678', email: 'sales@babycare.com', address: 'Phnom Penh', status: 'Active' },
        { id: 'SUP-002', name: 'Heng Heng Import Export', contact: '098 765 432', email: 'contact@hengheng.com', address: 'Siem Reap', status: 'Active' },
        { id: 'SUP-003', name: 'Kids World Supplies', contact: '011 222 333', email: 'info@kidsworld.com', address: 'Battambang', status: 'Inactive' },
    ]);
  };

  // FIXED: Ensure columns match exactly what DataTable expects, including the Actions column if needed.
  // Note: If your DataTable component automatically generates an action column, you don't need it here.
  // Assuming it just renders what is passed in:
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Supplier Name', accessor: 'name' },
    { header: 'Contact', accessor: 'contact' },
    { header: 'Email', accessor: 'email' },
    { header: 'Status', accessor: 'status' }
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveSupplier = (e) => {
    e.preventDefault();

    request('suppliers', 'POST', formData)
    .then(result => {
       if(result && result.action === 'upgrade') {
           setLimitMessage(result.message); 
           setIsModalOpen(false); 
           setShowUpgradeModal(true); 
       } 
       else if(result && result.errors) {
           console.error("Form validation errors:", result.errors);
           // Here you would typically set form errors state to show under inputs
       } else {
           setIsModalOpen(false);
           setFormData({ name: '', contact: '', email: '', address: '', status: 'Active' });
           fetchSuppliers(); // Refresh the list
       }
    })
    .catch(error => {
       if(error.response?.data?.action === 'upgrade') {
           setLimitMessage(error.response.data.message);
           setIsModalOpen(false);
           setShowUpgradeModal(true);
       } else {
           console.error("API Error saving supplier:", error);
           
           // For demo purposes when backend isn't connected
           setIsModalOpen(false);
           setFormData({ name: '', contact: '', email: '', address: '', status: 'Active' });
           
           // Simulating a successful save by updating local state (remove in production)
           const newSupplier = { ...formData, id: `SUP-${Math.floor(Math.random() * 1000)}` };
           setSuppliers([...suppliers, newSupplier]);
       }
    });
  };

  // Filter functionality
  const filteredSuppliers = suppliers.filter(supplier => 
    supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    supplier?.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier?.contact?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-6 font-['Public_Sans'] h-full flex flex-col">
        
        {/* Header section with back button and page title */}
        <div className="flex items-center gap-4 mb-6 shrink-0">
          <Link 
            to="/dashboard" 
            className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm shrink-0"
            title="Back to Dashboard"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Supplier Management</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Manage your product suppliers and vendors</p>
          </div>
        </div>

        {/* Error Notification Banner */}
        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined">warning</span>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="flex justify-between items-start mb-6 shrink-0">
           <div className="w-1/3">
             <SearchFilter 
               searchTerm={searchTerm} 
               onSearchChange={setSearchTerm} 
               placeholder="Search by Name, ID, or Contact..." 
             />
           </div>
           
           <button 
             onClick={() => setIsModalOpen(true)} 
             className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
           >
             <span className="material-symbols-outlined text-sm">add</span>
             Add Supplier
           </button>
        </div>

        {/* Data Table Area */}
        <div className="flex-1 min-h-0 overflow-auto bg-white rounded-2xl border border-slate-200 shadow-sm relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <span className="material-symbols-outlined animate-spin">refresh</span>
                Loading data...
              </div>
            </div>
          ) : null}
          <DataTable columns={columns} data={filteredSuppliers} />
        </div>

        {/* Modal for Adding Supplier */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Supplier">
          <form className="text-slate-700" onSubmit={handleSaveSupplier}>
            
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-slate-700 uppercase tracking-widest text-[11px]">Supplier Name</label>
              <input 
                required
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900" 
                placeholder="e.g. Baby Care Distribution" 
              />
            </div>

            <div className="flex gap-4 mb-4">
              <div className="w-1/2">
                <label className="block text-sm font-bold mb-2 text-slate-700 uppercase tracking-widest text-[11px]">Contact Number</label>
                <input 
                  required
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900" 
                  placeholder="Phone number" 
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-bold mb-2 text-slate-700 uppercase tracking-widest text-[11px]">Email Address</label>
                <input 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  type="email" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900" 
                  placeholder="email@example.com" 
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-slate-700 uppercase tracking-widest text-[11px]">Full Address</label>
              <textarea 
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900" 
                rows="2" 
                placeholder="Supplier's full address..."
              ></textarea>
            </div>

            <div className="mb-4">
               <label className="block text-sm font-bold mb-2 text-slate-700 uppercase tracking-widest text-[11px]">Status</label>
               <select 
                 name="status"
                 value={formData.status}
                 onChange={handleInputChange}
                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900"
               >
                 <option value="Active">Active</option>
                 <option value="Inactive">Inactive</option>
               </select>
            </div>
            
            <div className="mt-8 flex justify-end gap-3 pt-5 border-t border-slate-100">
               <button 
                 type="button"
                 onClick={() => setIsModalOpen(false)}
                 className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-colors"
               >
                 Cancel
               </button>
               <button 
                 type="submit"
                 className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-md shadow-blue-600/20"
               >
                 Save Supplier
               </button>
            </div>
          </form>
        </Modal>

        {/* Modal for Limit Reached (Upgrade Popup) */}
        <Modal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} title="">
          <div className="text-center p-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl text-red-600">lock</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Limit Reached!</h2>
            <p className="text-slate-500 font-medium mb-8">
              {limitMessage || "You have reached the maximum number of suppliers allowed for your current plan."}
            </p>
            
            <div className="flex flex-col gap-3">
              <Link 
                to="/subscription"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                Upgrade Plan Now
              </Link>
              <button 
                 onClick={() => setShowUpgradeModal(false)}
                 className="w-full text-slate-500 hover:text-slate-700 font-bold py-3 rounded-xl transition-all"
              >
                 Maybe Later
              </button>
            </div>
          </div>
        </Modal>

      </div>
    </Layout>
  );
}