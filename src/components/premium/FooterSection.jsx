import React from 'react';
import { FaFacebook, FaInstagram, FaTelegram, FaTwitter } from 'react-icons/fa';

const FooterSection = () => {
  return (
    <footer style={{
      background: '#0F172A',
      color: 'white',
      padding: '5rem 2rem 3rem 2rem',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '4rem',
        marginBottom: '4rem'
      }}>
        {/* Brand Column */}
        <div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '1.5rem', letterSpacing: '-1px' }}>
            TELEPHONE<span style={{ color: '#2563EB' }}>SHOP</span>
          </h3>
          <p style={{ color: '#94A3B8', lineHeight: '1.6', marginBottom: '2rem' }}>
            O'zbekistondagi eng ishonchli va yirik elektronika do'koni. Asl mahsulotlar va kafolatlangan xizmat.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {[<FaFacebook />, <FaInstagram />, <FaTelegram />, <FaTwitter />].map((icon, i) => (
              <a key={i} href="#" style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.2rem',
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = '#2563EB';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Links Columns */}
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', color: '#F8FAFC' }}>Tezkor Havolalar</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['Bosh Sahifa', 'Smartfonlar', 'Aksessuarlar', 'Biz Haqimizda'].map((link, i) => (
              <li key={i}>
                <a href="#" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.3s ease' }}
                  onMouseOver={e => e.currentTarget.style.color = '#2563EB'}
                  onMouseOut={e => e.currentTarget.style.color = '#94A3B8'}
                >{link}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', color: '#F8FAFC' }}>Mijozlar Uchun</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['To\'lov va Yetkazish', 'Kafolat', 'Qaytarish Shartlari', 'FAQ'].map((link, i) => (
              <li key={i}>
                <a href="#" style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.3s ease' }}
                  onMouseOver={e => e.currentTarget.style.color = '#2563EB'}
                  onMouseOut={e => e.currentTarget.style.color = '#94A3B8'}
                >{link}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', color: '#F8FAFC' }}>Aloqa</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', color: '#94A3B8' }}>
            <li>📞 +998 90 123 45 67</li>
            <li>✉️ info@telephoneshop.uz</li>
            <li>📍 Toshkent shahri, Chilonzor tumani, 1-uy</li>
          </ul>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingTop: '2rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
        color: '#64748B',
        fontSize: '0.9rem'
      }}>
        © {new Date().getFullYear()} Telephone Shop. Barcha huquqlar himoyalangan.
      </div>
    </footer>
  );
};

export default FooterSection;
