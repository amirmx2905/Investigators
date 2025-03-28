import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

function FormModal({ isOpen, onClose, title, children, centerContent = false }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Añadir keydown listener para cerrar con Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && onClose) {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop con blur */}
      <div 
        className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="bg-gray-800 border border-blue-500/30 rounded-lg shadow-lg w-full max-w-lg mx-4 z-10 overflow-hidden transform transition-all duration-300 animate-fadeIn">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/90">
          <h3 className="text-xl font-semibold text-blue-400">{title}</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="cursor-pointer text-gray-400 hover:text-white transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          )}
        </div>
        
        {/* Body */}
        <div className={`p-4 max-h-[70vh] overflow-y-auto ${centerContent ? 'flex justify-center' : ''}`}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default FormModal;