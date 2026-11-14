import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';
// Logo কম্পোনেন্টের বদলে সরাসরি img ট্যাগ ব্যবহার করছি যাতে ওভারল্যাপ ঠিকমতো কাজ করে
import Logo from './Logo'; 

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  useEffect(() => { setOpen(false); }, [pathname]);

  const links = [
    { to: '/', label: 'হোম' },
    { to: '/about', label: 'আমাদের সম্পর্কে' },
    { to: '/activities', label: 'কার্যক্রম' },
    { to: '/gallery', label: 'গ্যালারি' },
    { to: '/membership', label: 'সদস্যপদ' },
    { to: '/contact', label: 'যোগাযোগ' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        
        {/* Overlapping Logo */}
        <Link to="/" className="nav-logo-wrapper">
          <Logo size={90} /> 
        </Link>

        {/* Mobile Brand Text */}
        <Link to="/" className="nav-brand-text">
          ফুটন্ত ফুল
        </Link>
        
        <button className="nav-toggle" onClick={() => setOpen(!open)}>
          <Icon name={open ? 'x' : 'menu'} size={24} />
        </button>
        
        {/* Nav Links */}
        <ul className={`nav-links ${open ? 'open' : ''}`}>
          {links.map(l => (
            <li key={l.to}>
              <Link to={l.to} className={pathname === l.to ? 'active' : ''}>{l.label}</Link>
            </li>
          ))}
          {user ? (
            <>
              <li>
                <Link to={user.role === 'admin' ? '/admin' : '/member'}>
                  <span className="nav-avatar" style={{width: 28, height: 28, background: 'var(--primary-500)', color: 'white', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '.8rem'}}>{user.name.charAt(0)}</span>
                  {user.name.split(' ')[0]}
                </Link>
              </li>
              <li>
                <button onClick={logout} className="icon-inline">
                  <Icon name="log-out" size={16} /> লগআউট
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="btn btn-primary btn-sm icon-inline">
                <Icon name="log-in" size={16} /> লগইন
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}