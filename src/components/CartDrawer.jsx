import React from 'react';
import { useApp } from '../context/AppContext';
import { FaTrash, FaShoppingCart, FaArrowRight } from 'react-icons/fa';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, products, updateCartQty, removeFromCart, checkout } = useApp();

  if (!isOpen) return null;

  // Map cart items (which store ProductId as string) to products data
  const cartWithProducts = cart.map(item => {
    const product = products.find(p => p.id === parseInt(item.ProductId, 10));
    return {
      ...item,
      product
    };
  }).filter(item => item.product !== undefined);

  const totalPrice = cartWithProducts.reduce((acc, item) => {
    const price = parseFloat(item.product.saleprice || item.product.price || 0);
    return acc + (price * item.quantity);
  }, 0);

  const handleCheckout = async () => {
    const success = await checkout();
    if (success) {
      alert("Xarid muvaffaqiyatli yakunlandi! Rahmat!");
      onClose();
    } else {
      alert("Xatolik yuz berdi. Iltimos, qaytadan urunib ko'ring.");
    }
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose}></div>
      <div className="drawer">
        <div className="drawer-header">
          <h2 className="drawer-title">
            <FaShoppingCart style={{ color: '#8b5cf6' }} /> Savatingiz
          </h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="drawer-body">
          {cartWithProducts.length === 0 ? (
            <div className="empty-cart-msg">
              <FaShoppingCart className="empty-cart-icon" />
              <p>Savatingiz hozircha bo'sh</p>
            </div>
          ) : (
            cartWithProducts.map((item) => (
              <div className="cart-item" key={item.id}>
                <img 
                  src={item.product.images} 
                  alt={item.product.name} 
                  className="cart-item-img"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60';
                  }}
                />
                <div className="cart-item-details">
                  <h4 className="cart-item-title">{item.product.name}</h4>
                  <div className="cart-item-price">
                    ${item.product.saleprice || item.product.price}
                  </div>
                </div>

                <div className="cart-qty-ctrl">
                  <button 
                    className="qty-btn"
                    onClick={() => updateCartQty(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="qty-num">{item.quantity}</span>
                  <button 
                    className="qty-btn"
                    onClick={() => updateCartQty(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <button 
                  className="trash-btn" 
                  onClick={() => removeFromCart(item.id)}
                  title="O'chirish"
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>

        {cartWithProducts.length > 0 && (
          <div className="drawer-footer">
            <div className="cart-summary-row">
              <span>Jami summa:</span>
              <span className="cart-total-price">${totalPrice.toFixed(2)}</span>
            </div>
            <button className="btn-primary" onClick={handleCheckout}>
              Sotib olish <FaArrowRight />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
