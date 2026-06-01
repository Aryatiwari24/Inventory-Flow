import React from 'react';
import { ShieldCheck, UserCircle, Bell, ChevronDown } from 'lucide-react';

export default function Header({ title, userRole, setUserRole }) {
  const roles = ['Business Owner', 'Inventory Manager', 'Sales Executive'];

  return (
    <header className="glass-panel" style={{
      margin: '1.5rem 1.5rem 0 1.5rem',
      padding: '1.25rem 2rem',
      borderRadius: 'var(--border-radius-md)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: '1px solid var(--glass-border)',
      boxShadow: 'var(--glass-shadow)',
    }}>
      {/* Title & Connection Pulse */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
          {title}
        </h1>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.25rem 0.6rem',
          borderRadius: 'var(--border-radius-full)',
          background: 'rgba(34, 197, 94, 0.05)',
          border: '1px solid rgba(34, 197, 94, 0.2)',
          fontSize: '0.75rem',
          color: 'var(--color-success)',
          fontWeight: 500
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-success)',
            boxShadow: '0 0 8px var(--color-success)',
            display: 'inline-block'
          }} />
          Live Connected
        </div>
      </div>

      {/* Role Switcher & User Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        
        {/* Interactive Role Switcher Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={16} color="var(--color-text-secondary)" />
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>View Role:</span>
          <div style={{ position: 'relative' }}>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="form-select"
              style={{
                padding: '0.4rem 2rem 0.4rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                width: '180px',
                borderRadius: 'var(--border-radius-sm)',
                background: 'var(--color-bg-panel)',
                border: '1px solid var(--color-bg-border)',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
                outline: 'none'
              }}
            >
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <ChevronDown size={14} style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-secondary)',
              pointerEvents: 'none'
            }} />
          </div>
        </div>

        {/* Notifications Mock */}
        <div style={{
          position: 'relative',
          cursor: 'pointer',
          color: 'var(--color-text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          border: '1px solid var(--color-bg-border)',
          background: 'rgba(15, 23, 42, 0.4)',
          transition: 'var(--transition-smooth)'
        }}
        className="btn-secondary"
        >
          <Bell size={18} />
          <span style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-danger)',
            boxShadow: '0 0 6px var(--color-danger)'
          }} />
        </div>

        {/* User Profile Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          paddingLeft: '1.25rem',
          borderLeft: '1px solid var(--color-bg-border)'
        }}>
          <UserCircle size={32} color="var(--color-primary)" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              SaaS Admin
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
              admin@inventoryflow.com
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}
