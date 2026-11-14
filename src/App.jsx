import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Activities from './pages/Activities';
import Gallery from './pages/Gallery';
import Membership from './pages/Membership';
import Contact from './pages/Contact';
import Login from './pages/Login';
import MemberDashboard from './pages/MemberDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/member" element={
            <ProtectedRoute role="member"><MemberDashboard /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '100px 20px' }}>
              <h1 style={{ fontSize: '5rem', color: 'var(--primary)' }}>404</h1>
              <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>পেজটি পাওয়া যায়নি</p>
              <Link to="/" className="btn btn-primary">হোমে ফিরুন</Link>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}