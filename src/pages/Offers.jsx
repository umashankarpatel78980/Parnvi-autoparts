import React, { useState, useEffect } from 'react';
import { Plus, Tag, Calendar, Trash2, Edit2, Gift, Zap, Percent, X, Check, Share2 } from 'lucide-react';
import './Offers.css';

const Offers = () => {
  const [offers, setOffers] = useState([
    {
      id: 1,
      title: 'Diwali Special 20%',
      type: 'Seasonal',
      discount: '20% Off',
      validUntil: '2025-11-15',
      status: 'Active',
      category: 'All Parts',
      description: 'Special discount for Diwali festival on all spare parts'
    },
    {
      id: 2,
      title: 'First Service Free',
      type: 'Welcome',
      discount: '100% Off',
      validUntil: '2025-12-31',
      status: 'Active',
      category: 'Service Only',
      description: 'Free first service for new customers'
    },
    {
      id: 3,
      title: 'Monsoon Engine Check',
      type: 'Seasonal',
      discount: '₹500 Flat',
      validUntil: '2025-08-30',
      status: 'Expired',
      category: 'Engine Service',
      description: 'Flat ₹500 discount on engine check during monsoon'
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [shareModal, setShareModal] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'Seasonal',
    discount: '',
    validUntil: '',
    category: '',
    description: ''
  });

  // Check and update expired offers
  useEffect(() => {
    const checkExpiredOffers = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      setOffers(prevOffers => 
        prevOffers.map(offer => {
          const validDate = new Date(offer.validUntil);
          validDate.setHours(0, 0, 0, 0);
          
          if (validDate < today && offer.status === 'Active') {
            return { ...offer, status: 'Expired' };
          }
          return offer;
        })
      );
    };

    checkExpiredOffers();
    const interval = setInterval(checkExpiredOffers, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setFormData({
      title: '',
      type: 'Seasonal',
      discount: '',
      validUntil: '',
      category: '',
      description: ''
    });
    setEditingOffer(null);
    setShowModal(true);
  };

  const openEditModal = (offer) => {
    setFormData({
      title: offer.title,
      type: offer.type,
      discount: offer.discount,
      validUntil: offer.validUntil,
      category: offer.category,
      description: offer.description || ''
    });
    setEditingOffer(offer);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.discount || !formData.validUntil || !formData.category) {
      alert('Please fill all required fields');
      return;
    }

    const validDate = new Date(formData.validUntil);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    validDate.setHours(0, 0, 0, 0);
    
    const status = validDate >= today ? 'Active' : 'Expired';

    if (editingOffer) {
      setOffers(offers.map(offer => 
        offer.id === editingOffer.id 
          ? { ...offer, ...formData, status }
          : offer
      ));
    } else {
      const newOffer = {
        id: Date.now(),
        ...formData,
        status
      };
      setOffers([...offers, newOffer]);
    }

    setShowModal(false);
    setFormData({
      title: '',
      type: 'Seasonal',
      discount: '',
      validUntil: '',
      category: '',
      description: ''
    });
  };

  const deleteOffer = (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      setOffers(offers.filter(offer => offer.id !== id));
    }
  };

  const reactivateOffer = (offer) => {
    const today = new Date();
    const thirtyDaysLater = new Date(today.setDate(today.getDate() + 30));
    const newValidDate = thirtyDaysLater.toISOString().split('T')[0];
    
    setOffers(offers.map(o => 
      o.id === offer.id 
        ? { ...o, status: 'Active', validUntil: newValidDate }
        : o
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const shareOffer = (platform, offer) => {
    const message = `🎉 *${offer.title}* 🎉\n\n💰 Discount: ${offer.discount}\n📦 Category: ${offer.category}\n⏰ Valid until: ${formatDate(offer.validUntil)}\n\n${offer.description}\n\nDon't miss out on this amazing offer!`;
    
    const encodedMessage = encodeURIComponent(message);
    
    let url = '';
    switch(platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedMessage}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodedMessage}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing via URL, so we copy to clipboard
        navigator.clipboard.writeText(message.replace(/\*/g, ''));
        alert('Offer details copied to clipboard! You can now paste it on Instagram.');
        return;
      default:
        return;
    }
    
    window.open(url, '_blank');
    setShareModal(null);
  };

  const activeOffers = offers.filter(o => o.status === 'Active');
  const expiredOffers = offers.filter(o => o.status === 'Expired');

  return (
    <div className="offers-page">
      <div className="offers-header">
        <h2 className="title-with-icon">
          <Tag size={28} />
          Active Offers & Promotions
        </h2>
        <button className="btn-primary" onClick={openCreateModal}>
          <Plus size={20} />
          Create New Offer
        </button>
      </div>

      {/* Active Offers */}
      {activeOffers.length > 0 && (
        <div className="offers-section">
          <h3 className="section-title">Active Offers ({activeOffers.length})</h3>
          <div className="offers-grid">
            {activeOffers.map((offer) => (
              <div key={offer.id} className="offer-card">
                <div className="offer-badge">{offer.type}</div>
                
                <div className="offer-main">
                  <div className="offer-icon">
                    {offer.discount.includes('%') ? <Percent size={28} /> : <Tag size={28} />}
                  </div>
                  <div className="offer-details">
                    <h3>{offer.title}</h3>
                    <div className="discount-value">{offer.discount}</div>
                    <div className="offer-cat">{offer.category}</div>
                  </div>
                </div>

                {offer.description && (
                  <p className="offer-description">{offer.description}</p>
                )}

                <div className="offer-footer">
                  <div className="validity">
                    <Calendar size={16} />
                    <span>Valid till: {formatDate(offer.validUntil)}</span>
                  </div>
                  <div className="offer-actions">
                    <button 
                      className="btn-icon btn-success" 
                      onClick={() => setShareModal(offer)}
                      title="Share Offer"
                    >
                      <Share2 size={18} />
                    </button>
                    <button 
                      className="btn-icon btn-primary" 
                      onClick={() => openEditModal(offer)}
                      title="Edit Offer"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      className="btn-icon btn-danger" 
                      onClick={() => deleteOffer(offer.id)}
                      title="Delete Offer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expired Offers */}
      {expiredOffers.length > 0 && (
        <div className="offers-section">
          <h3 className="section-title">Expired Offers ({expiredOffers.length})</h3>
          <div className="offers-grid">
            {expiredOffers.map((offer) => (
              <div key={offer.id} className="offer-card expired">
                <div className="expired-overlay">EXPIRED</div>
                <div className="offer-badge">{offer.type}</div>
                
                <div className="offer-main">
                  <div className="offer-icon">
                    {offer.discount.includes('%') ? <Percent size={28} /> : <Tag size={28} />}
                  </div>
                  <div className="offer-details">
                    <h3>{offer.title}</h3>
                    <div className="discount-value">{offer.discount}</div>
                    <div className="offer-cat">{offer.category}</div>
                  </div>
                </div>

                {offer.description && (
                  <p className="offer-description">{offer.description}</p>
                )}

                <div className="offer-footer">
                  <div className="validity">
                    <Calendar size={16} />
                    <span>Expired: {formatDate(offer.validUntil)}</span>
                  </div>
                  <div className="offer-actions">
                    <button 
                      className="btn-icon btn-success" 
                      onClick={() => reactivateOffer(offer)}
                      title="Reactivate Offer"
                    >
                      <Check size={18} />
                    </button>
                    <button 
                      className="btn-icon btn-primary" 
                      onClick={() => openEditModal(offer)}
                      title="Edit Offer"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      className="btn-icon btn-danger" 
                      onClick={() => deleteOffer(offer.id)}
                      title="Delete Offer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Promotion Tools */}
      <div className="promo-tools">
        <h3>Promotion Tools</h3>
        <div className="tools-grid">
          <div className="tool-item">
            <div className="tool-icon">
              <Gift size={24} />
            </div>
            <h4>Birthday Offers</h4>
            <p>Automated discounts for customer birthdays.</p>
            <button className="btn-secondary">Configure</button>
          </div>
          <div className="tool-item">
            <div className="tool-icon">
              <Zap size={24} />
            </div>
            <h4>Bulk SMS</h4>
            <p>Notify customers about new arrivals.</p>
            <button className="btn-secondary">Send Now</button>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingOffer ? 'Edit Offer' : 'Create New Offer'}</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="title">Offer Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Summer Sale 2025"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="type">Offer Type *</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Seasonal">Seasonal</option>
                    <option value="Welcome">Welcome</option>
                    <option value="Festival">Festival</option>
                    <option value="Flash">Flash Sale</option>
                    <option value="Clearance">Clearance</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="discount">Discount *</label>
                  <input
                    type="text"
                    id="discount"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    placeholder="e.g., 20% Off or ₹500 Flat"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g., All Parts, Service Only"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="validUntil">Valid Until *</label>
                  <input
                    type="date"
                    id="validUntil"
                    name="validUntil"
                    value={formData.validUntil}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Add a brief description of the offer..."
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingOffer ? 'Update Offer' : 'Create Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModal && (
        <div className="modal-overlay" onClick={() => setShareModal(null)}>
          <div className="modal-content share-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Share Offer</h3>
              <button className="btn-close" onClick={() => setShareModal(null)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="share-content">
              <h4>{shareModal.title}</h4>
              <p className="share-discount">{shareModal.discount}</p>
              
              <div className="share-buttons">
                <button 
                  className="share-btn whatsapp"
                  onClick={() => shareOffer('whatsapp', shareModal)}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Share on WhatsApp
                </button>
                
                <button 
                  className="share-btn facebook"
                  onClick={() => shareOffer('facebook', shareModal)}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Share on Facebook
                </button>
                
                <button 
                  className="share-btn instagram"
                  onClick={() => shareOffer('instagram', shareModal)}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                  Copy for Instagram
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Offers;