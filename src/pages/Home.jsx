import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useToast } from '../components/Toast';
import Icon from '../components/Icon';
import Skeleton from '../components/Skeleton';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [stats, setStats] = useState({ members: '...', events: '...', yearsRunning: '...', benefited: '...', divisions: '...' });
  const [reviews, setReviews] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reviewForm, setReviewForm] = useState({ name: '', role: '', text: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    Promise.all([
      api.getEvents(), api.getGallery(), api.getStats(), api.getReviews(), api.getNotices()
    ])
      .then(([ev, ga, st, rv, nt]) => { 
        setEvents(ev || []); 
        setGallery(ga || []); 
        setStats(st || {});
        setReviews(rv || []);
        setNotices(nt || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    try {
      const res = await api.submitReview(reviewForm);
      toast(res.message, 'success');
      setReviewForm({ name: '', role: '', text: '' });
    } catch (err) {
      toast('রিভিউ সাবমিট করতে সমস্যা হয়েছে', 'error');
    } finally {
      setReviewLoading(false);
    }
  };

  const pillars = [
    { icon: 'heart', title: 'সমাজসেবা', desc: 'সুবিধাবঞ্চিত শিশুদের ইফতার, ঈদ উপহার ও শীতবস্ত্র বিতরণসহ বহু মানবিক উদ্যোগ।', color: 'red' },
    { icon: 'trophy', title: 'ক্রীড়া', desc: 'আগ্রাবাদ ও ডাবলমুরিং এলাকায় বার্ষিক ক্রিকেট ও ফুটবল টুর্নামেন্টের আয়োজন।', color: 'orange' },
    { icon: 'book-open', title: 'শিক্ষা ও সংস্কৃতি', desc: 'সিরাত অলিম্পিয়াডসহ বিভিন্ন মেধা ও সৃজনশীল প্রতিযোগিতার আয়োজন।', color: 'blue' },
  ];

  return (
    <>
      <style>{`
        body { overflow-x: hidden; }
        
        /* ====== DESKTOP CSS (Default) ====== */
        .hero-2 { position: relative; overflow: hidden; border-radius: var(--r-xl); margin: 0 20px; background-image: linear-gradient(rgba(0, 30, 10, 0.7), rgba(0, 15, 0, 0.9)), url('/banner.webp'); background-size: cover; background-position: center; color: #fff; padding: 100px 20px 120px; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.3), inset 0 0 100px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); }
        .hero-2-inner { max-width: 800px; margin: 0 auto; position: relative; z-index: 1; animation: heroFadeUp 0.8s ease-out; }
        .hero-title { color: #fff; font-size: clamp(2.5rem, 5vw, 4rem); margin-bottom: 20px; line-height: 1.15; text-shadow: 0 0 20px rgba(255,255,255,0.4), 0 4px 15px rgba(0,0,0,0.5); background: linear-gradient(to right, #fff, #e2e8f0, #fff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmerText 3s infinite linear; background-size: 200% auto; }
        .hero-2-badge { display: inline-flex; align-items: center; gap: 8px; padding: 10px 22px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); backdrop-filter: blur(10px); border-radius: var(--r-full); font-size: .9rem; font-weight: 600; margin-bottom: 24px; color: #fff; animation: pulseBadge 2s infinite; }
        .hero-2 p { font-size: 1.2rem; color: rgba(255,255,255,0.9); max-width: 600px; margin: 0 auto 40px; text-shadow: 0 2px 5px rgba(0,0,0,0.5); }
        .hero-btn-ghost { background: rgba(255,255,255,0.15) !important; color: #fff !important; border: 1px solid rgba(255,255,255,0.4) !important; backdrop-filter: blur(10px); }
        .hero-btn-ghost:hover { background: rgba(255,255,255,0.3) !important; transform: translateY(-3px); }
        .hero-stats { display: flex; justify-content: center; gap: 40px; margin-top: 60px; flex-wrap: wrap; }
        .hero-stat-num { font-size: 2.5rem; font-weight: 800; line-height: 1; margin-bottom: 6px; color: var(--gold); text-shadow: 0 0 15px rgba(245,124,0,0.5); }
        .hero-stat-label { font-size: .95rem; color: rgba(255,255,255,0.8); font-weight: 500; }
        
        .trust-strip { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--r-full); padding: 20px 30px; margin: -40px auto 40px; max-width: 1000px; position: relative; z-index: 2; backdrop-filter: var(--glass-blur); box-shadow: var(--glass-shadow); transition: transform 0.3s; }
        .trust-items { display: flex; justify-content: space-around; align-items: center; flex-wrap: wrap; gap: 20px; }
        .trust-item { display: flex; align-items: center; gap: 10px; font-weight: 600; color: var(--text-secondary); }
        .trust-item svg { color: var(--primary-600); }

        .notice-board { background: #fff3cd; border-left: 5px solid #ffc107; border-radius: var(--r-md); padding: 20px; margin-bottom: 40px; box-shadow: var(--glass-shadow); }
        .notice-title { display: flex; align-items: center; gap: 8px; color: #856404; font-weight: 800; font-size: 1.2rem; margin-bottom: 15px; }
        .notice-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; border-bottom: 1px dashed rgba(0,0,0,0.1); padding-bottom: 10px; }
        .notice-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .notice-date { font-size: 0.8rem; color: #856404; font-weight: 700; white-space: nowrap; margin-top: 3px; }
        .notice-text { font-size: 0.95rem; color: #533f03; line-height: 1.5; }
        .notice-text strong { display: block; font-size: 1rem; margin-bottom: 4px; }

        .section-header { position: relative; }
        .section-header::after { content: ''; display: block; width: 60px; height: 4px; background: linear-gradient(90deg, var(--primary-500), var(--gold)); margin: 15px auto 0; border-radius: 99px; }
        .mission-split { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .mission-visual { background: var(--glass-bg); backdrop-filter: var(--glass-blur); border: 1px solid var(--glass-border); border-radius: var(--r-xl); padding: 50px 40px; text-align: center; box-shadow: var(--glass-shadow); }
        .mission-visual-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 30px; padding-top: 25px; border-top: 1px solid rgba(0,0,0,0.05); }
        .mission-visual-stats strong { display: block; font-size: 1.8rem; color: var(--primary-dark); }
        .mission-visual-stats span { font-size: .85rem; color: var(--muted); }
        .pillar-card { background: var(--glass-bg); backdrop-filter: var(--glass-blur); border: 1px solid var(--glass-border); border-radius: var(--r-lg); box-shadow: var(--glass-shadow); padding: 32px; transition: all 0.4s var(--t-spring); position: relative; overflow: hidden; }
        .pillar-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: var(--glass-shadow-hover); background: var(--glass-bg-hover); border-color: #fff; }
        .pillar-icon { width: 70px; height: 70px; border-radius: var(--r-md); display: grid; place-items: center; margin-bottom: 24px; box-shadow: 0 10px 20px rgba(0,0,0,0.05); transition: transform 0.4s var(--t-spring); }
        .pillar-red { background: linear-gradient(135deg, #fee2e2, #fecaca); color: #b91c1c; }
        .pillar-orange { background: linear-gradient(135deg, #fef3c7, #fed7aa); color: #c2410c; }
        .pillar-blue { background: linear-gradient(135deg, #dbeafe, #bfdbfe); color: #1e40af; }
        
        .event-card { background: var(--glass-bg); backdrop-filter: var(--glass-blur); border: 1px solid var(--glass-border); border-left: 5px solid var(--primary-500); border-radius: var(--r-lg); box-shadow: var(--glass-shadow); padding: 32px; transition: all 0.4s var(--t-spring); }
        .event-card:hover { transform: translateY(-8px) scale(1.01); box-shadow: var(--glass-shadow-hover); background: var(--glass-bg-hover); border-left-color: var(--gold); }
        .event-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; gap: 10px; flex-wrap: wrap; }
        .event-badge { display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; border-radius: var(--r-full); font-size: .75rem; font-weight: 600; }
        .event-badge-event { background: #dbeafe; color: #1e40af; }
        .event-badge-notice { background: #fef3c7; color: #92400e; }
        .event-date { display: inline-flex; align-items: center; gap: 5px; font-size: .85rem; color: var(--muted); font-weight: 600; }
        
        .gallery-preview { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .gallery-preview-item { aspect-ratio: 1; border-radius: var(--r-lg); background: linear-gradient(135deg, var(--primary-200), var(--primary-600)); background-size: cover; background-position: center; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: var(--glass-shadow); transition: all 0.4s; }
        .gallery-preview-item:hover { transform: scale(1.05) rotate(1deg); box-shadow: var(--glass-shadow-hover); z-index: 2; }
        .gallery-preview-caption { position: absolute; bottom: 0; left: 0; right: 0; padding: 30px 16px 14px; background: linear-gradient(transparent, rgba(0,0,0,0.85)); color: #fff; font-size: .9rem; font-weight: 500; transform: translateY(0); transition: transform 0.3s; }
        
        .testimonial-card { background: var(--glass-bg); backdrop-filter: var(--glass-blur); border: 1px solid var(--glass-border); border-radius: var(--r-lg); box-shadow: var(--glass-shadow); padding: 32px; transition: all 0.4s var(--t-spring); display: flex; flex-direction: column; position: relative; }
        .testimonial-card:hover { transform: translateY(-8px); box-shadow: var(--glass-shadow-hover); background: var(--glass-bg-hover); }
        .testimonial-quote { color: var(--primary-300); margin-bottom: 14px; position: absolute; top: 20px; right: 20px; opacity: 0.3; }
        .testimonial-text { font-size: 1rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 20px; flex: 1; font-style: italic; position: relative; z-index: 1; }
        .testimonial-author { display: flex; align-items: center; gap: 12px; padding-top: 16px; border-top: 1px solid rgba(0,0,0,0.05); }
        .testimonial-avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, var(--gold), var(--primary-700)); color: #fff; display: grid; place-items: center; font-weight: 700; font-size: 1.1rem; }
        
        .review-section { background: var(--glass-bg); border-radius: var(--r-xl); padding: 50px 40px; margin-top: 60px; border: 1px solid var(--glass-border); box-shadow: var(--glass-shadow); }
        .review-form { max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; gap: 15px; }
        .review-form input, .review-form textarea { width: 100%; padding: 16px; border-radius: var(--r-md); border: 1.5px solid #e2e8f0; font-family: inherit; font-size: 1rem; transition: all 0.3s; }
        .review-form input:focus, .review-form textarea:focus { border-color: var(--primary-500); outline: none; box-shadow: 0 0 0 4px rgba(34,197,94,0.15); }
        
        @keyframes heroFadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulseBadge { 0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.2); } 70% { box-shadow: 0 0 0 10px rgba(255,255,255,0); } 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); } }
        @keyframes shimmerText { to { background-position: 200% center; } }

        /* ==========================================
           📱 MOBILE APP-LIKE CSS (max-width: 768px)
           ========================================== */
        @media (max-width: 768px) {
          /* Global Fixes */
          body { padding-bottom: 70px; } /* Space for potential bottom nav */
          
          /* Hero Section - Edge to Edge */
          .hero-2 { margin: 0; border-radius: 0 0 30px 30px; padding: 60px 15px 40px; }
          .hero-title { font-size: 2.2rem; }
          .hero-2 p { font-size: 1rem; margin-bottom: 25px; }
          .hero-btns { flex-direction: column; gap: 12px; }
          .hero-btns .btn { width: 100%; padding: 16px; font-size: 1.05rem; }
          
          /* Horizontal Scroll for Stats */
          .hero-stats { 
            gap: 15px; margin-top: 30px; flex-wrap: nowrap; 
            overflow-x: auto; scroll-snap-type: x mandatory; 
            justify-content: flex-start; padding-bottom: 10px;
            -webkit-overflow-scrolling: touch;
          }
          .hero-stats::-webkit-scrollbar { display: none; }
          .hero-stat { min-width: 100px; scroll-snap-align: start; }
          .hero-stat-num { font-size: 1.8rem; }
          .hero-stat-label { font-size: 0.8rem; }

          /* Trust Strip - App Grid */
          .trust-strip { margin: -20px 15px 30px; padding: 15px; border-radius: var(--r-xl); }
          .trust-items { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .trust-item { font-size: 0.85rem; }

          /* Notice Board */
          .notice-board { margin: 0 15px 30px; padding: 15px; }

          /* Mission Section */
          .mission-split { grid-template-columns: 1fr; gap: 30px; }
          .mission-visual { padding: 30px 20px; }

          /* Section Headers */
          .section { padding: 40px 0; }
          
          /* Pillars & Events - Horizontal Scroll (App Style) */
          .grid, .grid-3 { 
            display: flex; flex-direction: row; overflow-x: auto; 
            scroll-snap-type: x mandatory; gap: 15px; 
            padding-bottom: 15px; padding-left: 15px; padding-right: 15px;
            -webkit-overflow-scrolling: touch;
          }
          .grid::-webkit-scrollbar, .grid-3::-webkit-scrollbar { display: none; }
          
          .pillar-card, .event-card { 
            min-width: 85%; scroll-snap-align: center; 
            padding: 24px; border-radius: var(--r-lg);
          }

          /* Gallery Preview - 2 Column Grid */
          .gallery-preview { grid-template-columns: repeat(2, 1fr); gap: 10px; padding: 0 15px; }

          /* Reviews - Horizontal Scroll */
          .testimonial-card { min-width: 85%; scroll-snap-align: center; }

          /* Review Form */
          .review-section { padding: 30px 20px; margin-top: 30px; border-radius: 0; }
          .review-form input, .review-form textarea { font-size: 16px; } /* Prevents iOS zoom */
          .review-form .btn { padding: 16px; font-size: 1.05rem; }
        }
      `}</style>

      {/* 1. HERO SECTION */}
      <section className="hero-2">
        <div className="hero-2-inner">
          <div className="hero-2-badge"><Icon name="sparkles" size={16} /> জাতীয় শিশু-কিশোর সংগঠন</div>
          <h1 className="hero-title">ফুটন্ত ফুল, ডাবলমুরিং জোন</h1>
          <p style={{ fontStyle: 'italic', color: 'var(--gold)', fontWeight: '600', fontSize: '1.2rem', marginBottom: '20px', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>"আমরাই গড়বো আগামী দিন স্বপ্নে মনার বাংলাদেশ"</p>
          <p>সমাজসেবা, ক্রীড়া ও শিক্ষার মাধ্যমে আগামী প্রজন্ম গড়ার দৃঢ় প্রত্যয়ে আমরা কাজ করে যাচ্ছি।</p>
          <div className="hero-btns">
            <Link to="/membership" className="btn btn-accent btn-lg" style={{ boxShadow: '0 10px 25px rgba(229,57,53,0.4)' }}>সদস্য হোন <Icon name="arrow-right" size={18} /></Link>
            <Link to="/activities" className="btn hero-btn-ghost btn-lg">কার্যক্রম দেখুন</Link>
          </div>
          
          <div className="hero-stats">
            <div className="hero-stat"><div className="hero-stat-num">{stats.members}</div><div className="hero-stat-label">সদস্য</div></div>
            <div className="hero-stat"><div className="hero-stat-num">{stats.events}</div><div className="hero-stat-label">ইভেন্ট</div></div>
            <div className="hero-stat"><div className="hero-stat-num">{stats.yearsRunning}</div><div className="hero-stat-label">বছরের পথচলা</div></div>
            <div className="hero-stat"><div className="hero-stat-num">{stats.divisions}</div><div className="hero-stat-label">কার্যক্রম বিভাগ</div></div>
          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP */}
      <div className="container">
        <section className="trust-strip">
          <div className="trust-items">
            <div className="trust-item"><Icon name="shield" size={20} /> নিবন্ধিত সংগঠন</div>
            <div className="trust-item"><Icon name="users" size={20} /> {stats.members} সক্রিয় সদস্য</div>
            <div className="trust-item"><Icon name="award" size={20} /> সমাজসেবায় স্বীকৃত</div>
            <div className="trust-item"><Icon name="heart" size={20} /> নিঃস্বার্থ সেবা</div>
          </div>
        </section>
      </div>

      {/* 3. NOTICE BOARD */}
      {notices.length > 0 && (
        <div className="container">
          <div className="notice-board">
            <div className="notice-title"><Icon name="megaphone" size={22} /> জরুরি নোটিশ বোর্ড</div>
            {notices.map(n => (
              <div className="notice-item" key={n._id}>
                <div className="notice-date">{new Date(n.event_date).toLocaleDateString('bn-BD', {day: '2-digit', month: 'short'})}</div>
                <div className="notice-text"><strong>{n.title}</strong> {n.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. MISSION & ABOUT */}
      <section className="section">
        <div className="container">
          <div className="mission-split">
            <div className="mission-visual">
              <div className="mission-visual-inner">
                <div style={{ background: '#fff', display: 'inline-block', padding: '15px', borderRadius: '50%', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
                   <img src="https://res.cloudinary.com/vqcb8cvu/image/upload/f_auto,q_auto/logo" alt="Logo" width="110" height="110" style={{ objectFit: 'contain', borderRadius: '50%' }} />
                </div>
                <div className="mission-visual-stats">
                  <div><strong>{stats.yearsRunning}</strong><span>বছর</span></div>
                  <div><strong>{stats.events}</strong><span>ইভেন্ট</span></div>
                  <div><strong>{stats.benefited}</strong><span>উপকৃত</span></div>
                </div>
              </div>
            </div>
            <div className="mission-content">
              <span className="section-eyebrow">আমাদের সম্পর্কে</span>
              <h2 className="section-title">আমরা কারা?</h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.8 }}>
                ফুটন্ত ফুল জাতীয় শিশু-কিশোর সংগঠনের ডাবলমুরিং জোন শাখা চট্টগ্রামের ডাবলমুরিং ও আগ্রাবাদ এলাকায় সক্রিয়ভাবে কাজ করে যাচ্ছে। আমাদের লক্ষ্য সুস্থ ও আলোকিত সমাজ গঠন।
              </p>
              <Link to="/about" className="btn btn-primary icon-inline" style={{ marginTop: 10 }}>বিস্তারিত জানুন <Icon name="arrow-right" size={16} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THREE PILLARS */}
      <section className="section" style={{ background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(20px)' }}>
        <div className="container" style={{ padding: '0 15px', marginBottom: 20 }}>
          <div className="section-header">
            <span className="section-eyebrow">আমাদের লক্ষ্য</span>
            <h2 className="section-title">তিনটি স্তম্ভে গড়া আমাদের পথচলা</h2>
          </div>
        </div>
        <div className="container" style={{ padding: 0 }}>
          <div className="grid grid-3">
            {pillars.map((p, i) => (
              <div className="pillar-card" key={i}>
                <div className={`pillar-icon pillar-${p.color}`}><Icon name={p.icon} size={32} strokeWidth={2} /></div>
                <h3>{p.title}</h3><p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. UPCOMING EVENTS */}
      <section className="section">
        <div className="container" style={{ padding: '0 15px', marginBottom: 20 }}>
          <div className="section-header">
            <span className="section-eyebrow">আপডেট</span>
            <h2 className="section-title">চলমান ও আসন্ন ইভেন্ট</h2>
          </div>
        </div>
        <div className="container" style={{ padding: 0 }}>
          <div className="grid">
            {loading ? [1, 2, 3].map(i => <div key={i} style={{ minWidth: '85%' }}><Skeleton variant="card" /></div>) : events.slice(0, 3).map(e => (
              <div className="event-card" key={e._id}>
                <div className="event-card-header">
                  <div className={`event-badge ${e.type === 'event' ? 'event-badge-event' : 'event-badge-notice'}`}><Icon name="target" size={14} /> {e.type === 'event' ? 'ইভেন্ট' : 'নোটিশ'}</div>
                  <div className="event-date"><Icon name="calendar" size={14} /> {new Date(e.event_date).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                </div>
                <h3>{e.title}</h3><p>{e.description}</p>
              </div>
            ))}
          </div>
          <div className="container" style={{ textAlign: 'center', marginTop: 20 }}>
            <Link to="/activities" className="btn btn-outline icon-inline">সব কার্যক্রম দেখুন <Icon name="arrow-right" size={16} /></Link>
          </div>
        </div>
      </section>

      {/* 7. GALLERY PREVIEW */}
      <section className="section" style={{ background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(20px)' }}>
        <div className="container" style={{ padding: '0 15px', marginBottom: 20 }}>
          <div className="section-header">
            <span className="section-eyebrow">গ্যালারি</span>
            <h2 className="section-title">স্মরণীয় মুহূর্ত</h2>
          </div>
        </div>
        <div className="container" style={{ padding: 0 }}>
          <div className="gallery-preview">
            {loading ? [1, 2, 3, 4].map(i => <Skeleton key={i} variant="card" />) : gallery.slice(0, 4).map((g, i) => (
              <div key={g._id || i} className="gallery-preview-item" style={g.imageUrl ? { backgroundImage: `url('${g.imageUrl}')` } : {}}>
                {!g.imageUrl && <svg viewBox="0 0 100 100" className="gallery-flower"><g fill="white" opacity="0.85"><ellipse cx="50" cy="30" rx="10" ry="17" /><ellipse cx="50" cy="30" rx="10" ry="17" transform="rotate(72 50 50)" /><ellipse cx="50" cy="30" rx="10" ry="17" transform="rotate(144 50 50)" /><ellipse cx="50" cy="30" rx="10" ry="17" transform="rotate(216 50 50)" /><ellipse cx="50" cy="30" rx="10" ry="17" transform="rotate(288 50 50)" /></g><circle cx="50" cy="50" r="9" fill="#ffa726" /></svg>}
                <div className="gallery-preview-caption">{g.title}</div>
              </div>
            ))}
          </div>
          <div className="container" style={{ textAlign: 'center', marginTop: 20 }}>
            <Link to="/gallery" className="btn btn-outline icon-inline">পুরো গ্যালারি দেখুন <Icon name="arrow-right" size={16} /></Link>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS & REVIEW FORM */}
      <section className="section">
        <div className="container" style={{ padding: '0 15px', marginBottom: 20 }}>
          <div className="section-header">
            <span className="section-eyebrow">প্রশংসাপত্র</span>
            <h2 className="section-title">তারা যা বলেন</h2>
          </div>
        </div>
        
        <div className="container" style={{ padding: 0 }}>
          <div className="grid grid-3">
            {reviews.map((r, i) => (
              <div className="testimonial-card" key={i}>
                <div className="testimonial-quote"><Icon name="quote" size={40} strokeWidth={1.5} /></div>
                <p className="testimonial-text">"{r.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{r.name.charAt(0)}</div>
                  <div><strong>{r.name}</strong><span>{r.role}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="container" style={{ padding: '0 15px' }}>
          <div className="review-section">
            <div className="section-header" style={{ marginBottom: '30px' }}>
              <h2 className="section-title" style={{ fontSize: '1.8rem' }}>আপনার মতামত দিন</h2>
              <p className="section-sub">আপনার রিভিউ অ্যাডমিন অনুমোদনের পর এখানে দেখা যাবে।</p>
            </div>
            <form className="review-form" onSubmit={handleReviewSubmit}>
              <input 
                id="review-name"
                name="name"
                type="text" 
                placeholder="আপনার নাম" 
                required 
                value={reviewForm.name} 
                onChange={e => setReviewForm({...reviewForm, name: e.target.value})} 
              />
              <input 
                id="review-role"
                name="role"
                type="text" 
                placeholder="আপনি কে? (যেমন: অভিভাবক, সদস্য)" 
                value={reviewForm.role} 
                onChange={e => setReviewForm({...reviewForm, role: e.target.value})} 
              />
              <textarea 
                id="review-text"
                name="text"
                rows="4" 
                placeholder="আপনার রিভিউ লিখুন..." 
                required 
                value={reviewForm.text} 
                onChange={e => setReviewForm({...reviewForm, text: e.target.value})}
              ></textarea>
              <button type="submit" className="btn btn-primary" disabled={reviewLoading}>
                {reviewLoading ? 'সাবমিট হচ্ছে...' : 'রিভিউ সাবমিট করুন'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
