import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  IndianRupee, 
  AlertTriangle, 
  TrendingUp, 
  PieChart as PieIcon, 
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart, 
  Cell, 
  Pie, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { api } from '../../services/api';
import StatCard from '../../components/StatCard';

export default function DashboardPage({ userRole, setCurrentPage }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getDashboard();
      setData(res);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to retrieve dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flex: '1', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <RefreshCw size={40} className="animate-float" style={{ color: 'var(--color-primary)' }} />
        <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Loading enterprise ledger statistics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', margin: '2rem auto', maxWidth: '600px', textAlign: 'center', border: '1px solid var(--color-danger)' }}>
        <AlertTriangle size={48} color="var(--color-danger)" style={{ marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>Error Loading Dashboard</h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{error}</p>
        <button onClick={fetchDashboardData} className="btn btn-primary">Retry Fetching Data</button>
      </div>
    );
  }

  const { widgets, charts, stock_alerts } = data;

  // Custom colors for inventory distribution pie chart
  const PIE_COLORS = [
    'var(--color-success)', // In Stock (Emerald)
    'var(--color-warning)', // Low Stock (Amber)
    'var(--color-danger)'   // Out of Stock (Red)
  ];

  // Re-format pie chart data for Recharts
  const pieData = [
    { name: 'In Stock (>20)', value: charts.distribution.in_stock },
    { name: 'Low Stock (1-20)', value: charts.distribution.low_stock },
    { name: 'Out of Stock (0)', value: charts.distribution.out_of_stock }
  ].filter(item => item.value > 0); // Hide empty sectors to look cleaner

  // Custom tooltips styling
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid var(--color-bg-border)',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          boxShadow: 'var(--glass-shadow)',
          fontSize: '0.8rem'
        }}>
          <p style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>{label}</p>
          {payload.map((p, idx) => (
            <p key={idx} style={{ color: p.color }}>
              {p.name}: {p.name.includes('Revenue') ? `₹${p.value.toLocaleString('en-IN')}` : p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 5 Statistics Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '1.25rem'
      }}>
        <StatCard 
          title="Total Products" 
          value={widgets.total_products} 
          icon={Package} 
          color="primary"
          trend="8% new"
          trendDirection="up"
        />
        <StatCard 
          title="Total Customers" 
          value={widgets.total_customers} 
          icon={Users} 
          color="success"
          trend="14% new"
          trendDirection="up"
        />
        <StatCard 
          title="Total Orders" 
          value={widgets.total_orders} 
          icon={ShoppingCart} 
          color="warning"
          trend="24% new"
          trendDirection="up"
        />
        <StatCard 
          title="Total Revenue" 
          value={widgets.total_revenue} 
          icon={IndianRupee} 
          color="primary"
          trend="₹38K gain"
          trendDirection="up"
          prefix="₹"
        />
        <StatCard 
          title="Needs Restocking" 
          value={widgets.low_stock_count} 
          icon={AlertTriangle} 
          color={widgets.low_stock_count > 0 ? "danger" : "success"}
          trend={widgets.low_stock_count > 0 ? "Critically low" : "Perfect stock"}
          trendDirection={widgets.low_stock_count > 0 ? "down" : "up"}
        />
      </div>

      {/* Grid containing charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '1.5rem'
      }}>
        
        {/* Line Chart: Orders & Revenue Trend */}
        <div className="glass-panel" style={{ padding: '1.75rem', height: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="var(--color-primary)" />
              Orders & Revenue Trend
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', background: 'var(--color-bg-panel)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
              Last 7 Days (Continuous)
            </span>
          </div>

          <div style={{ width: '100%', height: '100%', flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.orders_trend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="var(--color-text-muted)" fontSize={11} tickLine={false} />
                <YAxis yAxisId="left" stroke="var(--color-text-muted)" fontSize={11} tickLine={false} label={{ value: 'Revenue (₹)', angle: -90, position: 'insideLeft', style: { fill: 'var(--color-text-muted)', fontSize: 10, dy: 30 } }} />
                <YAxis yAxisId="right" orientation="right" stroke="var(--color-text-muted)" fontSize={11} tickLine={false} label={{ value: 'Orders', angle: 90, position: 'insideRight', style: { fill: 'var(--color-text-muted)', fontSize: 10, dy: -30 } }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }} />
                <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                <Area yAxisId="right" type="monotone" dataKey="orders" name="Orders Volume" stroke="var(--color-success)" fillOpacity={1} fill="url(#colorOrders)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Inventory Distribution */}
        <div className="glass-panel" style={{ padding: '1.75rem', height: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieIcon size={18} color="var(--color-success)" />
            Inventory Status
          </h3>

          <div style={{ width: '100%', height: '100%', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', minHeight: 0 }}>
            {pieData.length === 0 ? (
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>No inventory data available.</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => {
                      let color = PIE_COLORS[0];
                      if (entry.name.includes('Low')) color = PIE_COLORS[1];
                      if (entry.name.includes('Out')) color = PIE_COLORS[2];
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Pie>
                  <Tooltip wrapperStyle={{ fontSize: '0.8rem' }} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }} />
                </PieChart>
              </ResponsiveContainer>
            )}

            {/* Custom text layer inside the hollow ring */}
            <div style={{
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none'
            }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>
                Total Items
              </span>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                {widgets.total_products}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Grid containing Best-Sellers & Stock Alerts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        
        {/* Bar Chart: Best Selling Products */}
        <div className="glass-panel" style={{ padding: '1.75rem', minHeight: '350px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={18} color="var(--color-warning)" />
            Top Selling Products
          </h3>

          <div style={{ width: '100%', height: '100%', flex: 1, minHeight: 0 }}>
            {charts.top_products.length === 0 ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>No sales history available to chart yet.</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.top_products} layout="vertical" margin={{ top: 5, right: 10, left: 15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" stroke="var(--color-text-muted)" fontSize={11} tickLine={false} />
                  <YAxis dataKey="name" type="category" stroke="var(--color-text-primary)" fontSize={10} width={120} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
                  <Bar dataKey="total_sold" name="Quantity Sold" fill="var(--color-primary)" radius={[0, 4, 4, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* List Panel: Low Stock Restock Feeds */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} color="var(--color-danger)" />
              Restocking Monitor
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)', fontWeight: 600 }}>
              {widgets.low_stock_count} low items
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', flex: 1, maxHeight: '250px' }}>
            {stock_alerts.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-success)', fontWeight: 500 }}>
                  ✔ All products are well stocked!
                </span>
              </div>
            ) : (
              stock_alerts.map((prod) => (
                <div key={prod.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(15, 23, 42, 0.4)',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--color-bg-border)',
                  borderLeft: prod.stock_quantity === 0 ? '3px solid var(--color-danger)' : '3px solid var(--color-warning)'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{prod.name}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>SKU: {prod.sku} • {prod.category}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className={`badge ${prod.stock_quantity === 0 ? 'badge-danger' : 'badge-warning'}`}>
                      {prod.stock_quantity === 0 ? 'Out of Stock' : `${prod.stock_quantity} remaining`}
                    </span>
                    
                    {userRole !== 'Sales Executive' && (
                      <button 
                        onClick={() => setCurrentPage('products')}
                        className="btn btn-secondary" 
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.7rem' }}
                      >
                        Restock
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
