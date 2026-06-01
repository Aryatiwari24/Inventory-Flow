import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Eye, 
  TrendingDown, 
  Sparkles,
  Info,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';
import Modal from '../../components/Modal';

export default function ProductsPage({ userRole }) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  
  // Search, Filter, Sort States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [stockStatus, setStockStatus] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // create, edit, view
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category: 'Electronics',
    price: '',
    stock_quantity: 0,
    image_url: ''
  });

  const categories = ['Electronics', 'Office Supplies', 'Kitchen Appliances', 'Wearables'];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getProducts({
        search,
        category,
        stock_status: stockStatus,
        sort_by: sortBy,
        sort_order: sortOrder,
        page,
        limit
      });
      setProducts(res.data);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load products database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, category, stockStatus, sortBy, sortOrder]);

  // Trigger search on submit or debounce, simple handle key down or button click is extremely reliable
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  // Open modals
  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      name: '',
      sku: '',
      description: '',
      category: 'Electronics',
      price: '',
      stock_quantity: 0,
      image_url: ''
    });
    setError(null);
    setIsModalOpen(true);
  };

  const openViewModal = (product) => {
    setModalMode('view');
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      category: product.category,
      price: product.price,
      stock_quantity: product.stock_quantity,
      image_url: product.image_url || ''
    });
    setError(null);
    setIsModalOpen(true);
  };

  // Submit Product Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Front-end validations
    if (parseFloat(formData.price) <= 0) {
      setError("Price must be greater than 0");
      return;
    }
    if (parseInt(formData.stock_quantity) < 0) {
      setError("Stock cannot be negative");
      return;
    }

    try {
      const dataPayload = {
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity)
      };

      if (modalMode === 'create') {
        await api.createProduct(dataPayload);
        showSuccessAlert("Product created successfully!");
      } else {
        await api.updateProduct(selectedProduct.id, dataPayload);
        showSuccessAlert("Product updated successfully!");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error occurred while saving product.');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Are you absolutely sure you want to delete ${product.name} (SKU: ${product.sku})?`)) {
      return;
    }

    try {
      setError(null);
      setSuccessMsg(null);
      await api.deleteProduct(product.id);
      showSuccessAlert("Product successfully deleted.");
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error deleting product. It is likely tied to past customer orders.');
    }
  };

  const showSuccessAlert = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // Calculate totals pages
  const totalPages = Math.ceil(total / limit) || 1;

  // Render modal forms depending on mode (view, edit, create)
  const renderModalContent = () => {
    if (modalMode === 'view' && selectedProduct) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: 'var(--border-radius-md)',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--color-bg-border)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {selectedProduct.image_url ? (
                <img src={selectedProduct.image_url} alt={selectedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Package size={48} color="var(--color-text-muted)" />
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span className="badge badge-info" style={{ alignSelf: 'flex-start', marginBottom: '0.25rem' }}>
                {selectedProduct.category}
              </span>
              <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
                {selectedProduct.name}
              </h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                SKU: <strong style={{ color: 'var(--color-text-primary)' }}>{selectedProduct.sku}</strong>
              </span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            background: 'rgba(15, 23, 42, 0.4)',
            padding: '1.25rem',
            borderRadius: '8px',
            border: '1px solid var(--color-bg-border)'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>
                Unit price
              </span>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                ₹{parseFloat(selectedProduct.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>
                Available Stock
              </span>
              <span className={`badge ${
                selectedProduct.stock_quantity === 0 ? 'badge-danger' : 
                selectedProduct.stock_quantity <= 20 ? 'badge-warning' : 'badge-success'
              }`} style={{ fontSize: '1.1rem', padding: '0.35rem 1rem', marginTop: '0.25rem', fontWeight: 700 }}>
                {selectedProduct.stock_quantity} units
              </span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
              Description
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)', background: 'rgba(15, 23, 42, 0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-bg-border)', lineHeight: '1.6' }}>
              {selectedProduct.description || 'No description provided for this product.'}
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--color-bg-border)', paddingTop: '1.25rem' }}>
            <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Close Details</button>
            {userRole !== 'Sales Executive' && (
              <button onClick={() => openEditModal(selectedProduct)} className="btn btn-primary">
                <Edit3 size={16} />
                Edit Product
              </button>
            )}
          </div>
        </div>
      );
    }

    // Create or Edit Form
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
          <label className="form-label">Product Name *</label>
          <input 
            type="text" 
            className="form-input" 
            required 
            placeholder="e.g. iPhone 15 Pro Max"
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            disabled={userRole === 'Inventory Manager' && modalMode === 'edit' && false /* allowed to update */}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">SKU (Unique ID) *</label>
            <input 
              type="text" 
              className="form-input" 
              required 
              placeholder="e.g. ELEC-IPH-15PM"
              value={formData.sku} 
              onChange={(e) => setFormData({...formData, sku: e.target.value.toUpperCase()})}
              disabled={modalMode === 'edit'} // SKU cannot be edited normally
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select 
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Price (INR) *</label>
            <input 
              type="number" 
              step="0.01" 
              className="form-input" 
              required 
              placeholder="0.00"
              value={formData.price} 
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              disabled={userRole === 'Inventory Manager' && modalMode === 'edit'} // Inventory managers can only update stock
            />
            {userRole === 'Inventory Manager' && modalMode === 'edit' && (
              <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Price edit locked for Inventory Manager</span>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Stock Quantity *</label>
            <input 
              type="number" 
              className="form-input" 
              required 
              placeholder="0"
              value={formData.stock_quantity} 
              onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Image URL</label>
          <input 
            type="url" 
            className="form-input" 
            placeholder="https://example.com/image.jpg"
            value={formData.image_url} 
            onChange={(e) => setFormData({...formData, image_url: e.target.value})}
            disabled={userRole === 'Inventory Manager' && modalMode === 'edit'}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Product Description</label>
          <textarea 
            rows="3" 
            className="form-textarea" 
            placeholder="Provide detail description of materials, sizes..."
            value={formData.description} 
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            disabled={userRole === 'Inventory Manager' && modalMode === 'edit'}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--color-bg-border)', paddingTop: '1.25rem', marginTop: '1rem' }}>
          <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
          <button type="submit" className="btn btn-primary">
            {modalMode === 'create' ? 'Create Product' : 'Save Changes'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Floating alert banners for success */}
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

      {/* Control Bar: Search & Action Buttons */}
      <div className="glass-panel" style={{
        padding: '1.25rem 1.5rem',
        borderRadius: 'var(--border-radius-md)',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '400px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input 
              type="text" 
              className="form-input" 
              style={{ paddingLeft: '2.5rem' }} 
              placeholder="Search products by Name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          </div>
          <button type="submit" className="btn btn-secondary" style={{ padding: '0.65rem 1.25rem' }}>Search</button>
        </form>

        {/* Filter controls row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            <Filter size={14} />
            Filters:
          </div>
          
          <select 
            className="form-select" 
            style={{ width: '150px', padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select 
            className="form-select" 
            style={{ width: '150px', padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
            value={stockStatus}
            onChange={(e) => { setStockStatus(e.target.value); setPage(1); }}
          >
            <option value="">All Stock Levels</option>
            <option value="in_stock">In Stock (&gt;20)</option>
            <option value="low_stock">Low Stock (1-20)</option>
            <option value="out_of_stock">Out of Stock (0)</option>
          </select>

          <select 
            className="form-select" 
            style={{ width: '150px', padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
              setPage(1);
            }}
          >
            <option value="created_at-desc">Newest Added</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="stock_quantity-asc">Stock: Low to High</option>
            <option value="stock_quantity-desc">Stock: High to Low</option>
            <option value="name-asc">Alphabetical A-Z</option>
          </select>

          {userRole !== 'Sales Executive' && (
            <button onClick={openCreateModal} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>
              <Plus size={16} />
              Add Product
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="glass-panel" style={{ padding: '1rem', borderRadius: 'var(--border-radius-md)' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '1rem' }}>
            <RefreshCw size={32} className="animate-float" style={{ color: 'var(--color-primary)' }} />
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Refreshing stock listings...</span>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
            <Package size={48} color="var(--color-text-muted)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>No Products Found</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Try refining your search keyword or clearing the stock status filter.</p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th>SKU Code</th>
                    <th>Category</th>
                    <th>Price (INR)</th>
                    <th>Stock Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod.id}>
                      {/* Image + Title Column */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '6px',
                            background: 'rgba(15, 23, 42, 0.4)',
                            border: '1px solid var(--color-bg-border)',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {prod.image_url ? (
                              <img src={prod.image_url} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <Package size={20} color="var(--color-text-muted)" />
                            )}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{prod.name}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }} numberOfLines={1}>
                              {prod.description ? (prod.description.substring(0, 45) + (prod.description.length > 45 ? '...' : '')) : 'No description'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td>
                        <code style={{ fontSize: '0.8rem', color: 'var(--color-text-primary)', background: 'rgba(15, 23, 42, 0.5)', padding: '0.2rem 0.4rem', borderRadius: '4px', border: '1px solid var(--color-bg-border)' }}>
                          {prod.sku}
                        </code>
                      </td>

                      {/* Category */}
                      <td>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                          {prod.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        ₹{parseFloat(prod.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Stock Badge */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className={`badge ${
                            prod.stock_quantity === 0 ? 'badge-danger' : 
                            prod.stock_quantity <= 20 ? 'badge-warning' : 'badge-success'
                          }`} style={{ fontWeight: 600 }}>
                            {prod.stock_quantity === 0 ? 'Out of Stock' : `${prod.stock_quantity} units`}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                          <button 
                            onClick={() => openViewModal(prod)} 
                            className="btn btn-secondary" 
                            style={{ padding: '0.4rem', borderRadius: 'var(--border-radius-sm)' }}
                            title="View Details"
                          >
                            <Eye size={14} />
                          </button>
                          
                          {userRole !== 'Sales Executive' && (
                            <>
                              <button 
                                onClick={() => openEditModal(prod)} 
                                className="btn btn-secondary" 
                                style={{ padding: '0.4rem', borderRadius: 'var(--border-radius-sm)' }}
                                title="Edit Product"
                              >
                                <Edit3 size={14} />
                              </button>
                              
                              <button 
                                onClick={() => handleDeleteProduct(prod)} 
                                className="btn btn-danger" 
                                style={{ padding: '0.4rem', borderRadius: 'var(--border-radius-sm)' }}
                                title="Delete Product"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
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
              borderTop: 'none',
              fontSize: '0.8rem',
              color: 'var(--color-text-secondary)'
            }}>
              <span>Showing products {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total}</span>
              
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

      {/* Modal overlays for details / create / edit */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={
          modalMode === 'view' ? 'Product Specifications' : 
          modalMode === 'edit' ? 'Update Product Information' : 'Register New Product'
        }
      >
        {renderModalContent()}
      </Modal>

    </div>
  );
}

// Simple Refresh spinner animation class stub
const RefreshCw = ({ className, ...props }) => {
  return (
    <span style={{ display: 'inline-flex', animation: 'spin 2s linear infinite' }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
        <path d="M16 16h5v5" />
      </svg>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </span>
  );
};
