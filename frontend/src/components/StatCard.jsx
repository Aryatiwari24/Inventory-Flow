import React, { useState, useEffect } from 'react';

export default function StatCard({ title, value, icon: Icon, color, trend, trendDirection = 'up', prefix = '' }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Parse numeric value if it is a number or currency string
    const numericStr = String(value).replace(/[^\d.]/g, '');
    const target = parseFloat(numericStr);
    
    if (isNaN(target)) {
      setDisplayValue(value);
      return;
    }

    // Smooth count-up animation over 1.2 seconds (60 frames)
    let start = 0;
    const duration = 1200;
    const frameRate = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Ease out quad formula: f(x) = x(2-x)
      const easeProgress = progress * (2 - progress);
      const current = Math.round(start + easeProgress * (target - start));
      
      setDisplayValue(current);

      if (frame >= totalFrames) {
        clearInterval(timer);
        setDisplayValue(target);
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, [value]);

  // Format currency/number nicely
  const formatVal = () => {
    if (typeof displayValue === 'string') return displayValue;
    
    if (prefix === '₹') {
      return `₹${displayValue.toLocaleString('en-IN')}`;
    }
    return displayValue.toLocaleString();
  };

  const getBorderColor = () => {
    switch (color) {
      case 'primary': return 'rgba(37, 99, 235, 0.4)';
      case 'success': return 'rgba(34, 197, 94, 0.4)';
      case 'warning': return 'rgba(245, 158, 11, 0.4)';
      case 'danger': return 'rgba(239, 68, 68, 0.4)';
      default: return 'var(--glass-border)';
    }
  };

  const getIconBg = () => {
    switch (color) {
      case 'primary': return 'rgba(37, 99, 235, 0.15)';
      case 'success': return 'rgba(34, 197, 94, 0.15)';
      case 'warning': return 'rgba(245, 158, 11, 0.15)';
      case 'danger': return 'rgba(239, 68, 68, 0.15)';
      default: return 'rgba(255, 255, 255, 0.05)';
    }
  };

  const getIconColor = () => {
    switch (color) {
      case 'primary': return 'var(--color-primary)';
      case 'success': return 'var(--color-success)';
      case 'warning': return 'var(--color-warning)';
      case 'danger': return 'var(--color-danger)';
      default: return 'var(--color-text-primary)';
    }
  };

  return (
    <div className="glass-panel" style={{
      padding: '1.75rem',
      borderRadius: 'var(--border-radius-md)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      borderLeft: `4px solid ${getIconColor()}`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Light glow overlay behind card */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: getIconBg(),
        filter: 'blur(30px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
          {title}
        </span>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: 'var(--border-radius-sm)',
          background: getIconBg(),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: getIconColor()
        }}>
          <Icon size={20} />
        </div>
      </div>

      <div style={{ zIndex: 1 }}>
        <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
          {formatVal()}
        </h2>
      </div>

      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', zIndex: 1, fontSize: '0.75rem' }}>
          <span style={{
            fontWeight: 600,
            color: trendDirection === 'up' ? 'var(--color-success)' : 'var(--color-danger)'
          }}>
            {trendDirection === 'up' ? '▲' : '▼'} {trend}
          </span>
          <span style={{ color: 'var(--color-text-muted)' }}>
            vs last month
          </span>
        </div>
      )}
    </div>
  );
}
