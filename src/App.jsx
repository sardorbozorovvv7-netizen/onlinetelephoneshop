import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import ManagerDashboard from './components/ManagerDashboard';
import SuperadminDashboard from './components/SuperadminDashboard';
import { FaHeart, FaShoppingBag, FaTimes, FaUser, FaPhone, FaLock, FaTrash } from 'react-icons/fa';

function MainAppContent() {
  const { 
    activeRole, 
    products, 
    categories, 
    likes, 
    orders,
    loggedUser,
    registerUser,
    changeRole,
    toggleLike,
    addToCart,
    loading 
  } = useApp();

  const [currentTab, setCurrentTab] = useState('shop'); // 'shop' | 'manager' | 'superadmin'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal states
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  
  // Role password protection states
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState(null);
  const [rolePassword, setRolePassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Form states for login
  const [loginName, setLoginName] = useState('');
  const [loginSurname, setLoginSurname] = useState('');
  const [loginPhone, setLoginPhone] = useState('');

  // Sync tab with role automatically when it changes
  React.useEffect(() => {
    if (activeRole === 'manager') {
      setCurrentTab('manager');
    } else if (activeRole === 'superadmin') {
      setCurrentTab('superadmin');
    } else {
      setCurrentTab('shop');
    }
  }, [activeRole]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center', background: '#f7ebd8', color: '#4b3420' }}>
        <div className="spinner" style={{ width: '50px', height: '50px', border: '5px solid rgba(75, 52, 32, 0.15)', borderTopColor: '#b56a2b', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '1.5rem', fontSize: '1.2rem', letterSpacing: '1px', color: '#8b735d' }}>Tizim yuklanmoqda...</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#a89080', maxWidth: '280px', textAlign: 'center', lineHeight: '1.5' }}>
          Server uyg'onmoqda, iltimos bir oz kuting (30 soniyagacha)...
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Filter products for standard Shop view
  const filteredProducts = products.filter(prod => {
    // Hide disabled products for users
    if (!prod.status) return false;
    
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // User Wishlist items
  const likedProducts = products.filter(p => likes.includes(p.id));

  // User Order list
  const userOrdersMapped = orders.map(order => {
    const product = products.find(p => p.id === parseInt(order.ProductId, 10));
    let historyDetails = {};
    try {
      historyDetails = JSON.parse(order.history || '{}');
    } catch {}
    return {
      ...order,
      product,
      details: historyDetails
    };
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginName || !loginPhone) {
      alert("Ism va telefon raqami kiritilishi shart!");
      return;
    }

    const success = await registerUser({
      name: loginName,
      surname: loginSurname,
      phone: loginPhone
    });

    if (success) {
      setLoginOpen(false);
      setLoginName('');
      setLoginSurname('');
      setLoginPhone('');
      alert("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
    } else {
      alert("Xatolik yuz berdi. Iltimos qayta urunib ko'ring.");
    }
  };

  const handleRoleChangePrompt = (role) => {
    if (role === 'user') {
      changeRole('user');
    } else {
      setPendingRole(role);
      setPasswordModalOpen(true);
      setRolePassword('');
      setPasswordError(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (rolePassword === 'menejer2009') {
      changeRole(pendingRole);
      setPasswordModalOpen(false);
      setRolePassword('');
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  return (
    <div className="app-container">
      <Navbar
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenOrders={() => setOrdersOpen(true)}
        onOpenLogin={() => setLoginOpen(true)}
        onPromptRoleChange={handleRoleChangePrompt}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="main-content">
        {/* SHOP VIEW (USER ROLE) */}
        {currentTab === 'shop' && (
          <>
            <section className="hero">
              <h1 className="hero-title">
                Eng Sifatli Telefonlar <br />
                <span className="hero-gradient">Hamyonbop Narxlarda</span>
              </h1>
              <p className="hero-desc">
                Bizning do'konda eng so'nggi rusumdagi smartfonlarni original kafolati va qulay to'lov shartlari bilan sotib oling.
              </p>

              {/* Category tabs */}
              <div className="category-tabs">
                <button
                  className={`category-tab ${selectedCategory === 'All' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('All')}
                >
                  Barchasi
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`category-tab ${selectedCategory === cat.name ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.name)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </section>

            {/* Products grid */}
            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                <h3>Telefonlar topilmadi</h3>
                <p>Qidiruv shartlarini o'zgartirib ko'ring.</p>
              </div>
            ) : (
              <div className="product-grid">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onPromptLogin={() => setLoginOpen(true)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* MANAGER VIEW (MANAGER ROLE) */}
        {currentTab === 'manager' && <ManagerDashboard />}

        {/* SUPERADMIN VIEW (SUPERADMIN ROLE) */}
        {currentTab === 'superadmin' && <SuperadminDashboard />}
      </main>

      {/* Cart Drawer Panel */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Login Modal */}
      {loginOpen && (
        <div className="modal-backdrop" onClick={() => setLoginOpen(false)}>
          <div className="modal" style={{ width: '450px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="modal-title" style={{ margin: 0 }}>Tizimga Kirish</h3>
              <button className="close-btn" onClick={() => setLoginOpen(false)}><FaTimes /></button>
            </div>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.4' }}>
              Mahsulotlarni savatchaga solish, buyurtma berish va sevimlilarga qo'shish uchun ro'yxatdan o'teing.
            </p>

            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label">Ismingiz <span style={{ color: 'red' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <FaUser style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                    placeholder="Masalan: Shodiyor"
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Familiyangiz</label>
                <div style={{ position: 'relative' }}>
                  <FaUser style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                    placeholder="Masalan: Fullstack"
                    value={loginSurname}
                    onChange={(e) => setLoginSurname(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Telefon raqamingiz <span style={{ color: 'red' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <FaPhone style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                    placeholder="Masalan: +998901234567"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                Kirish / Ro'yxatdan o'tish
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Role Switch Password Modal */}
      {passwordModalOpen && (
        <div className="modal-backdrop" onClick={() => setPasswordModalOpen(false)}>
          <div className="modal" style={{ width: '400px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="modal-title" style={{ margin: 0 }}>Parol Kiritish</h3>
              <button className="close-btn" onClick={() => setPasswordModalOpen(false)}><FaTimes /></button>
            </div>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.4' }}>
              <strong>{pendingRole === 'manager' ? 'Menejer' : 'Super Admin'}</strong> paneliga o'tish uchun maxfiy parolni kiriting.
            </p>

            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label className="form-label">Parol</label>
                <div style={{ position: 'relative' }}>
                  <FaLock style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    required
                    autoFocus
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                    placeholder="••••••••"
                    value={rolePassword}
                    onChange={(e) => {
                      setRolePassword(e.target.value);
                      setPasswordError(false);
                    }}
                  />
                </div>
                {passwordError && (
                  <div style={{ color: 'var(--color-accent)', fontSize: '0.85rem', marginTop: '0.6rem', fontWeight: 'bold' }}>
                    Xato parol kiritildi! Qayta uruning.
                  </div>
                )}
              </div>

              <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setPasswordModalOpen(false)}>
                  Bekor qilish
                </button>
                <button type="submit" className="btn-primary" style={{ width: 'auto' }}>
                  Tasdiqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Wishlist Modal */}
      {wishlistOpen && (
        <div className="modal-backdrop" onClick={() => setWishlistOpen(false)}>
          <div className="modal" style={{ width: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="modal-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaHeart style={{ color: '#f43f5e' }} /> Sevimli telefonlaringiz
              </h3>
              <button className="close-btn" onClick={() => setWishlistOpen(false)}><FaTimes /></button>
            </div>
            
            <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {likedProducts.length === 0 ? (
                <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem 0' }}>Sevimli telefonlar ro'yxati bo'sh.</p>
              ) : (
                likedProducts.map(prod => (
                  <div key={prod.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', marginBottom: '0.8rem' }}>
                    <img src={prod.images} alt={prod.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.95rem' }}>{prod.name}</h4>
                      <span style={{ fontSize: '0.85rem', color: '#06b6d4' }}>${prod.saleprice || prod.price}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-primary" style={{ width: 'auto', padding: '0.5rem 0.8rem', fontSize: '0.85rem' }} onClick={() => {
                        addToCart(prod.id, 1);
                        setWishlistOpen(false);
                        setCartOpen(true);
                      }}>Savatga</button>
                      <button className="action-btn delete" style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)' }} onClick={() => {
                        toggleLike(prod.id);
                      }} title="O'chirish">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Orders History Modal */}
      {ordersOpen && (
        <div className="modal-backdrop" onClick={() => setOrdersOpen(false)}>
          <div className="modal" style={{ width: '700px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="modal-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaShoppingBag style={{ color: '#06b6d4' }} /> Xaridlar Tarixi (HistoryModel)
              </h3>
              <button className="close-btn" onClick={() => setOrdersOpen(false)}><FaTimes /></button>
            </div>

            <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {userOrdersMapped.length === 0 ? (
                <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem 0' }}>Siz hali xaridlar amalga oshirmadingiz.</p>
              ) : (
                userOrdersMapped.map(order => (
                  <div key={order.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', marginBottom: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.5rem' }}>
                      <span>Buyurtma ID: #{order.id}</span>
                      <span>Sana: {new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      {order.product ? (
                        <>
                          <img src={order.product.images} alt={order.product.name} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                          <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '0.95rem' }}>{order.product.name}</h4>
                            <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>{order.quantity} ta x xarid qilindi</span>
                          </div>
                        </>
                      ) : (
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '0.95rem' }}>O'chirilgan telefon (ID: {order.ProductId})</h4>
                          <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>{order.quantity} ta x xarid qilindi</span>
                        </div>
                      )}
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: '800', color: '#10b981' }}>
                          ${(parseFloat(order.details.pricePaid || 0) * order.quantity).toFixed(2)}
                        </span>
                        <div style={{ fontSize: '0.75rem', color: '#10b981' }}>To'landi (Muvaffaqiyatli)</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
