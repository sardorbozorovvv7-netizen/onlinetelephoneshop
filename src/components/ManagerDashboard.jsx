import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FaPlus, FaEdit, FaTrash, FaListAlt, FaMobileAlt, FaImage, FaEye, FaToggleOn, FaToggleOff } from 'react-icons/fa';

export default function ManagerDashboard() {
  const { 
    products, 
    categories, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    addCategory, 
    deleteCategory 
  } = useApp();

  const [activeTab, setActiveTab] = useState('products');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [imgError, setImgError] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const [prodForm, setProdForm] = useState({
    name: '',
    category: '',
    price: '',
    saleprice: '',
    salePercent: 0,
    quantity: '',
    images: '',
    status: true,
  });

  const [newCatName, setNewCatName] = useState('');

  const openAddProduct = () => {
    setEditingProduct(null);
    setProdForm({
      name: '',
      category: categories[0]?.name || '',
      price: '',
      saleprice: '',
      salePercent: 0,
      quantity: '',
      images: '',
      status: true,
    });
    setPreviewImage('');
    setImgError(false);
    setShowProductModal(true);
  };

  const openEditProduct = (prod) => {
    setEditingProduct(prod);
    setProdForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      saleprice: prod.saleprice,
      salePercent: prod.salePercent,
      quantity: prod.quantity,
      images: prod.images,
      status: prod.status,
    });
    setPreviewImage(prod.images);
    setImgError(false);
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    const priceNum = parseFloat(prodForm.price);
    const salePriceNum = parseFloat(prodForm.saleprice || prodForm.price);
    let percent = 0;
    if (priceNum > 0 && salePriceNum < priceNum) {
      percent = Math.round(((priceNum - salePriceNum) / priceNum) * 100);
    }

    const payload = {
      ...prodForm,
      salePercent: percent,
      saleprice: prodForm.saleprice || prodForm.price
    };

    let success;
    if (editingProduct) {
      success = await updateProduct(editingProduct.id, payload);
    } else {
      success = await addProduct(payload);
    }

    if (success) {
      setShowProductModal(false);
    } else {
      alert("Xatolik yuz berdi.");
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const success = await addCategory({ name: newCatName });
    if (success) {
      setNewCatName('');
    } else {
      alert("Turkum qo'shishda xatolik.");
    }
  };

  const handleToggleStatus = async (prod) => {
    await updateProduct(prod.id, { ...prod, status: !prod.status });
  };

  const handleImageUrlChange = (url) => {
    setProdForm({ ...prodForm, images: url });
    setPreviewImage(url);
    setImgError(false);
  };

  const DEFAULT_IMG = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60';

  return (
    <div className="dashboard-grid">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div style={{ marginBottom: '1rem', padding: '1rem', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #b56a2b, #c79a4f)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.8rem', fontSize: '1.5rem', color: 'white', boxShadow: '0 0 20px rgba(181,106,43,0.3)' }}>
            🗂️
          </div>
          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#4b3420' }}>Menejer Panel</div>
          <div style={{ fontSize: '0.75rem', color: '#8b735d' }}>Mahsulotlar boshqaruvi</div>
        </div>
        <button className={`sidebar-tab ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
          <FaMobileAlt /> Telefonlar ({products.length})
        </button>
        <button className={`sidebar-tab ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
          <FaListAlt /> Turkumlar ({categories.length})
        </button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        
        {/* ========== PRODUCTS ========== */}
        {activeTab === 'products' ? (
          <>
            <div className="dashboard-title-row">
              <h2>Telefonlar Ombori <span style={{ fontSize: '1rem', fontWeight: 600, color: '#8b735d' }}>({products.length} ta)</span></h2>
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                {/* View mode toggle */}
                <div style={{ display: 'flex', background: 'rgba(120,90,40,0.08)', border: '1px solid rgba(120,90,40,0.15)', borderRadius: '10px', overflow: 'hidden' }}>
                  <button
                    onClick={() => setViewMode('grid')}
                    style={{ padding: '0.5rem 0.8rem', background: viewMode === 'grid' ? 'linear-gradient(135deg,#b56a2b,#c79a4f)' : 'transparent', color: viewMode === 'grid' ? 'white' : '#8b735d', border: 'none', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s' }}
                    title="Grid ko'rinish"
                  >⊞</button>
                  <button
                    onClick={() => setViewMode('table')}
                    style={{ padding: '0.5rem 0.8rem', background: viewMode === 'table' ? 'linear-gradient(135deg,#b56a2b,#c79a4f)' : 'transparent', color: viewMode === 'table' ? 'white' : '#8b735d', border: 'none', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s' }}
                    title="Jadval ko'rinish"
                  >☰</button>
                </div>
                <button className="btn-primary" style={{ width: 'auto' }} onClick={openAddProduct}>
                  <FaPlus /> Yangi Telefon
                </button>
              </div>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.2rem' }}>
                {products.map(prod => (
                  <div key={prod.id} style={{ background: 'rgba(255,250,240,0.9)', border: `1px solid ${prod.status ? 'rgba(120,90,40,0.15)' : 'rgba(244,63,94,0.2)'}`, borderRadius: '16px', overflow: 'hidden', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(90,60,20,0.07)', position: 'relative' }}>
                    {/* Status badge */}
                    <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 5 }}>
                      <span className={`status-pill ${prod.status ? 'active' : 'inactive'}`} style={{ fontSize: '0.65rem' }}>
                        {prod.status ? '● Faol' : '● Nofaol'}
                      </span>
                    </div>
                    {prod.salePercent > 0 && (
                      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 5, background: 'linear-gradient(135deg, #b56a2b, #f43f5e)', color: 'white', borderRadius: '6px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 800 }}>
                        -{prod.salePercent}%
                      </div>
                    )}
                    <div style={{ height: '180px', overflow: 'hidden', background: 'rgba(120,90,40,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        src={prod.images || DEFAULT_IMG}
                        alt={prod.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                        onError={e => { e.target.src = DEFAULT_IMG; }}
                        onMouseEnter={e => { e.target.style.transform = 'scale(1.08)'; }}
                        onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
                      />
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.72rem', color: '#b56a2b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>{prod.category}</div>
                      <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#4b3420', marginBottom: '0.5rem', lineHeight: 1.3 }}>{prod.name}</h4>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#b56a2b' }}>${prod.saleprice || prod.price}</span>
                        {prod.salePercent > 0 && <span style={{ textDecoration: 'line-through', color: '#8b735d', fontSize: '0.85rem' }}>${prod.price}</span>}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#8b735d', marginBottom: '0.8rem' }}>
                        📦 {prod.quantity} ta qoldi
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="action-btn edit" style={{ flex: 1, justifyContent: 'center', gap: '0.4rem', fontSize: '0.82rem', padding: '0.5rem' }} onClick={() => openEditProduct(prod)}>
                          <FaEdit /> Tahrirlash
                        </button>
                        <button className="action-btn" style={{ padding: '0.5rem 0.6rem', color: prod.status ? '#10b981' : '#8b735d', borderColor: prod.status ? '#10b981' : 'rgba(120,90,40,0.2)' }} onClick={() => handleToggleStatus(prod)} title={prod.status ? 'Nofaol qilish' : 'Faol qilish'}>
                          {prod.status ? <FaToggleOn /> : <FaToggleOff />}
                        </button>
                        <button className="action-btn delete" style={{ padding: '0.5rem 0.6rem' }} onClick={() => { if (confirm("O'chirmoqchimisiz?")) deleteProduct(prod.id); }} title="O'chirish">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
              <div className="table-container">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Rasm</th>
                      <th>Nomi</th>
                      <th>Turkum</th>
                      <th>Narxi</th>
                      <th>Chegirma</th>
                      <th>Miqdori</th>
                      <th>Holati</th>
                      <th>Amallar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(prod => (
                      <tr key={prod.id}>
                        <td>
                          <img src={prod.images || DEFAULT_IMG} alt={prod.name} className="db-img" onError={(e) => { e.target.src = DEFAULT_IMG; }} />
                        </td>
                        <td style={{ fontWeight: 'bold' }}>{prod.name}</td>
                        <td><span style={{ background: 'rgba(181,106,43,0.1)', color: '#b56a2b', padding: '2px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>{prod.category}</span></td>
                        <td style={{ fontWeight: 700 }}>${prod.price}</td>
                        <td style={{ color: prod.salePercent > 0 ? '#10b981' : '#8b735d', fontWeight: prod.salePercent > 0 ? 700 : 400 }}>
                          {prod.salePercent > 0 ? `$${prod.saleprice} (-${prod.salePercent}%)` : '—'}
                        </td>
                        <td><span style={{ color: parseInt(prod.quantity) > 0 ? '#10b981' : '#f43f5e', fontWeight: 700 }}>{prod.quantity} ta</span></td>
                        <td>
                          <span className={`status-pill ${prod.status ? 'active' : 'inactive'}`}>
                            {prod.status ? 'Faol' : 'Nofaol'}
                          </span>
                        </td>
                        <td>
                          <div className="action-btn-row">
                            <button className="action-btn edit" onClick={() => openEditProduct(prod)} title="Tahrirlash"><FaEdit /></button>
                            <button className="action-btn" style={{ color: prod.status ? '#10b981' : '#8b735d' }} onClick={() => handleToggleStatus(prod)} title="Holat o'zgartirish">
                              {prod.status ? <FaToggleOn /> : <FaToggleOff />}
                            </button>
                            <button className="action-btn delete" onClick={() => { if (confirm("O'chirmoqchimisiz?")) deleteProduct(prod.id); }} title="O'chirish"><FaTrash /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          /* ========== CATEGORIES ========== */
          <>
            <div className="dashboard-title-row">
              <h2>Turkumlar Boshqaruvi <span style={{ fontSize: '1rem', fontWeight: 600, color: '#8b735d' }}>({categories.length} ta)</span></h2>
            </div>

            <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <input
                type="text"
                className="form-input"
                style={{ maxWidth: '300px' }}
                placeholder="Yangi turkum nomi..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
              />
              <button type="submit" className="btn-primary" style={{ width: 'auto' }}>
                <FaPlus /> Turkum Qo'shish
              </button>
            </form>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {categories.map(cat => (
                <div key={cat.id} style={{ background: 'rgba(255,250,240,0.9)', border: '1px solid rgba(120,90,40,0.15)', borderRadius: '14px', padding: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 3px 10px rgba(90,60,20,0.06)', transition: 'all 0.3s' }}>
                  <div>
                    <div style={{ fontWeight: 800, color: '#4b3420', marginBottom: '0.3rem' }}>{cat.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#8b735d' }}>
                      {products.filter(p => p.category === cat.name).length} ta telefon
                    </div>
                    <span className={`status-pill ${cat.status ? 'active' : 'inactive'}`} style={{ fontSize: '0.65rem', marginTop: '0.4rem', display: 'inline-block' }}>
                      {cat.status ? 'Faol' : 'Nofaol'}
                    </span>
                  </div>
                  <button
                    className="action-btn delete"
                    onClick={() => {
                      if (confirm(`"${cat.name}" turkumini o'chirmoqchimisiz?`)) {
                        deleteCategory(cat.id);
                      }
                    }}
                    title="O'chirish"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Add/Edit Product Modal */}
      {showProductModal && (
        <div className="modal-backdrop" onClick={() => setShowProductModal(false)}>
          <div className="modal" style={{ width: '640px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">
              {editingProduct ? '✏️ Telefonni Tahrirlash' : '📱 Yangi Telefon Qo\'shish'}
            </h3>
            <form onSubmit={handleProductSubmit}>
              {/* Two column layout */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Telefon nomi</label>
                  <input type="text" required className="form-input" value={prodForm.name}
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })} />
                </div>

                <div className="form-group">
                  <label className="form-label">Turkumi</label>
                  <select className="form-select" value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Holati</label>
                  <select className="form-select" value={prodForm.status}
                    onChange={(e) => setProdForm({ ...prodForm, status: e.target.value === 'true' })}>
                    <option value="true">Faol</option>
                    <option value="false">Nofaol</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Narxi ($) <span style={{ color: 'red' }}>*</span></label>
                  <input type="number" required className="form-input" value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })} />
                </div>

                <div className="form-group">
                  <label className="form-label">Chegirma Narxi ($)</label>
                  <input type="number" className="form-input" value={prodForm.saleprice}
                    placeholder={prodForm.price || 'Ixtiyoriy'}
                    onChange={(e) => setProdForm({ ...prodForm, saleprice: e.target.value })} />
                  {prodForm.price && prodForm.saleprice && parseFloat(prodForm.saleprice) < parseFloat(prodForm.price) && (
                    <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.3rem', fontWeight: 700 }}>
                      ✓ {Math.round(((parseFloat(prodForm.price) - parseFloat(prodForm.saleprice)) / parseFloat(prodForm.price)) * 100)}% chegirma
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Miqdori (Omborda) <span style={{ color: 'red' }}>*</span></label>
                  <input type="number" required className="form-input" value={prodForm.quantity}
                    onChange={(e) => setProdForm({ ...prodForm, quantity: e.target.value })} />
                </div>
              </div>

              {/* Image URL with Preview */}
              <div className="form-group">
                <label className="form-label">
                  <FaImage style={{ marginRight: '6px', color: '#b56a2b' }} />
                  Rasm havolasi (URL)
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="https://example.com/phone.jpg"
                  value={prodForm.images}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                />
                
                {/* Image Preview */}
                {previewImage && (
                  <div style={{ marginTop: '0.8rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(120,90,40,0.15)', background: 'rgba(120,90,40,0.04)' }}>
                    <div style={{ fontSize: '0.75rem', color: '#8b735d', fontWeight: 700, padding: '0.5rem 0.8rem', background: 'rgba(120,90,40,0.06)', borderBottom: '1px solid rgba(120,90,40,0.1)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <FaEye /> Rasm ko'rinishi
                    </div>
                    <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem' }}>
                      {imgError ? (
                        <div style={{ textAlign: 'center', color: '#f43f5e', fontSize: '0.85rem' }}>
                          ❌ Rasm yuklanmadi. URL to'g'riligini tekshiring.
                        </div>
                      ) : (
                        <img
                          src={previewImage}
                          alt="preview"
                          style={{ maxHeight: '160px', maxWidth: '100%', objectFit: 'contain', borderRadius: '8px' }}
                          onError={() => setImgError(true)}
                          onLoad={() => setImgError(false)}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowProductModal(false)}>
                  Bekor qilish
                </button>
                <button type="submit" className="btn-primary" style={{ width: 'auto' }}>
                  {editingProduct ? 'Yangilash' : 'Qo\'shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
