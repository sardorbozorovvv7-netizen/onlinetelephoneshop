import React from 'react';
import { useApp } from '../context/AppContext';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';

export default function ProductCard({ product, onPromptLogin }) {
  const { likes, loggedUser, addToCart, toggleLike } = useApp();

  const isLiked = likes.includes(product.id);
  const inStock = parseInt(product.quantity || 0, 10) > 0;
  const hasDiscount = product.salePercent > 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!loggedUser) {
      onPromptLogin();
      return;
    }
    addToCart(product.id, 1);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    if (!loggedUser) {
      onPromptLogin();
      return;
    }
    toggleLike(product.id);
  };

  return (
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

      <div className="card-img-container">
        <img 
          src={product.images || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60'} 
          alt={product.name} 
          className="card-img"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60';
          }}
        />
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
  );
}
