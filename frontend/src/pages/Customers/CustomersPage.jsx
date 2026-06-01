import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Sparkles,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';
import Modal from '../../components/Modal';

export default function CustomersPage({ userRole }) {
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // create, profile
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    address: ''
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getCustomers({ search, page, limit });
      setCustomers(res.data);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to retrieve customers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCustomers();
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      full_name: '',
      email: '',
      phone_number: '',
      address: ''
    });
    setError(null);
    setIsModalOpen(true);
  };

  const openProfileModal = async (customer) => {
    setModalMode('profile');
    setIsModalOpen(true);
    setProfileLoading(true);
    setError(null);
    try {
      const res = await api.getCustomerProfile(customer.id);
      setProfileData(res);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch customer profile details.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    try {
      await api.createCustomer(formData);
      showSuccessAlert("Customer registered successfully!");
      setIsModalOpen(false);
      fetchCustomers();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create customer. Email may already exist.');
    }
  };

  const handleDeleteCustomer = async (cust) => {
    if (!window.confirm(`Are you sure you want to delete client ${cust.full_name}?`)) {
      return;
    }

    try {
      setError(null);
      setSuccessMsg(null);
      await api.deleteCustomer(cust.id);
      showSuccessAlert("Customer record deleted successfully.");
      fetchCustomers();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to delete customer. Client has linked order history.');
    }
  };

  const showSuccessAlert = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const totalPages = Math.ceil(total / limit) || 1;

  const renderModalContent = () => {
    if (modalMode === 'profile') {
      if (profileLoading) {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ display: 'inline-flex', animation: 'spin 2s linear infinite' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-float" style={{ color: 'var(--color-primary)' }}><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>
            </span>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Compiling profile stats & orders...</span>
          </div>
        );
      }

      if (!profileData) return null;

      const avgSpent = profileData.order_count > 0 ? (profileData.total_spent / profileData.order_count) : 0;

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header Info */}
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(37, 99, 235, 0.1)',
              border: '1px solid rgba(37, 99, 235, 0.2)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Users size={32} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
                {profileData.full_name}
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Client since {new Date(profileData.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Contact details */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
            padding: '1rem',
            background: 'rgba(15, 23, 42, 0.3)',
            borderRadius: '8px',
            border: '1px solid var(--color-bg-border)',
            fontSize: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-secondary)' }}>
              <Mail size={14} color="var(--color-primary)" />
              <span style={{ color: 'var(--color-text-primary)' }}>{profileData.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-secondary)' }}>
              <Phone size={14} color="var(--color-primary)" />
              <span style={{ color: 'var(--color-text-primary)' }}>{profileData.phone_number || 'No contact number'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'var(--color-text-secondary)' }}>
              <MapPin size={14} color="var(--color-primary)" style={{ marginTop: '0.15rem' }} />
              <span style={{ color: 'var(--color-text-primary)' }}>{profileData.address || 'No billing address'}</span>
            </div>
          </div>

          {/* Purchase Summary */}
          <div style={{
            gridTemplateColumns: 'repeat(3, 1fr)',
            display: 'grid',
            gap: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ background: 'rgba(37, 99, 235, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(37, 99, 235, 0.15)' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Lifetime Spend</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                ₹{profileData.total_spent.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
            </div>
            <div style={{ background: 'rgba(34, 197, 94, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.15)' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Total Orders</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-success)' }}>
                {profileData.order_count}
              </span>
            </div>
            <div style={{ background: 'rgba(245, 158, 11, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Average Order</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-warning)' }}>
                ₹{avgSpent.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Past Orders List */}
          <div>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingBag size={14} />
              Purchase History ({profileData.orders.length} orders)
            </h4>

            {profileData.orders.length === 0 ? (
              <div style={{ background: 'rgba(15, 23, 42, 0.2)', padding: '2rem', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--color-bg-border)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>This customer has not placed any orders yet.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                {profileData.orders.map((order) => (
                  <div key={order.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(15, 23, 42, 0.4)',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--color-bg-border)'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        Order #{order.id.substring(0, 8).toUpperCase()}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        ₹{parseFloat(order.total_amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </span>
                      <span className={`badge ${
                        order.status === 'Completed' ? 'badge-success' : 
                        order.status === 'Cancelled' ? 'badge-danger' : 'badge-warning'
                      }`} style={{ fontSize: '0.65rem' }}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-bg-border)', paddingTop: '1.25rem' }}>
            <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Close Profile</button>
          </div>
        </div>
      );
    }

    // Create Customer Form
    return (
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {error && (
          <div style={{
            background: 'var(--color-danger-bg)',
            border: '1px solid var(--color-danger)',
            color: 'var(--color-danger)',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input 
            type="text" 
            className="form-input" 
            required 
            placeholder="e.g. Rajesh Kumar"
            value={formData.full_name} 
            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address *</label>
          <input 
            type="email" 
            className="form-input" 
            required 
            placeholder="e.g. rajesh.kumar@example.com"
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Contact Phone Number</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="e.g. +91 98765 43210"
            value={formData.phone_number} 
            onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Billing/Shipping Address</label>
          <textarea 
            rows="3" 
            className="form-textarea" 
            placeholder="Provide complete street, building, city, state and pincode..."
            value={formData.address} 
            onChange={(e) => setFormData({...formData, address: e.target.value})}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--color-bg-border)', paddingTop: '1.25rem', marginTop: '1rem' }}>
          <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
          <button type="submit" className="btn btn-primary">Create Customer</button>
        </div>
      </form>
    );
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Success alerts */}
      {successMsg && (
        <div style={{
          background: 'var(--color-success-bg)',
          border: '1px solid var(--color-success)',
          color: 'var(--color-success)',
          padding: '1rem 1.5rem',
          borderRadius: '8px',
          fontSize: '0.9rem',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: 'var(--glass-shadow)'
        }}>
          <Sparkles size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Floating delete error alerts */}
      {error && !isModalOpen && (
        <div style={{
          background: 'var(--color-danger-bg)',
          border: '1px solid var(--color-danger)',
          color: 'var(--color-danger)',
          padding: '1rem 1.5rem',
          borderRadius: '8px',
          fontSize: '0.9rem',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: 'var(--glass-shadow)'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Search and Action Bar */}
      <div className="glass-panel" style={{
        padding: '1.25rem 1.5rem',
        borderRadius: 'var(--border-radius-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem',
        flexWrap: 'wrap'
      }}>
        {/* Search */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '400px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input 
              type="text" 
              className="form-input" 
              style={{ paddingLeft: '2.5rem' }} 
              placeholder="Search clients by Name, Email or Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          </div>
          <button type="submit" className="btn btn-secondary" style={{ padding: '0.65rem 1.25rem' }}>Search</button>
        </form>

        {/* Action Button */}
        <button onClick={openCreateModal} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
          <Plus size={16} />
          Add Customer
        </button>
      </div>

      {/* Customer list container */}
      <div className="glass-panel" style={{ padding: '1rem', borderRadius: 'var(--border-radius-md)' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '1rem' }}>
            <span style={{ display: 'inline-flex', animation: 'spin 2s linear infinite' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-float" style={{ color: 'var(--color-primary)' }}><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>
            </span>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Fetching client records...</span>
          </div>
        ) : customers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
            <Users size={48} color="var(--color-text-muted)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>No Customers Registered</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Get started by adding your first B2B client profile.</p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Email Address</th>
                    <th>Phone Number</th>
                    <th>Registered Date</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((cust) => (
                    <tr key={cust.id}>
                      <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {cust.full_name}
                      </td>
                      <td>
                        <span style={{ color: 'var(--color-text-secondary)' }}>{cust.email}</span>
                      </td>
                      <td>
                        <span style={{ color: 'var(--color-text-secondary)' }}>{cust.phone_number || 'N/A'}</span>
                      </td>
                      <td>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                          {new Date(cust.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                          <button 
                            onClick={() => openProfileModal(cust)} 
                            className="btn btn-secondary" 
                            style={{ padding: '0.4rem', borderRadius: 'var(--border-radius-sm)' }}
                            title="View Purchases"
                          >
                            <Eye size={14} />
                          </button>
                          
                          <button 
                            onClick={() => handleDeleteCustomer(cust)} 
                            className="btn btn-danger" 
                            style={{ padding: '0.4rem', borderRadius: 'var(--border-radius-sm)' }}
                            title="Delete Record"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem 0.5rem 0.25rem 0.5rem',
              fontSize: '0.8rem',
              color: 'var(--color-text-secondary)'
            }}>
              <span>Showing customers {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total}</span>
              
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))} 
                  disabled={page === 1}
                  className="btn btn-secondary" 
                  style={{ padding: '0.35rem 0.65rem', pointerEvents: page === 1 ? 'none' : 'auto', opacity: page === 1 ? 0.4 : 1 }}
                >
                  <ChevronLeft size={14} />
                  Prev
                </button>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', padding: '0 0.5rem' }}>Page {page} of {totalPages}</span>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                  disabled={page === totalPages}
                  className="btn btn-secondary" 
                  style={{ padding: '0.35rem 0.65rem', pointerEvents: page === totalPages ? 'none' : 'auto', opacity: page === totalPages ? 0.4 : 1 }}
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Profile / Creation Modals */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalMode === 'profile' ? 'Customer Profile & Transactions' : 'Register New Client Profile'}
      >
        {renderModalContent()}
      </Modal>

    </div>
  );
}
