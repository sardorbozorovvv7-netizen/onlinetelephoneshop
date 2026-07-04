import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FaHeart, FaShoppingCart, FaExpand } from 'react-icons/fa';

export default function ProductCard({ product, onPromptLogin }) {
  const { likes, loggedUser, addToCart, toggleLike } = useApp();
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const isLiked = likes.includes(product.id);
  const inStock = parseInt(product.quantity || 0, 10) > 0;
  const hasDiscount = product.salePercent > 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product.id, 1);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    toggleLike(product.id);
  };

  const handleImageClick = (e) => {
    e.stopPropagation();
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="product-card">
        {hasDiscount && (
          <span className="card-badge">-{product.salePercent}% Chegirma</span>
        )}
        
        <button 
          className={`card-like-btn ${isLiked ? 'liked' : ''}`} 
          onClick={handleLike}
          title={isLiked ? "Sevimlilar ro'yxatidan o'chirish" : "Sevimlilarga qo'shish"}
        >
          <FaHeart />
        </button>

        <div className="card-img-container" onClick={handleImageClick} style={{ cursor: 'zoom-in' }}>
          <img 
            src={product.images || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60'} 
            alt={product.name} 
            className="card-img"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60';
            }}
          />
          <div className="card-img-overlay">
            <FaExpand style={{ fontSize: '1.5rem', color: 'white' }} />
          </div>
        </div>

        <div className="card-info">
          <span className="card-category">{product.category}</span>
          <h3 className="card-title">{product.name}</h3>

          <div className="card-price-row">
            <span className="card-price">${product.saleprice || product.price}</span>
            {hasDiscount && (
              <span className="card-old-price">${product.price}</span>
            )}
          </div>

          <div className="card-footer" style={{ justifyContent: 'space-between', marginTop: 'auto' }}>
            <div className="card-stock">
              <span className={`stock-dot ${inStock ? 'in' : 'out'}`}></span>
              {inStock ? `${product.quantity} ta mavjud` : 'Tugadi'}
            </div>
            
            <button 
              className="btn-primary" 
              style={{ width: 'auto', padding: '0.6rem 1rem' }}
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              <FaShoppingCart /> Qo'shish
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div 
          className="lightbox-backdrop" 
          onClick={() => setLightboxOpen(false)}
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>×</button>
            <img 
              src={product.images || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60'} 
              alt={product.name}
              className="lightbox-img"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60';
              }}
            />
            <div className="lightbox-info">
              <h3>{product.name}</h3>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#b56a2b' }}>${product.saleprice || product.price}</span>
                {hasDiscount && <span style={{ textDecoration: 'line-through', color: '#8b735d' }}>${product.price}</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
