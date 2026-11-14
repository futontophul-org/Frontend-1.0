import Icon from '../components/Icon';

export default function Activities() {
  const items = [
    { icon: 'utensils', title: 'সুবিধাবঞ্চিত শিশুদের ইফতার', desc: '২০২৩ সালে ডাবলমুরিং ও আগ্রাবাদে বিশেষ ইফতার ও ঈদ উপহার বিতরণ।', color: 'red' },
    { icon: 'gift', title: 'ঈদ উপহার বিতরণ', desc: 'প্রতি বছর ঈদে সুবিধাবঞ্চিত পরিবারের মাঝে নতুন পোশাক ও খাদ্যসামগ্রী বিতরণ।', color: 'orange' },
    { icon: 'trophy', title: '৮ দলীয় ক্রিকেট টুর্নামেন্ট', desc: '২০২৫ সালে আগ্রাবাদে ৮ দলের অংশগ্রহণে ক্রিকেট টুর্নামেন্ট।', color: 'blue' },
    { icon: 'moon-star', title: 'সিরাত অলিম্পিয়াড', desc: '২০২৬ সালে আয়োজনের প্রস্তুতি — শিশু-কিশোরদের ইসলামি ও নৈতিক শিক্ষায় উৎসাহিত করতে।', color: 'purple' },
    { icon: 'book-open', title: 'শিক্ষা সহায়তা', desc: 'দরিদ্র ও মেধাবী শিক্ষার্থীদের শিক্ষা উপকরণ ও বৃত্তি সহায়তা।', color: 'green' },
    { icon: 'leaf', title: 'পরিবেশ সচেতনতা', desc: 'বৃক্ষরোপণ ও পরিচ্ছন্নতা অভিযানে স্থানীয় যুবসমাজের অংশগ্রহণ।', color: 'teal' },
  ];

  return (
    <>
      {/* ==========================================
          ACTIVITIES PAGE HIGHLIGHTED CSS 
          ========================================== */}
      <style>{`
        .activities-page {
          position: relative;
          padding-top: 50px;
          padding-bottom: 80px;
          overflow: hidden;
          min-height: 80vh;
        }

        /* Background Blobs */
        .act-blob {
          position: absolute; width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(76,175,80,0.12) 0%, transparent 70%);
          border-radius: 50%; z-index: 0; pointer-events: none;
        }
        .act-blob-1 { top: -50px; left: -100px; }
        .act-blob-2 { bottom: 10%; right: -100px; background: radial-gradient(circle, rgba(245,124,0,0.1) 0%, transparent 70%); }

        /* Header */
        .act-header {
          text-align: center;
          margin-bottom: 60px;
          position: relative;
          z-index: 1;
          animation: fadeUp 0.6s ease-out;
        }
        .act-header-badge {
          display: inline-flex; align-items: center; gap: 6px; padding: 6px 16px;
          background: rgba(255,255,255,0.6); backdrop-filter: blur(10px);
          border: 1px solid rgba(76,175,80,0.2); border-radius: 99px;
          color: var(--primary-700); font-size: 0.85rem; font-weight: 700; text-transform: uppercase;
          margin-bottom: 16px;
        }
        .act-header h1 {
          font-size: clamp(2.2rem, 5vw, 3rem);
          font-weight: 900;
          background: linear-gradient(135deg, var(--primary-800), var(--gold), var(--accent-600));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }
        .act-header p {
          color: var(--text-secondary);
          font-size: 1.1rem;
          font-weight: 500;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Grid Layout */
        .act-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 28px;
          position: relative;
          z-index: 1;
        }

        /* Activity Cards */
        .activity-card {
          background: var(--glass-bg);
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
          border: 1px solid var(--glass-border);
          border-radius: var(--r-xl);
          box-shadow: var(--glass-shadow);
          padding: 32px;
          transition: all 0.4s var(--t-spring);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: fadeUp 0.6s ease-out both;
        }
        
        /* Top Border Glow on Hover */
        .activity-card::before {
          content: '';
          position: absolute; top: 0; left: 0; width: 100%; height: 4px;
          background: linear-gradient(90deg, transparent, var(--primary-400), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .activity-card:hover::before { opacity: 1; }
        
        .activity-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: var(--glass-shadow-hover);
          background: var(--glass-bg-hover);
          border-color: #fff;
        }

        /* Icon Badges */
        .act-icon-badge {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          margin-bottom: 22px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.06);
          transition: transform 0.4s var(--t-spring);
        }
        .activity-card:hover .act-icon-badge {
          transform: scale(1.1) rotate(5deg);
        }

        /* Specific Colors for Badges */
        .icon-red { background: linear-gradient(135deg, #fee2e2, #fecaca); color: #b91c1c; }
        .icon-orange { background: linear-gradient(135deg, #fef3c7, #fed7aa); color: #c2410c; }
        .icon-blue { background: linear-gradient(135deg, #dbeafe, #bfdbfe); color: #1e40af; }
        .icon-purple { background: linear-gradient(135deg, #f3e8ff, #e9d5ff); color: #6b21a8; }
        .icon-green { background: linear-gradient(135deg, #dcfce7, #bbf7d0); color: #15803d; }
        .icon-teal { background: linear-gradient(135deg, #ccfbf1, #99f6e4); color: #0f766e; }

        /* Text */
        .activity-card h3 {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text);
          margin-bottom: 10px;
          line-height: 1.3;
        }
        .activity-card p {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
          flex: 1;
        }

        /* Animations */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .act-grid { grid-template-columns: 1fr; }
          .activities-page { padding-top: 30px; }
        }
      `}</style>

      <div className="container activities-page">
        {/* Background Blobs */}
        <div className="act-blob act-blob-1"></div>
        <div className="act-blob act-blob-2"></div>

        {/* 1. Header Section */}
        <div className="act-header">
          <div className="act-header-badge">
            <Icon name="award" size={14} /> আমাদের উদ্যোগ
          </div>
          <h1>আমাদের কার্যক্রম</h1>
          <p>সমাজসেবা, ক্রীড়া, শিক্ষা ও সংস্কৃতির মাধ্যমে একটি সুন্দর সমাজ গঠনে আমরা কাজ করে যাচ্ছি।</p>
        </div>

        {/* 2. Activities Grid */}
        <div className="act-grid">
          {items.map((it, i) => (
            <div 
              className="activity-card" 
              key={i}
              style={{ animationDelay: `${i * 0.1}s` }} // Staggered Animation
            >
              <div className={`act-icon-badge icon-${it.color}`}>
                <Icon name={it.icon} size={30} strokeWidth={1.8} />
              </div>
              <h3>{it.title}</h3>
              <p>{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}