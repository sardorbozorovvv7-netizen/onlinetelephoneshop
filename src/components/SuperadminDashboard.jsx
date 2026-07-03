import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FaUserPlus, FaTrash, FaChartPie, FaUserTie, FaUsers, FaHistory, 
  FaShoppingBag, FaMobileAlt, FaMoneyBillWave, FaEye, FaChartBar
} from 'react-icons/fa';

// Simple inline bar chart using pure CSS/SVG
function BarChart({ data, label }) {
  if (!data || data.length === 0) return null;
  const maxVal = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px', padding: '0 4px' }}>
      {data.map((item, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '0.65rem', color: '#8b735d', fontWeight: 700 }}>
            {item.value > 0 ? (item.value > 999 ? `$${(item.value/1000).toFixed(1)}k` : `$${item.value.toFixed(0)}`) : '0'}
          </span>
          <div 
            style={{ 
              width: '100%', 
              background: 'linear-gradient(180deg, #b56a2b, #c79a4f)', 
              borderRadius: '4px 4px 0 0',
              height: `${Math.max(4, (item.value / maxVal) * 90)}px`,
              transition: 'height 0.6s ease',
              boxShadow: '0 0 8px rgba(181,106,43,0.4)',
            }} 
          />
          <span style={{ fontSize: '0.6rem', color: '#8b735d', fontWeight: 600, textAlign: 'center' }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// Donut / Ring Chart (SVG)
function DonutChart({ percent, color, size = 100, label }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(120,90,40,0.12)" strokeWidth="10" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color}66)` }}
        />
        <text x="50" y="54" textAnchor="middle" fill={color} fontSize="18" fontWeight="900" fontFamily="Outfit, sans-serif">
          {percent.toFixed(0)}%
        </text>
      </svg>
      <span style={{ fontSize: '0.75rem', color: '#8b735d', fontWeight: 700, textAlign: 'center' }}>{label}</span>
    </div>
  );
}

export default function SuperadminDashboard() {
  const { 
    managers, 
    users, 
    orders, 
    products, 
    addManager, 
    deleteManager 
  } = useApp();

  const [activeTab, setActiveTab] = useState('stats');
  const [showAddManagerModal, setShowAddManagerModal] = useState(false);
  const [viewOrderModal, setViewOrderModal] = useState(null);
  
  const [mngrForm, setMngrForm] = useState({
    username: '',
    email: '',
    phone: '',
  });

  const handleAddManager = async (e) => {
    e.preventDefault();
    const success = await addManager(mngrForm);
    if (success) {
      setShowAddManagerModal(false);
      setMngrForm({ username: '', email: '', phone: '' });
    } else {
      alert("Menejer qo'shishda xatolik.");
    }
  };

  // Statistics calculations
  const totalRevenue = orders.reduce((acc, order) => {
    try {
      const details = JSON.parse(order.history || '{}');
      const price = parseFloat(details.pricePaid || 0);
      return acc + (price * order.quantity);
    } catch {
      return acc;
    }
  }, 0);

  const totalProductsSold = orders.reduce((acc, order) => acc + order.quantity, 0);
  const activeProducts = products.filter(p => p.status).length;
  const inactiveProducts = products.filter(p => !p.status).length;
  const activePercent = products.length > 0 ? (activeProducts / products.length) * 100 : 0;

  // Revenue per product (top 5)
  const productRevMap = {};
  orders.forEach(order => {
    let price = 0;
    try { price = parseFloat(JSON.parse(order.history || '{}').pricePaid || 0); } catch {}
    const pid = order.ProductId?.toString();
    if (!productRevMap[pid]) productRevMap[pid] = { revenue: 0, qty: 0 };
    productRevMap[pid].revenue += price * order.quantity;
    productRevMap[pid].qty += order.quantity;
  });

  const topProducts = Object.entries(productRevMap)
    .map(([pid, data]) => {
      const prod = products.find(p => p.id === parseInt(pid));
      return { name: prod?.name || `#${pid}`, ...data };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);

  const barData = topProducts.map(p => ({ label: p.name.slice(0, 8) + (p.name.length > 8 ? '…' : ''), value: p.revenue }));

  // Orders enriched with user info
  const enrichedOrders = orders.map(order => {
    const product = products.find(p => p.id === parseInt(order.ProductId));
    const user = users.find(u => u.id === parseInt(order.UserId));
    let details = {};
    try { details = JSON.parse(order.history || '{}'); } catch {}
    return { ...order, product, user, details };
  });

  const statCards = [
    { label: 'Jami Tushum', value: `$${totalRevenue.toFixed(0)}`, icon: <FaMoneyBillWave />, color: '#10b981', glow: 'rgba(16,185,129,0.2)' },
    { label: 'Sotilgan Telefonlar', value: `${totalProductsSold} ta`, icon: <FaMobileAlt />, color: '#b56a2b', glow: 'rgba(181,106,43,0.2)' },
    { label: 'Menejerlar', value: `${managers.length} ta`, icon: <FaUserTie />, color: '#8b5cf6', glow: 'rgba(139,92,246,0.2)' },
    { label: 'Mijozlar', value: `${users.length} ta`, icon: <FaUsers />, color: '#06b6d4', glow: 'rgba(6,182,212,0.2)' },
    { label: "Jami Buyurtmalar", value: `${orders.length} ta`, icon: <FaShoppingBag />, color: '#f43f5e', glow: 'rgba(244,63,94,0.2)' },
    { label: "Mahsulotlar", value: `${products.length} ta`, icon: <FaChartBar />, color: '#c79a4f', glow: 'rgba(199,154,79,0.2)' },
  ];

  return (
    <div className="dashboard-grid">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div style={{ marginBottom: '1rem', padding: '1rem', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #b56a2b, #c79a4f)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.8rem', fontSize: '1.5rem', color: 'white', boxShadow: '0 0 20px rgba(181,106,43,0.4)' }}>
            👑
          </div>
          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#4b3420' }}>Super Admin</div>
          <div style={{ fontSize: '0.75rem', color: '#8b735d' }}>Bosh boshqaruvchi</div>
        </div>
        <button className={`sidebar-tab ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
          <FaChartPie /> Statistika
        </button>
        <button className={`sidebar-tab ${activeTab === 'managers' ? 'active' : ''}`} onClick={() => setActiveTab('managers')}>
          <FaUserTie /> Menejerlar ({managers.length})
        </button>
        <button className={`sidebar-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          <FaUsers /> Mijozlar ({users.length})
        </button>
        <button className={`sidebar-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
          <FaHistory /> Savdo Tarixi ({orders.length})
        </button>
      </aside>

      {/* Main Panel */}
      <main className="dashboard-main">

        {/* ========== STATS ========== */}
        {activeTab === 'stats' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', fontWeight: 900 }}>Tizim Statistikasi</h2>
              <span style={{ background: 'rgba(181,106,43,0.12)', color: '#b56a2b', fontSize: '0.75rem', fontWeight: 800, padding: '0.3rem 0.8rem', borderRadius: '999px', border: '1px solid rgba(181,106,43,0.2)' }}>LIVE</span>
            </div>

            {/* Stat Cards */}
            <div className="stats-grid">
              {statCards.map((card, i) => (
                <div key={i} className="stat-card" style={{ borderTop: `3px solid ${card.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span className="stat-label">{card.label}</span>
                    <div style={{ width: 36, height: 36, borderRadius: '10px', background: card.glow, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, fontSize: '1rem' }}>
                      {card.icon}
                    </div>
                  </div>
                  <span className="stat-value" style={{ background: `linear-gradient(135deg, ${card.color}, ${card.color}99)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '2rem' }}>
                    {card.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="charts-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
              
              {/* Bar Chart */}
              <div style={{ background: 'rgba(255,250,240,0.7)', border: '1px solid rgba(120,90,40,0.12)', borderRadius: '16px', padding: '1.5rem' }}>
                <h4 style={{ fontWeight: 800, marginBottom: '1.2rem', fontSize: '0.95rem', color: '#4b3420' }}>
                  📊 Top Mahsulotlar (Tushum bo'yicha)
                </h4>
                {barData.length > 0 ? (
                  <BarChart data={barData} />
                ) : (
                  <p style={{ color: '#8b735d', textAlign: 'center', padding: '2rem 0', fontSize: '0.85rem' }}>Hali buyurtmalar yo'q</p>
                )}
              </div>

              {/* Donut Charts */}
              <div style={{ background: 'rgba(255,250,240,0.7)', border: '1px solid rgba(120,90,40,0.12)', borderRadius: '16px', padding: '1.5rem' }}>
                <h4 style={{ fontWeight: 800, marginBottom: '1.5rem', fontSize: '0.95rem', color: '#4b3420' }}>
                  🍩 Mahsulot Holati
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <DonutChart percent={activePercent} color="#10b981" label={`Faol: ${activeProducts} ta`} />
                  <DonutChart percent={products.length > 0 ? (inactiveProducts / products.length) * 100 : 0} color="#f43f5e" label={`Nofaol: ${inactiveProducts} ta`} />
                  <DonutChart percent={orders.length > 0 ? Math.min(100, (totalProductsSold / products.reduce((a,p) => a + parseInt(p.quantity || 0), 0)) * 100) : 0} color="#b56a2b" label={`Sotilish darajasi`} />
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div style={{ marginTop: '1.5rem', background: 'rgba(255,250,240,0.7)', border: '1px solid rgba(120,90,40,0.12)', borderRadius: '16px', padding: '1.5rem' }}>
              <h4 style={{ fontWeight: 800, marginBottom: '1rem', fontSize: '0.95rem', color: '#4b3420' }}>
                🕒 So'ngi Buyurtmalar
              </h4>
              {enrichedOrders.slice(0, 5).length === 0 ? (
                <p style={{ color: '#8b735d', textAlign: 'center', padding: '1rem 0', fontSize: '0.85rem' }}>Hali buyurtmalar yo'q</p>
              ) : (
                enrichedOrders.slice(-5).reverse().map(order => (
                  <div key={order.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.7rem 0', borderBottom: '1px solid rgba(120,90,40,0.08)' }}>
                    {order.product && (
                      <img src={order.product.images} alt={order.product.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(120,90,40,0.15)' }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80'; }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{order.product?.name || `Telefon #${order.ProductId}`}</div>
                      <div style={{ fontSize: '0.75rem', color: '#8b735d' }}>
                        {order.user?.name || order.details?.guestName || `Foydalanuvchi #${order.UserId}`} • {order.quantity} ta
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, color: '#10b981', fontSize: '0.9rem' }}>
                      ${(parseFloat(order.details.pricePaid || 0) * order.quantity).toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* ========== MANAGERS ========== */}
        {activeTab === 'managers' && (
          <>
            <div className="dashboard-title-row">
              <h2>Menejerlar Ro'yxati</h2>
              <button className="btn-primary" style={{ width: 'auto' }} onClick={() => setShowAddManagerModal(true)}>
                <FaUserPlus /> Menejer Qo'shish
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem' }}>
              {managers.length === 0 && (
                <p style={{ color: '#8b735d', gridColumn: '1/-1', textAlign: 'center', padding: '2rem 0' }}>Hali menejer qo'shilmagan.</p>
              )}
              {managers.map(mngr => (
                <div key={mngr.id} style={{ background: 'rgba(255,250,240,0.8)', border: '1px solid rgba(120,90,40,0.15)', borderRadius: '16px', padding: '1.5rem', position: 'relative', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(90,60,20,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.3rem', fontWeight: 900 }}>
                      {mngr.username?.charAt(0)?.toUpperCase() || 'M'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: '#4b3420' }}>{mngr.username}</div>
                      <span className={`status-pill ${mngr.status === 1 ? 'active' : 'inactive'}`} style={{ fontSize: '0.7rem' }}>
                        {mngr.status === 1 ? '● Faol' : '● Nofaol'}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#8b735d', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <div>✉️ {mngr.email}</div>
                    <div>📞 {mngr.phone || 'Kiritilmagan'}</div>
                    <div>🆔 ID: #{mngr.id}</div>
                  </div>
                  <button
                    className="action-btn delete"
                    style={{ position: 'absolute', top: '1rem', right: '1rem' }}
                    onClick={() => {
                      if (confirm(`Haqiqatan ham "${mngr.username}" menejerini o'chirmoqchimisiz?`)) {
                        deleteManager(mngr.id);
                      }
                    }}
                    title="Menejerni o'chirish"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ========== USERS ========== */}
        {activeTab === 'users' && (
          <>
            <h2 style={{ marginBottom: '2rem' }}>Mijozlar Ro'yxati</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
              {users.length === 0 && (
                <p style={{ color: '#8b735d', gridColumn: '1/-1', textAlign: 'center', padding: '2rem 0' }}>Hali ro'yxatdan o'tgan foydalanuvchi yo'q.</p>
              )}
              {users.map(usr => {
                const userOrders = orders.filter(o => parseInt(o.UserId) === usr.id);
                const userSpend = userOrders.reduce((acc, o) => {
                  try { return acc + parseFloat(JSON.parse(o.history || '{}').pricePaid || 0) * o.quantity; } catch { return acc; }
                }, 0);
                return (
                  <div key={usr.id} style={{ background: 'rgba(255,250,240,0.8)', border: '1px solid rgba(120,90,40,0.15)', borderRadius: '16px', padding: '1.2rem', boxShadow: '0 4px 12px rgba(90,60,20,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                      <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #06b6d4, #0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.1rem', fontWeight: 900 }}>
                        {usr.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#4b3420' }}>{usr.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#8b735d' }}>ID #{usr.id}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#8b735d', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <div>📞 {usr.phone || 'Kiritilmagan'}</div>
                      <div>🛍️ {userOrders.length} ta buyurtma</div>
                      <div style={{ color: '#10b981', fontWeight: 700 }}>💰 ${userSpend.toFixed(2)} sarfladi</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ========== ORDERS ========== */}
        {activeTab === 'orders' && (
          <>
            <h2 style={{ marginBottom: '2rem' }}>Savdo Tarixi</h2>
            <div className="table-container">
              <table className="dashboard-table orders-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Telefon</th>
                    <th>Mijoz</th>
                    <th>Telefon raqam</th>
                    <th>Miqdor</th>
                    <th>Narxi</th>
                    <th>Sana</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {enrichedOrders.map(order => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          {order.product && (
                            <img src={order.product.images} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(120,90,40,0.2)' }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80'; }} />
                          )}
                          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{order.product?.name || `#${order.ProductId}`}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {order.user?.name || order.details?.guestName || `Foydalanuvchi #${order.UserId}`}
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#8b735d' }}>
                        {order.user?.phone || order.details?.guestPhone || '—'}
                      </td>
                      <td>{order.quantity} ta</td>
                      <td style={{ color: '#10b981', fontWeight: 800 }}>
                        ${(parseFloat(order.details.pricePaid || 0) * order.quantity).toFixed(2)}
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#8b735d' }}>
                        {new Date(order.createdAt || Date.now()).toLocaleString('uz-UZ')}
                      </td>
                      <td>
                        <button className="action-btn edit" onClick={() => setViewOrderModal(order)} title="Ko'rish">
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="order-card-list">
              {enrichedOrders.length === 0 ? (
                <p style={{ color: '#8b735d', textAlign: 'center', padding: '1.5rem 0' }}>Hali buyurtmalar yo'q</p>
              ) : (
                enrichedOrders.map(order => (
                  <div key={`card-${order.id}`} className="order-card">
                    <div className="order-card-row">
                      <div className="order-card-item">
                        <span className="order-card-label">Buyurtma ID</span>
                        <span className="order-card-value">#{order.id}</span>
                      </div>
                      <div className="order-card-item">
                        <span className="order-card-label">Mahsulot</span>
                        <span className="order-card-value">{order.product?.name || `#${order.ProductId}`}</span>
                      </div>
                    </div>
                    <div className="order-card-row">
                      <div className="order-card-item">
                        <span className="order-card-label">Mijoz</span>
                        <span className="order-card-value">{order.user?.name || order.details?.guestName || `#${order.UserId}`}</span>
                      </div>
                      <div className="order-card-item">
                        <span className="order-card-label">Telefon</span>
                        <span className="order-card-value">{order.user?.phone || order.details?.guestPhone || '—'}</span>
                      </div>
                    </div>
                    <div className="order-card-row">
                      <div className="order-card-item">
                        <span className="order-card-label">Miqdor</span>
                        <span className="order-card-value">{order.quantity} ta</span>
                      </div>
                      <div className="order-card-item">
                        <span className="order-card-label">Jami</span>
                        <span className="order-card-value">${(parseFloat(order.details.pricePaid || 0) * order.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="order-card-row">
                      <div className="order-card-item">
                        <span className="order-card-label">Sana</span>
                        <span className="order-card-value">{new Date(order.createdAt || Date.now()).toLocaleString('uz-UZ')}</span>
                      </div>
                      <button className="action-btn edit" onClick={() => setViewOrderModal(order)} title="Ko'rish">
                        <FaEye />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>

      {/* Add Manager Modal */}
      {showAddManagerModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3 className="modal-title">Yangi Menejer Tayinlash</h3>
            <form onSubmit={handleAddManager}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input type="text" required className="form-input" value={mngrForm.username}
                  onChange={(e) => setMngrForm({ ...mngrForm, username: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" required className="form-input" value={mngrForm.email}
                  onChange={(e) => setMngrForm({ ...mngrForm, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Telefon raqami</label>
                <input type="text" className="form-input" placeholder="+998901234567" value={mngrForm.phone}
                  onChange={(e) => setMngrForm({ ...mngrForm, phone: e.target.value })} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddManagerModal(false)}>Bekor qilish</button>
                <button type="submit" className="btn-primary" style={{ width: 'auto' }}>Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {viewOrderModal && (
        <div className="modal-backdrop" onClick={() => setViewOrderModal(null)}>
          <div className="modal" style={{ width: '480px' }} onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Buyurtma #{viewOrderModal.id}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {viewOrderModal.product && (
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', background: 'rgba(181,106,43,0.06)', borderRadius: '12px', border: '1px solid rgba(181,106,43,0.15)' }}>
                  <img src={viewOrderModal.product.images} alt="" style={{ width: 60, height: 60, borderRadius: 10, objectFit: 'cover' }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80'; }} />
                  <div>
                    <div style={{ fontWeight: 800 }}>{viewOrderModal.product.name}</div>
                    <div style={{ color: '#8b735d', fontSize: '0.85rem' }}>{viewOrderModal.quantity} ta × ${viewOrderModal.details.pricePaid}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontWeight: 900, color: '#10b981', fontSize: '1.1rem' }}>
                    ${(parseFloat(viewOrderModal.details.pricePaid || 0) * viewOrderModal.quantity).toFixed(2)}
                  </div>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                {[
                  { label: 'Mijoz', value: viewOrderModal.user?.name || viewOrderModal.details?.guestName || `#${viewOrderModal.UserId}` },
                  { label: 'Telefon', value: viewOrderModal.user?.phone || viewOrderModal.details?.guestPhone || '—' },
                  { label: 'Holat', value: viewOrderModal.details.status || 'Completed' },
                  { label: 'Sana', value: new Date(viewOrderModal.createdAt || Date.now()).toLocaleString('uz-UZ') },
                ].map((item, i) => (
                  <div key={i} style={{ padding: '0.8rem', background: 'rgba(255,250,240,0.8)', borderRadius: '10px', border: '1px solid rgba(120,90,40,0.1)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#8b735d', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.3rem' }}>{item.label}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#4b3420' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setViewOrderModal(null)}>Yopish</button>
          </div>
        </div>
      )}
    </div>
  );
}
