import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { useToast } from '../components/Toast';
import Icon from '../components/Icon';
import Alert from '../components/Alert';

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5; 
const SPACER_HEIGHT = (ITEM_HEIGHT * (VISIBLE_ITEMS - 1)) / 2;

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
// iOS Style Wheel Picker Component
// ==========================================
function WheelPicker({ isOpen, onClose, options, value, onChange, title }) {
  const scrollRef = useRef(null);
  const scrollTimeout = useRef(null);
  const initialScrolled = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      initialScrolled.current = false;
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      return;
    }
    if (initialScrolled.current || !scrollRef.current) return;

    const idx = Math.max(0, options.indexOf(value));
    setActiveIndex(idx);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = idx * ITEM_HEIGHT;
          initialScrolled.current = true;
        }
      });
    });
  }, [isOpen, options, value]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollTop = scrollRef.current.scrollTop;
    let idx = Math.round(scrollTop / ITEM_HEIGHT);
    idx = Math.max(0, Math.min(options.length - 1, idx));

    if (idx !== activeIndex) setActiveIndex(idx);

    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      if (options[idx] !== undefined && options[idx] !== value) {
        onChange(options[idx]);
      }
    }, 100);
  };

  const handleClick = (idx) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: idx * ITEM_HEIGHT, behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ios-picker-overlay" onClick={onClose}>
      <div className="ios-picker-sheet" onClick={e => e.stopPropagation()}>
        <div className="ios-picker-header">
          <button onClick={onClose} className="cancel">বাতিল</button>
          <span>{title}</span>
          <button onClick={onClose} className="done">সম্পন্ন</button>
        </div>
        <div className="ios-picker-wheel-wrapper">
          <div className="ios-picker-highlight"></div>
          <div className="ios-picker-wheel" ref={scrollRef} onScroll={handleScroll}>
            <div style={{ height: `${SPACER_HEIGHT}px`, flexShrink: 0 }} />
            {options.map((opt, i) => (
              <div key={i} className={`ios-picker-item ${activeIndex === i ? 'active' : ''}`} onClick={() => handleClick(i)}>
                {opt}
              </div>
            ))}
            <div style={{ height: `${SPACER_HEIGHT}px`, flexShrink: 0 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Main Membership Component
// ==========================================
export default function Membership() {
  const [form, setForm] = useState({
    name: '', fatherName: '', elaka: '', roadNo: '', 
    houseName: '', bloodGroup: '', whatsapp: '', 
    email: '', password: '', address: '',
  });
  
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [resetCaptcha, setResetCaptcha] = useState(false);

  const [activePicker, setActivePicker] = useState(null); 

  const toast = useToast();
  const nav = useNavigate();

  const elakaOptions = ['বেপারী পাড়া', 'ছোটপুল', 'সিডিএ আ/এ', 'বলির পাড়া', 'বিল্লাপাড়া', 'আবিদর পাড়া', 'নালা পাড়া'];
  const roadOptions = Array.from({ length: 29 }, (_, i) => `রোড নং ${(i + 1).toLocaleString('bn-BD')}`);
  const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const handleElakaChange = (value) => {
    setForm(prev => ({ ...prev, elaka: value, roadNo: value === 'সিডিএ আ/এ' ? prev.roadNo : '' }));
  };

  const getPasswordStrength = () => {
    const pwd = form.password;
    if (!pwd) return { score: 0, text: '', color: 'transparent' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 33, text: 'দুর্বল', color: '#ef4444' };
    if (score <= 4) return { score: 66, text: 'ভালো', color: '#f59e0b' };
    return { score: 100, text: 'স্ট্রং', color: '#10b981' };
  };
  const pwdStrength = getPasswordStrength();

  // বাগ ফিক্স: কন্ডিশনাল ফিল্ডসহ সঠিক প্রোগ্রেস বার
  const calculateProgress = () => {
    let fieldsToTrack = [form.name, form.fatherName, form.elaka, form.bloodGroup, form.whatsapp, form.email, form.password];
    
    // সিডিএ আ/এ হলে রোড নং ট্র্যাক করবে
    if (form.elaka === 'সিডিএ আ/এ') fieldsToTrack.push(form.roadNo);
    // এলাকা সিলেক্ট করলে বাড়ীর নাম ট্র্যাক করবে
    if (form.elaka) fieldsToTrack.push(form.houseName);

    const totalFields = fieldsToTrack.length + 2; // +2 for agreeTerms & captcha
    const filledText = fieldsToTrack.filter(f => f && f.trim().length > 0).length;
    const booleans = (agreeTerms ? 1 : 0) + (captchaVerified ? 1 : 0);
    
    return Math.round(((filledText + booleans) / totalFields) * 100);
  };
  const formProgress = calculateProgress();

  const submit = async (e) => {
    e.preventDefault();
    setAlert(null);

    // বাগ ফিক্স: কাস্টম পিকারের ম্যানুয়াল ভ্যালিডেশন (HTML5 required কাজ করে না)
    if (!form.elaka) {
      setAlert({ type: 'error', msg: 'অনুগ্রহ করে আপনার এলাকা নির্বাচন করুন।' });
      return;
    }
    if (form.elaka === 'সিডিএ আ/এ' && !form.roadNo) {
      setAlert({ type: 'error', msg: 'অনুগ্রহ করে রোড নং নির্বাচন করুন।' });
      return;
    }
    if (!form.houseName) {
      setAlert({ type: 'error', msg: 'অনুগ্রহ করে বাড়ীর নাম বা নম্বর দিন।' });
      return;
    }
    if (!form.bloodGroup) {
      setAlert({ type: 'error', msg: 'অনুগ্রহ করে রক্তের গ্রুপ নির্বাচন করুন।' });
      return;
    }
    if (form.whatsapp.length < 11) {
      setAlert({ type: 'error', msg: 'সঠিক WhatsApp নম্বর দিন (কমপক্ষে ১১ ডিজিট)।' });
      return;
    }
    if (!agreeTerms) {
      setAlert({ type: 'error', msg: 'অনুগ্রহ করে শর্তাবলী মেনে নিন।' });
      return;
    }
    if (!captchaVerified) {
      setAlert({ type: 'error', msg: 'অনুগ্রহ করে ক্যাপচা ভেরিফাই করুন।' });
      return;
    }

    setLoading(true);
    try {
      const r = await api.register(form);
      setAlert({ type: 'success', msg: r.message });
      toast(r.message, 'success');
      setForm({ name: '', fatherName: '', elaka: '', roadNo: '', houseName: '', bloodGroup: '', whatsapp: '', email: '', password: '', address: '' });
      setTimeout(() => nav('/login'), 2000);
    } catch (err) {
      setAlert({ type: 'error', msg: err.response?.data?.message || err.message });
      setCaptchaVerified(false);
      setResetCaptcha(prev => !prev);
    } finally {
      setLoading(false);
    }
  };

  const ch = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');
        
        body { background: #eef2f6; margin: 0; padding: 0; }

        .mobile-app-shell {
          display: flex; flex-direction: column; height: 100dvh; max-width: 600px;
          margin: 0 auto; background: linear-gradient(180deg, #ffffff 0%, #f4f9f4 100%);
          box-shadow: 0 0 50px rgba(0,0,0,0.1); font-family: 'Roboto', 'Hind Siliguri', sans-serif;
          position: relative; overflow: hidden;
        }

        @media (min-width: 601px) {
          .mobile-app-shell { margin: 20px auto; height: 90vh; border-radius: 40px; }
        }

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

        form.app-body { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        
        .app-content { 
          flex: 1; overflow-y: auto; padding: 24px 24px 60px 24px; /* Bottom padding barano hoyeche */
          -webkit-overflow-scrolling: touch; 
        }

        .progress-container {
          height: 8px; background: #e2e8f0; border-radius: 99px;
          margin-bottom: 24px; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
        }
        .progress-bar {
          height: 100%; background: linear-gradient(90deg, #22c55e, #facc15);
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 99px;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
        }

        .gradient-title { 
          font-size: 1.8rem; font-weight: 900; text-align: center; margin-bottom: 8px;
          background: linear-gradient(135deg, #166534, #ca8a04);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; letter-spacing: -1px;
        }
        .subtitle { text-align: center; color: #64748b; font-size: 0.95rem; margin-bottom: 28px; font-weight: 500; }

        .section-divider {
          display: flex; align-items: center; gap: 10px; margin: 26px 0 18px 0;
          color: #166534; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;
        }
        .section-divider::after { content: ''; flex: 1; height: 2px; background: linear-gradient(90deg, rgba(34,197,94,0.2), transparent); border-radius: 2px; }

        .form-stack { display: flex; flex-direction: column; gap: 18px; }
        .form-group { position: relative; }

        .form-group > label { 
          position: absolute; top: 16px; left: 52px; color: #94a3b8; font-size: 0.95rem; font-weight: 500;
          pointer-events: none; transition: all 0.25s ease; z-index: 2;
        }
        
        .input-icon-wrapper input:focus ~ label,
        .input-icon-wrapper input:not(:placeholder-shown) ~ label,
        .picker-input:not(.empty) ~ label {
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

        .input-icon-wrapper input, .input-icon-wrapper textarea, .picker-input { 
          padding: 18px 20px 18px 58px !important; border-radius: 16px; background: #fff !important;
          border: 1.5px solid #e2e8f0; color: var(--text) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
          font-family: inherit; font-size: 1rem; width: 100%; font-weight: 600;
          -webkit-appearance: none; box-shadow: 0 4px 12px rgba(0,0,0,0.02), inset 0 2px 4px rgba(0,0,0,0.02);
        }

        .input-icon-wrapper input:focus, .input-icon-wrapper textarea:focus {
          background: #fff !important; border-color: #22c55e;
          box-shadow: 0 0 0 5px rgba(34,197,94,0.15), 0 10px 25px rgba(34,197,94,0.1); 
          outline: none; transform: translateY(-2px);
        }

        .input-icon-wrapper textarea { padding-top: 18px !important; min-height: 90px; }
        .picker-input { display: flex; align-items: center; cursor: pointer; user-select: none; }
        .picker-input.empty { color: #94a3b8 !important; }

        .pwd-toggle {
          position: absolute; right: 16px; top: 18px; background: #f1f5f9; border: none; 
          width: 34px; height: 34px; border-radius: 8px; color: #64748b; cursor: pointer; 
          z-index: 2; display: flex; align-items: center; justify-content: center; transition: all 0.2s;
        }
        .pwd-toggle:active { background: #e2e8f0; transform: scale(0.95); }
        
        .strength-meter { margin-top: 8px; display: flex; align-items: center; gap: 12px; padding: 0 6px; }
        .strength-bar-bg { flex: 1; height: 6px; background: #e2e8f0; border-radius: 99px; overflow: hidden; }
        .strength-bar { height: 100%; border-radius: 99px; transition: all 0.3s; box-shadow: 0 0 8px currentColor; }
        .strength-text { font-size: 0.75rem; font-weight: 800; min-width: 45px; text-align: right; }

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
          color: #15803d; cursor: grab; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.8);
          z-index: 2; transition: background 0.2s, color 0.2s; touch-action: none; 
        }
        .verified .slider-handle { 
          background: linear-gradient(135deg, #22c55e, #16a34a); color: #fff; cursor: default;
          box-shadow: 0 4px 12px rgba(34,197,94,0.4);
        }

        .custom-checkbox { display: flex; align-items: flex-start; gap: 14px; cursor: pointer; margin-bottom: 15px; }
        .custom-checkbox input { display: none; }
        .checkmark {
          width: 26px; height: 26px; border: 2px solid #cbd5e1; border-radius: 8px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          transition: all 0.2s; margin-top: 1px; background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .custom-checkbox input:checked + .checkmark { 
          background: linear-gradient(135deg, #22c55e, #16a34a); border-color: #16a34a; 
          transform: scale(1.05); box-shadow: 0 4px 10px rgba(34,197,94,0.3);
        }
        .checkmark svg { width: 14px; height: 14px; stroke: #fff; stroke-width: 3; fill: none; opacity: 0; transition: opacity 0.2s; }
        .custom-checkbox input:checked + .checkmark svg { opacity: 1; }
        .custom-checkbox span { color: #475569; font-size: 0.9rem; line-height: 1.5; font-weight: 500; }
        .custom-checkbox a { color: #15803d; font-weight: 800; text-decoration: none; }

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

        .ios-picker-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 9999; display: flex; align-items: flex-end; animation: fadeIn 0.2s ease-out; backdrop-filter: blur(5px); }
        .ios-picker-sheet { background: #fff; color: var(--text); width: 100%; max-width: 600px; margin: 0 auto; border-radius: 24px 24px 0 0; padding: 20px 20px 30px 20px; animation: slideUp 0.3s ease-out; box-shadow: 0 -4px 20px rgba(0,0,0,0.1); }
        .ios-picker-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 15px; border-bottom: 1px solid #eee; font-weight: 600; font-size: 1.05rem; }
        .ios-picker-header button { background: none; border: none; font-size: 1rem; cursor: pointer; font-family: inherit; padding: 5px 10px; border-radius: 6px; }
        .ios-picker-header .cancel { color: var(--muted); }
        .ios-picker-header .done { color: var(--primary-600); font-weight: 700; }
        .ios-picker-wheel-wrapper { position: relative; height: ${ITEM_HEIGHT * VISIBLE_ITEMS}px; overflow: hidden; mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%); }
        .ios-picker-highlight { position: absolute; top: 50%; left: 10px; right: 10px; height: ${ITEM_HEIGHT}px; transform: translateY(-50%); border-top: 1px solid #e0e0e0; border-bottom: 1px solid #e0e0e0; background: rgba(0,0,0,0.02); pointer-events: none; z-index: 2; border-radius: 8px; }
        .ios-picker-wheel { height: 100%; overflow-y: scroll; scroll-snap-type: y mandatory; scrollbar-width: none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; overscroll-behavior: contain; }
        .ios-picker-wheel::-webkit-scrollbar { display: none; }
        .ios-picker-item { height: ${ITEM_HEIGHT}px; display: flex; align-items: center; justify-content: center; scroll-snap-align: center; color: var(--muted); font-size: 1.05rem; font-weight: 500; cursor: pointer; user-select: none; transition: color 0.15s ease, transform 0.15s ease; }
        .ios-picker-item.active { color: var(--primary-800); transform: scale(1.15); font-weight: 700; }
      `}</style>

      <div className="mobile-app-shell">
        
        <div className="app-top-bar">
          <button className="app-back-btn" onClick={() => nav('/')} type="button">
            <Icon name="chevron-left" size={24} />
          </button>
          <h1 className="app-title">রেজিস্ট্রেশন</h1>
        </div>

        <form onSubmit={submit} className="app-body">
          
          <div className="app-content">
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${formProgress}%` }}></div>
            </div>

            <div className="gradient-title">Create Account</div>
            <div className="subtitle">ফুটন্ত ফুল পরিবারে যোগ দিন</div>
            
            {alert && <Alert type={alert.type}>{alert.msg}</Alert>}
            
            <div className="section-divider"><Icon name="user" size={16} /> ব্যক্তিগত তথ্য</div>
            
            <div className="form-stack">
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <div className="input-icon-badge"><Icon name="user" size={18} /></div>
                  <input name="name" placeholder=" " value={form.name} onChange={ch} required />
                  <label>প্রথম নাম *</label>
                </div>
              </div>
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <div className="input-icon-badge"><Icon name="users" size={18} /></div>
                  <input name="fatherName" placeholder=" " value={form.fatherName} onChange={ch} required />
                  <label>পিতার নাম *</label>
                </div>
              </div>
            </div>

            <div className="section-divider"><Icon name="map-pin" size={16} /> ঠিকানা ও যোগাযোগ</div>

            <div className="form-stack">
              <div className="form-group">
                <div className="input-icon-wrapper" onClick={() => setActivePicker('elaka')}>
                  <div className="input-icon-badge"><Icon name="map-pin" size={18} /></div>
                  <div className={`picker-input ${!form.elaka ? 'empty' : ''}`}>
                    {form.elaka || ' '}
                  </div>
                  <label>এলাকা *</label>
                </div>
              </div>

              {form.elaka === 'সিডিএ আ/এ' && (
                <div className="form-group animate-fade-in">
                  <div className="input-icon-wrapper" onClick={() => setActivePicker('roadNo')}>
                    <div className="input-icon-badge"><Icon name="map" size={18} /></div>
                    <div className={`picker-input ${!form.roadNo ? 'empty' : ''}`}>
                      {form.roadNo || ' '}
                    </div>
                    <label>রোড নং *</label>
                  </div>
                </div>
              )}

              {form.elaka !== '' && (
                <div className="form-group animate-fade-in">
                  <div className="input-icon-wrapper">
                    <div className="input-icon-badge"><Icon name="home" size={18} /></div>
                    <input name="houseName" placeholder=" " value={form.houseName} onChange={ch} required />
                    <label>বাড়ীর নাম / নম্বর *</label>
                  </div>
                </div>
              )}

              <div className="form-group">
                <div className="input-icon-wrapper" onClick={() => setActivePicker('bloodGroup')}>
                  <div className="input-icon-badge"><Icon name="activity" size={18} /></div>
                  <div className={`picker-input ${!form.bloodGroup ? 'empty' : ''}`}>
                    {form.bloodGroup || ' '}
                  </div>
                  <label>রক্তের গ্রুপ *</label>
                </div>
              </div>

              <div className="form-group">
                <div className="input-icon-wrapper">
                  <div className="input-icon-badge"><Icon name="phone" size={18} /></div>
                  <input type="tel" inputMode="numeric" name="whatsapp" placeholder=" " value={form.whatsapp} onChange={ch} required />
                  <label>WhatsApp নম্বর *</label>
                </div>
              </div>
            </div>

            <div className="section-divider"><Icon name="shield" size={16} /> অ্যাকাউন্ট ও নিরাপত্তা</div>

            <div className="form-stack">
              <div className="form-group">
                <div className="input-icon-wrapper">
                  <div className="input-icon-badge"><Icon name="mail" size={18} /></div>
                  <input type="email" inputMode="email" name="email" placeholder=" " value={form.email} onChange={ch} required />
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
                {form.password && (
                  <div className="strength-meter animate-fade-in">
                    <div className="strength-bar-bg">
                      <div className="strength-bar" style={{ width: `${pwdStrength.score}%`, background: pwdStrength.color }}></div>
                    </div>
                    <span className="strength-text" style={{ color: pwdStrength.color }}>{pwdStrength.text}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <div className="input-icon-wrapper">
                  <div className="input-icon-badge"><Icon name="clipboard" size={18} /></div>
                  <textarea name="address" placeholder=" " value={form.address} onChange={ch} />
                  <label>বিস্তারিত ঠিকানা (ঐচ্ছিক)</label>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <label className="icon-inline" style={{ color: 'var(--text)', marginBottom: '10px', fontWeight: '800', fontSize: '0.9rem' }}>
                <Icon name="shield" size={18} color="var(--primary-600)" /> বট প্রোটেক্টর
              </label>
              <SliderCaptcha onVerify={setCaptchaVerified} reset={resetCaptcha} />
            </div>

            <label className="custom-checkbox">
              <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
              <div className="checkmark">
                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <span>আমি <a href="#">শর্তাবলী</a> এবং <a href="#">গোপনীয়তা নীতি</a> পড়েছি এবং সম্মত আছি।</span>
            </label>
          </div>

          <div className="sticky-bottom-bar">
            <button type="submit" className="btn-shimmer" disabled={loading}>
              <Icon name="user-plus" size={20} />
              {loading ? 'অপেক্ষারত...' : 'রেজিস্ট্রেশন করুন'}
            </button>
          </div>
        </form>

      </div>

      <WheelPicker isOpen={activePicker === 'elaka'} onClose={() => setActivePicker(null)} options={elakaOptions} value={form.elaka} onChange={handleElakaChange} title="এলাকা নির্বাচন" />
      <WheelPicker isOpen={activePicker === 'roadNo'} onClose={() => setActivePicker(null)} options={roadOptions} value={form.roadNo} onChange={(val) => setForm(prev => ({ ...prev, roadNo: val }))} title="রোড নং নির্বাচন" />
      <WheelPicker isOpen={activePicker === 'bloodGroup'} onClose={() => setActivePicker(null)} options={bloodGroupOptions} value={form.bloodGroup} onChange={(val) => setForm(prev => ({ ...prev, bloodGroup: val }))} title="রক্তের গ্রুপ নির্বাচন" />
    </>
  );
}