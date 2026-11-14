import { useEffect, useState } from 'react';
import { api } from '../api';
import Icon from '../components/Icon';
import Skeleton from '../components/Skeleton';

const CATS = {
  all: 'সব',
  Social: 'সমাজসেবা',
  Sports: 'ক্রীড়া',
  Education: 'শিক্ষা',
  Others: 'অন্যান্য',
};

function FlowerPlaceholder({ size = '45%' }) {
  return (
    <svg viewBox="0 0 100 100" style={{ width: size, height: size, opacity: 0.9 }} xmlns="http://www.w3.org/2000/svg">
      <g fill="white">
        <ellipse cx="50" cy="30" rx="10" ry="17" />
        <ellipse cx="50" cy="30" rx="10" ry="17" transform="rotate(72 50 50)" />
        <ellipse cx="50" cy="30" rx="10" ry="17" transform="rotate(144 50 50)" />
        <ellipse cx="50" cy="30" rx="10" ry="17" transform="rotate(216 50 50)" />
        <ellipse cx="50" cy="30" rx="10" ry="17" transform="rotate(288 50 50)" />
      </g>
      <circle cx="50" cy="50" r="9" fill="#ffa726" />
      <circle cx="50" cy="50" r="5" fill="#f57c00" />
    </svg>
  );
}

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [activeAlbum, setActiveAlbum] = useState(null); 
  const [cat, setCat] = useState('all');
  const [loading, setLoading] = useState(true);
  
  const [selectedImage, setSelectedImage] = useState(null); 

  useEffect(() => {
    setLoading(true);
    api.getGallery(cat)
      .then(data => {
        setItems(data);
        
        const albumMap = {};
        data.forEach(item => {
          const albumName = item.album || 'সাধারণ';
          if (!albumMap[albumName]) {
            albumMap[albumName] = {
              name: albumName,
              cover: item.imageUrl,
              count: 0,
              photos: []
            };
          }
          albumMap[albumName].count += 1;
          albumMap[albumName].photos.push(item);
        });

        setAlbums(Object.values(albumMap));
        setActiveAlbum(null); 
      })
      .catch(err => console.error("Gallery error:", err))
      .finally(() => setLoading(false));
  }, [cat]);

  const openLightbox = (img) => setSelectedImage(img);
  const closeLightbox = () => setSelectedImage(null);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedImage]);

  return (
    <>
      <style>{`
        /* ==== Gallery Base CSS ==== */
        .gallery-page { position: relative; padding-top: 50px; padding-bottom: 80px; overflow: hidden; min-height: 80vh; }
        .gallery-blob { position: absolute; width: 350px; height: 350px; background: radial-gradient(circle, rgba(76,175,80,0.12) 0%, transparent 70%); border-radius: 50%; z-index: 0; pointer-events: none; }
        .gallery-blob-1 { top: -50px; left: -100px; }
        .gallery-blob-2 { bottom: 10%; right: -100px; background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%); }
        
        .gallery-header { text-align: center; margin-bottom: 30px; position: relative; z-index: 1; animation: fadeUp 0.6s ease-out; }
        .gallery-header h1 { font-size: clamp(2.2rem, 5vw, 3rem); font-weight: 900; background: linear-gradient(135deg, var(--primary-800), var(--gold), var(--accent-600)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 12px; }
        .gallery-header p { color: var(--text-secondary); font-size: 1.1rem; font-weight: 500; max-width: 600px; margin: 0 auto; }
        
        .gallery-filters { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin-bottom: 40px; position: relative; z-index: 1; }
        .filter-btn { padding: 10px 24px; border-radius: 99px; background: var(--glass-bg); border: 1px solid var(--glass-border); color: var(--text-secondary); font-size: 0.95rem; font-weight: 700; cursor: pointer; transition: all 0.3s; backdrop-filter: var(--glass-blur); }
        .filter-btn.active { background: linear-gradient(135deg, var(--primary-500), var(--primary-700)); color: #fff; border-color: transparent; box-shadow: 0 8px 20px rgba(46,125,50,0.3); }

        /* ==== Album View CSS ==== */
        .album-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px; position: relative; z-index: 1; }
        .album-card { position: relative; border-radius: var(--r-xl); overflow: hidden; aspect-ratio: 16/9; background: #000; box-shadow: 0 10px 30px rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.4s var(--t-spring), box-shadow 0.4s; }
        .album-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 40px rgba(46,125,50,0.2); }
        .album-cover { width: 100%; height: 100%; object-fit: cover; opacity: 0.7; transition: opacity 0.4s, transform 0.4s; }
        .album-card:hover .album-cover { opacity: 0.9; transform: scale(1.1); }
        .album-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; padding: 30px; background: linear-gradient(transparent 20%, rgba(0,0,0,0.85)); color: #fff; }
        .album-overlay h3 { font-size: 1.6rem; font-weight: 800; margin-bottom: 6px; text-shadow: 0 2px 5px rgba(0,0,0,0.5); }
        .album-overlay p { font-size: 1rem; color: rgba(255,255,255,0.8); display: flex; align-items: center; gap: 6px; }
        
        /* ==== Inside Album View CSS ==== */
        .album-header-nav { display: flex; align-items: center; gap: 16px; margin-bottom: 30px; position: relative; z-index: 1; }
        .back-btn { background: var(--surface); border: 1px solid var(--border); padding: 10px 16px; border-radius: 12px; display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 700; color: var(--text); transition: all 0.2s; }
        .back-btn:hover { background: var(--primary-50); color: var(--primary-700); border-color: var(--primary-300); }
        
        .gallery-grid-app { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; position: relative; z-index: 1; }
        .gallery-item-app { position: relative; border-radius: var(--r-lg); overflow: hidden; display: flex; flex-direction: column; background: var(--surface); border: 1px solid var(--border); box-shadow: var(--glass-shadow); transition: all 0.3s; animation: fadeUp 0.6s ease-out both; }
        .gallery-item-app:hover { transform: translateY(-5px); box-shadow: var(--glass-shadow-hover); }
        
        .img-wrapper { width: 100%; aspect-ratio: 4/3; overflow: hidden; position: relative; cursor: zoom-in; }
        .img-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
        .gallery-item-app:hover .img-wrapper img { transform: scale(1.1); }
        
        .photo-details { padding: 16px; flex: 1; display: flex; flex-direction: column; }
        .photo-title { font-size: 1.1rem; font-weight: 800; color: var(--text); margin-bottom: 6px; line-height: 1.3; }
        
        .gallery-empty { grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; padding: 60px 20px; background: var(--glass-bg); border-radius: var(--r-xl); border: 1px dashed var(--border); color: var(--muted); font-size: 1.1rem; }

        /* ==== Fixed Facebook Style Lightbox CSS ==== */
        .fb-lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 9999; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.2s ease-out; backdrop-filter: blur(5px); }
        
        /* Force White Background for Content */
        .fb-lightbox-content { 
          width: 95%; max-width: 1100px; height: 85vh; 
          background: #ffffff !important; 
          border-radius: var(--r-lg); display: flex; overflow: hidden; 
          box-shadow: 0 20px 50px rgba(0,0,0,0.5); position: relative; animation: zoomIn 0.3s ease-out; 
        }
        
        .fb-lightbox-img-wrapper { flex: 1.5; background: #000; display: flex; align-items: center; justify-content: center; position: relative; }
        .fb-lightbox-img-wrapper img { max-width: 100%; max-height: 100%; object-fit: contain; }
        
        /* Force White Background for Details */
        .fb-lightbox-details { 
          flex: 1; padding: 30px; display: flex; flex-direction: column; overflow-y: auto; 
          background: #ffffff !important; color: #1f2937 !important; 
        }
        
        .fb-lightbox-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #e5e7eb; }
        .fb-lightbox-avatar { width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, var(--primary-500), var(--primary-800)); display: flex; align-items: center; justify-content: center; color: #fff; }
        .fb-lightbox-meta { display: flex; flex-direction: column; }
        .fb-lightbox-meta h4 { font-size: 1.1rem; font-weight: 800; margin: 0; color: #111827 !important; }
        .fb-lightbox-meta span { font-size: 0.85rem; color: #6b7280 !important; }
        
        .fb-lightbox-title { font-size: 1.6rem; font-weight: 900; color: #111827 !important; margin-bottom: 12px; line-height: 1.3; }
        .fb-lightbox-badges { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
        
        /* Description Text */
        .fb-lightbox-desc { font-size: 1.05rem; color: #4b5563 !important; line-height: 1.8; white-space: pre-wrap; word-break: break-word; }
        
        .fb-close-btn { position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.6); border: none; width: 40px; height: 40px; border-radius: 50%; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10; transition: all 0.2s; backdrop-filter: blur(5px); }
        .fb-close-btn:hover { background: #dc2626; transform: rotate(90deg); }
        
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

        /* ==== Responsive CSS ==== */
        @media (max-width: 900px) {
          .album-grid, .gallery-grid-app { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
          .fb-lightbox-content { flex-direction: column; height: 95vh; }
          .fb-lightbox-img-wrapper { flex: 1.2; min-height: 40vh; }
          .fb-lightbox-details { flex: 1; padding: 20px; }
          .fb-close-btn { background: rgba(0,0,0,0.6); }
        }
        @media (max-width: 500px) {
          .album-grid, .gallery-grid-app { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="container gallery-page">
        <div className="gallery-blob gallery-blob-1"></div>
        <div className="gallery-blob gallery-blob-2"></div>

        <div className="gallery-header">
          <h1>আমাদের গ্যালারি</h1>
          <p>আমাদের কার্যক্রমের স্মরণীয় মুহূর্তগুলো অ্যালবাম আকারে দেখুন।</p>
        </div>

        <div className="gallery-filters">
          {Object.entries(CATS).map(([k, v]) => (
            <button key={k} className={`filter-btn ${cat === k ? 'active' : ''}`} onClick={() => setCat(k)}>{v}</button>
          ))}
        </div>

        {loading ? (
          <div className="gallery-grid-app">
             {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} variant="card" />)}
          </div>
        ) : activeAlbum ? (
          // === অ্যালবামের ভেতরের ছবি ===
          <>
            <div className="album-header-nav">
              <button className="back-btn" onClick={() => setActiveAlbum(null)}>
                <Icon name="arrow-left" size={18} /> পেছনে যান
              </button>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-dark)' }}>{activeAlbum}</h2>
            </div>
            <div className="gallery-grid-app">
              {albums.find(a => a.name === activeAlbum)?.photos.map((g, i) => (
                <div key={g._id || i} className="gallery-item-app" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="img-wrapper" onClick={() => openLightbox(g)}>
                    {g.imageUrl ? <img src={g.imageUrl} alt={g.title} loading="lazy" /> : <FlowerPlaceholder />}
                  </div>
                  <div className="photo-details">
                    <h4 className="photo-title">{g.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : albums.length === 0 ? (
          // === কোনো অ্যালবাম না থাকলে ===
          <div className="gallery-empty">
            <Icon name="image" size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
            এই ক্যাটাগরিতে এখনো কোনো ছবি যুক্ত করা হয়নি।
          </div>
        ) : (
          // === মেইন অ্যালবাম গ্রিড ===
          <div className="album-grid">
            {albums.map((album, i) => (
              <div 
                key={album.name} 
                className="album-card" 
                onClick={() => setActiveAlbum(album.name)}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {album.cover ? (
                  <img src={album.cover} alt={album.name} className="album-cover" />
                ) : (
                  <div style={{ background: 'var(--primary-900)', width: '100%', height: '100%' }} />
                )}
                <div className="album-overlay">
                  <h3>{album.name}</h3>
                  <p><Icon name="image" size={16} /> {album.count} টি ছবি</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* === Facebook Style Lightbox Modal (White Background) === */}
      {selectedImage && (
        <div className="fb-lightbox" onClick={closeLightbox}>
          <div className="fb-lightbox-content" onClick={e => e.stopPropagation()}>
            
            <button className="fb-close-btn" onClick={closeLightbox}>
              <Icon name="x" size={24} />
            </button>
            
            {/* বাম দিকে ছবি */}
            <div className="fb-lightbox-img-wrapper">
              <img src={selectedImage.imageUrl} alt={selectedImage.title} />
            </div>

            {/* ডান দিকে বিবরণ */}
            <div className="fb-lightbox-details">
              <div className="fb-lightbox-header">
                <div className="fb-lightbox-avatar">
                  <Icon name="image" size={24} />
                </div>
                <div className="fb-lightbox-meta">
                  <h4>ফুটন্ত ফুল</h4>
                  <span>{new Date(selectedImage.createdAt || Date.now()).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>

              <div className="fb-lightbox-title">{selectedImage.title}</div>
              
              <div className="fb-lightbox-badges">
                <span className="badge badge-info">অ্যালবাম: {selectedImage.album || 'সাধারণ'}</span>
                <span className="badge badge-approved">{CATS[selectedImage.category] || selectedImage.category}</span>
              </div>

              {/* Description Text */}
              <p className="fb-lightbox-desc">
                {selectedImage.description && selectedImage.description.trim() !== '' 
                  ? selectedImage.description 
                  : 'এই ছবির কোনো বিবরণ দেওয়া হয়নি।'}
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
}