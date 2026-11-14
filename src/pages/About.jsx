import { useEffect, useState } from 'react';
import { api } from '../api';
import Icon from '../components/Icon';
import Logo from '../components/Logo';
import Skeleton from '../components/Skeleton';

export default function About() {
  const [committee, setCommittee] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCommittee()
      .then(setCommittee)
      .catch((err) => console.error("Failed to load committee", err))
      .finally(() => setLoading(false));
  }, []);

  // কমিটির সদস্যদের আলাদা করা (লিডার এবং মেম্বার)
  const isLeader = (role) => {
    if (!role) return false;
    // 'সভাপতি' বা 'সম্পাদক' থাকলে তাকে লিডার হিসেবে ধরা হবে
    return role.includes('সভাপতি') || role.includes('সম্পাদক');
  };

  const leaders = committee.filter(c => isLeader(c.role));
  const members = committee.filter(c => !isLeader(c.role));

  return (
    <>
      <style>{`
        /* ==========================================
           ABOUT PAGE HIGHLIGHTED CSS 
           ========================================== */
        .about-page {
          position: relative;
          padding-top: 40px;
          padding-bottom: 80px;
          overflow: hidden;
        }
        
        /* Background Blobs */
        .about-blob {
          position: absolute; width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(76,175,80,0.15) 0%, transparent 70%);
          border-radius: 50%; z-index: 0; pointer-events: none;
        }
        .blob-1 { top: -50px; left: -50px; }
        .blob-2 { bottom: 20%; right: -100px; background: radial-gradient(circle, rgba(245,124,0,0.12) 0%, transparent 70%); }

        /* Hero Section */
        .about-hero {
          text-align: center;
          margin-bottom: 60px;
          position: relative;
          z-index: 1;
          animation: fadeUp 0.6s ease-out;
        }
        .about-logo-wrapper {
          display: inline-block;
          background: #fff;
          border-radius: 50%;
          padding: 15px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08), 0 0 30px rgba(76,175,80,0.2);
          margin-bottom: 24px;
          animation: floatLogo 4s ease-in-out infinite;
        }
        .about-hero h1 {
          font-size: clamp(2.2rem, 5vw, 3.2rem);
          font-weight: 900;
          background: linear-gradient(135deg, var(--primary-800), var(--gold), var(--accent-600));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 12px;
          letter-spacing: -1px;
        }
        .about-hero-badge {
          display: inline-flex; align-items: center; gap: 6px; padding: 6px 16px;
          background: rgba(255,255,255,0.6); backdrop-filter: blur(10px);
          border: 1px solid rgba(76,175,80,0.2); border-radius: 99px;
          color: var(--primary-700); font-size: 0.85rem; font-weight: 700; text-transform: uppercase;
        }

        /* History & Mission Card */
        .about-card {
          background: var(--glass-bg); backdrop-filter: var(--glass-blur);
          border: 1px solid var(--glass-border); border-radius: var(--r-xl);
          box-shadow: var(--glass-shadow); padding: 45px; margin-bottom: 60px;
          position: relative; z-index: 1; transition: all 0.4s;
          animation: fadeUp 0.7s ease-out 0.1s both;
        }
        .about-card:hover { transform: translateY(-5px); box-shadow: var(--glass-shadow-hover); }
        .about-card-title {
          display: flex; align-items: center; gap: 12px; color: var(--primary-dark);
          font-size: 1.5rem; font-weight: 800; margin-bottom: 24px;
          border-bottom: 2px solid rgba(46,125,50,0.1); padding-bottom: 15px;
        }
        .about-text {
          font-size: 1.05rem; line-height: 1.9; color: var(--text-secondary); text-align: justify;
        }
        
        /* Vision & Mission */
        .vm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 30px; }
        .vm-box {
          background: rgba(255,255,255,0.6); border: 1px solid rgba(46,125,50,0.15);
          border-radius: var(--r-lg); padding: 24px; transition: all 0.3s;
          position: relative; overflow: hidden;
        }
        .vm-box::before {
          content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%;
          background: linear-gradient(to bottom, var(--primary-400), var(--gold)); opacity: 0; transition: 0.3s;
        }
        .vm-box:hover { background: #fff; box-shadow: 0 10px 30px rgba(46,125,50,0.08); transform: translateY(-3px); }
        .vm-box:hover::before { opacity: 1; }
        .vm-box h4 { display: flex; align-items: center; gap: 8px; color: var(--primary-dark); margin-bottom: 12px; font-size: 1.15rem; }
        .vm-box p { color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem; }

        /* ==========================================
           VIP LEADERS SECTION (সভাপতি ও সম্পাদক)
           ========================================== */
        .leader-section {
          margin-bottom: 70px; position: relative; z-index: 1;
          animation: fadeUp 0.8s ease-out 0.2s both;
        }
        .section-heading { text-align: center; margin-bottom: 40px; }
        .section-heading h2 { font-size: 2rem; font-weight: 900; color: var(--text); margin-bottom: 8px; }
        .section-heading p { color: var(--text-secondary); font-size: 1rem; }
        
        .leader-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px;
          justify-content: center;
        }
        
        .leader-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,250,240,0.8));
          backdrop-filter: blur(20px); border: 2px solid rgba(184,134,11,0.3);
          border-radius: 28px; padding: 35px 30px; text-align: center;
          position: relative; overflow: hidden; transition: all 0.4s var(--t-spring);
          box-shadow: 0 15px 35px rgba(184,134,11,0.1);
        }
        /* Golden glow effect */
        .leader-card::before {
          content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
          background: radial-gradient(circle at 50% 0%, rgba(255,215,0,0.15), transparent 60%);
          opacity: 0; transition: opacity 0.4s;
        }
        .leader-card:hover { transform: translateY(-10px) scale(1.02); border-color: var(--gold); box-shadow: 0 25px 50px rgba(184,134,11,0.2); }
        .leader-card:hover::before { opacity: 1; }

        /* Crown Icon */
        .crown-icon {
          position: absolute; top: 15px; right: 20px; color: var(--gold);
          transform: rotate(15deg); opacity: 0.8;
        }

        .leader-avatar-wrapper {
          position: relative; width: 120px; height: 120px; margin: 0 auto 20px;
        }
        .leader-avatar {
          width: 100%; height: 100%; border-radius: 50%;
          background: linear-gradient(135deg, var(--gold), var(--primary-700));
          color: #fff; display: grid; place-items: center;
          font-size: 3rem; font-weight: 800;
          box-shadow: 0 15px 30px rgba(184,134,11,0.3);
          border: 4px solid #fff;
        }
        .leader-badge {
          position: absolute; bottom: -5px; left: 50%; transform: translateX(-50%);
          background: linear-gradient(135deg, var(--gold), #d97706); color: #fff;
          padding: 4px 16px; border-radius: 99px; font-size: 0.75rem; font-weight: 800;
          white-space: nowrap; box-shadow: 0 4px 10px rgba(184,134,11,0.4); letter-spacing: 0.5px;
        }

        .leader-card h3 { font-size: 1.4rem; font-weight: 800; color: var(--text); margin-bottom: 6px; }
        .leader-card .designation { color: var(--gold-dark); font-weight: 700; font-size: 1rem; }

        /* ==========================================
           GENERAL MEMBERS SECTION (সাধারণ সদস্য)
           ========================================== */
        .members-section {
          position: relative; z-index: 1;
          animation: fadeUp 0.9s ease-out 0.3s both;
        }
        .member-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px;
        }
        .member-card {
          background: var(--glass-bg); backdrop-filter: var(--glass-blur);
          border: 1px solid var(--glass-border); border-radius: var(--r-lg);
          padding: 24px 20px; text-align: center; transition: all 0.3s;
          box-shadow: var(--glass-shadow);
        }
        .member-card:hover {
          transform: translateY(-5px); background: var(--glass-bg-hover);
          box-shadow: var(--glass-shadow-hover); border-color: var(--primary-200);
        }
        .member-avatar {
          width: 70px; height: 70px; border-radius: 50%; margin: 0 auto 14px;
          background: linear-gradient(135deg, var(--primary-400), var(--primary-700));
          color: #fff; display: grid; place-items: center;
          font-size: 1.5rem; font-weight: 700; box-shadow: 0 8px 20px rgba(46,125,50,0.2);
        }
        .member-card h4 { font-size: 1.05rem; font-weight: 700; color: var(--text); margin-bottom: 4px; }
        .member-card .role { color: var(--primary-600); font-weight: 600; font-size: 0.8rem; text-transform: uppercase; }

        /* Animations */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatLogo {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .vm-grid { grid-template-columns: 1fr; }
          .about-card { padding: 25px; }
          .leader-grid { grid-template-columns: 1fr; }
          .member-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 480px) {
          .member-grid { grid-template-columns: 1fr; }
          .about-hero h1 { font-size: 2rem; }
        }
      `}</style>

      <div className="container about-page">
        <div className="about-blob blob-1"></div>
        <div className="about-blob blob-2"></div>

        {/* 1. Hero Section */}
        <div className="about-hero">
          <div className="about-logo-wrapper">
            <Logo size={120} />
          </div>
          <h1>আমাদের সম্পর্কে</h1>
          <div className="about-hero-badge">
            <Icon name="sparkles" size={14} /> ফুটন্ত ফুল, ডাবলমুরিং জোন
          </div>
        </div>

        {/* 2. History & Mission */}
        <div className="about-card">
          <h3 className="about-card-title">
            <Icon name="book-open" size={28} color="var(--primary-600)" /> সংগঠনের ইতিহাস ও লক্ষ্য
          </h3>
          <p className="about-text">
            ফুটন্ত ফুল জাতীয় শিশু-কিশোর সংগঠনের ডাবলমুরিং জোন শাখা দীর্ঘদিন ধরে চট্টগ্রামের ডাবলমুরিং ও আগ্রাবাদ এলাকায় সক্রিয়ভাবে কাজ করে যাচ্ছে। শিশু-কিশোরদের নৈতিক ও মানসিক বিকাশ, সমাজসেবা, ক্রীড়া এবং শিক্ষামূলক কার্যক্রমের মাধ্যমে একটি সুস্থ ও আলোকিত সমাজ গঠন আমাদের মূল লক্ষ্য। আমরা বিশ্বাস করি, আজকের শিশু-কিশোররাই আগামী দিনের সুনাগরিক।
          </p>
          
          <div className="vm-grid">
            <div className="vm-box">
              <h4><Icon name="target" size={22} color="var(--primary-600)" /> ভিশন</h4>
              <p>আগামী প্রজন্মকে নৈতিকতা, দেশপ্রেম ও মানবিক মূল্যবোধে উদ্বুদ্ধ করে একটি আলোকিত বাংলাদেশ গড়ে তোলা।</p>
            </div>
            <div className="vm-box">
              <h4><Icon name="shield" size={22} color="var(--primary-600)" /> মিশন</h4>
              <p>সমাজসেবা, শিক্ষা ও ক্রীড়ার মাধ্যমে শিশু-কিশোরদের সর্বাঙ্গীণ বিকাশ নিশ্চিত করা এবং সুবিধাবঞ্চিতদের পাশে দাঁড়ানো।</p>
            </div>
          </div>
        </div>

        {/* 3. VIP Leaders Section (সভাপতি ও সম্পাদক) */}
        {loading ? (
          <div className="leader-grid">
            <Skeleton variant="card" />
            <Skeleton variant="card" />
          </div>
        ) : leaders.length > 0 && (
          <div className="leader-section">
            <div className="section-heading">
              <h2>নেতৃত্ববৃন্দ</h2>
              <p>সংগঠনের মূল চালিকাশক্তি</p>
            </div>
            <div className="leader-grid">
              {leaders.map((c, i) => (
                <div className="leader-card" key={c._id || i}>
                  <div className="crown-icon"><Icon name="star" size={28} /></div>
                  <div className="leader-avatar-wrapper">
                    <div className="leader-avatar">{c.name ? c.name.charAt(0) : '?'}</div>
                    <div className="leader-badge">👑 {c.role || 'পদবি নেই'}</div>
                  </div>
                  <h3>{c.name || 'নাম নেই'}</h3>
                  <div className="designation">কার্যনির্বাহী কমিটি</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. General Members Section */}
        {!loading && members.length > 0 && (
          <div className="members-section">
            <div className="section-heading">
              <h2>কার্যনির্বাহী সদস্যবৃন্দ</h2>
              <p>যারা নিঃস্বার্থভাবে কাজ করে যাচ্ছেন</p>
            </div>
            <div className="member-grid">
              {members.map((c, i) => (
                <div className="member-card" key={c._id || i}>
                  <div className="member-avatar">{c.name ? c.name.charAt(0) : '?'}</div>
                  <h4>{c.name || 'নাম নেই'}</h4>
                  <div className="role">{c.role || 'সদস্য'}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State Fallback */}
        {!loading && committee.length === 0 && (
          <div className="alert alert-info" style={{ textAlign: 'center', marginTop: '20px' }}>
            <Icon name="info" size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            শীঘ্রই কমিটি তথ্য যুক্ত হবে।
          </div>
        )}

      </div>
    </>
  );
}