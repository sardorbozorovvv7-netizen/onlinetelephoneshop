import React from 'react';
import { useApp } from '../context/AppContext';
import { FaShoppingCart, FaHeart, FaStore, FaUserShield, FaCog, FaSignOutAlt, FaUser, FaHistory } from 'react-icons/fa';

export default function Navbar({ onOpenCart, onOpenWishlist, onOpenOrders, currentTab, setCurrentTab, searchQuery, setSearchQuery, onOpenLogin, onPromptRoleChange }) {
  const { activeRole, currentUser, loggedUser, cart, likes, logoutUser } = useApp();

  return (
    <>
      {/* Role Switcher Bar — faqat manager va superadmin uchun ko'rinadi */}
      {activeRole !== 'user' && (
        <div className="role-switcher-banner">
          <div>
            Tizimdagi roli: <strong style={{ color: '#06b6d4' }}>{activeRole.toUpperCase()}</strong>
            {activeRole !== 'user' && currentUser && ` (${currentUser.name || currentUser.username})`}
          </div>
          <div className="role-buttons">
            <button
              className={`role-btn ${activeRole === 'user' ? 'active' : ''}`}
              onClick={() => onPromptRoleChange('user')}
            >
              Mijoz (User)
            </button>
            <button
              className={`role-btn ${activeRole === 'manager' ? 'active' : ''}`}
              onClick={() => onPromptRoleChange('manager')}
            >
              Menejer (Manager)
            </button>
            <button
              className={`role-btn ${activeRole === 'superadmin' ? 'active' : ''}`}
              onClick={() => onPromptRoleChange('superadmin')}
            >
              Super Admin
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <nav className="navbar">
        <a className="logo" onClick={() => setCurrentTab('shop')}>
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

              {/* Purchase History button */}
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
                <button className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={onOpenLogin}>
                  <FaUser /> Kirish
                </button>
              )}
            </>
          )}

          {activeRole === 'manager' && (
            <button className={`icon-btn ${currentTab === 'manager' ? 'active' : ''}`} onClick={() => setCurrentTab('manager')} title="Menejer Panel">
              <FaCog />
            </button>
          )}

          {activeRole === 'superadmin' && (
            <button className={`icon-btn ${currentTab === 'superadmin' ? 'active' : ''}`} onClick={() => setCurrentTab('superadmin')} title="Superadmin Panel">
              <FaUserShield />
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
