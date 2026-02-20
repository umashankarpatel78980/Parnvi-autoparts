import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddDealerModal({ dealer, onClose, onSave }) {
    const [formData, setFormData] = useState(dealer || {
        name: '',
        contact: '',
        email: '',
        address: '',
        gstNumber: '',
        status: 'Active'
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Dealer name is required';
        if (!formData.contact.trim()) newErrors.contact = 'Contact number is required';
        else if (!/^\+?[\d\s-]{10,15}$/.test(formData.contact)) newErrors.contact = 'Invalid contact number';
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSave(formData);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">{dealer ? 'Edit Dealer' : 'Add New Dealer'}</h2>
                    <button onClick={onClose} className="close-btn">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="space-y-6">
                        <div className="form-group">
                            <label className="form-label">Dealer Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="form-input"
                                placeholder="Enter full business name"
                            />
                            {errors.name && <p className="error-msg"><span className="w-1 h-1 rounded-full bg-red-500"></span> {errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-group">
                                <label className="form-label">Contact Number *</label>
                                <input
                                    type="text"
                                    value={formData.contact}
                                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                    className="form-input"
                                    placeholder="+91 XXXXX XXXXX"
                                    style={{ fontFamily: 'monospace' }}
                                />
                                {errors.contact && <p className="error-msg"><span className="w-1 h-1 rounded-full bg-red-500"></span> {errors.contact}</p>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="form-input"
                                    placeholder="dealer@domain.com"
                                />
                                {errors.email && <p className="error-msg"><span className="w-1 h-1 rounded-full bg-red-500"></span> {errors.email}</p>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Business Address *</label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="form-textarea"
                                placeholder="Enter shop/office complete address"
                                rows="3"
                                style={{ resize: 'none' }}
                            />
                            {errors.address && <p className="error-msg"><span className="w-1 h-1 rounded-full bg-red-500"></span> {errors.address}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-group">
                                <label className="form-label">GST Number</label>
                                <input
                                    type="text"
                                    value={formData.gstNumber}
                                    onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                                    className="form-input"
                                    placeholder="22AAAAA0000A1Z5"
                                    style={{ fontFamily: 'monospace' }}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Account Status *</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="form-select"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cancel-btn"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                        >
                            {dealer ? 'Update Dealer Info' : 'Register Dealer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
