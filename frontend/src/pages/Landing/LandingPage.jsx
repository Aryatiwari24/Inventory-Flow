import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Zap, 
  CheckCircle, 
  BarChart3, 
  Server,
  Layers,
  Sparkles
} from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  // Counters states
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);

  useEffect(() => {
    // Run simple count-up logic for statistics on load
    const duration = 1500;
    const intervalTime = 30;
    const totalSteps = duration / intervalTime;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      setProductsCount(Math.min(150, Math.round((150 / totalSteps) * step)));
      setOrdersCount(Math.min(240, Math.round((240 / totalSteps) * step)));
      setCustomersCount(Math.min(85, Math.round((85 / totalSteps) * step)));

      if (step >= totalSteps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      background: 'radial-gradient(circle at 50% -20%, #1e293b 0%, #0f172a 80%)',
      minHeight: '100vh',
      color: 'var(--color-text-primary)',
      fontFamily: 'var(--font-sans)',
      paddingBottom: '4rem'
    }}>
      
      {/* Premium Header/Navigation Bar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 5%',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-info) 100%)',
            width: '36px',
            height: '36px',
            borderRadius: 'var(--border-radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Layers size={18} color="white" />
          </div>
          <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
            Inventory<span style={{ color: 'var(--color-primary)' }}>Flow</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          <a href="#features" style={{ fontWeight: 500 }}>Features</a>
          <a href="#stats" style={{ fontWeight: 500 }}>Metrics</a>
          <a href="#benefits" style={{ fontWeight: 500 }}>Benefits</a>
        </div>

        <button 
          onClick={() => onNavigate('dashboard')} 
          className="btn btn-primary"
          style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
        >
          View Dashboard
        </button>
      </nav>

      {/* Hero Section */}
      <header className="page-content animate-fade-in" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center',
        padding: '5rem 5% 6rem 5%',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Hero Copy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{
            alignSelf: 'flex-start',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--border-radius-full)',
            background: 'rgba(37, 99, 235, 0.1)',
            border: '1px solid rgba(37, 99, 235, 0.2)',
            fontSize: '0.75rem',
            color: 'var(--color-primary)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <Sparkles size={12} />
            Version 1.0 Production Ready
          </div>
          
          <h1 style={{
            fontSize: '3.5rem',
            lineHeight: '1.1',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #ffffff 30%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Smart Inventory Management For Modern Businesses
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.6',
            maxWidth: '540px'
          }}>
            Manage products, customers, orders, and inventory from one powerful dashboard. Cut manual entries, stop inventory overselling, and gain direct business insights.
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              onClick={() => onNavigate('dashboard')} 
              className="btn btn-primary"
              style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem' }}
            >
              Get Started
              <ArrowRight size={16} />
            </button>
            
            <a 
              href="#features" 
              className="btn btn-secondary"
              style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem' }}
            >
              Explore Features
            </a>
          </div>
        </div>

        {/* Hero Interactive Dashboard Mockup */}
        <div className="animate-float" style={{ position: 'relative' }}>
          <div className="glass-panel" style={{
            borderRadius: 'var(--border-radius-lg)',
            padding: '1.5rem',
            background: 'rgba(23, 29, 43, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
          }}>
            {/* Window Dots */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '1.25rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
            </div>

            {/* Dashboard Mockup Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ height: '16px', width: '100px', background: 'var(--color-bg-border)', borderRadius: '4px' }} />
                <span style={{ height: '22px', width: '60px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px' }} />
              </div>

              <div style={{ gridTemplateColumns: 'repeat(3, 1fr)', display: 'grid', gap: '0.75rem' }}>
                {[
                  { label: 'Products', val: '150', color: 'var(--color-primary)' },
                  { label: 'Orders', val: '240', color: 'var(--color-success)' },
                  { label: 'Revenue', val: '₹1.25L', color: 'var(--color-warning)' }
                ].map((w, idx) => (
                  <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-bg-border)' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', display: 'block' }}>{w.label}</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: w.color }}>{w.val}</span>
                  </div>
                ))}
              </div>

              {/* Simulated Chart */}
              <div style={{ height: '100px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', border: '1px solid var(--color-bg-border)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '0.75rem' }}>
                {[30, 45, 60, 50, 75, 90, 85].map((h, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      width: '12px', 
                      height: `${h}%`, 
                      background: 'linear-gradient(to top, var(--color-primary), var(--color-info))', 
                      borderRadius: '3px',
                      opacity: 0.8
                    }} 
                  />
                ))}
              </div>

              {/* Low stock alerts simulator */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '6px', padding: '0.5rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem' }}>
                  <span style={{ color: 'var(--color-danger)', fontWeight: 600 }}>⚠ Stock Alert: 8 products low stock</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>Restock Now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" style={{
        padding: '6rem 5%',
        maxWidth: '1400px',
        margin: '0 auto',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
            Smart Features Built For Growth
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px' }}>
            Everything you need to monitor stock, build customer profiles, and process orders in a highly responsive cloud environment.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.5rem'
        }}>
          {[
            {
              title: "Product Management",
              desc: "Create, update, and manage products, categories, SKU mappings, and price tables easily.",
              icon: Package,
              color: "primary"
            },
            {
              title: "Customer Management",
              desc: "Maintain detailed contact cards, shipping directories, and compile full purchase logs in real time.",
              icon: Users,
              color: "success"
            },
            {
              title: "Order Tracking",
              desc: "Process transactions, monitor shipping stages (Pending to Completed), and print details dynamically.",
              icon: ShoppingCart,
              color: "warning"
            },
            {
              title: "Inventory Monitoring",
              desc: "Real-time stock indicators, automated low-stock warnings, and negative inventory prevention checks.",
              icon: TrendingUp,
              color: "info"
            }
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderRadius: 'var(--border-radius-md)' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--border-radius-sm)',
                  background: `rgba(255, 255, 255, 0.03)`,
                  border: `1px solid var(--color-bg-border)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: i === 0 ? 'var(--color-primary)' : i === 1 ? 'var(--color-success)' : i === 2 ? 'var(--color-warning)' : 'var(--color-info)'
                }}>
                  <Icon size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 600 }}>{f.title}</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Statistics / Counters Section */}
      <section id="stats" style={{
        background: 'rgba(30, 41, 59, 0.4)',
        borderY: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '5rem 5%'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '3rem',
          textAlign: 'center'
        }}>
          {[
            { count: productsCount, label: "Products Managed", suffix: "+", color: "var(--color-primary)" },
            { count: ordersCount, label: "Orders Processed", suffix: "+", color: "var(--color-success)" },
            { count: customersCount, label: "Active Customers", suffix: "", color: "var(--color-warning)" }
          ].map((s, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{
                fontSize: '4.5rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                color: s.color,
                lineHeight: 1
              }}>
                {s.count}{s.suffix}
              </span>
              <span style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" style={{
        padding: '6rem 5%',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
            Engineered For High-Accuracy Operations
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px' }}>
            Why leading businesses transition their manual sheets to InventoryFlow's automated central database.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '2rem'
        }}>
          {[
            {
              title: "Faster Operations",
              desc: "Automated calculations and transactional deduction ensure your stock shifts without complex clerical entries, reducing time by 80%.",
              icon: Zap
            },
            {
              title: "Better Accuracy",
              desc: "Strict SKU checking and database rollbacks block negative numbers and duplicate client directories, ensuring 100% stock precision.",
              icon: CheckCircle
            },
            {
              title: "Business Insights",
              desc: "Deep statistics monitor which items trigger restock warnings and chart weekly gross revenues, enabling predictive purchasing.",
              icon: BarChart3
            },
            {
              title: "Cloud & Container Ready",
              desc: "Built to run seamlessly via Docker and compose configurations, facilitating fast deployments on Render, Vercel, or AWS.",
              icon: Server
            }
          ].map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="glass-panel" style={{
                padding: '2rem',
                borderRadius: 'var(--border-radius-md)',
                display: 'flex',
                gap: '1.5rem',
                alignItems: 'flex-start'
              }}>
                <div style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--border-radius-sm)',
                  background: 'rgba(37, 99, 235, 0.08)',
                  color: 'var(--color-primary)',
                  display: 'flex'
                }}>
                  <Icon size={22} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{b.title}</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call To Action Section */}
      <section style={{
        padding: '6rem 5%',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div className="glass-panel" style={{
          padding: '4rem 2rem',
          borderRadius: 'var(--border-radius-lg)',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
            Ready to manage inventory smarter?
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '550px', fontSize: '1.1rem', margin: '0 auto' }}>
            Empower your business owners, warehouse personnel, and sales agents with the central core of modern ERP operations.
          </p>
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="btn btn-primary"
            style={{ padding: '0.9rem 2.25rem', fontSize: '1rem', marginTop: '1rem' }}
          >
            Start Managing Inventory
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '4rem 5% 2rem 5%',
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '3rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '3rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                background: 'var(--color-primary)',
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Layers size={16} color="white" />
              </div>
              <span style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                Inventory<span style={{ color: 'var(--color-primary)' }}>Flow</span>
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              Centralized stock ledgering, client mapping, and transaction orchestration inside a high-speed cloud container framework.
            </p>
          </div>

          {/* Nav Links */}
          <div style={{ display: 'flex', gap: '4rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-primary)', fontWeight: 700, letterSpacing: '0.05em' }}>
                Platform
              </span>
              <button onClick={() => onNavigate('dashboard')} style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-text-secondary)', padding: 0 }}>Dashboard</button>
              <button onClick={() => onNavigate('products')} style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-text-secondary)', padding: 0 }}>Products</button>
              <button onClick={() => onNavigate('customers')} style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-text-secondary)', padding: 0 }}>Customers</button>
              <button onClick={() => onNavigate('orders')} style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-text-secondary)', padding: 0 }}>Orders</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-primary)', fontWeight: 700, letterSpacing: '0.05em' }}>
                Developer
              </span>
              <a href="#" style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>GitHub Repository</a>
              <a href="http://localhost:8000/api/docs" target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Swagger Documentation</a>
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '2rem'
        }}>
          <span>© 2026 InventoryFlow Inc. All rights reserved.</span>
          <span>Security Validated • Production Grade</span>
        </div>
      </footer>

    </div>
  );
}
