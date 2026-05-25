import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import SearchFilter from '../components/SearchFilter';
import Modal from '../components/Modal';
import { request } from '../util/request';

export default function Category() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  // 1. Added form state to capture what the user actually types in the modal
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  // Created a separate function so we can refresh the list after adding a new category
  const fetchCategories = () => {
    request('categories', 'GET')
      .then(response => {
         // Safely extract the data array
         if (response && response.data && Array.isArray(response.data)) {
             setCategories(response.data);
         } else if (Array.isArray(response)) {
             setCategories(response);
         } else {
             setCategories([]);
         }
      })
      .catch(error => console.log("Error fetching categories:", error));
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Category Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
    { header: 'Status', accessor: 'status' }
  ];

  // Handle typing in the input fields
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();

    // 2. We now send the real formData that the user typed, instead of hardcoded text
    request('categories', 'POST', formData)
    .then(result => {
       if(result && result.errors) {
           console.log("Errors:", result.errors);
       } else {
           console.log("Saved successfully:", result);
           setIsModalOpen(false); // Close modal
           
           // Clear the form for the next time
           setFormData({ name: '', description: '', status: 'Active' });
           
           // Refresh the table automatically
           fetchCategories();
       }
    })
    .catch(error => console.log("Error saving category:", error));
  };

  // 3. Actually filter the data based on the search term before passing it to DataTable
  const filteredCategories = categories.filter(cat => 
    cat?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat?.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Category Management</h1>

      <div className="flex justify-between items-start mb-6">
         <div className="w-1/3">
           <SearchFilter 
             searchTerm={searchTerm} 
             onSearchChange={setSearchTerm} 
             placeholder="Search categories..." 
           />
         </div>
         
         <button 
           onClick={() => setIsModalOpen(true)} 
           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm"
         >
           + Add Category
         </button>
      </div>

      {/* Pass the filtered list here, not the original array */}
      <DataTable columns={columns} data={filteredCategories} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Category">
        <form className="text-gray-700" onSubmit={handleSaveCategory}>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Category Name</label>
            <input 
              required
              name="name" // Matches formData property
              value={formData.name} // Binds input to state
              onChange={handleInputChange} 
              type="text" 
              className="w-full p-2 border rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
              placeholder="e.g. Toys & Learning" 
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              className="w-full p-2 border rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
              rows="3" 
              placeholder="Brief description...">
            </textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Status</label>
            <select 
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
             <button 
               type="button"
               onClick={() => setIsModalOpen(false)}
               className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
             >
               Cancel
             </button>
             <button 
               type="submit"
               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
             >
               Save Category
             </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}