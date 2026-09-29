import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, Trash2, X, Shield, Sparkles } from 'lucide-react';
import api from '../../api/apiClient';
import { useToast } from '../../context/ToastContext';

export const AdminStaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Staff@123');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('product_manager');

  const { success, error } = useToast();

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const data = await api.get('/admin-users');
      if (data.success) {
        setStaff(data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin-users', { name, email, password, phone, role });
      if (res.success) {
        success(res.message);
        setIsModalOpen(false);
        setName('');
        setEmail('');
        fetchStaff();
      }
    } catch (err) {
      error(err.message || 'Error creating staff user.');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await api.put(`/admin-users/${userId}/role`, { role: newRole });
      if (res.success) {
        success(res.message);
        fetchStaff();
      }
    } catch (err) {
      error(err.message || 'Error updating role.');
    }
  };

  const handleDelete = async (userId, staffName) => {
    if (!window.confirm(`Remove staff member "${staffName}"?`)) return;
    try {
      const res = await api.delete(`/admin-users/${userId}`);
      if (res.success) {
        success(res.message);
        fetchStaff();
      }
    } catch (err) {
      error(err.message || 'Error removing staff.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Staff & Sub-Admin Roles ({staff.length})
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage administrative personnel, assign granular roles (Catalog Lead, Order Manager, Super Admin).
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Role Permission</th>
                <th className="py-3.5 px-4">Date Added</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {staff.map((u) => (
                <tr key={u.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`}
                        alt=""
                        className="w-9 h-9 rounded-full border border-gold-400 object-cover"
                      />
                      <span className="font-bold text-stone-900">{u.name}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-stone-700">
                    {u.email}
                  </td>

                  <td className="py-3.5 px-4 text-stone-600">
                    {u.phone || 'N/A'}
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-maroon-900 focus:outline-none focus:border-gold-500"
                    >
                      <option value="admin">👑 Super Admin</option>
                      <option value="product_manager">📦 Product Manager</option>
                      <option value="order_manager">🚚 Order Manager</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-stone-500">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDelete(u.id, u.name)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-stone-100"
                      title="Remove Staff"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-gold-200/80">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif text-lg font-bold text-stone-900">Add Staff Account</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Meera Joshi"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Official Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="meera@shagunshine.com"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Temporary Password *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Staff@123"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  Assigned Staff Role *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
                >
                  <option value="product_manager">Product Manager (Catalog & Stock Only)</option>
                  <option value="order_manager">Order Manager (Logistics & Shipments Only)</option>
                  <option value="admin">Super Admin (Full Administrative Authority)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-maroon-800 text-gold-100 text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
