import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Layers, 
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowLeftRight
} from 'lucide-react';

export default function Sidebar({ currentPage, setCurrentPage, userRole }) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, roles: ['Business Owner', 'Inventory Manager', 'Sales Executive'] },
    { id: 'products', name: 'Products', icon: Package, roles: ['Business Owner', 'Inventory Manager', 'Sales Executive'] },
    { id: 'customers', name: 'Customers', icon: Users, roles: ['Business Owner', 'Sales Executive'] },
    { id: 'orders', name: 'Orders', icon: ShoppingCart, roles: ['Business Owner', 'Sales Executive'] }
  ];

  // Filter menu items by user role permissions
  const filteredItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="glass-panel sidebar-nav" style={{
      width: '280px',
      margin: '1.5rem 0 1.5rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 3rem)',
      borderRadius: 'var(--border-radius-lg)',
      padding: '2rem 1rem'
    }}>
      {/* Brand Header */}
      <div className="sidebar-brand" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0 0.5rem 2rem 0.5rem',
        borderBottom: '1px solid var(--color-bg-border)',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-info) 100%)',
          width: '40px',
          height: '40px',
          borderRadius: 'var(--border-radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px var(--color-primary-glow)'
        }}>
          <Layers size={22} color="white" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Inventory<span style={{ color: 'var(--color-primary)' }}>Flow</span>
          </h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            Enterprise ERP
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.85rem 1rem',
                width: '100%',
                background: isActive ? 'linear-gradient(135deg, var(--color-primary-glow) 0%, rgba(37, 99, 235, 0.03) 100%)' : 'transparent',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                border: 'none',
                borderRadius: 'var(--border-radius-sm)',
                textAlign: 'left',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
                borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                transition: 'var(--transition-smooth)'
              }}
            >
              <Icon size={18} style={{ transform: isActive ? 'scale(1.1)' : 'none', transition: 'var(--transition-smooth)' }} />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* User Role Badge & Landing Link */}
      <div style={{
        marginTop: 'auto',
        padding: '1rem',
        borderRadius: 'var(--border-radius-md)',
        background: 'rgba(15, 23, 42, 0.4)',
        border: '1px solid var(--color-bg-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Active Session Role
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={14} color={
              userRole === 'Business Owner' ? 'var(--color-warning)' :
              userRole === 'Inventory Manager' ? 'var(--color-info)' : 'var(--color-success)'
            } />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {userRole}
            </span>
          </div>
        </div>

        <button 
          onClick={() => setCurrentPage('landing')}
          className="btn btn-secondary" 
          style={{ 
            width: '100%', 
            padding: '0.5rem', 
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem'
          }}
        >
          <ArrowLeftRight size={12} />
          Exit to Landing Page
        </button>
      </div>
    </aside>
  );
}
