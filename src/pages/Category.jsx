import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx'; // Added Layout
import DataTable from '../components/DataTable';
import SearchFilter from '../components/SearchFilter';
import Modal from '../components/Modal';
import { request } from '../util/request';

export default function Category() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setIsLoading(true);
    request('categories', 'GET')
      .then(response => {
         if (response && response.data && Array.isArray(response.data)) {
             setCategories(response.data);
         } else if (Array.isArray(response)) {
             setCategories(response);
         } else {
             setCategories([]);
         }
      })
      .catch(error => {
        console.log("Error fetching categories:", error);
        setCategories([]);
      })
      .finally(() => setIsLoading(false));
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Category Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
    { header: 'Status', accessor: 'status' }
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    request('categories', 'POST', formData)
    .then(result => {
        setIsModalOpen(false);
        setFormData({ name: '', description: '', status: 'Active' });
        fetchCategories();
    })
    .catch(error => console.log("Error saving category:", error));
  };

  const filteredCategories = categories.filter(cat => 
    cat?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat?.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/dashboard" className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm">
            <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
          </Link>
          <h1 className="text-2xl font-bold">Category Management</h1>
        </div>

        <div className="flex justify-between items-start mb-6">
           <div className="w-1/3">
             <SearchFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search categories..." />
           </div>
           <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm">
             + Add Category
           </button>
        </div>

        {isLoading ? (
          <div className="p-10 text-center text-gray-500">Loading categories...</div>
        ) : (
          <DataTable columns={columns} data={filteredCategories} />
        )}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Category">
          <form className="text-gray-700" onSubmit={handleSaveCategory}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Category Name</label>
              <input required name="name" value={formData.name} onChange={handleInputChange} type="text" className="w-full p-2 border rounded-lg" placeholder="e.g. Toys & Learning" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full p-2 border rounded-lg" rows="3"></textarea>
            </div>
            <div className="mt-6 flex justify-end gap-3 border-t pt-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2">Cancel</button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Save Category</button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}