import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FaUserPlus, FaTrash, FaChartPie, FaUserTie, FaUsers, FaHistory } from 'react-icons/fa';

export default function SuperadminDashboard() {
  const { 
    managers, 
    users, 
    orders, 
    products, 
    addManager, 
    deleteManager 
  } = useApp();

  const [activeTab, setActiveTab] = useState('stats'); // 'stats' | 'managers' | 'users' | 'orders'
  const [showAddManagerModal, setShowAddManagerModal] = useState(false);
  
  // Manager form state
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

  // Calculations for Stats
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

  return (
    <div className="dashboard-grid">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <button 
          className={`sidebar-tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <FaChartPie /> Statistika
        </button>
        <button 
          className={`sidebar-tab ${activeTab === 'managers' ? 'active' : ''}`}
          onClick={() => setActiveTab('managers')}
        >
          <FaUserTie /> Menejerlar ({managers.length})
        </button>
        <button 
          className={`sidebar-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <FaUsers /> Mijozlar ({users.length})
        </button>
        <button 
          className={`sidebar-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <FaHistory /> Savdo Tarixi ({orders.length})
        </button>
      </aside>

      {/* Main Panel */}
      <main className="dashboard-main">
        {activeTab === 'stats' && (
          <>
            <h2 style={{ marginBottom: '2rem' }}>Tizim Statistikasi</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Jami Tushum</span>
                <span className="stat-value">${totalRevenue.toFixed(2)}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Sotilgan Telefonlar</span>
                <span className="stat-value">{totalProductsSold} ta</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Menejerlar Soni</span>
                <span className="stat-value">{managers.length} ta</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Mijozlar Soni</span>
                <span className="stat-value">{users.length} ta</span>
              </div>
            </div>
            
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-lg)' }}>
              <h3>Super Admin Roli haqida</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: '1.6' }}>
                Super Admin butun tizimni nazorat qiladi. Menejerlarni tayinlash, umumiy savdo hisobotlarini ko'rish, mijozlar ro'yxatini tekshirish va tizimdagi barcha ma'lumotlarni boshqarish vakolatiga ega. Barcha operatsiyalar ma'lumotlar bazasining <strong>superadmin</strong>, <strong>Manager</strong> va <strong>HistoryModel</strong> jadvallarida aks etadi.
              </p>
            </div>
          </>
        )}

        {activeTab === 'managers' && (
          <>
            <div className="dashboard-title-row">
              <h2>Menejerlar Ro'yxati</h2>
              <button className="btn-primary" style={{ width: 'auto' }} onClick={() => setShowAddManagerModal(true)}>
                <FaUserPlus /> Menejer Qo'shish
              </button>
            </div>

            <div className="table-container">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Foydalanuvchi nomi</th>
                    <th>Email</th>
                    <th>Telefon</th>
                    <th>Holati</th>
                    <th>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {managers.map(mngr => (
                    <tr key={mngr.id}>
                      <td>{mngr.id}</td>
                      <td style={{ fontWeight: 'bold' }}>{mngr.username}</td>
                      <td>{mngr.email}</td>
                      <td>{mngr.phone || 'Kiritilmagan'}</td>
                      <td>
                        <span className={`status-pill ${mngr.status === 1 ? 'active' : 'inactive'}`}>
                          {mngr.status === 1 ? 'Faol' : 'Nofaol'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="action-btn delete"
                          onClick={() => {
                            if (confirm(`Haqiqatan ham "${mngr.username}" menejerini o'chirmoqchimisiz?`)) {
                              deleteManager(mngr.id);
                            }
                          }}
                          title="Menejerni o'chirish"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <>
            <h2 style={{ marginBottom: '2rem' }}>Mijozlar (Foydalanuvchilar) Ro'yxati</h2>
            <div className="table-container">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Foydalanuvchi ismi</th>
                    <th>Email</th>
                    <th>Telefon</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(usr => (
                    <tr key={usr.id}>
                      <td>{usr.id}</td>
                      <td style={{ fontWeight: 'bold' }}>{usr.name}</td>
                      <td>{usr.email}</td>
                      <td>{usr.phone || 'Kiritilmagan'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'orders' && (
          <>
            <h2 style={{ marginBottom: '2rem' }}>Savdo Tarixi (HistoryModel)</h2>
            <div className="table-container">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Buyurtma ID</th>
                    <th>Telefon ID</th>
                    <th>Mijoz ID</th>
                    <th>Sotilgan Miqdor</th>
                    <th>Tafsilotlar (Narxi)</th>
                    <th>Sana</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => {
                    let details = {};
                    try {
                      details = JSON.parse(order.history || '{}');
                    } catch {}
                    
                    return (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.ProductId}</td>
                        <td>Foydalanuvchi #{order.UserId || '1'}</td>
                        <td>{order.quantity} ta</td>
                        <td style={{ color: '#10b981', fontWeight: 'bold' }}>
                          ${(parseFloat(details.pricePaid || 0) * order.quantity).toFixed(2)} (${details.pricePaid}/ta)
                        </td>
                        <td>{new Date(order.createdAt || Date.now()).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
                <label className="form-label">Username (Foydalanuvchi nomi)</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={mngrForm.username}
                  onChange={(e) => setMngrForm({ ...mngrForm, username: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  value={mngrForm.email}
                  onChange={(e) => setMngrForm({ ...mngrForm, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Telefon raqami</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="+998901234567"
                  value={mngrForm.phone}
                  onChange={(e) => setMngrForm({ ...mngrForm, phone: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddManagerModal(false)}>
                  Bekor qilish
                </button>
                <button type="submit" className="btn-primary" style={{ width: 'auto' }}>
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
