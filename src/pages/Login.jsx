import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import Icon from '../components/Icon';
import Alert from '../components/Alert';

// ==========================================
// Advanced Slider CAPTCHA Component
// ==========================================
function SliderCaptcha({ onVerify, reset }) {
  const [isVerified, setIsVerified] = useState(false);
  const [progress, setProgress] = useState(0);
  const trackRef = useRef(null);
  const handleRef = useRef(null);
  const isDragging = useRef(false); 
  const progressRef = useRef(0);

  useEffect(() => {
    if (reset) {
      setIsVerified(false);
      setProgress(0);
      progressRef.current = 0;
    }
  }, [reset]);

  const handlePointerDown = (e) => {
    if (isVerified) return;
    isDragging.current = true;
    if (handleRef.current) {
      handleRef.current.setPointerCapture(e.pointerId);
    }
    updateProgress(e.clientX);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current || isVerified) return;
    updateProgress(e.clientX);
  };

  const handlePointerUp = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (handleRef.current && handleRef.current.hasPointerCapture(e.pointerId)) {
      handleRef.current.releasePointerCapture(e.pointerId);
    }
    if (progressRef.current < 95) {
      setProgress(0);
      progressRef.current = 0;
    }
  };

  const updateProgress = (clientX) => {
    if (isVerified || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const handleWidth = 44; 
    const maxLeft = rect.width - handleWidth;
    
    let x = clientX - rect.left;
    let left = Math.max(0, Math.min(x - (handleWidth / 2), maxLeft));
    
    const newProgress = (left / maxLeft) * 100;
    setProgress(newProgress);
    progressRef.current = newProgress;

    if (newProgress >= 95) {
      setIsVerified(true);
      setProgress(100);
      progressRef.current = 100;
      onVerify(true);
    }
  };

  return (
    <div className={`slider-captcha-wrapper ${isVerified ? 'verified' : ''}`}>
      <div className="slider-track" ref={trackRef}>
        <div className="slider-fill" style={{ width: `${progress}%` }}></div>
        <span className="slider-text">
          {isVerified ? 'ভেরিফাইড সফল' : 'ডান দিকে স্লাইড করুন →'}
        </span>
        <div 
          className="slider-handle" 
          ref={handleRef}
          style={{ left: `calc(${progress}% - ${progress * 0.44}px)` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {isVerified ? <Icon name="check" size={22} /> : <Icon name="chevron-right" size={22} />}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Main Login Component
// ==========================================
export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [resetCaptcha, setResetCaptcha] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const nav = useNavigate();

  const ch = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setAlert(null);

    // বট প্রোটেক্টর চেক
    if (!captchaVerified) {
      setAlert({ type: 'error', msg: 'অনুগ্রহ করে ক্যাপচা ভেরিফাই করুন।' });
      return;
    }

    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast(`স্বাগতম, ${user.name}!`, 'success');
      nav(user.role === 'admin' ? '/admin' : '/member');
    } catch (err) {
      setAlert({ type: 'error', msg: err.response?.data?.message || err.message });
      setCaptchaVerified(false);
      setResetCaptcha(prev => !prev); // ভুল হলে ক্যাপচা রিসেট
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');
        
        body { background: #eef2f6; margin: 0; padding: 0; }

        /* === Mobile App Wrapper === */
        .mobile-app-shell {
          display: flex; flex-direction: column; height: 100dvh; max-width: 600px;
          margin: 0 auto; background: linear-gradient(180deg, #ffffff 0%, #f4f9f4 100%);
          box-shadow: 0 0 50px rgba(0,0,0,0.1); font-family: 'Roboto', 'Hind Siliguri', sans-serif;
          position: relative; overflow: hidden;
        }

        @media (min-width: 601px) {
          .mobile-app-shell { margin: 20px auto; height: 90vh; border-radius: 40px; }
        }

        /* Top App Bar */
        .app-top-bar {
          padding: 15px 20px; display: flex; align-items: center; justify-content: center;
          position: relative; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px); border-bottom: 1px solid rgba(0,0,0,0.05); z-index: 10;
        }
        .app-back-btn {
          position: absolute; left: 20px; top: 50%; transform: translateY(-50%);
          background: #fff; border: 1px solid #e2e8f0; width: 42px; height: 42px;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--text); transition: all 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        .app-back-btn:active { transform: translateY(-50%) scale(0.95); background: #f1f5f9; }
        .app-title { font-size: 1.15rem; font-weight: 800; color: var(--text); margin: 0; letter-spacing: -0.5px; }

        /* Form Body */
        form.app-body { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .app-content { flex: 1; overflow-y: auto; padding: 24px 24px 60px 24px; -webkit-overflow-scrolling: touch; }

        .gradient-title { 
          font-size: 1.8rem; font-weight: 900; text-align: center; margin-bottom: 8px;
          background: linear-gradient(135deg, #166534, #ca8a04);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; letter-spacing: -1px;
        }
        .subtitle { text-align: center; color: #64748b; font-size: 0.95rem; margin-bottom: 28px; font-weight: 500; }

        /* === Inputs & Floating Labels === */
        .form-stack { display: flex; flex-direction: column; gap: 18px; margin-top: 20px; }
        .form-group { position: relative; }

        .form-group > label { 
          position: absolute; top: 16px; left: 52px; color: #94a3b8; font-size: 0.95rem; font-weight: 500;
          pointer-events: none; transition: all 0.25s ease; z-index: 2;
        }
        
        .input-icon-wrapper input:focus ~ label,
        .input-icon-wrapper input:not(:placeholder-shown) ~ label {
          top: -9px; left: 44px; font-size: 0.75rem; font-weight: 800;
          color: #15803d; background: #fff; border-radius: 4px; padding: 0 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }

        .input-icon-badge {
          position: absolute; top: 10px; left: 10px; width: 36px; height: 36px;
          background: linear-gradient(135deg, #dcfce7, #bbf7d0); border-radius: 10px; 
          display: flex; align-items: center; justify-content: center; color: #15803d; 
          z-index: 2; transition: all 0.3s; box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .input-icon-wrapper:focus-within .input-icon-badge {
          background: linear-gradient(135deg, #22c55e, #16a34a); color: #fff;
          transform: scale(1.05); box-shadow: 0 4px 10px rgba(34,197,94,0.4);
        }

        .input-icon-wrapper { position: relative; width: 100%; }

        .input-icon-wrapper input { 
          padding: 18px 20px 18px 58px !important; border-radius: 16px; background: #fff !important;
          border: 1.5px solid #e2e8f0; color: var(--text) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
          font-family: inherit; font-size: 1rem; width: 100%; font-weight: 600;
          -webkit-appearance: none; box-shadow: 0 4px 12px rgba(0,0,0,0.02), inset 0 2px 4px rgba(0,0,0,0.02);
        }

        .input-icon-wrapper input:focus {
          background: #fff !important; border-color: #22c55e;
          box-shadow: 0 0 0 5px rgba(34,197,94,0.15), 0 10px 25px rgba(34,197,94,0.1); 
          outline: none; transform: translateY(-2px);
        }

        .pwd-toggle {
          position: absolute; right: 16px; top: 18px; background: #f1f5f9; border: none; 
          width: 34px; height: 34px; border-radius: 8px; color: #64748b; cursor: pointer; 
          z-index: 2; display: flex; align-items: center; justify-content: center; transition: all 0.2s;
        }
        .pwd-toggle:active { background: #e2e8f0; transform: scale(0.95); }

        /* === Slider CAPTCHA === */
        .slider-captcha-wrapper {
          margin: 12px 0 24px 0; padding: 5px; background: #fff; border-radius: 16px;
          border: 2px solid #e2e8f0; transition: all 0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.03);
        }
        .slider-captcha-wrapper.verified { border-color: #22c55e; background: #f0fdf4; box-shadow: 0 0 20px rgba(34,197,94,0.2); }
        
        .slider-track {
          position: relative; height: 54px; background: #f8fafc;
          border-radius: 12px; overflow: hidden; display: flex; align-items: center; justify-content: center;
        }
        .slider-fill {
          position: absolute; top: 0; left: 0; bottom: 0;
          background: linear-gradient(90deg, rgba(34,197,94,0.2), rgba(34,197,94,0.6));
          border-radius: 12px; transition: width 0.1s linear;
        }
        .slider-text {
          position: relative; z-index: 1; color: #64748b; font-size: 0.95rem; font-weight: 700;
          user-select: none; pointer-events: none; letter-spacing: 0.5px;
        }
        .verified .slider-text { color: #15803d; font-weight: 800; }
        
        .slider-handle {
          position: absolute; top: 5px; width: 44px; height: 44px;
          background: linear-gradient(135deg, #fff, #f1f5f9); border-radius: 10px; 
          display: flex; align-items: center; justify-content: center;
          color: #15803d; cursor: grab; box-shadow: 0 4px 12px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.8);
          z-index: 2; transition: background 0.2s, color 0.2s; touch-action: none; 
        }
        .verified .slider-handle { 
          background: linear-gradient(135deg, #22c55e, #16a34a); color: #fff; cursor: default;
          box-shadow: 0 4px 12px rgba(34,197,94,0.4);
        }

        /* Sticky Bottom Bar */
        .sticky-bottom-bar {
          padding: 15px 24px 25px 24px; background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px);
          border-top: 1px solid rgba(0,0,0,0.05); z-index: 100;
        }

        .btn-shimmer {
          position: relative; background: linear-gradient(135deg, #22c55e, #15803d);
          color: #fff; font-weight: 900; font-size: 1.1rem; padding: 18px 20px;
          border-radius: 16px; border: none; cursor: pointer; overflow: hidden;
          transition: all 0.2s ease; box-shadow: 0 10px 25px rgba(34,197,94,0.4), 0 0 0 0 rgba(34,197,94,0.5);
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: 100%; letter-spacing: 0.5px; animation: pulseGlow 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
        }
        
        @keyframes pulseGlow {
          0% { box-shadow: 0 10px 25px rgba(34,197,94,0.4), 0 0 0 0 rgba(34,197,94,0.4); }
          70% { box-shadow: 0 10px 25px rgba(34,197,94,0.4), 0 0 0 15px rgba(34,197,94,0); }
          100% { box-shadow: 0 10px 25px rgba(34,197,94,0.4), 0 0 0 0 rgba(34,197,94,0); }
        }

        .btn-shimmer:active:not(:disabled) { transform: scale(0.97); }
        .btn-shimmer::after {
          content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%);
          transform: skewX(-25deg); animation: shimmer 3s infinite;
        }
        @keyframes shimmer { 0% { left: -100%; } 20% { left: 200%; } 100% { left: 200%; } }

        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="mobile-app-shell">
        
        <div className="app-top-bar">
          <button className="app-back-btn" onClick={() => nav('/')} type="button">
            <Icon name="chevron-left" size={24} />
          </button>
          <h1 className="app-title">লগইন</h1>
        </div>

        <form onSubmit={submit} className="app-body">
          
          <div className="app-content">
            <div className="gradient-title">Welcome Back</div>
            <div className="subtitle">আপনার অ্যাকাউন্টে লগইন করুন</div>
            
            {alert && <Alert type={alert.type}>{alert.msg}</Alert>}
            
            <div className="form-stack">
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <div className="input-icon-badge"><Icon name="mail" size={18} /></div>
                  <input 
                    type="email" 
                    inputMode="email" 
                    name="email" 
                    placeholder=" " 
                    value={form.email} 
                    onChange={ch} 
                    required 
                  />
                  <label>ইমেইল *</label>
                </div>
              </div>

              <div className="form-group">
                <div className="input-icon-wrapper">
                  <div className="input-icon-badge"><Icon name="lock" size={18} /></div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    placeholder=" " 
                    value={form.password} 
                    onChange={ch} 
                    required 
                    minLength={6} 
                  />
                  <label>পাসওয়ার্ড *</label>
                  <button type="button" className="pwd-toggle" onClick={() => setShowPassword(!showPassword)}>
                    <Icon name={showPassword ? "eye-off" : "eye"} size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <label className="icon-inline" style={{ color: 'var(--text)', marginBottom: '10px', fontWeight: '800', fontSize: '0.9rem' }}>
                <Icon name="shield" size={18} color="var(--primary-600)" /> বট প্রোটেক্টর
              </label>
              <SliderCaptcha onVerify={setCaptchaVerified} reset={resetCaptcha} />
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>
                নতুন সদস্য? <Link to="/membership" style={{ color: '#15803d', fontWeight: 'bold', textDecoration: 'none' }}>রেজিস্ট্রেশন করুন</Link>
              </p>
            </div>
          </div>

          <div className="sticky-bottom-bar">
            <button type="submit" className="btn-shimmer" disabled={loading}>
              <Icon name="log-in" size={20} />
              {loading ? 'অপেক্ষারত...' : 'লগইন করুন'}
            </button>
          </div>
        </form>

      </div>
    </>
  );
}