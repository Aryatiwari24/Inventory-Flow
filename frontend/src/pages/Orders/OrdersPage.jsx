import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Sparkles,
  AlertCircle,
  Clock,
  User,
  ShoppingBag,
  PlusCircle,
  MinusCircle,
  Trash,
  CheckCircle2,
  RefreshCw,
  Edit2
} from 'lucide-react';
import { api } from '../../services/api';
import Modal from '../../components/Modal';

export default function OrdersPage({ userRole }) {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // view, create, status
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Create Order Wizard States
  const [wizardStep, setWizardStep] = useState(1); // 1: Select Customer, 2: Add Products, 3: Finalize
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cart, setCart] = useState([]); // [{product, quantity}]
  
  // Search inputs inside wizard
  const [custSearch, setCustSearch] = useState('');
  const [prodSearch, setProdSearch] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getOrders({ page, limit });
      setOrders(res.data);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to retrieve orders ledger.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  // Load Wizard Customers
  const loadWizardCustomers = async () => {
    try {
      const res = await api.getCustomers({ search: custSearch, limit: 100 });
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Load Wizard Products
  const loadWizardProducts = async () => {
    try {
      const res = await api.getProducts({ search: prodSearch, limit: 100 });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isModalOpen && modalMode === 'create') {
      if (wizardStep === 1) {
        loadWizardCustomers();
      } else if (wizardStep === 2) {
        loadWizardProducts();
      }
    }
  }, [isModalOpen, modalMode, wizardStep, custSearch, prodSearch]);

  const openCreateWizard = () => {
    setModalMode('create');
    setWizardStep(1);
    setSelectedCustomer(null);
    setCart([]);
    setCustSearch('');
    setProdSearch('');
    setError(null);
    setIsModalOpen(true);
  };

  const openViewModal = (order) => {
    setModalMode('view');
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const openStatusModal = (order) => {
    setModalMode('status');
    setSelectedOrder(order);
    setError(null);
    setIsModalOpen(true);
  };

  // Cart operations
  const addToCart = (product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock_quantity) {
        alert(`Cannot add more. Available stock is only ${product.stock_quantity}.`);
        return;
      }
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      if (product.stock_quantity === 0) {
        alert(`Product is out of stock.`);
        return;
      }
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const updateCartQuantity = (productId, qty) => {
    const item = cart.find(i => i.product.id === productId);
    if (!item) return;

    if (qty <= 0) {
      setCart(cart.filter(i => i.product.id !== productId));
      return;
    }

    if (qty > item.product.stock_quantity) {
      alert(`Requested quantity exceeds available stock (${item.product.stock_quantity} units).`);
      return;
    }

    setCart(cart.map(i => 
      i.product.id === productId ? { ...i, quantity: qty } : i
    ));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  // Submit Order Creation
  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      setError("Please add at least one product to the order.");
      return;
    }

    setError(null);
    try {
      const payload = {
        customer_id: selectedCustomer.id,
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity
        }))
      };

      await api.createOrder(payload);
      showSuccessAlert("Order processed successfully and stock levels updated!");
      setIsModalOpen(false);
      fetchOrders();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create order. Check product stock levels.');
    }
  };

  // Update Status
  const handleUpdateStatus = async (status) => {
    try {
      setError(null);
      await api.updateOrderStatus(selectedOrder.id, status);
      showSuccessAlert("Order status updated successfully!");
      setIsModalOpen(false);
      fetchOrders();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error occurred while updating order status.');
    }
  };

  // Delete Order
  const handleDeleteOrder = async (order) => {
    if (!window.confirm(`Are you sure you want to delete Order #${order.id.substring(0, 8).toUpperCase()}? This will restore stock levels for Pending/Processing orders.`)) {
      return;
    }

    try {
      setError(null);
      await api.deleteOrder(order.id);
      showSuccessAlert("Order successfully deleted. Stock has been reinstated.");
      fetchOrders();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to delete order.');
    }
  };

  const showSuccessAlert = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const calculateCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.quantity * parseFloat(item.product.price)), 0);
  };

  const totalPages = Math.ceil(total / limit) || 1;

  // Render wizard steps
  const renderModalContent = () => {
    if (modalMode === 'create') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Progress Indicator Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.4)', padding: '0.75rem 1.25rem', borderRadius: '8px', border: '1px solid var(--color-bg-border)', fontSize: '0.8rem' }}>
            <span style={{ color: wizardStep === 1 ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontWeight: wizardStep === 1 ? 700 : 500 }}>
              1. Customer Selected {selectedCustomer ? `(✔)` : ''}
            </span>
            <span style={{ color: 'var(--color-text-muted)' }}>➔</span>
            <span style={{ color: wizardStep === 2 ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontWeight: wizardStep === 2 ? 700 : 500 }}>
              2. Add Stock Items {cart.length > 0 ? `(${cart.length})` : ''}
            </span>
            <span style={{ color: 'var(--color-text-muted)' }}>➔</span>
            <span style={{ color: wizardStep === 3 ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontWeight: wizardStep === 3 ? 700 : 500 }}>
              3. Check Out
            </span>
          </div>

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

          {/* STEP 1: Select Customer */}
          {wizardStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Filter customers by name or email..." 
                  value={custSearch}
                  onChange={(e) => setCustSearch(e.target.value)}
                />
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '250px', overflowY: 'auto', border: '1px solid var(--color-bg-border)', borderRadius: '8px', padding: '0.5rem' }}>
                {customers.length === 0 ? (
                  <span style={{ textStyle: 'italic', color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>No matching customers registered. Add a customer first.</span>
                ) : (
                  customers.map(cust => (
                    <button
                      key={cust.id}
                      onClick={() => {
                        setSelectedCustomer(cust);
                        setWizardStep(2);
                      }}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem 1rem',
                        background: selectedCustomer?.id === cust.id ? 'var(--color-primary-glow)' : 'transparent',
                        border: 'none',
                        borderBottom: '1px solid var(--color-bg-border)',
                        color: 'var(--color-text-primary)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        width: '100%'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cust.full_name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{cust.email}</span>
                      </div>
                      <ChevronRight size={16} color="var(--color-text-muted)" />
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Add Products */}
          {wizardStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem' }}>Selected Client: <strong>{selectedCustomer?.full_name}</strong></span>
                <button onClick={() => setWizardStep(1)} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>Change</button>
              </div>

              {/* Search products inside wizard */}
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Filter stock products by keyword..." 
                  value={prodSearch}
                  onChange={(e) => setProdSearch(e.target.value)}
                />
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              </div>

              {/* Products selector split */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                
                {/* Product list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '250px', overflowY: 'auto', border: '1px solid var(--color-bg-border)', borderRadius: '8px', padding: '0.5rem' }}>
                  {products.length === 0 ? (
                    <span style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>No products found.</span>
                  ) : (
                    products.map(prod => (
                      <div
                        key={prod.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.5rem',
                          borderBottom: '1px solid var(--color-bg-border)',
                          fontSize: '0.8rem'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '110px' }}>
                          <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }} numberOfLines={1}>{prod.name}</span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>₹{parseFloat(prod.price).toLocaleString('en-IN')}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className={`badge ${prod.stock_quantity === 0 ? 'badge-danger' : prod.stock_quantity <= 20 ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '0.6rem' }}>
                            {prod.stock_quantity}
                          </span>
                          <button
                            onClick={() => addToCart(prod)}
                            disabled={prod.stock_quantity === 0}
                            className="btn btn-primary"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.65rem', opacity: prod.stock_quantity === 0 ? 0.4 : 1 }}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Checkout Cart drawer */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '250px', overflowY: 'auto', border: '1px solid var(--color-bg-border)', borderRadius: '8px', padding: '0.5rem', background: 'rgba(15, 23, 42, 0.2)' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: 600, paddingBottom: '0.25rem', borderBottom: '1px solid var(--color-bg-border)' }}>
                    Checkout Cart ({cart.length} items)
                  </span>

                  {cart.length === 0 ? (
                    <span style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '3rem 0.5rem', fontSize: '0.8rem' }}>Cart is empty. Select products from the left to add.</span>
                  ) : (
                    cart.map(item => (
                      <div key={item.product.id} style={{ display: 'flex', justify: 'space-between', alignItems: 'center', fontSize: '0.75rem', borderBottom: '1px dotted var(--color-bg-border)', paddingBottom: '0.35rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, maxWidth: '100px' }}>
                          <span style={{ fontWeight: 600 }} numberOfLines={1}>{item.product.name}</span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
                            ₹{(item.quantity * parseFloat(item.product.price)).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <button type="button" onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                            <MinusCircle size={14} />
                          </button>
                          <span style={{ fontWeight: 700, padding: '0 0.2rem' }}>{item.quantity}</span>
                          <button type="button" onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                            <PlusCircle size={14} />
                          </button>
                          
                          <button type="button" onClick={() => removeFromCart(item.product.id)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', paddingLeft: '0.35rem' }}>
                            <Trash size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}

                  {cart.length > 0 && (
                    <div style={{ borderTop: '1px solid var(--color-bg-border)', paddingTop: '0.5rem', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.8rem' }}>
                      <span>Estimated Total:</span>
                      <span style={{ color: 'var(--color-primary)' }}>₹{calculateCartTotal().toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>

              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--color-bg-border)', paddingTop: '1.25rem' }}>
                <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button 
                  onClick={() => setWizardStep(3)} 
                  disabled={cart.length === 0} 
                  className="btn btn-primary"
                  style={{ opacity: cart.length === 0 ? 0.4 : 1 }}
                >
                  Proceed to Review
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Place */}
          {wizardStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Customer Details</h4>
                <div style={{ padding: '0.75rem 1rem', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid var(--color-bg-border)', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <strong>{selectedCustomer?.full_name}</strong> ({selectedCustomer?.email})
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Selected Order Items</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
                  {cart.map(item => (
                    <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 1rem', background: 'rgba(15, 23, 42, 0.2)', border: '1px solid var(--color-bg-border)', borderRadius: '6px', fontSize: '0.8rem' }}>
                      <div>
                        <strong>{item.product.name}</strong>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>SKU: {item.product.sku} • ₹{parseFloat(item.product.price).toLocaleString('en-IN')} each</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span>Qty: <strong>{item.quantity}</strong></span>
                        <strong style={{ display: 'block', color: 'var(--color-text-primary)' }}>₹{(item.quantity * parseFloat(item.product.price)).toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Summary */}
              <div style={{
                background: 'rgba(37, 99, 235, 0.05)',
                border: '1px solid rgba(37, 99, 235, 0.15)',
                padding: '1.25rem',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Gross Total (Calculated by Backend):</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  ₹{calculateCartTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-bg-border)', paddingTop: '1.25rem' }}>
                <button onClick={() => setWizardStep(2)} className="btn btn-secondary">Back to Products</button>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                  <button onClick={handlePlaceOrder} className="btn btn-primary">
                    <CheckCircle2 size={16} />
                    Place Order (Deduct Stock)
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      );
    }

    if (modalMode === 'status' && selectedOrder) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ fontSize: '0.9rem' }}>
            Update shipping/fulfillment status for Order <strong>#{selectedOrder.id.substring(0, 8).toUpperCase()}</strong> placed by {selectedOrder.customer_name}.
          </p>

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

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.75rem'
          }}>
            {[
              { status: 'Pending', color: 'var(--color-warning)' },
              { status: 'Processing', color: 'var(--color-info)' },
              { status: 'Completed', color: 'var(--color-success)' },
              { status: 'Cancelled', color: 'var(--color-danger)' }
            ].map(item => (
              <button
                key={item.status}
                onClick={() => handleUpdateStatus(item.status)}
                style={{
                  padding: '1rem',
                  background: selectedOrder.status === item.status ? 'var(--color-primary-glow)' : 'var(--color-bg-panel)',
                  border: selectedOrder.status === item.status ? `2px solid ${item.color}` : '1px solid var(--color-bg-border)',
                  borderRadius: '8px',
                  color: 'var(--color-text-primary)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'var(--transition-smooth)'
                }}
              >
                {item.status}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-bg-border)', paddingTop: '1.25rem' }}>
            <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Close Dialog</button>
          </div>
        </div>
      );
    }

    // View Order Details
    if (modalMode === 'view' && selectedOrder) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header metadata */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Order Reference</span>
              <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)' }}>
                Order #{selectedOrder.id.toUpperCase()}
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={12} />
                Placed {new Date(selectedOrder.created_at).toLocaleString()}
              </span>
            </div>
            
            <span className={`badge ${
              selectedOrder.status === 'Completed' ? 'badge-success' : 
              selectedOrder.status === 'Cancelled' ? 'badge-danger' : 
              selectedOrder.status === 'Processing' ? 'badge-info' : 'badge-warning'
            }`} style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
              {selectedOrder.status}
            </span>
          </div>

          {/* Customer info card */}
          <div>
            <h4 style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
              Billing Customer
            </h4>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'rgba(15, 23, 42, 0.4)',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--color-bg-border)'
            }}>
              <User size={16} color="var(--color-primary)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{selectedOrder.customer_name}</span>
            </div>
          </div>

          {/* Order Items Table */}
          <div>
            <h4 style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
              Order Line Items
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
              {selectedOrder.items.map(item => (
                <div key={item.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.65rem 1rem',
                  background: 'rgba(15, 23, 42, 0.2)',
                  border: '1px solid var(--color-bg-border)',
                  borderRadius: '6px',
                  fontSize: '0.8rem'
                }}>
                  <div>
                    <strong style={{ color: 'var(--color-text-primary)' }}>{item.product_name}</strong>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>SKU: {item.product_sku} • ₹{parseFloat(item.unit_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })} each</span>
                  </div>
                  <div style={{ textStyle: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Qty: {item.quantity}</span>
                    <strong style={{ color: 'var(--color-text-primary)' }}>₹{parseFloat(item.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total card summary */}
          <div style={{
            background: 'rgba(37, 99, 235, 0.05)',
            border: '1px solid rgba(37, 99, 235, 0.15)',
            padding: '1.25rem',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Fulfillment Total Amount:</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              ₹{parseFloat(selectedOrder.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--color-bg-border)', paddingTop: '1.25rem' }}>
            <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Close Drawer</button>
            
            {userRole !== 'Sales Executive' && (
              <button onClick={() => openStatusModal(selectedOrder)} className="btn btn-primary">
                <Edit2 size={14} />
                Update Status
              </button>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Floating success banner */}
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

      {/* Control Action Bar */}
      <div className="glass-panel" style={{
        padding: '1.25rem 1.5rem',
        borderRadius: 'var(--border-radius-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShoppingCart size={18} color="var(--color-primary)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Active Orders: {total} transactions</span>
        </div>

        <button onClick={openCreateWizard} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
          <Plus size={16} />
          Create Order
        </button>
      </div>

      {/* Orders list table container */}
      <div className="glass-panel" style={{ padding: '1rem', borderRadius: 'var(--border-radius-md)' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '1rem' }}>
            <span style={{ display: 'inline-flex', animation: 'spin 2s linear infinite' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-float" style={{ color: 'var(--color-primary)' }}><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>
            </span>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Querying transactions ledger...</span>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
            <ShoppingCart size={48} color="var(--color-text-muted)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>No Orders Processed</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Launch the order placement wizard above to check out items.</p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Order Ref #</th>
                    <th>Customer Name</th>
                    <th>Gross Amount</th>
                    <th>Fulfillment Status</th>
                    <th>Placed Timestamp</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: 600 }}>
                        <code style={{ fontSize: '0.8rem', color: 'var(--color-primary)', background: 'rgba(37, 99, 235, 0.05)', padding: '0.2rem 0.4rem', borderRadius: '4px', border: '1px solid rgba(37, 99, 235, 0.1)' }}>
                          #{order.id.substring(0, 8).toUpperCase()}
                        </code>
                      </td>
                      <td>
                        <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{order.customer_name}</span>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        ₹{parseFloat(order.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <span className={`badge ${
                          order.status === 'Completed' ? 'badge-success' : 
                          order.status === 'Cancelled' ? 'badge-danger' : 
                          order.status === 'Processing' ? 'badge-info' : 'badge-warning'
                        }`} style={{ fontWeight: 600 }}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                          {new Date(order.created_at).toLocaleString()}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                          <button 
                            onClick={() => openViewModal(order)} 
                            className="btn btn-secondary" 
                            style={{ padding: '0.4rem', borderRadius: 'var(--border-radius-sm)' }}
                            title="View Items"
                          >
                            <Eye size={14} />
                          </button>
                          
                          {userRole !== 'Sales Executive' && (
                            <button 
                              onClick={() => openStatusModal(order)} 
                              className="btn btn-secondary" 
                              style={{ padding: '0.4rem', borderRadius: 'var(--border-radius-sm)' }}
                              title="Update Status"
                            >
                              <Edit2 size={14} />
                            </button>
                          )}

                          <button 
                            onClick={() => handleDeleteOrder(order)} 
                            className="btn btn-danger" 
                            style={{ padding: '0.4rem', borderRadius: 'var(--border-radius-sm)' }}
                            title="Delete / Reinstate Stock"
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

            {/* Pagination */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem 0.5rem 0.25rem 0.5rem',
              fontSize: '0.8rem',
              color: 'var(--color-text-secondary)'
            }}>
              <span>Showing orders {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total}</span>
              
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

      {/* Creation Wizard / Update Overlays */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={
          modalMode === 'create' ? `Order Placement Wizard (Step ${wizardStep} of 3)` : 
          modalMode === 'status' ? 'Update Fulfillment Stage' : 'Order Breakdown Details'
        }
        maxWidth={modalMode === 'create' && wizardStep === 2 ? '800px' : '600px'}
      >
        {renderModalContent()}
      </Modal>

    </div>
  );
}
