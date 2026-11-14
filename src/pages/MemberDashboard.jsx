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
  const [data, setData] = useState({ members: [], events: [], gallery: [], committee: [] });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [members, events, gallery, committee] = await Promise.all([
      api.getMembers(),
      api.getEvents(),
      api.getGallery(),
      api.getCommittee(),
    ]);
    setData({ members, events, gallery, committee });
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  /* Members */
  const approve = async (id) => {
    await api.approveMember(id);
    await load();
    toast('সদস্য অনুমোদিত হয়েছে', 'success');
  };
  const delMember = async (id) => {
    if (!confirm('মুছবেন?')) return;
    await api.deleteMember(id);
    await load();
    toast('মুছে ফেলা হয়েছে', 'info');
  };

  /* Events */
  const [evForm, setEvForm] = useState({ title: '', description: '', event_date: '', type: 'event' });
  const addEvent = async (e) => {
    e.preventDefault();
    await api.createEvent(evForm);
    setEvForm({ title: '', description: '', event_date: '', type: 'event' });
    await load();
    toast('ইভেন্ট যোগ হয়েছে', 'success');
  };
  const delEvent = async (id) => {
    if (!confirm('মুছবেন?')) return;
    await api.deleteEvent(id);
    await load();
    toast('মুছে ফেলা হয়েছে', 'info');
  };

  /* Gallery */
  const [gForm, setGForm] = useState({ title: '', category: 'Social' });
  const [gFile, setGFile] = useState(null);
  const addGallery = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', gForm.title);
    fd.append('category', gForm.category);
    if (gFile) fd.append('image', gFile);
    await api.uploadGallery(fd);
    setGForm({ title: '', category: 'Social' });
    setGFile(null);
    await load();
    toast('গ্যালারি আইটেম যোগ হয়েছে', 'success');
  };
  const delGallery = async (id) => {
    if (!confirm('মুছবেন?')) return;
    await api.deleteGalleryItem(id);
    await load();
    toast('মুছে ফেলা হয়েছে', 'info');
  };

  /* Committee */
  const [cForm, setCForm] = useState({ name: '', role: '' });
  const addCommittee = async (e) => {
    e.preventDefault();
    await api.createCommittee(cForm);
    setCForm({ name: '', role: '' });
    await load();
    toast('কমিটি সদস্য যোগ হয়েছে', 'success');
  };
  const delCommittee = async (id) => {
    if (!confirm('মুছবেন?')) return;
    await api.deleteCommittee(id);
    await load();
    toast('মুছে ফেলা হয়েছে', 'info');
  };

  const pending = data.members.filter(m => m.status === 'pending').length;

  const navItems = [
    { key: 'members', icon: 'users', label: 'সদস্য', badge: pending > 0 ? pending : null },
    { key: 'events', icon: 'calendar', label: 'ইভেন্ট' },
    { key: 'gallery', icon: 'image', label: 'গ্যালারি' },
    { key: 'committee', icon: 'briefcase', label: 'কমিটি' },
  ];

  return (
    <div className="container page">
      <div className="dash-layout">
        {/* SIDEBAR */}
        <aside className="dash-sidebar">
          <div className="dash-sidebar-title">মেনু</div>
          <div className="dash-nav">
            {navItems.map(item => (
              <button
                key={item.key}
                className={`dash-nav-btn ${tab === item.key ? 'active' : ''}`}
                onClick={() => setTab(item.key)}
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
                {item.badge && <span className="dash-nav-badge">{item.badge}</span>}
              </button>
            ))}
          </div>
        </aside>

        {/* CONTENT */}
        <main>
          <div className="dash-header">
            <div>
              <h1 className="icon-inline">
                <Icon name="settings" size={26} /> অ্যাডমিন প্যানেল
              </h1>
              <p>স্বাগতম, {user.name}</p>
            </div>
            <button className="btn btn-outline btn-sm icon-inline" onClick={logout}>
              <Icon name="log-out" size={15} /> লগআউট
            </button>
          </div>

          <div className="stat-grid">
            <div className="stat">
              <div className="stat-icon"><Icon name="users" size={26} /></div>
              <div className="stat-num">{data.members.length}</div>
              <div className="stat-label">মোট সদস্য</div>
            </div>
            <div className="stat">
              <div className="stat-icon"><Icon name="clock" size={26} /></div>
              <div className="stat-num">{pending}</div>
              <div className="stat-label">অপেক্ষমাণ</div>
            </div>
            <div className="stat">
              <div className="stat-icon"><Icon name="check-circle" size={26} /></div>
              <div className="stat-num">{data.members.length - pending}</div>
              <div className="stat-label">অনুমোদিত</div>
            </div>
          </div>

          {loading ? (
            <Skeleton variant="card" />
          ) : (
            <>
              {/* MEMBERS */}
              {tab === 'members' && (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>নাম</th>
                        <th>ইমেইল</th>
                        <th>ফোন</th>
                        <th>স্ট্যাটাস</th>
                        <th>অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.members.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', color: 'var(--muted)' }}>
                            কোনো সদস্য নেই
                          </td>
                        </tr>
                      ) : (
                        data.members.map(m => (
                          <tr key={m._id}>
                            <td><strong>{m.name}</strong></td>
                            <td>{m.email}</td>
                            <td>{m.phone || '-'}</td>
                            <td>
                              <span
                                className={`badge badge-${
                                  m.status === 'approved' ? 'approved' : 'pending'
                                } icon-inline`}
                              >
                                <Icon
                                  name={m.status === 'approved' ? 'check' : 'clock'}
                                  size={12}
                                />
                                {m.status === 'approved' ? 'অনুমোদিত' : 'অপেক্ষমাণ'}
                              </span>
                            </td>
                            <td style={{ display: 'flex', gap: 6 }}>
                              {m.status === 'pending' && (
                                <button
                                  className="btn btn-sm btn-primary icon-inline"
                                  onClick={() => approve(m._id)}
                                >
                                  <Icon name="check" size={14} /> অনুমোদন
                                </button>
                              )}
                              <button
                                className="btn btn-sm btn-danger icon-inline"
                                onClick={() => delMember(m._id)}
                              >
                                <Icon name="x" size={14} /> মুছুন
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* EVENTS */}
              {tab === 'events' && (
                <>
                  <div className="card" style={{ marginBottom: 20 }}>
                    <h3 className="icon-inline" style={{ marginBottom: 16 }}>
                      <Icon name="plus" size={18} /> নতুন ইভেন্ট/নোটিশ
                    </h3>
                    <form onSubmit={addEvent}>
                      <div className="form-group">
                        <label>শিরোনাম</label>
                        <input
                          value={evForm.title}
                          onChange={e => setEvForm({ ...evForm, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>বিবরণ</label>
                        <textarea
                          rows="2"
                          value={evForm.description}
                          onChange={e => setEvForm({ ...evForm, description: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>তারিখ</label>
                          <input
                            type="date"
                            value={evForm.event_date}
                            onChange={e => setEvForm({ ...evForm, event_date: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>ধরন</label>
                          <select
                            value={evForm.type}
                            onChange={e => setEvForm({ ...evForm, type: e.target.value })}
                          >
                            <option value="event">ইভেন্ট</option>
                            <option value="notice">নোটিশ</option>
                          </select>
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary icon-inline">
                        <Icon name="plus" size={16} /> যোগ করুন
                      </button>
                    </form>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>শিরোনাম</th>
                          <th>তারিখ</th>
                          <th>ধরন</th>
                          <th>অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.events.map(e => (
                          <tr key={e._id}>
                            <td>{e.title}</td>
                            <td>{new Date(e.event_date).toLocaleDateString('bn-BD')}</td>
                            <td>
                              <span
                                className={`badge ${
                                  e.type === 'event' ? 'badge-info' : 'badge-new'
                                }`}
                              >
                                {e.type}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-danger icon-inline"
                                onClick={() => delEvent(e._id)}
                              >
                                <Icon name="x" size={14} /> মুছুন
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* GALLERY */}
              {tab === 'gallery' && (
                <>
                  <div className="card" style={{ marginBottom: 20 }}>
                    <h3 className="icon-inline" style={{ marginBottom: 16 }}>
                      <Icon name="plus" size={18} /> নতুন ছবি
                    </h3>
                    <form onSubmit={addGallery}>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>শিরোনাম</label>
                          <input
                            value={gForm.title}
                            onChange={e => setGForm({ ...gForm, title: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>ক্যাটাগরি</label>
                          <select
                            value={gForm.category}
                            onChange={e => setGForm({ ...gForm, category: e.target.value })}
                          >
                            <option value="Social">সমাজসেবা</option>
                            <option value="Sports">ক্রীড়া</option>
                            <option value="Education">শিক্ষা</option>
                            <option value="Others">অন্যান্য</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>ছবি</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => setGFile(e.target.files[0])}
                        />
                      </div>
                      <button type="submit" className="btn btn-primary icon-inline">
                        <Icon name="plus" size={16} /> যোগ করুন
                      </button>
                    </form>
                  </div>
                  <div className="gallery-grid">
                    {data.gallery.map(g => (
                      <div
                        key={g._id}
                        className="gallery-item"
                        style={
                          g.imageUrl ? { background: `url('${g.imageUrl}') center/cover` } : {}
                        }
                      >
                        {!g.imageUrl && (
                          <svg
                            viewBox="0 0 100 100"
                            style={{ width: '45%', height: '45%', opacity: 0.9 }}
                          >
                            <g fill="white">
                              <ellipse cx="50" cy="30" rx="10" ry="17" />
                              <ellipse cx="50" cy="30" rx="10" ry="17" transform="rotate(72 50 50)" />
                              <ellipse cx="50" cy="30" rx="10" ry="17" transform="rotate(144 50 50)" />
                              <ellipse cx="50" cy="30" rx="10" ry="17" transform="rotate(216 50 50)" />
                              <ellipse cx="50" cy="30" rx="10" ry="17" transform="rotate(288 50 50)" />
                            </g>
                            <circle cx="50" cy="50" r="9" fill="#ffa726" />
                          </svg>
                        )}
                        <button className="del-btn" onClick={() => delGallery(g._id)}>
                          <Icon name="x" size={14} />
                        </button>
                        <div className="caption">{g.title}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* COMMITTEE */}
              {tab === 'committee' && (
                <>
                  <div className="card" style={{ marginBottom: 20 }}>
                    <h3 className="icon-inline" style={{ marginBottom: 16 }}>
                      <Icon name="plus" size={18} /> নতুন কমিটি সদস্য
                    </h3>
                    <form onSubmit={addCommittee}>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>নাম</label>
                          <input
                            value={cForm.name}
                            onChange={e => setCForm({ ...cForm, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>পদবি</label>
                          <input
                            value={cForm.role}
                            onChange={e => setCForm({ ...cForm, role: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary icon-inline">
                        <Icon name="plus" size={16} /> যোগ করুন
                      </button>
                    </form>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>নাম</th>
                          <th>পদবি</th>
                          <th>অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.committee.map(c => (
                          <tr key={c._id}>
                            <td><strong>{c.name}</strong></td>
                            <td>{c.role}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-danger icon-inline"
                                onClick={() => delCommittee(c._id)}
                              >
                                <Icon name="x" size={14} /> মুছুন
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}