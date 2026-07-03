import React from 'react';
import { useApp } from '../context/AppContext';
import { FaShoppingCart, FaHeart, FaStore, FaUserShield, FaCog, FaSignOutAlt, FaUser, FaHistory } from 'react-icons/fa';

export default function Navbar({ onOpenCart, onOpenWishlist, onOpenOrders, currentTab, setCurrentTab, searchQuery, setSearchQuery, onOpenLogin, onPromptRoleChange, onLogoClick, showAdminPanel }) {
  const { activeRole, currentUser, loggedUser, cart, likes, logoutUser } = useApp();

  return (
    <>
      {/* 
        Admin Panel — ko'rsatish shartlari:
        1. showAdminPanel === true (logo 5 marta bosish yoki /#admin URL)
        2. yoki hozir manager/superadmin rolida
      */}
      {(showAdminPanel || activeRole !== 'user') && (
        <div className="role-switcher-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.7rem', background: 'rgba(181,106,43,0.15)', color: '#b56a2b', padding: '2px 8px', borderRadius: '999px', border: '1px solid rgba(181,106,43,0.25)', fontWeight: 700 }}>
              🔐 ADMIN
            </span>
            <span>
              Rol: <strong style={{ color: '#b56a2b' }}>{activeRole.toUpperCase()}</strong>
              {activeRole !== 'user' && currentUser && ` (${currentUser.name || currentUser.username})`}
            </span>
          </div>
          <div className="role-buttons">
            <button
              className={`role-btn ${activeRole === 'user' ? 'active' : ''}`}
              onClick={() => onPromptRoleChange('user')}
            >
              👤 Mijoz
            </button>
            <button
              className={`role-btn ${activeRole === 'manager' ? 'active' : ''}`}
              onClick={() => onPromptRoleChange('manager')}
            >
              🗂️ Menejer
            </button>
            <button
              className={`role-btn ${activeRole === 'superadmin' ? 'active' : ''}`}
              onClick={() => onPromptRoleChange('superadmin')}
            >
              👑 Super Admin
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <nav className="navbar">
        {/* Logo — 5 marta bosish admin panelni ochadi */}
        <a
          className="logo"
          onClick={onLogoClick || (() => setCurrentTab('shop'))}
          title="PHONESTORE"
          style={{ userSelect: 'none' }}
        >
          <FaStore className="logo-icon" />
          <span>PHONESTORE</span>
        </a>

        {currentTab === 'shop' && activeRole === 'user' && (
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Telefonlarni qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        <div className="nav-actions">
          {activeRole === 'user' && (
            <>
              {/* Liked list button */}
              <button className="icon-btn" onClick={onOpenWishlist} title="Sevimlilar">
                <FaHeart />
                {likes.length > 0 && <span className="badge">{likes.length}</span>}
              </button>

              {/* Cart Drawer button */}
              <button className="icon-btn" onClick={onOpenCart} title="Savat">
                <FaShoppingCart />
                {cart.length > 0 && <span className="badge">{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>}
              </button>

              {/* Purchase History — faqat login qilgan foydalanuvchi uchun */}
              {loggedUser && (
                <button className="icon-btn" onClick={onOpenOrders} title="Buyurtmalar tarixi">
                  <FaHistory />
                </button>
              )}

              {/* Login / Logout button */}
              {loggedUser ? (
                <button className="icon-btn" onClick={logoutUser} title="Chiqish" style={{ background: 'rgba(244, 63, 94, 0.1)', borderColor: 'rgba(244, 63, 94, 0.2)' }}>
                  <FaSignOutAlt style={{ color: '#f43f5e' }} />
                </button>
              ) : (
                <button className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={onOpenLogin}>
                  <FaUser /> Kirish
                </button>
              )}
            </>
          )}

          {activeRole === 'manager' && (
            <button
              className={`icon-btn ${currentTab === 'manager' ? 'active' : ''}`}
              onClick={() => setCurrentTab('manager')}
              title="Menejer Panel"
            >
              <FaCog />
            </button>
          )}

          {activeRole === 'superadmin' && (
            <button
              className={`icon-btn ${currentTab === 'superadmin' ? 'active' : ''}`}
              onClick={() => setCurrentTab('superadmin')}
              title="Superadmin Panel"
            >
              <FaUserShield />
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
