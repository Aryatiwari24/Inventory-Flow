import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = '600px' }) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: maxWidth,
          background: 'rgba(23, 29, 43, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div className="modal-header">
          <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
            {title}
          </h2>
          <button onClick={onClose} className="modal-close">
            <X size={18} />
          </button>
        </div>
        <div style={{ maxHeight: 'calc(80vh - 100px)', overflowY: 'auto', paddingRight: '0.25rem' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
