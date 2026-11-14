import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { api } from '../api';
import Icon from '../components/Icon';
import Skeleton from '../components/Skeleton';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState('members');
  const [data, setData] = useState({ members: [], events: [], gallery: [], committee: [], reviews: [] });
  const [config, setConfig] = useState({ yearsRunning: '৫+', benefited: '১০০০+' });
  const [loading, setLoading] = useState(true);

  // States for Gallery
  const [gForm, setGForm] = useState({ title: '', description: '', album: '', category: 'Social' });
  const [gFile, setGFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        api.getMembers(), 
        api.getEvents(), 
        api.getGallery(), 
        api.getCommittee(), 
        api.getAdminReviews()
      ]);

      setData({
        members: results[0].status === 'fulfilled' ? results[0].value : [],
        events: results[1].status === 'fulfilled' ? results[1].value : [],
        gallery: results[2].status === 'fulfilled' ? results[2].value : [],
        committee: results[3].status === 'fulfilled' ? results[3].value : [],
        reviews: results[4].status === 'fulfilled' ? results[4].value : [],
      });

      const hasError = results.some(r => r.status === 'rejected');
      if (hasError) toast('কিছু ডাটা লোড করতে সমস্যা হয়েছে।', 'warning');
    } catch (err) {
      toast('সার্ভারের সাথে কানেক্ট করা যাচ্ছে না।', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user) load(); }, [user]);

  /* Members */
  const approve = async (id) => { 
    try { await api.approveMember(id); await load(); toast('সদস্য অনুমোদিত হয়েছে', 'success'); } 
    catch { toast('সমস্যা হয়েছে', 'error'); }
  };
  const delMember = async (id) => { 
    if (!confirm('মুছবেন?')) return; 
    try { await api.deleteMember(id); await load(); toast('মুছে ফেলা হয়েছে', 'info'); } 
    catch { toast('সমস্যা হয়েছে', 'error'); }
  };

  /* Events */
  const [evForm, setEvForm] = useState({ title: '', description: '', event_date: '', type: 'event' });
  const addEvent = async (e) => { 
    e.preventDefault(); 
    try { await api.createEvent(evForm); setEvForm({ title: '', description: '', event_date: '', type: 'event' }); await load(); toast('ইভেন্ট যোগ হয়েছে', 'success'); } 
    catch { toast('সমস্যা হয়েছে', 'error'); }
  };
  const delEvent = async (id) => { 
    if (!confirm('মুছবেন?')) return; 
    try { await api.deleteEvent(id); await load(); toast('মুছে ফেলা হয়েছে', 'info'); } 
    catch { toast('সমস্যা হয়েছে', 'error'); }
  };

  /* Gallery */
  const addGallery = async (e) => { 
    e.preventDefault(); 
    if (!gFile) return toast('অনুগ্রহ করে একটি ছবি সিলেক্ট করুন', 'warning');
    
    setIsUploading(true);
    const fd = new FormData(); 
    fd.append('title', gForm.title); 
    fd.append('description', gForm.description);
    fd.append('album', gForm.album);
    fd.append('category', gForm.category); 
    fd.append('image', gFile); 

    try {
      await api.uploadGallery(fd); 
      setGForm({ title: '', description: '', album: '', category: 'Social' }); 
      setGFile(null); 
      const fileInput = document.getElementById('gal-file');
      if (fileInput) fileInput.value = '';
      
      await load(); 
      toast('ছবি সফলভাবে আপলোড হয়েছে', 'success'); 
    } catch (err) { 
      toast(err.response?.data?.message || 'ছবি আপলোডে সমস্যা হয়েছে', 'error'); 
    } finally {
      setIsUploading(false);
    }
  };

  const delGallery = async (id) => { 
    if (!confirm('আপনি কি নিশ্চিতভাবে এই ছবিটি ডিলিট করতে চান? (ওয়েবসাইট ও ডাটাবেস থেকে মুছে যাবে, তবে গুগল ড্রাইভে থাকবে)')) return; 
    
    setIsDeleting(id);
    try { 
      await api.deleteGalleryItem(id); 
      setData(prev => ({
        ...prev,
        gallery: prev.gallery.filter(g => g._id !== id)
      }));
      toast('ছবি সফলভাবে ডিলিট হয়েছে', 'success'); 
    } 
    catch (err) { 
      toast(err.response?.data?.message || 'ডিলিট করতে সমস্যা হয়েছে', 'error'); 
    } 
    finally {
      setIsDeleting(null);
    }
  };

  /* Committee */
  const [cForm, setCForm] = useState({ name: '', role: '' });
  const addCommittee = async (e) => { 
    e.preventDefault(); 
    try { await api.createCommittee(cForm); setCForm({ name: '', role: '' }); await load(); toast('কমিটি সদস্য যোগ হয়েছে', 'success'); } 
    catch { toast('সমস্যা হয়েছে', 'error'); }
  };
  const delCommittee = async (id) => { 
    if (!confirm('মুছবেন?')) return; 
    try { await api.deleteCommittee(id); await load(); toast('মুছে ফেলা হয়েছে', 'info'); } 
    catch { toast('সমস্যা হয়েছে', 'error'); }
  };

  /* Reviews */
  const approveRev = async (id) => { 
    try { await api.approveReview(id); await load(); toast('রিভিউ অ্যাপ্রুভড', 'success'); } 
    catch { toast('সমস্যা হয়েছে', 'error'); }
  };
  const delRev = async (id) => { 
    if (!confirm('মুছবেন?')) return; 
    try { await api.deleteReview(id); await load(); toast('রিভিউ মুছে ফেলা হয়েছে', 'info'); } 
    catch { toast('সমস্যা হয়েছে', 'error'); }
  };

  /* Config Settings */
  const saveConfig = async (e) => {
    e.preventDefault();
    try {
      await api.updateConfig(config);
      toast('সেটিংস সেভ হয়েছে', 'success');
    } catch {
      toast('সেটিংস সেভ করতে সমস্যা হয়েছে', 'error');
    }
  };

  const pending = data.members.filter(m => m.status === 'pending').length;
  const pendingRevs = data.reviews.filter(r => r.status === 'pending').length;

  const navItems = [
    { key: 'members', icon: 'users', label: 'সদস্য', badge: pending > 0 ? pending : null },
    { key: 'events', icon: 'calendar', label: 'ইভেন্ট' },
    { key: 'gallery', icon: 'image', label: 'গ্যালারি' },
    { key: 'committee', icon: 'briefcase', label: 'কমিটি' },
    { key: 'reviews', icon: 'star', label: 'রিভিউ', badge: pendingRevs > 0 ? pendingRevs : null },
    { key: 'settings', icon: 'settings', label: 'সেটিংস' },
  ];

  return (
    <>
      <style>{`
        .spinner {
          width: 18px; height: 18px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
          display: inline-block;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .admin-gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 16px;
          margin-top: 20px;
        }
        .admin-gallery-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: var(--r-md);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border);
          transition: transform 0.2s;
        }
        .admin-gallery-item:hover {
          transform: scale(1.02);
        }
        .admin-gallery-item img {
          width: 100%; height: 100%; object-fit: cover;
        }
        .admin-gallery-caption {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.9));
          color: #fff; font-size: 0.8rem; padding: 30px 10px 8px;
          text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .admin-del-btn {
          position: absolute; top: 8px; right: 8px;
          background: rgba(220, 38, 38, 0.9); color: #fff;
          border: none; width: 30px; height: 30px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 2; transition: all 0.2s;
          backdrop-filter: blur(4px);
        }
        .admin-del-btn:hover { background: #dc2626; transform: scale(1.1); }
        .admin-del-btn:disabled { background: #9ca3af; cursor: not-allowed; }
      `}</style>

      <div className="container page">
        <div className="dash-layout">
          <aside className="dash-sidebar">
            <div className="dash-sidebar-title">মেনু</div>
            <div className="dash-nav">
              {navItems.map(item => (
                <button key={item.key} className={`dash-nav-btn ${tab === item.key ? 'active' : ''}`} onClick={() => setTab(item.key)}>
                  <Icon name={item.icon} size={18} />
                  <span>{item.label}</span>
                  {item.badge && <span className="dash-nav-badge">{item.badge}</span>}
                </button>
              ))}
            </div>
          </aside>

          <main>
            <div className="dash-header">
              <div>
                <h1 className="icon-inline"><Icon name="settings" size={26} /> অ্যাডমিন প্যানেল</h1>
                <p>স্বাগতম, {user?.name || 'অ্যাডমিন'}</p>
              </div>
              <button className="btn btn-outline btn-sm icon-inline" onClick={logout}><Icon name="log-out" size={15} /> লগআউট</button>
            </div>

            <div className="stat-grid">
              <div className="stat"><div className="stat-icon"><Icon name="users" size={26} /></div><div className="stat-num">{data.members.length}</div><div className="stat-label">মোট সদস্য</div></div>
              <div className="stat"><div className="stat-icon"><Icon name="clock" size={26} /></div><div className="stat-num">{pending}</div><div className="stat-label">অপেক্ষমাণ সদস্য</div></div>
              <div className="stat"><div className="stat-icon"><Icon name="star" size={26} /></div><div className="stat-num">{pendingRevs}</div><div className="stat-label">নতুন রিভিউ</div></div>
            </div>

            {loading ? <Skeleton variant="card" /> : (
              <>
                {tab === 'members' && (
                  <div className="table-wrap"><table>
                    <thead><tr><th>নাম</th><th>ইমেইল</th><th>ফোন</th><th>স্ট্যাটাস</th><th>অ্যাকশন</th></tr></thead>
                    <tbody>
                      {data.members.length === 0 ? <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--muted)' }}>কোনো সদস্য নেই</td></tr> : data.members.map(m => (
                        <tr key={m._id}>
                          <td><strong>{m.name}</strong></td><td>{m.email}</td><td>{m.phone || '-'}</td>
                          <td><span className={`badge badge-${m.status === 'approved' ? 'approved' : 'pending'}`}><Icon name={m.status === 'approved' ? 'check' : 'clock'} size={12} />{m.status === 'approved' ? 'অনুমোদিত' : 'অপেক্ষমাণ'}</span></td>
                          <td style={{ display: 'flex', gap: 6 }}>
                            {m.status === 'pending' && <button className="btn btn-sm btn-primary icon-inline" onClick={() => approve(m._id)}><Icon name="check" size={14} /> অনুমোদন</button>}
                            <button className="btn btn-sm btn-danger icon-inline" onClick={() => delMember(m._id)}><Icon name="x" size={14} /> মুছুন</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table></div>
                )}

                {tab === 'events' && (
                  <>
                    <div className="card" style={{ marginBottom: 20 }}>
                      <h3 className="icon-inline" style={{ marginBottom: 16 }}><Icon name="plus" size={18} /> নতুন ইভেন্ট/নোটিশ</h3>
                      <form onSubmit={addEvent}>
                        <div className="form-group"><label>শিরোনাম</label><input value={evForm.title} onChange={e => setEvForm({ ...evForm, title: e.target.value })} required /></div>
                        <div className="form-group"><label>বিবরণ</label><textarea rows="2" value={evForm.description} onChange={e => setEvForm({ ...evForm, description: e.target.value })} required /></div>
                        <div className="form-grid">
                          <div className="form-group"><label>তারিখ</label><input type="date" value={evForm.event_date} onChange={e => setEvForm({ ...evForm, event_date: e.target.value })} required /></div>
                          <div className="form-group"><label>ধরন</label><select value={evForm.type} onChange={e => setEvForm({ ...evForm, type: e.target.value })}><option value="event">ইভেন্ট</option><option value="notice">নোটিশ</option></select></div>
                        </div>
                        <button type="submit" className="btn btn-primary icon-inline"><Icon name="plus" size={16} /> যোগ করুন</button>
                      </form>
                    </div>
                    <div className="table-wrap"><table>
                      <thead><tr><th>শিরোনাম</th><th>তারিখ</th><th>ধরন</th><th>অ্যাকশন</th></tr></thead>
                      <tbody>{data.events.map(e => (
                        <tr key={e._id}><td>{e.title}</td><td>{new Date(e.event_date).toLocaleDateString('bn-BD')}</td><td><span className={`badge ${e.type === 'event' ? 'badge-info' : 'badge-new'}`}>{e.type}</span></td><td><button className="btn btn-sm btn-danger icon-inline" onClick={() => delEvent(e._id)}><Icon name="x" size={14} /> মুছুন</button></td></tr>
                      ))}</tbody>
                    </table></div>
                  </>
                )}

                {tab === 'gallery' && (
                  <>
                    <div className="card" style={{ marginBottom: 30 }}>
                      <h3 className="icon-inline" style={{ marginBottom: 16 }}><Icon name="plus" size={18} /> নতুন ছবি আপলোড</h3>
                      <form onSubmit={addGallery}>
                        <div className="form-grid">
                          <div className="form-group">
                            <label>ছবির নাম (Title)</label>
                            <input value={gForm.title} onChange={e => setGForm({ ...gForm, title: e.target.value })} required disabled={isUploading} />
                          </div>
                          <div className="form-group">
                            <label>অ্যালবামের নাম</label>
                            <input value={gForm.album} onChange={e => setGForm({ ...gForm, album: e.target.value })} placeholder="যেমন: ইফতার বিতরণ ২০২৪" required disabled={isUploading} />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>ছবির বিবরণ (Description)</label>
                          <textarea rows="2" value={gForm.description} onChange={e => setGForm({ ...gForm, description: e.target.value })} placeholder="ছবির বিষয়ে কিছু লিখুন..." disabled={isUploading} />
                        </div>
                        <div className="form-grid">
                          <div className="form-group">
                            <label>ক্যাটাগরি</label>
                            <select value={gForm.category} onChange={e => setGForm({ ...gForm, category: e.target.value })} disabled={isUploading}>
                              <option value="Social">সমাজসেবা</option>
                              <option value="Sports">ক্রীড়া</option>
                              <option value="Education">শিক্ষা</option>
                              <option value="Others">অন্যান্য</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>ছবি সিলেক্ট করুন</label>
                            <input id="gal-file" type="file" accept="image/*" onChange={e => setGFile(e.target.files[0])} required disabled={isUploading} />
                          </div>
                        </div>
                        <button type="submit" className="btn btn-primary icon-inline" disabled={isUploading}>
                          {isUploading ? <><span className="spinner"></span> আপলোড হচ্ছে...</> : <><Icon name="plus" size={16} /> আপলোড করুন</>}
                        </button>
                      </form>
                    </div>
                    
                    <h3 style={{ marginBottom: 10 }}>আপলোড করা ছবিসমূহ</h3>
                    <div className="admin-gallery-grid">
                      {data.gallery.length === 0 ? (
                        <p style={{ color: 'var(--muted)' }}>কোনো ছবি আপলোড করা হয়নি।</p>
                      ) : data.gallery.map(g => (
                        <div key={g._id} className="admin-gallery-item">
                          {g.imageUrl ? <img src={g.imageUrl} alt={g.title} /> : <div style={{ background: '#eee', width: '100%', height: '100%' }} />}
                          <button 
                            className="admin-del-btn" 
                            onClick={() => delGallery(g._id)} 
                            disabled={isDeleting === g._id}
                            title="ছবি ডিলিট করুন"
                          >
                            {isDeleting === g._id ? <span className="spinner" style={{width: 14, height: 14, borderWidth: 2}}></span> : <Icon name="x" size={16} />}
                          </button>
                          <div className="admin-gallery-caption">{g.title}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {tab === 'committee' && (
                  <>
                    <div className="card" style={{ marginBottom: 20 }}>
                      <h3 className="icon-inline" style={{ marginBottom: 16 }}><Icon name="plus" size={18} /> নতুন কমিটি সদস্য</h3>
                      <form onSubmit={addCommittee}>
                        <div className="form-grid">
                          <div className="form-group"><label>নাম</label><input value={cForm.name} onChange={e => setCForm({ ...cForm, name: e.target.value })} required /></div>
                          <div className="form-group"><label>পদবি</label><input value={cForm.role} onChange={e => setCForm({ ...cForm, role: e.target.value })} required /></div>
                        </div>
                        <button type="submit" className="btn btn-primary icon-inline"><Icon name="plus" size={16} /> যোগ করুন</button>
                      </form>
                    </div>
                    <div className="table-wrap"><table>
                      <thead><tr><th>নাম</th><th>পদবি</th><th>অ্যাকশন</th></tr></thead>
                      <tbody>{data.committee.map(c => (
                        <tr key={c._id}><td><strong>{c.name}</strong></td><td>{c.role}</td><td><button className="btn btn-sm btn-danger icon-inline" onClick={() => delCommittee(c._id)}><Icon name="x" size={14} /> মুছুন</button></td></tr>
                      ))}</tbody>
                    </table></div>
                  </>
                )}

                {tab === 'reviews' && (
                  <div className="table-wrap"><table>
                    <thead><tr><th>নাম</th><th>রোল</th><th>রিভিউ</th><th>স্ট্যাটাস</th><th>অ্যাকশন</th></tr></thead>
                    <tbody>
                      {data.reviews.length === 0 ? <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--muted)' }}>কোনো রিভিউ নেই</td></tr> : data.reviews.map(r => (
                        <tr key={r._id}>
                          <td><strong>{r.name}</strong></td><td>{r.role}</td><td>{r.text}</td>
                          <td><span className={`badge badge-${r.status === 'approved' ? 'approved' : 'pending'}`}>{r.status === 'approved' ? 'অনুমোদিত' : 'অপেক্ষমাণ'}</span></td>
                          <td style={{ display: 'flex', gap: 6 }}>
                            {r.status === 'pending' && <button className="btn btn-sm btn-primary icon-inline" onClick={() => approveRev(r._id)}><Icon name="check" size={14} /> অ্যাপ্রুভ</button>}
                            <button className="btn btn-sm btn-danger icon-inline" onClick={() => delRev(r._id)}><Icon name="x" size={14} /> মুছুন</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table></div>
                )}

                {tab === 'settings' && (
                  <div className="card">
                    <h3 className="icon-inline" style={{ marginBottom: 16 }}><Icon name="settings" size={20} /> ওয়েবসাইট সেটিংস</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>এখানে দেওয়া নাম্বারগুলো হোমপেজে স্বয়ংক্রিয়ভাবে আপডেট হবে।</p>
                    <form onSubmit={saveConfig}>
                      <div className="form-group"><label>বছরের পথচলা</label><input value={config.yearsRunning} onChange={e => setConfig({...config, yearsRunning: e.target.value})} placeholder="যেমন: ৫+" required /></div>
                      <div className="form-group"><label>উপকৃত মানুষের সংখ্যা</label><input value={config.benefited} onChange={e => setConfig({...config, benefited: e.target.value})} placeholder="যেমন: ১০০০+" required /></div>
                      <button type="submit" className="btn btn-primary">সেভ করুন</button>
                    </form>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}