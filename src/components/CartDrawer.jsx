import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FaTrash, FaShoppingCart, FaArrowRight, FaUser, FaPhone, FaCheckCircle, FaMinus, FaPlus } from 'react-icons/fa';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, products, updateCartQty, removeFromCart, guestCheckout } = useApp();

  // Steps: 'cart' -> 'form' -> 'success'
  const [step, setStep] = useState('cart');
  const [guestName, setGuestName] = useState('');
  const [guestSurname, setGuestSurname] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const cartWithProducts = cart.map(item => {
    const product = products.find(p => p.id === parseInt(item.ProductId || item.productId, 10));
    return { ...item, product };
  }).filter(item => item.product !== undefined);

  const totalPrice = cartWithProducts.reduce((acc, item) => {
    return acc + parseFloat(item.product.saleprice || item.product.price || 0) * item.quantity;
  }, 0);

  const totalItems = cartWithProducts.reduce((acc, item) => acc + item.quantity, 0);

  const handleClose = () => {
    setStep('cart');
    onClose();
  };

  const handleGuestCheckout = async (e) => {
    e.preventDefault();
    if (!guestName.trim() || !guestPhone.trim()) {
      alert('Ism va telefon raqami kiritilishi shart!');
      return;
    }
    setIsSubmitting(true);
    const success = await guestCheckout({ name: guestName, surname: guestSurname, phone: guestPhone });
    setIsSubmitting(false);
    if (success) {
      setStep('success');
      setTimeout(() => {
        setStep('cart');
        setGuestName('');
        setGuestSurname('');
        setGuestPhone('');
        handleClose();
      }, 3000);
    } else {
      alert("Xatolik yuz berdi. Iltimos, qaytadan urunib ko'ring.");
    }
  };

  const DEFAULT_IMG = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60';

  return (
    <>
      <div className="drawer-backdrop" onClick={handleClose} />
      <div className="drawer">

        {/* ========== STEP: SUCCESS ========== */}
        {step === 'success' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))', border: '2px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'scaleUp 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}>
                <FaCheckCircle style={{ fontSize: '2.8rem', color: '#10b981' }} />
              </div>
              <div style={{ position: 'absolute', top: -8, right: -8, width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #b56a2b, #c79a4f)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>🎉</div>
            </div>
            <div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: 900, color: '#10b981', marginBottom: '0.5rem' }}>Buyurtma qabul qilindi!</h3>
              <p style={{ color: '#8b735d', lineHeight: 1.7, fontSize: '0.95rem' }}>
                Buyurtmangiz muvaffaqiyatli yuborildi.<br />
                Tez orada siz bilan bog'lanamiz. 📞
              </p>
            </div>
            <div style={{ padding: '1rem 1.5rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '14px', fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>
              ✓ Telegram orqali xabardor qilindingiz
            </div>
          </div>
        )}

        {/* ========== STEP: CHECKOUT FORM ========== */}
        {step === 'form' && (
          <>
            <div className="drawer-header">
              <button onClick={() => setStep('cart')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8b735d', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'Outfit,sans-serif', fontWeight: 700, padding: 0 }}>
                ← Orqaga
              </button>
              <button className="close-btn" onClick={handleClose}>×</button>
            </div>

            <div className="drawer-body">
              {/* Step indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: '1.5rem' }}>
                {['Savat', "Ma'lumot", 'Tasdiqlash'].map((label, i) => (
                  <React.Fragment key={i}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: i === 1 ? 'linear-gradient(135deg,#b56a2b,#c79a4f)' : i < 1 ? 'rgba(181,106,43,0.3)' : 'rgba(120,90,40,0.1)', color: i <= 1 ? 'white' : '#8b735d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900, boxShadow: i === 1 ? '0 4px 12px rgba(181,106,43,0.4)' : 'none', transition: 'all 0.3s' }}>
                        {i + 1}
                      </div>
                      <span style={{ fontSize: '0.6rem', color: i === 1 ? '#b56a2b' : '#8b735d', fontWeight: i === 1 ? 800 : 600 }}>{label}</span>
                    </div>
                    {i < 2 && <div style={{ flex: 1, height: 2, background: i < 1 ? 'rgba(181,106,43,0.3)' : 'rgba(120,90,40,0.1)', margin: '0 4px', marginBottom: '16px' }} />}
                  </React.Fragment>
                ))}
              </div>

              {/* Order Summary */}
              <div style={{ marginBottom: '1.5rem', background: 'rgba(181,106,43,0.05)', border: '1px solid rgba(181,106,43,0.12)', borderRadius: '14px', padding: '1rem', overflow: 'hidden' }}>
                <div style={{ fontSize: '0.78rem', color: '#b56a2b', fontWeight: 800, marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📦 Buyurtma tarkibi</div>
                {cartWithProducts.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.7rem', alignItems: 'center', padding: '0.5rem 0', borderBottom: i < cartWithProducts.length - 1 ? '1px solid rgba(120,90,40,0.07)' : 'none' }}>
                    <img src={item.product.images || DEFAULT_IMG} alt={item.product.name} style={{ width: 38, height: 38, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(120,90,40,0.15)', flexShrink: 0 }} onError={e => { e.target.src = DEFAULT_IMG; }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#8b735d' }}>{item.quantity} ta</div>
                    </div>
                    <div style={{ fontWeight: 900, color: '#b56a2b', fontSize: '0.9rem', flexShrink: 0 }}>
                      ${(parseFloat(item.product.saleprice || item.product.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.8rem', fontWeight: 900, fontSize: '1rem', borderTop: '1.5px dashed rgba(181,106,43,0.2)', marginTop: '0.5rem' }}>
                  <span>Jami:</span>
                  <span style={{ color: '#b56a2b', fontSize: '1.1rem' }}>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Guest form */}
              <form onSubmit={handleGuestCheckout}>
                <div style={{ marginBottom: '1rem', padding: '0.8rem 1rem', background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: '12px', fontSize: '0.82rem', color: '#0891b2', fontWeight: 600, lineHeight: 1.5 }}>
                  ℹ️ Buyurtmangizni tasdiqlaymiz va siz bilan bog'lanamiz.
                </div>

                <div className="form-group">
                  <label className="form-label">Ismingiz <span style={{ color: '#f43f5e' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <FaUser style={{ position: 'absolute', left: '13px', top: '14px', color: '#b56a2b', fontSize: '0.85rem' }} />
                    <input type="text" required className="form-input" style={{ paddingLeft: '38px' }} placeholder="Masalan: Shodiyor" value={guestName} onChange={e => setGuestName(e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Familiyangiz</label>
                  <div style={{ position: 'relative' }}>
                    <FaUser style={{ position: 'absolute', left: '13px', top: '14px', color: '#b56a2b', fontSize: '0.85rem' }} />
                    <input type="text" className="form-input" style={{ paddingLeft: '38px' }} placeholder="Masalan: Bozorov" value={guestSurname} onChange={e => setGuestSurname(e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Telefon raqamingiz <span style={{ color: '#f43f5e' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <FaPhone style={{ position: 'absolute', left: '13px', top: '14px', color: '#b56a2b', fontSize: '0.85rem' }} />
                    <input type="tel" required className="form-input" style={{ paddingLeft: '38px' }} placeholder="+998901234567" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} />
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '1.2rem', fontSize: '1rem', padding: '0.9rem', gap: '0.6rem' }} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="spinner-sm" style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                      Yuborilmoqda...
                    </>
                  ) : (
                    <>Buyurtmani Tasdiqlash <FaArrowRight /></>
                  )}
                </button>
              </form>
            </div>
          </>
        )}

        {/* ========== STEP: CART ITEMS ========== */}
        {step === 'cart' && (
          <>
            <div className="drawer-header">
              <h2 className="drawer-title">
                <FaShoppingCart style={{ color: '#b56a2b' }} />
                Savatingiz
                {totalItems > 0 && <span style={{ background: 'rgba(181,106,43,0.12)', color: '#b56a2b', borderRadius: '999px', padding: '2px 10px', fontSize: '0.8rem', fontWeight: 800, border: '1px solid rgba(181,106,43,0.2)' }}>{totalItems} ta</span>}
              </h2>
              <button className="close-btn" onClick={handleClose}>×</button>
            </div>

            <div className="drawer-body">
              {cartWithProducts.length === 0 ? (
                <div className="empty-cart-msg" style={{ marginTop: '3rem' }}>
                  <FaShoppingCart className="empty-cart-icon" />
                  <p style={{ fontWeight: 700 }}>Savatingiz bo'sh</p>
                  <p style={{ fontSize: '0.85rem', color: '#a89080', marginTop: '0.4rem' }}>Mahsulot qo'shib, buyurtma bering!</p>
                </div>
              ) : (
                cartWithProducts.map((item) => (
                  <div className="cart-item" key={item.id || item.ProductId} style={{ borderRadius: '14px', padding: '0.9rem', marginBottom: '0.7rem', background: 'rgba(255,250,240,0.7)', border: '1px solid rgba(120,90,40,0.1)' }}>
                    <img
                      src={item.product.images || DEFAULT_IMG}
                      alt={item.product.name}
                      className="cart-item-img"
                      style={{ borderRadius: '12px', border: '1px solid rgba(120,90,40,0.15)' }}
                      onError={e => { e.target.src = DEFAULT_IMG; }}
                    />
                    <div className="cart-item-details">
                      <h4 className="cart-item-title">{item.product.name}</h4>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}>
                        <span className="cart-item-price">${item.product.saleprice || item.product.price}</span>
                        {item.product.salePercent > 0 && (
                          <span style={{ textDecoration: 'line-through', color: '#a89080', fontSize: '0.78rem' }}>${item.product.price}</span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      <button className="trash-btn" onClick={() => removeFromCart(item.id || item.ProductId, true)} title="O'chirish">
                        <FaTrash />
                      </button>
                      <div className="cart-qty-ctrl" style={{ background: 'rgba(120,90,40,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
                        <button className="qty-btn" onClick={() => updateCartQty(item.id || item.ProductId, item.quantity - 1, true)}>
                          <FaMinus style={{ fontSize: '0.6rem' }} />
                        </button>
                        <span className="qty-num" style={{ minWidth: '28px', textAlign: 'center', fontWeight: 900 }}>{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateCartQty(item.id || item.ProductId, item.quantity + 1, true)}>
                          <FaPlus style={{ fontSize: '0.6rem' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartWithProducts.length > 0 && (
              <div className="drawer-footer" style={{ padding: '1rem 1.2rem 1.5rem', borderTop: '1px solid rgba(120,90,40,0.1)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Price summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#8b735d' }}>
                    <span>{totalItems} ta mahsulot</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '1.1rem', borderTop: '1px dashed rgba(120,90,40,0.15)', paddingTop: '0.5rem' }}>
                    <span>Jami:</span>
                    <span style={{ color: '#b56a2b', fontSize: '1.3rem' }}>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  className="btn-primary"
                  onClick={() => setStep('form')}
                  style={{ padding: '1rem', fontSize: '1rem', letterSpacing: '0.3px', gap: '0.5rem' }}
                >
                  Buyurtma Berish <FaArrowRight />
                </button>

                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#a89080', margin: 0 }}>
                  🔐 Xavfsiz buyurtma • Login talab etilmaydi
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
