import { useState } from 'react';
import { api } from '../api';
import { useToast } from '../components/Toast';
import Icon from '../components/Icon';
import Alert from '../components/Alert';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      const r = await api.sendContact(form);
      setAlert({ type: 'success', msg: r.message });
      toast(r.message, 'success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setAlert({ type: 'error', msg: 'সমস্যা হয়েছে, আবার চেষ্টা করুন' });
    } finally {
      setLoading(false);
    }
  };

  const ch = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const cards = [
    { icon: 'map-pin', color: 'red', title: 'অফিস', desc: 'আগ্রাবাদ, ডাবলমুরিং, চট্টগ্রাম' },
    { icon: 'mail', color: 'blue', title: 'ইমেইল', desc: 'info@futontaphul.org' },
    { icon: 'phone', color: 'orange', title: 'ফোন', desc: '+880 1XXX-XXXXXX' },
    { icon: 'facebook', color: 'purple', title: 'ফেসবুক', desc: '"ফুটন্ত ফুল, ডাবলমুরিং জোন"' },
  ];

  return (
    <>
      {/* ==========================================
          CONTACT PAGE HIGHLIGHTED CSS 
          ========================================== */}
      <style>{`
        .contact-page {
          position: relative;
          padding-top: 50px;
          padding-bottom: 80px;
          overflow: hidden;
          min-height: 80vh;
        }

        /* Background Blobs */
        .contact-blob {
          position: absolute; width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(76,175,80,0.12) 0%, transparent 70%);
          border-radius: 50%; z-index: 0; pointer-events: none;
        }
        .contact-blob-1 { top: -50px; right: -100px; }
        .contact-blob-2 { bottom: 10%; left: -100px; background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%); }

        /* Header */
        .contact-header {
          text-align: center;
          margin-bottom: 50px;
          position: relative;
          z-index: 1;
          animation: fadeUp 0.6s ease-out;
        }
        .contact-header-badge {
          display: inline-flex; align-items: center; gap: 6px; padding: 6px 16px;
          background: rgba(255,255,255,0.6); backdrop-filter: blur(10px);
          border: 1px solid rgba(76,175,80,0.2); border-radius: 99px;
          color: var(--primary-700); font-size: 0.85rem; font-weight: 700; text-transform: uppercase;
          margin-bottom: 16px;
        }
        .contact-header h1 {
          font-size: clamp(2.2rem, 5vw, 3rem);
          font-weight: 900;
          background: linear-gradient(135deg, var(--primary-800), var(--gold), var(--accent-600));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }
        .contact-header p {
          color: var(--text-secondary);
          font-size: 1.1rem;
          font-weight: 500;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Info Cards Grid */
        .contact-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          margin-bottom: 60px;
          position: relative;
          z-index: 1;
        }
        .contact-info-card {
          background: var(--glass-bg);
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
          border: 1px solid var(--glass-border);
          border-radius: var(--r-xl);
          box-shadow: var(--glass-shadow);
          padding: 30px 24px;
          text-align: center;
          transition: all 0.4s var(--t-spring);
          animation: fadeUp 0.6s ease-out both;
        }
        .contact-info-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--glass-shadow-hover);
          background: var(--glass-bg-hover);
          border-color: #fff;
        }

        /* Icon Badges */
        .contact-icon-badge {
          width: 64px; height: 64px; border-radius: 16px;
          display: grid; place-items: center; margin: 0 auto 20px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.06);
          transition: transform 0.4s var(--t-spring);
        }
        .contact-info-card:hover .contact-icon-badge {
          transform: scale(1.1) rotate(5deg);
        }
        .c-icon-red { background: linear-gradient(135deg, #fee2e2, #fecaca); color: #b91c1c; }
        .c-icon-blue { background: linear-gradient(135deg, #dbeafe, #bfdbfe); color: #1e40af; }
        .c-icon-orange { background: linear-gradient(135deg, #fef3c7, #fed7aa); color: #c2410c; }
        .c-icon-purple { background: linear-gradient(135deg, #f3e8ff, #e9d5ff); color: #6b21a8; }

        .contact-info-card h3 { font-size: 1.15rem; font-weight: 800; color: var(--text); margin-bottom: 8px; }
        .contact-info-card p { color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5; }

        /* Form Container */
        .contact-form-wrapper {
          max-width: 700px;
          margin: 0 auto;
          background: var(--glass-bg);
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
          border: 1px solid var(--glass-border);
          border-radius: var(--r-xl);
          box-shadow: var(--glass-shadow);
          padding: 45px;
          position: relative;
          z-index: 1;
          animation: fadeUp 0.8s ease-out 0.2s both;
        }
        .contact-form-title {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          font-size: 1.5rem; font-weight: 800; color: var(--primary-dark); margin-bottom: 30px;
        }

        /* Floating Labels & Inputs */
        .c-form-group { position: relative; margin-bottom: 24px; }
        .c-form-group > label {
          position: absolute; top: 16px; left: 48px; color: #94a3b8;
          font-size: 0.95rem; font-weight: 500; pointer-events: none;
          transition: all 0.25s ease; z-index: 2;
        }
        .c-input-icon {
          position: absolute; top: 16px; left: 16px; color: var(--primary-400);
          display: flex; align-items: center; justify-content: center; pointer-events: none;
          transition: color 0.3s; z-index: 2;
        }
        
        .c-input-wrapper input:focus ~ label,
        .c-input-wrapper input:not(:placeholder-shown) ~ label,
        .c-input-wrapper textarea:focus ~ label,
        .c-input-wrapper textarea:not(:placeholder-shown) ~ label {
          top: -9px; left: 40px; font-size: 0.75rem; font-weight: 800;
          color: #15803d; background: #fff; border-radius: 4px; padding: 0 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }

        .c-input-wrapper { position: relative; width: 100%; }
        .c-input-wrapper input, .c-input-wrapper textarea {
          width: 100%; padding: 16px 20px 16px 48px;
          border-radius: var(--r-md); background: #fff;
          border: 1.5px solid #e2e8f0; color: var(--text);
          font-size: 1rem; font-weight: 500; font-family: inherit;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }
        .c-input-wrapper textarea {
          padding-top: 16px; min-height: 120px; resize: vertical;
        }
        .c-input-wrapper input:focus, .c-input-wrapper textarea:focus {
          border-color: #22c55e; outline: none; transform: translateY(-2px);
          box-shadow: 0 0 0 4px rgba(34,197,94,0.15), 0 10px 25px rgba(34,197,94,0.1);
        }
        .c-input-wrapper input:focus ~ .c-input-icon,
        .c-input-wrapper textarea:focus ~ .c-input-icon {
          color: #15803d; transform: scale(1.1);
        }

        /* Submit Button */
        .c-btn-submit {
          width: 100%; padding: 16px 20px; border-radius: var(--r-md);
          background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
          color: #fff; font-size: 1.05rem; font-weight: 800; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 10px 25px rgba(34,197,94,0.3); transition: all 0.3s;
        }
        .c-btn-submit:hover:not(:disabled) {
          transform: translateY(-3px); box-shadow: 0 15px 30px rgba(34,197,94,0.4);
        }
        .c-btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

        /* Animations */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .contact-info-grid { grid-template-columns: 1fr 1fr; }
          .contact-form-wrapper { padding: 30px 20px; }
        }
        @media (max-width: 480px) {
          .contact-info-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="container contact-page">
        {/* Background Blobs */}
        <div className="contact-blob contact-blob-1"></div>
        <div className="contact-blob contact-blob-2"></div>

        {/* 1. Header */}
        <div className="contact-header">
          <div className="contact-header-badge">
            <Icon name="phone" size={14} /> যোগাযোগ
          </div>
          <h1>আমাদের সাথে যোগাযোগ করুন</h1>
          <p>যেকোনো জিজ্ঞাসা বা পরামর্শের জন্য আমাদের সাথে যোগাযোগ করুন। আমরা আপনার কথা শুনতে সবসময় প্রস্তুত।</p>
        </div>

        {/* 2. Info Cards */}
        <div className="contact-info-grid">
          {cards.map((c, i) => (
            <div className="contact-info-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`contact-icon-badge c-icon-${c.color}`}>
                <Icon name={c.icon} size={28} strokeWidth={1.8} />
              </div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>

        {/* 3. Contact Form */}
        <div className="contact-form-wrapper">
          <h2 className="contact-form-title">
            <Icon name="send" size={24} color="var(--primary-600)" /> বার্তা পাঠান
          </h2>
          
          {alert && <Alert type={alert.type}>{alert.msg}</Alert>}
          
          <form onSubmit={submit}>
            <div className="c-form-group">
              <div className="c-input-wrapper">
                <span className="c-input-icon"><Icon name="user" size={20} /></span>
                <input name="name" placeholder=" " value={form.name} onChange={ch} required />
                <label>আপনার নাম</label>
              </div>
            </div>

            <div className="c-form-group">
              <div className="c-input-wrapper">
                <span className="c-input-icon"><Icon name="mail" size={20} /></span>
                <input type="email" name="email" placeholder=" " value={form.email} onChange={ch} required />
                <label>ইমেইল</label>
              </div>
            </div>

            <div className="c-form-group">
              <div className="c-input-wrapper">
                <span className="c-input-icon" style={{ top: '16px' }}><Icon name="clipboard" size={20} /></span>
                <textarea name="message" placeholder=" " value={form.message} onChange={ch} required />
                <label style={{ top: '16px' }}>বার্তা</label>
              </div>
            </div>

            <button type="submit" className="c-btn-submit" disabled={loading}>
              <Icon name="send" size={20} />
              {loading ? 'পাঠানো হচ্ছে...' : 'বার্তা পাঠান'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}