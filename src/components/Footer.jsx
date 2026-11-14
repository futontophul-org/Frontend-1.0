import { Link } from 'react-router-dom';
import Icon from './Icon';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Logo size={48} />
            <div>
              <h4 style={{ marginBottom: 0 }}>ফুটন্ত ফুল</h4>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>জাতীয় শিশু-কিশোর সংগঠন</span>
            </div>
          </div>
          <p>ডাবলমুরিং জোন<br />চট্টগ্রাম, বাংলাদেশ</p>
        </div>
        <div>
          <h4>দ্রুত লিংক</h4>
          <Link to="/about">আমাদের সম্পর্কে</Link>
          <Link to="/activities">কার্যক্রম</Link>
          <Link to="/gallery">গ্যালারি</Link>
          <Link to="/membership">সদস্যপদ</Link>
        </div>
        <div>
          <h4>যোগাযোগ</h4>
          <p className="icon-inline"><Icon name="map-pin" size={15} /> আগ্রাবাদ, চট্টগ্রাম</p>
          <p className="icon-inline"><Icon name="mail" size={15} /> info@futontaphul.org</p>
          <p className="icon-inline"><Icon name="phone" size={15} /> +880 1XXX-XXXXXX</p>
        </div>
        <div>
          <h4>সোশ্যাল</h4>
          <p className="icon-inline" style={{ cursor: 'pointer' }}>
            <Icon name="facebook" size={15} /> Facebook (Double Mooring)
          </p>
          <p className="icon-inline" style={{ cursor: 'pointer' }}>
            <Icon name="instagram" size={15} /> Instagram (@futontofuL_dz)
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} ফুটন্ত ফুল, ডাবলমুরিং জোন। সর্বস্বত্ব সংরক্ষিত।
      </div>
    </footer>
  );
}