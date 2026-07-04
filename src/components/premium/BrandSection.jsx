import React from 'react';

const BrandSection = () => {
  const brands = [
    { name: 'Apple', logo: '🍎', color: '#000000' },
    { name: 'Samsung', logo: '📱', color: '#1428A0' },
    { name: 'Xiaomi', logo: '🟠', color: '#FF6900' },
    { name: 'Nothing', logo: '🔲', color: '#FF0000' },
    { name: 'Google', logo: '🇬', color: '#4285F4' },
    { name: 'OnePlus', logo: '1️⃣', color: '#F50514' }
  ];

  return (
    <section style={{
      padding: '4rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%'
    }}>
      <h2 style={{
        fontSize: '1.8rem',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: '3rem',
        color: '#0F172A',
        letterSpacing: '-0.5px'
      }}>Top Brendlar</h2>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2rem',
        justifyContent: 'center'
      }}>
        {brands.map((brand, i) => (
          <div key={i} style={{
            background: 'white',
            border: '1px solid rgba(15, 23, 42, 0.06)',
            borderRadius: '24px',
            padding: '2rem',
            width: '160px',
            height: '160px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.06)';
            e.currentTarget.style.borderColor = 'rgba(15, 23, 42, 0.15)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.02)';
            e.currentTarget.style.borderColor = 'rgba(15, 23, 42, 0.06)';
          }}
          >
            <span style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}>{brand.logo}</span>
            <span style={{ fontWeight: '700', color: '#0F172A', fontSize: '1rem' }}>{brand.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrandSection;
