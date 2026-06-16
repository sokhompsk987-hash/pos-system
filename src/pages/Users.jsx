import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { request } from '../util/request';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [branches, setBranches] = useState(["Main Warehouse", "Toul Kork Branch", "BKK Branch"]);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Track which user is being edited or deleted
  const [editingUserId, setEditingUserId] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    password: '',
    role: 'Cashier',
    branch: 'Main Warehouse',
    status: 'Active'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    request('users', 'GET')
      .then(res => {
        if (res && res.data && Array.isArray(res.data)) {
          setUsers(res.data);
        } else {
          setFallbackUsers(); 
        }
      })
      .catch(err => {
        console.log("Error fetching users:", err);
        setFallbackUsers();
      });
  };

  const setFallbackUsers = () => {
    setUsers([
      { id: 1, full_name: 'Sokhom', username: 'admin_sokhom', role: 'Admin', branch: 'All Branches', status: 'Active' },
      { id: 2, full_name: 'Thavin', username: 'VinTzin_c1', role: 'Cashier', branch: 'Toul Kork Branch', status: 'Active' },
      { id: 3, full_name: 'Seyha', username: 'Vuuthy_m', role: 'Manager', branch: 'BKK Branch', status: 'Inactive' }
    ]);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Reset form and close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUserId(null);
    setFormData({ full_name: '', username: '', password: '', role: 'Cashier', branch: 'Main Warehouse', status: 'Active' });
  };

  // Open modal for adding a new user
  const handleAddNewClick = () => {
    setEditingUserId(null);
    setFormData({ full_name: '', username: '', password: '', role: 'Cashier', branch: 'Main Warehouse', status: 'Active' });
    setIsModalOpen(true);
  };

  // Open modal for editing an existing user
  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setFormData({
      full_name: user.full_name,
      username: user.username,
      password: '', // Usually leave blank when editing unless they want to change it
      role: user.role,
      branch: user.branch,
      status: user.status
    });
    setIsModalOpen(true);
  };

  // Open modal for confirming deletion
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    
    if (editingUserId) {
      // Send PUT request to update user
      request(`users/${editingUserId}`, 'PUT', formData)
        .then(res => {
          console.log("User updated:", res);
          closeModal();
          fetchUsers();
        })
        .catch(err => console.log("Error updating user:", err));
    } else {
      // Send POST request to create new user
      request('users', 'POST', formData)
        .then(res => {
          console.log("User saved:", res);
          closeModal();
          fetchUsers();
        })
        .catch(err => console.log("Error saving user:", err));
    }
  };

  // Confirm and execute deletion
  const confirmDelete = () => {
    if (!userToDelete) return;

    request(`users/${userToDelete.id}`, 'DELETE')
      .then(res => {
        console.log("User deleted:", res);
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
        fetchUsers();
      })
      .catch(err => console.log("Error deleting user:", err));
  };

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin': return 'bg-purple-100 text-purple-700';
      case 'Manager': return 'bg-blue-100 text-blue-700';
      case 'Cashier': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-6 md:p-10 font-['Public_Sans'] bg-slate-50 min-h-screen">
      
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
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Users & Staff</h1>
            <p className="text-slate-500 font-medium mt-1">Manage system access and staff assignments</p>
          </div>
        </div>
        
        <button 
          onClick={handleAddNewClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 shrink-0"
        >
          <span className="material-symbols-outlined text-sm">person_add</span>
          Add New Staff
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              type="text" 
              placeholder="Search by name, username or role..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[12px] uppercase tracking-widest font-bold">
                <th className="p-4 pl-6">Staff Profile</th>
                <th className="p-4">System Role</th>
                <th className="p-4">Assigned Branch</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-slate-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id || index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-black border border-slate-200">
                          {user.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-slate-900 font-bold block">{user.full_name}</span>
                          <span className="text-xs text-slate-400">@{user.username}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">storefront</span>
                      {user.branch}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${user.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit Button */}
                        <button 
                          onClick={() => handleEditClick(user)} 
                          className="text-slate-400 hover:text-blue-600 transition-colors p-1.5 bg-slate-50 hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-100" 
                          title="Edit Staff"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        {/* Delete Button */}
                        <button 
                          onClick={() => handleDeleteClick(user)} 
                          className="text-slate-400 hover:text-red-600 transition-colors p-1.5 bg-slate-50 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100" 
                          title="Delete Staff"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <span className="material-symbols-outlined text-5xl mb-4 text-slate-300">badge</span>
                      <p className="text-lg font-bold text-slate-500">No staff members found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-xl">
                    <span className="material-symbols-outlined text-blue-600">{editingUserId ? 'edit_square' : 'badge'}</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {editingUserId ? 'Edit Staff Details' : 'Add New Staff'}
                  </h2>
                </div>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleSaveUser} className="space-y-5">
                
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-slate-700 uppercase tracking-widest">Full Name</label>
                  <input required name="full_name" value={formData.full_name} onChange={handleInputChange} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900" placeholder="e.g. Sok Dara" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-700 uppercase tracking-widest">Username</label>
                    <input required name="username" value={formData.username} onChange={handleInputChange} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900" placeholder="e.g. sok_dara" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-700 uppercase tracking-widest">
                      Password {editingUserId && <span className="text-slate-400 normal-case">(Leave blank to keep)</span>}
                    </label>
                    <input required={!editingUserId} name="password" value={formData.password} onChange={handleInputChange} type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-slate-900" placeholder="••••••••" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-700 uppercase tracking-widest">System Role</label>
                    <select name="role" value={formData.role} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-bold text-slate-900">
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Cashier">Cashier</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-700 uppercase tracking-widest">Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-bold text-slate-900">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-slate-700 uppercase tracking-widest">Assigned Branch</label>
                  <select name="branch" value={formData.branch} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-bold text-slate-900">
                    <option value="All Branches">All Branches (Admin Only)</option>
                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex gap-3 justify-end">
                  <button type="button" onClick={closeModal} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-colors">Cancel</button>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-md shadow-blue-600/20">
                    {editingUserId ? 'Update Staff' : 'Save Staff'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fadeIn">
          <div className="bg-white rounded-[24px] shadow-xl w-full max-w-sm overflow-hidden border border-slate-100 p-6 text-center transform transition-all">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-red-50 text-red-500 rounded-full mb-4">
              <span className="material-symbols-outlined text-[32px]">delete_forever</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Delete Staff?</h3>
            <p className="text-sm font-medium text-slate-500 mb-6 px-2">
              Are you sure you want to delete <span className="font-bold text-slate-700">{userToDelete?.full_name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm py-3 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-md shadow-red-600/10"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}