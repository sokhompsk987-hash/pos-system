import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../components/DataTable';
import SearchFilter from '../components/SearchFilter';
import Modal from '../components/Modal';
import { request } from '../util/request'; 

export default function Branch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New state to control the Upgrade Popup
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [limitMessage, setLimitMessage] = useState('');

  const [branches, setBranches] = useState([]);

  // បន្ថែម formData ដើម្បីចាប់យកទិន្នន័យពី Form
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contact: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = () => {
    request('branches', 'GET')
      .then(response => {
         // ប្រព័ន្ធការពារ កុំឱ្យគាំងបើ Backend អត់ទាន់រៀបរយ
         if (response && response.data && Array.isArray(response.data)) {
             setBranches(response.data);
         } else if (Array.isArray(response)) {
             setBranches(response);
         } else {
             setBranches([]);
         }
      })
      .catch(error => {
          console.log("Error fetching branches:", error);
          setBranches([]);
      });
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Branch Name', accessor: 'name' },
    { header: 'Location', accessor: 'location' },
    { header: 'Contact', accessor: 'contact' },
    { header: 'Status', accessor: 'status' }
  ];

  // មុខងារសម្រាប់ចាប់យកការវាយបញ្ចូល
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveBranch = (e) => {
    e.preventDefault();

    // ប្រើទិន្នន័យពិតប្រាកដដែលវាយបញ្ចូល ជំនួសឱ្យការ Hardcode
    request('branches', 'POST', formData)
    .then(result => {
       // Check if backend tells us we reached the limit (action: "upgrade")
       if(result && result.action === 'upgrade') {
           setLimitMessage(result.message); 
           setIsModalOpen(false); 
           setShowUpgradeModal(true); 
       } 
       else if(result && result.errors) {
           console.log("Errors:", result.errors);
       } else {
           console.log("Saved successfully:", result);
           setIsModalOpen(false);
           // លុបទិន្នន័យចាស់ចេញពី Form បន្ទាប់ពី Save ជោគជ័យ
           setFormData({ name: '', location: '', contact: '', status: 'Active' });
           // Refresh តារាង
           fetchBranches();
       }
    })
    .catch(error => {
       if(error.response && error.response.data && error.response.data.action === 'upgrade') {
           setLimitMessage(error.response.data.message);
           setIsModalOpen(false);
           setShowUpgradeModal(true);
       } else {
           console.log("Error:", error);
       }
    });
  };

  // 2. មុខងារ Filter សម្រាប់ស្វែងរកសាខា
  const filteredBranches = branches.filter(branch => 
    branch?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    branch?.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 font-['Public_Sans']">
      <h1 className="text-2xl font-black text-slate-900 mb-6">Branch Management</h1>

      <div className="flex justify-between items-start mb-6">
         <div className="w-1/3">
           <SearchFilter 
             searchTerm={searchTerm} 
             onSearchChange={setSearchTerm} 
             placeholder="Search branches..." 
           />
         </div>
         
         <button 
           onClick={() => setIsModalOpen(true)} 
           className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
         >
           <span className="material-symbols-outlined text-sm">add</span>
           Add Branch
         </button>
      </div>

      {/* ប្រើប្រាស់ filteredBranches ជំនួស branches ដើម */}
      <DataTable columns={columns} data={filteredBranches} />

      {/* Modal for Adding Branch */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Branch">
        <form className="text-slate-700" onSubmit={handleSaveBranch}>
          
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-slate-700 uppercase tracking-widest text-[11px]">Branch Name</label>
            <input 
              required
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900" 
              placeholder="e.g. Toul Kork Branch" 
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-slate-700 uppercase tracking-widest text-[11px]">Location / Address</label>
            <textarea 
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900" 
              rows="2" 
              placeholder="Full address..."
            ></textarea>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <label className="block text-sm font-bold mb-2 text-slate-700 uppercase tracking-widest text-[11px]">Contact Number</label>
              <input 
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900" 
                placeholder="Phone number" 
              />
            </div>
            <div className="w-1/2">
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
               Save Branch
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
            {limitMessage || "You have reached the maximum number of branches allowed for your current plan."}
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
  );
}