import { createContext, useContext, useState, useCallback } from 'react';
import Icon from './Icon';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => (t.id === id ? { ...t, removing: true } : t)));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 250);
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.map(t => (t.id === id ? { ...t, removing: true } : t)));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 250);
  };

  const icons = {
    success: <Icon name="check-circle" size={18} />,
    error: <Icon name="alert-circle" size={18} />,
    warning: <Icon name="alert-circle" size={18} />,
    info: <Icon name="info" size={18} />,
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type} ${t.removing ? 'removing' : ''}`}>
            <span className="toast-icon">{icons[t.type]}</span>
            <span>{t.message}</span>
            <button className="toast-close" onClick={() => removeToast(t.id)} aria-label="close">
              <Icon name="x" size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx.toast;
};