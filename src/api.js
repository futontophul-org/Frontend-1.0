import axios from 'axios';

// API URL (Vite এনভায়রনমেন্ট থেকে নেবে, না থাকলে লোকালহোস্ট)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// মক (Mock) ডাটা ব্যবহার করবেন কি না (আমরা বাস্তব ব্যাকএন্ড ব্যবহার করছি, তাই false)
export const USE_MOCK = false;

const client = axios.create({ 
  baseURL: API_URL, 
  withCredentials: true 
});

// প্রতিটি রিকোয়েস্টের সাথে JWT টোকেন পাঠানোর জন্য ইন্টারসেপ্টর
client.interceptors.request.use((config) => {
  const t = localStorage.getItem('ff_token');
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

export const api = {
  // ================= AUTH =================
  async login(email, password) {
    const res = await client.post('/api/auth/login', { email, password });
    return res.data;
  },

  async register(data) {
    const res = await client.post('/api/auth/register', data);
    return res.data;
  },

  async me() {
    const token = localStorage.getItem('ff_token');
    if (!token) return null; // টোকেন না থাকলে সরাসরি null রিটার্ন করবে

    try { 
      const res = await client.get('/api/auth/me'); 
      return res.data.user || res.data; 
    } catch (err) { 
      // টোকেন এক্সপায়ার হলে বা ভুল হলে টোকেন মুছে ফেলবে
      if (err.response && (err.response.status === 400 || err.response.status === 401)) {
        localStorage.removeItem('ff_token');
      }
      return null; 
    }
  },

  logout() { 
    localStorage.removeItem('ff_token'); 
  },

  // ================= PUBLIC DATA =================
  async getStats() {
    const res = await client.get('/api/stats');
    return res.data;
  },

  async getEvents() {
    const res = await client.get('/api/events');
    return res.data;
  },

  async getGallery(category) {
    const res = await client.get('/api/gallery', { params: { category } });
    return res.data;
  },

  async getCommittee() {
    const res = await client.get('/api/committee');
    return res.data;
  },

  async getNotices() {
    const res = await client.get('/api/notices');
    return res.data;
  },

  async getReviews() {
    const res = await client.get('/api/reviews');
    return res.data;
  },

  async submitReview(data) {
    const res = await client.post('/api/reviews', data);
    return res.data;
  },

  async sendContact(data) {
    const res = await client.post('/api/contact', data);
    return res.data;
  },

  // ================= ADMIN: MEMBERS =================
  async getMembers() {
    const res = await client.get('/api/admin/members');
    return res.data;
  },
  
  async approveMember(id) {
    const res = await client.patch(`/api/admin/members/${id}/approve`);
    return res.data;
  },
  
  async deleteMember(id) {
    const res = await client.delete(`/api/admin/members/${id}`);
    return res.data;
  },

  // ================= ADMIN: EVENTS =================
  async createEvent(data) {
    const res = await client.post('/api/admin/events', data);
    return res.data;
  },
  
  async deleteEvent(id) {
    const res = await client.delete(`/api/admin/events/${id}`);
    return res.data;
  },

  // ================= ADMIN: GALLERY =================
  async uploadGallery(formData) {
    const res = await client.post('/api/admin/gallery', formData, { 
      headers: { 'Content-Type': 'multipart/form-data' } 
    });
    return res.data;
  },
  
  async deleteGalleryItem(id) {
    const res = await client.delete(`/api/admin/gallery/${id}`);
    return res.data;
  },

  // ================= ADMIN: COMMITTEE =================
  async createCommittee(data) {
    const res = await client.post('/api/admin/committee', data);
    return res.data;
  },
  
  async deleteCommittee(id) {
    const res = await client.delete(`/api/admin/committee/${id}`);
    return res.data;
  },

  // ================= ADMIN: REVIEWS =================
  async getAdminReviews() {
    const res = await client.get('/api/admin/reviews');
    return res.data;
  },
  
  async approveReview(id) {
    const res = await client.patch(`/api/admin/reviews/${id}/approve`);
    return res.data;
  },
  
  async deleteReview(id) {
    const res = await client.delete(`/api/admin/reviews/${id}`);
    return res.data;
  },

  // ================= ADMIN: CONFIG =================
  async updateConfig(data) {
    const res = await client.post('/api/admin/config', data);
    return res.data;
  }
};