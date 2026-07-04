import React from 'react';

const HeroSection = () => {
  return (
    <section style={{
      padding: '8rem 2rem 6rem 2rem',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Background glow effects */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60vw',
        height: '60vw',
        background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 60%)',
        filter: 'blur(60px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(37, 99, 235, 0.1)',
          color: '#2563EB',
          padding: '8px 24px',
          borderRadius: '99px',
          fontWeight: '700',
          fontSize: '0.9rem',
          marginBottom: '2rem',
          border: '1px solid rgba(37, 99, 235, 0.2)',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          Yangi Davr Texnologiyasi
        </div>
        
        <h1 style={{
          fontSize: 'clamp(3rem, 6vw, 5rem)',
          fontWeight: '900',
          lineHeight: '1.1',
          letterSpacing: '-0.04em',
          color: '#0F172A',
          marginBottom: '1.5rem'
        }}>
          Kelajakni O'z <br />
          <span style={{ 
            background: 'linear-gradient(135deg, #2563EB, #3B82F6)', 
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Qo'lingizda His Eting</span>
        </h1>
        
        <p style={{
          fontSize: '1.25rem',
          color: '#64748B',
          maxWidth: '600px',
          margin: '0 auto 3rem',
          lineHeight: '1.6',
          fontWeight: '500'
        }}>
          Eng so'nggi rusumdagi flagman smartfonlarni rasmiy kafolat va ishonch bilan xarid qiling.
        </p>

        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{
            background: '#2563EB',
            color: 'white',
            border: 'none',
            padding: '16px 36px',
            borderRadius: '99px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(37, 99, 235, 0.4)' }}
          onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(37, 99, 235, 0.3)' }}
          >
            Hozir Xarid Qilish
          </button>
          
          <button style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            color: '#0F172A',
            border: '1px solid rgba(15, 23, 42, 0.1)',
            padding: '16px 36px',
            borderRadius: '99px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'translateY(-3px)' }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Barcha Telefonlar
          </button>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'flex',
          gap: '3rem',
          justifyContent: 'center',
          marginTop: '5rem',
          flexWrap: 'wrap'
        }}>
          {[
            { label: 'Mamnun Mijozlar', value: '50K+' },
            { label: 'Rasmiy Kafolat', value: '100%' },
            { label: 'Tezkor Yetkazish', value: '24/7' }
          ].map((stat, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '2rem', fontWeight: '800', color: '#0F172A' }}>{stat.value}</span>
              <span style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: '600' }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
