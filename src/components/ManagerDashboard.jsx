import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FaPlus, FaEdit, FaTrash, FaListAlt, FaMobileAlt } from 'react-icons/fa';

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

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'categories'
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State for Product
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

  // Form State for Category
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
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    // Auto-calculate sale percent or vice versa
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

  return (
    <div className="dashboard-grid">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <button 
          className={`sidebar-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <FaMobileAlt /> Telefonlar
        </button>
        <button 
          className={`sidebar-tab ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <FaListAlt /> Turkumlar
        </button>
      </aside>

      {/* Main Content Pane */}
      <main className="dashboard-main">
        {activeTab === 'products' ? (
          <>
            <div className="dashboard-title-row">
              <h2>Telefonlar Ombori ({products.length} ta)</h2>
              <button className="btn-primary" style={{ width: 'auto' }} onClick={openAddProduct}>
                <FaPlus /> Yangi Telefon
              </button>
            </div>

            <div className="table-container">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Rasm</th>
                    <th>Nomi</th>
                    <th>Turkum</th>
                    <th>Narxi</th>
                    <th>Chegirmadagi narx</th>
                    <th>Miqdori</th>
                    <th>Holati</th>
                    <th>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(prod => (
                    <tr key={prod.id}>
                      <td>
                        <img 
                          src={prod.images} 
                          alt={prod.name} 
                          className="db-img"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60';
                          }}
                        />
                      </td>
                      <td style={{ fontWeight: 'bold' }}>{prod.name}</td>
                      <td>{prod.category}</td>
                      <td>${prod.price}</td>
                      <td>${prod.saleprice || prod.price}</td>
                      <td>{prod.quantity} ta</td>
                      <td>
                        <span className={`status-pill ${prod.status ? 'active' : 'inactive'}`}>
                          {prod.status ? 'Faol' : 'Nofaol'}
                        </span>
                      </td>
                      <td>
                        <div className="action-btn-row">
                          <button 
                            className="action-btn edit" 
                            onClick={() => openEditProduct(prod)}
                            title="Tahrirlash"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="action-btn delete" 
                            onClick={() => {
                              if (confirm("Haqiqatan ham ushbu telefonni o'chirmoqchimisiz?")) {
                                deleteProduct(prod.id);
                              }
                            }}
                            title="O'chirish"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <div className="dashboard-title-row">
              <h2>Turkumlar Boshqaruvi ({categories.length} ta)</h2>
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

            <div className="table-container" style={{ maxWidth: '600px' }}>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Turkum Nomi</th>
                    <th>Holati</th>
                    <th>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat.id}>
                      <td>{cat.id}</td>
                      <td style={{ fontWeight: 'bold' }}>{cat.name}</td>
                      <td>
                        <span className={`status-pill ${cat.status ? 'active' : 'inactive'}`}>
                          {cat.status ? 'Faol' : 'Nofaol'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="action-btn delete" 
                          onClick={() => {
                            if (confirm(`Haqiqatan ham "${cat.name}" turkumini o'chirmoqchimisiz?`)) {
                              deleteCategory(cat.id);
                            }
                          }}
                          title="O'chirish"
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
      </main>

      {/* Add/Edit Product Modal */}
      {showProductModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3 className="modal-title">
              {editingProduct ? 'Telefonni Tahrirlash' : 'Yangi Telefon Qo\'shish'}
            </h3>
            <form onSubmit={handleProductSubmit}>
              <div className="form-group">
                <label className="form-label">Telefon nomi</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Turkumi</label>
                <select
                  className="form-select"
                  value={prodForm.category}
                  onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Narxi ($)</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Chegirma Narxi ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={prodForm.saleprice}
                    placeholder={prodForm.price || 'Optional'}
                    onChange={(e) => setProdForm({ ...prodForm, saleprice: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Miqdori (Omborda)</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={prodForm.quantity}
                    onChange={(e) => setProdForm({ ...prodForm, quantity: e.target.value })}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Holati</label>
                  <select
                    className="form-select"
                    value={prodForm.status}
                    onChange={(e) => setProdForm({ ...prodForm, status: e.target.value === 'true' })}
                  >
                    <option value="true">Faol</option>
                    <option value="false">Nofaol</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Rasm havolasi (URL)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="https://example.com/phone.jpg"
                  value={prodForm.images}
                  onChange={(e) => setProdForm({ ...prodForm, images: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowProductModal(false)}>
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
