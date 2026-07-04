import React from 'react';

const CategoriesSection = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <section style={{
      padding: '2rem 2rem 5rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: '800',
          color: '#0F172A',
          letterSpacing: '-0.5px',
          margin: 0
        }}>Turkumlar</h2>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <button
          style={{
            background: selectedCategory === 'All' ? '#0F172A' : 'white',
            color: selectedCategory === 'All' ? 'white' : '#0F172A',
            border: `1px solid ${selectedCategory === 'All' ? '#0F172A' : 'rgba(15, 23, 42, 0.1)'}`,
            padding: '12px 28px',
            borderRadius: '99px',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: selectedCategory === 'All' ? '0 10px 20px rgba(15, 23, 42, 0.15)' : 'none'
          }}
          onClick={() => setSelectedCategory('All')}
        >
          Barchasi
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            style={{
              background: selectedCategory === cat.name ? '#0F172A' : 'white',
              color: selectedCategory === cat.name ? 'white' : '#0F172A',
              border: `1px solid ${selectedCategory === cat.name ? '#0F172A' : 'rgba(15, 23, 42, 0.1)'}`,
              padding: '12px 28px',
              borderRadius: '99px',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: selectedCategory === cat.name ? '0 10px 20px rgba(15, 23, 42, 0.15)' : 'none'
            }}
            onClick={() => setSelectedCategory(cat.name)}
            onMouseOver={e => {
              if (selectedCategory !== cat.name) {
                e.currentTarget.style.borderColor = '#0F172A';
              }
            }}
            onMouseOut={e => {
              if (selectedCategory !== cat.name) {
                e.currentTarget.style.borderColor = 'rgba(15, 23, 42, 0.1)';
              }
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
