import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import { request } from '../util/request'; 

export default function Roles() {
  // State for the roles list coming from the backend
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State to control Modal visibility and Form input data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch roles from backend when the page first loads
  useEffect(() => {
    fetchRoles();
  }, []);

  // Function to get the latest list of roles from the API
  const fetchRoles = () => {
    setIsLoading(true);
    
    request('roles', 'GET')
      .then(res => {
        // Expecting backend to return an array of roles in res.data
        setRoles(res?.data || []);
      })
      .catch(err => {
        console.error("Failed to load roles from backend:", err);
        // Fallback mock data so the UI doesn't break during development
        setRoles([
          { id: 1, name: 'Administrator', description: 'Full access to all system features', userCount: 2 },
          { id: 2, name: 'Store Manager', description: 'Can manage inventory and reports', userCount: 3 }
        ]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Function to handle typing in the input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Function to send the new role data to the backend
  const handleSubmit = () => {
    // Basic validation before sending to backend
    if (!formData.name.trim()) {
      alert("Role Name is required!");
      return;
    }

    setIsSubmitting(true);
    
    // Send POST request to backend with the form data
    request('roles', 'POST', formData)
      .then(res => {
        // If successful, refresh the table and close modal
        fetchRoles();
        closeModal();
      })
      .catch(err => {
        console.error("Failed to save new role:", err);
        alert("Error saving role. Backend might not be ready yet.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // Helper function to reset form and close modal cleanly
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', description: '' });
  };

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto animate-fadeIn">
        
        {/* Page Header and Action Button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">User Roles</h1>
            <p className="text-slate-500 mt-1">Manage employee job titles and access groups</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all font-medium"
          >
            <span className="material-symbols-outlined">add</span>
            Add New Role
          </button>
        </div>

        {/* Data Table for displaying roles */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="p-10 text-center text-slate-500">
              <span className="material-symbols-outlined animate-spin text-3xl mb-2">refresh</span>
              <p>Loading roles from server...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-semibold text-slate-600 w-1/4">Role Name</th>
                  <th className="p-4 font-semibold text-slate-600 w-2/4">Description</th>
                  <th className="p-4 font-semibold text-slate-600 text-center w-1/4">Active Users</th>
                  <th className="p-4 font-semibold text-slate-600 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roles.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-slate-500">No roles found. Create one above!</td>
                  </tr>
                ) : (
                  roles.map((role) => (
                    <tr key={role.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 pl-6 font-bold text-slate-800">{role.name}</td>
                      <td className="p-4 text-slate-500 leading-relaxed">{role.description}</td>
                      <td className="p-4 text-center">
                        <span className="bg-blue-50 border border-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
                          {role.userCount || 0} Users
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <button className="text-slate-400 hover:text-blue-600 p-2 transition-colors" title="Edit Role">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button className="text-slate-400 hover:text-red-500 p-2 transition-colors ml-1" title="Delete Role">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Overlay for Creating a New Role */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-scaleIn">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Create New Role</h2>
              
              {/* Input Fields bound to state */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Role Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                    placeholder="e.g., Supervisor, Accountant" 
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                    rows="3" 
                    placeholder="Briefly describe what this role can do..."
                    disabled={isSubmitting}
                  ></textarea>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex justify-end gap-3 mt-8">
                <button 
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 border border-slate-300 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span>
                      Saving...
                    </>
                  ) : (
                    'Save Role'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}