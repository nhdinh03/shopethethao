import { useState, useEffect, useCallback } from 'react';
import '../styles/Toast.scss';

let toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState([]);
  
  const showToast = useCallback((type, message) => {
    const id = toastId++;
    
    setToasts(current => [
      ...current,
      {
        id,
        type,
        message,
      },
    ]);
    
    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      setToasts(current => current.filter(toast => toast.id !== id));
    }, 3000);
  }, []);
  
  // Create Toast Container if it doesn't exist
  useEffect(() => {
    let toastContainer = document.getElementById('toast-container');
    
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      document.body.appendChild(toastContainer);
    }
    
    // Render toasts
    const renderToasts = () => {
      if (toastContainer) {
        toastContainer.innerHTML = '';
        toasts.forEach(toast => {
          const toastElement = document.createElement('div');
          toastElement.className = `toast toast-${toast.type}`;
          toastElement.textContent = toast.message;
          toastContainer.appendChild(toastElement);

          // Animation
          setTimeout(() => {
            toastElement.classList.add('show');
          }, 10);
        });
      }
    };
    
    renderToasts();
    
    // Cleanup
    return () => {
      if (toastContainer && toastContainer.parentNode) {
        toastContainer.parentNode.removeChild(toastContainer);
      }
    };
  }, [toasts]);
  
  return { showToast };
};
