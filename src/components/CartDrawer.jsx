import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FaTrash, FaShoppingCart, FaArrowRight, FaUser, FaPhone, FaCheckCircle } from 'react-icons/fa';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, products, updateCartQty, removeFromCart, checkout, guestCheckout } = useApp();

  // Guest checkout form state
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestSurname, setGuestSurname] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Map cart items (which store ProductId as string) to products data
  const cartWithProducts = cart.map(item => {
    const product = products.find(p => p.id === parseInt(item.ProductId || item.productId, 10));
    return {
      ...item,
      product
    };
  }).filter(item => item.product !== undefined);

  const totalPrice = cartWithProducts.reduce((acc, item) => {
    const price = parseFloat(item.product.saleprice || item.product.price || 0);
    return acc + (price * item.quantity);
  }, 0);

  const handleCheckoutClick = () => {
    if (cartWithProducts.length === 0) return;
    setShowCheckoutForm(true);
  };

  const handleGuestCheckout = async (e) => {
    e.preventDefault();
    if (!guestName.trim() || !guestPhone.trim()) {
      alert('Ism va telefon raqami kiritilishi shart!');
      return;
    }
    setIsSubmitting(true);
    const success = await guestCheckout({
      name: guestName,
      surname: guestSurname,
      phone: guestPhone,
    });
    setIsSubmitting(false);
    if (success) {
      setOrderSuccess(true);
      setShowCheckoutForm(false);
      setGuestName('');
      setGuestSurname('');
      setGuestPhone('');
      setTimeout(() => {
        setOrderSuccess(false);
        onClose();
      }, 2500);
    } else {
      alert("Xatolik yuz berdi. Iltimos, qaytadan urunib ko'ring.");
    }
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={() => { setShowCheckoutForm(false); onClose(); }}></div>
      <div className="drawer">
        <div className="drawer-header">
          <h2 className="drawer-title">
            <FaShoppingCart style={{ color: '#b56a2b' }} /> Savatingiz
          </h2>
          <button className="close-btn" onClick={() => { setShowCheckoutForm(false); onClose(); }}>×</button>
        </div>

        {/* Success State */}
        {orderSuccess && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', animation: 'scaleUp 0.4s ease' }}>
              <FaCheckCircle style={{ fontSize: '2.5rem', color: '#10b981' }} />
            </div>
            <h3 style={{ color: '#10b981', fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.8rem' }}>Buyurtma qabul qilindi!</h3>
            <p style={{ color: '#8b735d', lineHeight: 1.6 }}>Buyurtmangiz muvaffaqiyatli yuborildi. Tez orada siz bilan bog'lanamiz.</p>
          </div>
        )}

        {/* Guest Checkout Form */}
        {showCheckoutForm && !orderSuccess && (
          <div className="drawer-body">
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(181, 106, 43, 0.08)', border: '1px solid rgba(181, 106, 43, 0.2)', borderRadius: '12px' }}>
              <h4 style={{ fontWeight: 800, marginBottom: '0.4rem', color: '#b56a2b' }}>📦 Buyurtma uchun ma'lumot</h4>
              <p style={{ fontSize: '0.85rem', color: '#8b735d', lineHeight: 1.5 }}>Buyurtmangizni tasdiqlash uchun ism va telefon raqamingizni kiriting.</p>
            </div>

            {/* Order summary */}
            <div style={{ marginBottom: '1.5rem' }}>
              {cartWithProducts.map(item => (
                <div key={item.id || item.ProductId} style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid rgba(120,90,40,0.1)' }}>
                  <img src={item.product.images} alt={item.product.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(120,90,40,0.2)' }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100'; }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.product.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#8b735d' }}>{item.quantity} ta × ${item.product.saleprice || item.product.price}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: '#b56a2b' }}>${(parseFloat(item.product.saleprice || item.product.price) * item.quantity).toFixed(2)}</div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0 0', fontWeight: 900, fontSize: '1.1rem' }}>
                <span>Jami:</span>
                <span style={{ color: '#b56a2b' }}>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handleGuestCheckout}>
              <div className="form-group">
                <label className="form-label">Ismingiz <span style={{ color: 'red' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <FaUser style={{ position: 'absolute', left: '12px', top: '13px', color: '#8b735d', fontSize: '0.85rem' }} />
                  <input
                    type="text"
                    required
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                    placeholder="Masalan: Shodiyor"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Familiyangiz</label>
                <div style={{ position: 'relative' }}>
                  <FaUser style={{ position: 'absolute', left: '12px', top: '13px', color: '#8b735d', fontSize: '0.85rem' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                    placeholder="Masalan: Bozorov"
                    value={guestSurname}
                    onChange={(e) => setGuestSurname(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Telefon raqamingiz <span style={{ color: 'red' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <FaPhone style={{ position: 'absolute', left: '12px', top: '13px', color: '#8b735d', fontSize: '0.85rem' }} />
                  <input
                    type="tel"
                    required
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                    placeholder="+998901234567"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowCheckoutForm(false)}
                >
                  Orqaga
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 2 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Yuborilmoqda...' : 'Buyurtma Berish'} <FaArrowRight />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Cart Items */}
        {!showCheckoutForm && !orderSuccess && (
          <>
            <div className="drawer-body">
              {cartWithProducts.length === 0 ? (
                <div className="empty-cart-msg">
                  <FaShoppingCart className="empty-cart-icon" />
                  <p>Savatingiz hozircha bo'sh</p>
                </div>
              ) : (
                cartWithProducts.map((item) => (
                  <div className="cart-item" key={item.id || item.ProductId}>
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
                        onClick={() => updateCartQty(item.id || item.ProductId, item.quantity - 1, true)}
                      >
                        -
                      </button>
                      <span className="qty-num">{item.quantity}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => updateCartQty(item.id || item.ProductId, item.quantity + 1, true)}
                      >
                        +
                      </button>
                    </div>

                    <button 
                      className="trash-btn" 
                      onClick={() => removeFromCart(item.id || item.ProductId, true)}
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
                <button className="btn-primary" onClick={handleCheckoutClick}>
                  Buyurtma Berish <FaArrowRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
