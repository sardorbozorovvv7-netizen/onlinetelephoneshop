import React, { useState, useEffect } from 'react';

const FlashSaleSection = () => {
  // Dummy countdown state
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 34,
    seconds: 56
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) hours--;
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section style={{
      padding: '4rem 2rem',
      maxWidth: '1200px',
      margin: '4rem auto',
      width: '100%',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      borderRadius: '32px',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(15, 23, 42, 0.2)'
    }}>
      {/* Glow effect */}
      <div style={{
        position: 'absolute',
        top: 0, right: 0,
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, transparent 70%)',
        filter: 'blur(40px)'
      }} />

      <span style={{
        background: '#EF4444',
        padding: '6px 16px',
        borderRadius: '99px',
        fontSize: '0.8rem',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginBottom: '1.5rem',
        zIndex: 1
      }}>
        🔥 Qaynoq Chegirma
      </span>

      <h2 style={{
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: '900',
        marginBottom: '2rem',
        textAlign: 'center',
        zIndex: 1
      }}>
        Faqat Bugun 50% Gacha Chegirma
      </h2>

      <div style={{
        display: 'flex',
        gap: '1rem',
        zIndex: 1
      }}>
        {Object.entries(timeLeft).map(([unit, value], i) => (
          <div key={i} style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            padding: '1.5rem',
            width: '100px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1 }}>
              {value.toString().padStart(2, '0')}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#CBD5E1', textTransform: 'uppercase', marginTop: '0.5rem', fontWeight: '600' }}>
              {unit === 'hours' ? 'Soat' : unit === 'minutes' ? 'Daqiqa' : 'Soniya'}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FlashSaleSection;
