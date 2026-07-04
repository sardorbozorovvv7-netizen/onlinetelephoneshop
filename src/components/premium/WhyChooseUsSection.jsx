import React from 'react';
import { FaShieldAlt, FaShippingFast, FaUndo, FaHeadset } from 'react-icons/fa';

const WhyChooseUsSection = () => {
  const features = [
    {
      icon: <FaShieldAlt />,
      title: '100% Original Kafolat',
      desc: 'Barcha smartfonlarimiz rasmiy dilerlardan keladi va 1 yillik kafolatga ega.'
    },
    {
      icon: <FaShippingFast />,
      title: 'Tezkor Yetkazib Berish',
      desc: 'O\'zbekiston bo\'ylab eng tezkor va ishonchli yetkazib berish xizmati.'
    },
    {
      icon: <FaUndo />,
      title: 'Oson Qaytarish',
      desc: 'Sifatidan qoniqmasangiz, 14 kun ichida so\'zsiz qaytarib oling.'
    },
    {
      icon: <FaHeadset />,
      title: '24/7 Mijozlarni Qo\'llab-quvvatlash',
      desc: 'Bizning mutaxassislarimiz har qanday muammoingizni hal qilishga doim tayyor.'
    }
  ];

  return (
    <section style={{
      padding: '6rem 2rem',
      background: 'white',
      borderTop: '1px solid rgba(15, 23, 42, 0.05)',
      marginTop: '6rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 3vw, 2.5rem)',
            fontWeight: '800',
            color: '#0F172A',
            marginBottom: '1rem',
            letterSpacing: '-0.5px'
          }}>Nima Uchun Bizni Tanlashadi?</h2>
          <p style={{ color: '#64748B', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Biz sizning ishonchingizni oqlash uchun eng yuqori darajadagi xizmatlarni taqdim etamiz.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2.5rem'
        }}>
          {features.map((feature, idx) => (
            <div key={idx} style={{
              padding: '2.5rem',
              background: '#F8FAFC',
              borderRadius: '24px',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(15, 23, 42, 0.03)'
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(15, 23, 42, 0.06)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = '#F8FAFC';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: 'rgba(37, 99, 235, 0.1)',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.8rem' }}>
                {feature.title}
              </h3>
              <p style={{ color: '#64748B', lineHeight: '1.6', fontSize: '0.95rem' }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
