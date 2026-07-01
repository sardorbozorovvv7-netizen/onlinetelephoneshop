import React from 'react';
import { useApp } from '../context/AppContext';
import { FaShoppingCart, FaHeart, FaStore, FaUserShield, FaCog, FaSignOutAlt, FaUser } from 'react-icons/fa';

export default function Navbar({ onOpenCart, onOpenWishlist, onOpenOrders, currentTab, setCurrentTab, searchQuery, setSearchQuery, onOpenLogin, onPromptRoleChange }) {
  const { activeRole, currentUser, loggedUser, cart, likes, logoutUser } = useApp();

  return (
    <>
      {/* Role Switcher Bar */}
      <div className="role-switcher-banner">
        <div>
          Tizimdagi roli: <strong style={{ color: '#06b6d4' }}>{activeRole.toUpperCase()}</strong>
          {activeRole === 'user' && loggedUser && (
            <span style={{ marginLeft: '10px', color: '#10b981' }}>
              <FaUser style={{ display: 'inline-block', marginRight: '4px', fontSize: '0.8rem' }} />
              {loggedUser.name}
            </span>
          )}
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
              <button className="icon-btn" onClick={loggedUser ? onOpenWishlist : onOpenLogin} title="Sevimlilar">
                <FaHeart />
                {likes.length > 0 && <span className="badge">{likes.length}</span>}
              </button>

              {/* Cart Drawer button */}
              <button className="icon-btn" onClick={loggedUser ? onOpenCart : onOpenLogin} title="Savat">
                <FaShoppingCart />
                {cart.length > 0 && <span className="badge">{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>}
              </button>

              {/* Purchase History button */}
              <button className="icon-btn" onClick={loggedUser ? onOpenOrders : onOpenLogin} title="Buyurtmalar tarixi">
                <FaList />
              </button>

              {/* Login / Logout button */}
              {loggedUser ? (
                <button className="icon-btn" onClick={logoutUser} title="Chiqish" style={{ background: 'rgba(244, 63, 94, 0.1)', borderColor: 'rgba(244, 63, 94, 0.2)' }}>
                  <FaSignOutAlt style={{ color: '#f43f5e' }} />
                </button>
              ) : (
                <button className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={onOpenLogin}>
                  Kirish
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

// Simple fallback icon in case FaList is not imported directly
function FaList(props) {
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M80 368H16a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16zm0-160H16a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16zm0-160H16A16 16 0 0 0 0 64v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16zm416 240H144a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h352a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-160H144a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h352a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-160H144a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h352a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16z"></path>
    </svg>
  );
}
