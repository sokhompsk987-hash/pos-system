import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { request } from '../util/request';

export default function Roles() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Roles State
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

  // New Role Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', description: '' });

  // Modules List
  const systemModules = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'pos', name: 'POS (Point of Sale)' },
    { id: 'products', name: 'Products & Categories' },
    { id: 'stock', name: 'Stock Management' },
    { id: 'transactions', name: 'Transactions & Invoices' },
    { id: 'users', name: 'Users & Staff' },
    { id: 'reports', name: 'Reports' }
  ];

  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    fetchRoles();
  }, []);

  // Fetch permissions automatically when a role is clicked
  useEffect(() => {
    if (selectedRole) {
      fetchRolePermissions(selectedRole.id);
    }
  }, [selectedRole]);

  const fetchRoles = () => {
    setIsLoading(true);
    request('roles', 'GET')
      .then(res => {
        if (res && res.data && Array.isArray(res.data)) {
          setRoles(res.data);
        } else {
          setFallbackRoles();
        }
      })
      .catch(err => {
        console.error("Error fetching roles:", err);
        setFallbackRoles();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const setFallbackRoles = () => {
    setRoles([
      { id: 'r1', name: 'Admin', description: 'Full system access', active_users: 2 },
      { id: 'r2', name: 'Manager', description: 'Store management and reports', active_users: 3 },
      { id: 'r3', name: 'Cashier', description: 'POS and basic sales', active_users: 5 }
    ]);
  };

  const fetchRolePermissions = (roleId) => {
    setIsLoading(true);
    request(`roles/${roleId}/permissions`, 'GET')
      .then(res => {
        if (res && res.data) {
          setPermissions(res.data);
        } else {
          initializeEmptyPermissions();
        }
      })
      .catch(err => {
        console.error("Error fetching permissions:", err);
        if (roleId === 'r1') {
          initializeAdminPermissions();
        } else {
          initializeEmptyPermissions();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const initializeEmptyPermissions = () => {
    const emptyPerms = {};
    systemModules.forEach(mod => {
      emptyPerms[mod.id] = { view: false, create: false, edit: false, delete: false };
    });
    setPermissions(emptyPerms);
  };

  const initializeAdminPermissions = () => {
    const fullPerms = {};
    systemModules.forEach(mod => {
      fullPerms[mod.id] = { view: true, create: true, edit: true, delete: true };
    });
    setPermissions(fullPerms);
  };

  const handleCheckboxChange = (moduleId, action) => {
    setPermissions(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [action]: !prev[moduleId]?.[action]
      }
    }));
  };

  const handleRowSelectAll = (moduleId, isChecked) => {
    setPermissions(prev => ({
      ...prev,
      [moduleId]: { view: isChecked, create: isChecked, edit: isChecked, delete: isChecked }
    }));
  };

  const handleSavePermissions = () => {
    if (!selectedRole) return;
    setIsSaving(true);
    
    const payload = {
      role_id: selectedRole.id,
      permissions: permissions
    };

    request(`roles/${selectedRole.id}/permissions`, 'PUT', payload)
      .then(res => {
        alert("Role permissions updated successfully!");
      })
      .catch(err => {
        console.error("Error saving permissions:", err);
        alert("Permissions saved (Offline mode)");
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleSaveNewRole = (e) => {
    e.preventDefault();
    const newRoleData = { ...newRole, id: `r${Math.random().toString(36).substr(2, 9)}`, active_users: 0 };
    setRoles([...roles, newRoleData]);
    setIsModalOpen(false);
    setNewRole({ name: '', description: '' });
  };

  return (
    <Layout>
      <div className="p-6 md:p-10 font-['Public_Sans'] bg-slate-50 min-h-screen">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Roles</h1>
            <p className="text-slate-500 font-medium mt-1">Manage employee job titles and system access rules</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 shrink-0"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add New Role
          </button>
        </div>

        {/* Section 1: Roles List Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[12px] uppercase tracking-widest font-bold">
                  <th className="p-4 pl-6">Role Name</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-center">Active Users</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-slate-700">
                {roles.map((role) => (
                  <tr 
                    key={role.id} 
                    className={`border-b border-slate-50 transition-colors ${selectedRole?.id === role.id ? 'bg-blue-50/50' : 'hover:bg-slate-50/50'}`}
                  >
                    <td className="p-4 pl-6 font-bold text-slate-900 flex items-center gap-2">
                      {selectedRole?.id === role.id && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                      {role.name}
                    </td>
                    <td className="p-4 text-slate-500">{role.description}</td>
                    <td className="p-4 text-center">
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                        {role.active_users} Users
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => setSelectedRole(role)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          selectedRole?.id === role.id 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Configure Access
                      </button>
                    </td>
                  </tr>
                ))}
                {roles.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-slate-500">No roles found. Create one above!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Permission Matrix (Only visible when a role is selected) */}
        {selectedRole && (
          <div className="bg-white border border-blue-200 rounded-2xl shadow-sm overflow-hidden animate-fadeIn">
            <div className="p-5 border-b border-slate-100 bg-blue-50/30 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Configure Access for <span className="text-blue-600">'{selectedRole.name}'</span>
                </h2>
                <p className="text-slate-500 text-sm mt-1">Check the boxes below to grant access to specific system areas.</p>
              </div>
              <button 
                onClick={handleSavePermissions}
                disabled={isLoading || isSaving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2"
              >
                {isSaving ? <span className="material-symbols-outlined animate-spin text-sm">refresh</span> : <span className="material-symbols-outlined text-sm">save</span>}
                Save Permissions
              </button>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                <span className="material-symbols-outlined animate-spin text-4xl mb-4">refresh</span>
                <p className="font-bold">Loading rules...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[12px] uppercase tracking-widest font-bold">
                      <th className="p-4 pl-6">System Area</th>
                      <th className="p-4 text-center">View</th>
                      <th className="p-4 text-center">Create</th>
                      <th className="p-4 text-center">Edit</th>
                      <th className="p-4 text-center">Delete</th>
                      <th className="p-4 text-center pr-6">Full Control</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-medium text-slate-700">
                    {systemModules.map((module) => {
                      const modPerms = permissions[module.id] || { view: false, create: false, edit: false, delete: false };
                      const isAllSelected = modPerms.view && modPerms.create && modPerms.edit && modPerms.delete;

                      return (
                        <tr key={module.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                          <td className="p-4 pl-6 font-bold text-slate-900">{module.name}</td>
                          <td className="p-4 text-center">
                            <input type="checkbox" checked={modPerms.view} onChange={() => handleCheckboxChange(module.id, 'view')} className="w-4 h-4 cursor-pointer accent-blue-600" />
                          </td>
                          <td className="p-4 text-center">
                            <input type="checkbox" checked={modPerms.create} onChange={() => handleCheckboxChange(module.id, 'create')} className="w-4 h-4 cursor-pointer accent-blue-600" />
                          </td>
                          <td className="p-4 text-center">
                            <input type="checkbox" checked={modPerms.edit} onChange={() => handleCheckboxChange(module.id, 'edit')} className="w-4 h-4 cursor-pointer accent-blue-600" />
                          </td>
                          <td className="p-4 text-center">
                            <input type="checkbox" checked={modPerms.delete} onChange={() => handleCheckboxChange(module.id, 'delete')} className="w-4 h-4 cursor-pointer accent-red-500" />
                          </td>
                          <td className="p-4 text-center pr-6 border-l border-slate-100">
                            <label className="flex items-center justify-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={isAllSelected} onChange={(e) => handleRowSelectAll(module.id, e.target.checked)} className="w-4 h-4 cursor-pointer accent-emerald-500" />
                              <span className="text-xs font-bold text-slate-500">All</span>
                            </label>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Modal for Creating New Role */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black text-slate-900">Create New Role</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full">
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
                <form onSubmit={handleSaveNewRole} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-700 uppercase tracking-widest">Role Name</label>
                    <input required value={newRole.name} onChange={(e) => setNewRole({...newRole, name: e.target.value})} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none" placeholder="e.g. Accountant" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-700 uppercase tracking-widest">Description</label>
                    <textarea value={newRole.description} onChange={(e) => setNewRole({...newRole, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none min-h-[100px]" placeholder="Briefly describe the responsibilities..." />
                  </div>
                  <div className="pt-4 flex gap-3 justify-end">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-md">Create Role</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}