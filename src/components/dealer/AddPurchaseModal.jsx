import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload, Edit2, Check, Package } from 'lucide-react';

// Add Purchase Modal Component
export default function AddPurchaseModal({ dealers, onClose, onSave, purchase = null }) {
    const [formData, setFormData] = useState({
        dealerId: '',
        invoiceNumber: '',
        invoiceDate: '',
        products: [],
        totalAmount: 0,
        paidAmount: 0,
        paymentMode: 'Cash',
        billFile: null
    });

    const [currentCategory, setCurrentCategory] = useState('Auto Parts');
    const [currentProduct, setCurrentProduct] = useState({});
    const [editingIdx, setEditingIdx] = useState(null);

    // If editing a purchase, pre-fill form
    useEffect(() => {
        if (purchase) {
            setFormData({
                ...purchase,
                billFile: null // Reset file as we can't easily pre-fill it for security reasons
            });
        }
    }, [purchase]);

    const addProduct = () => {
        if (Object.keys(currentProduct).length > 0) {
            const productWithCategory = { ...currentProduct, categoryType: currentCategory };

            if (editingIdx !== null) {
                const newProducts = [...formData.products];
                newProducts[editingIdx] = productWithCategory;
                setFormData(prev => ({ ...prev, products: newProducts }));
                setEditingIdx(null);
            } else {
                setFormData(prev => ({
                    ...prev,
                    products: [...prev.products, productWithCategory]
                }));
            }
            setCurrentProduct({});
        }
    };

    const handleEditItem = (idx) => {
        const item = formData.products[idx];
        setCurrentCategory(item.categoryType);
        setCurrentProduct(item);
        setEditingIdx(idx);
    };

    // Calculate totals automatically whenever products or paidAmount changes
    useEffect(() => {
        const total = formData.products.reduce((sum, p) => {
            const qty = parseFloat(p.quantity) || 0;
            const price = parseFloat(p.pricePerUnit || p.price) || 0;
            return sum + (qty * price);
        }, 0);

        setFormData(prev => ({
            ...prev,
            totalAmount: total,
            pendingAmount: Math.max(0, total - prev.paidAmount)
        }));
    }, [formData.products, formData.paidAmount]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.products.length === 0) {
            alert('Please add at least one item to the purchase.');
            return;
        }
        onSave({
            ...formData,
            pendingAmount: formData.totalAmount - formData.paidAmount
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content large">
                <div className="modal-header">
                    <h2 className="modal-title">{purchase ? 'Edit Purchase' : 'Add New Purchase'}</h2>
                    <button onClick={onClose} className="close-btn">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="form-group">
                            <label className="form-label">Select Dealer *</label>
                            <select
                                value={formData.dealerId}
                                onChange={(e) => setFormData({ ...formData, dealerId: parseInt(e.target.value) })}
                                className="form-select"
                                required
                            >
                                <option value="">Choose a dealer</option>
                                {dealers.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Invoice Number *</label>
                            <input
                                type="text"
                                value={formData.invoiceNumber}
                                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                                className="form-input"
                                placeholder="e.g. INV/2024/001"
                                style={{ fontFamily: 'monospace' }}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Invoice Date *</label>
                            <input
                                type="date"
                                value={formData.invoiceDate}
                                onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                                className="form-input"
                                required
                            />
                        </div>
                    </div>

                    {/* Product Type Selection */}
                    <div>
                        <label className="form-label" style={{ marginBottom: '1rem' }}>Entry Category (Select for Current Item) *</label>
                        <div className="grid grid-cols-3 gap-4">
                            {['Auto Parts', 'Oil Products', 'Hardware Items'].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => {
                                        setCurrentCategory(type);
                                        if (editingIdx === null) setCurrentProduct({});
                                    }}
                                    className={`category-btn ${currentCategory === type ? 'active' : 'inactive'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Entry Form */}
                    <div className="item-entry-container">
                        <div className="item-entry-badge">
                            <div className="badge-text">{editingIdx !== null ? 'Updating' : 'Item Entry'}</div>
                        </div>

                        <h3 className="text-xl font-bold text-stone-200 mb-8 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                {editingIdx !== null ? <Edit2 className="w-4 h-4 text-amber-500" /> : <Plus className="w-4 h-4 text-amber-500" />}
                            </div>
                            {editingIdx !== null ? 'Modify Item' : 'Configure Products'}
                        </h3>

                        {currentCategory === 'Auto Parts' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="form-group">
                                    <p className="form-label text-[10px] px-1">Brand</p>
                                    <input type="text" placeholder="e.g. Tata" value={currentProduct.brand || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, brand: e.target.value })}
                                        className="form-input text-sm" />
                                </div>
                                <div className="form-group">
                                    <p className="form-label text-[10px] px-1">Model</p>
                                    <input type="text" placeholder="e.g. 407" value={currentProduct.model || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, model: e.target.value })}
                                        className="form-input text-sm" />
                                </div>
                                <div className="form-group">
                                    <p className="form-label text-[10px] px-1">Part Name</p>
                                    <input type="text" placeholder="Brake Pad" value={currentProduct.partName || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, partName: e.target.value })}
                                        className="form-input text-sm" />
                                </div>
                                <div className="form-group">
                                    <p className="form-label text-[10px] px-1">Part No.</p>
                                    <input type="text" placeholder="BP-123" value={currentProduct.partNumber || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, partNumber: e.target.value })}
                                        className="form-input text-sm" />
                                </div>
                                <div className="form-group">
                                    <p className="form-label text-[10px] px-1">Qty</p>
                                    <input type="number" placeholder="0" value={currentProduct.quantity || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, quantity: parseInt(e.target.value) })}
                                        className="form-input text-sm" />
                                </div>
                                <div className="form-group">
                                    <p className="form-label text-[10px] px-1">Price/Unit</p>
                                    <input type="number" placeholder="₹0.00" value={currentProduct.pricePerUnit || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, pricePerUnit: parseFloat(e.target.value) })}
                                        className="form-input text-sm font-bold text-amber-500" style={{ color: 'var(--primary)' }} />
                                </div>
                            </div>
                        )}

                        {currentCategory === 'Oil Products' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="form-group">
                                    <p className="form-label text-[10px] px-1">Company</p>
                                    <input type="text" placeholder="e.g. Castrol" value={currentProduct.company || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, company: e.target.value })}
                                        className="form-input text-sm" />
                                </div>
                                <div className="form-group">
                                    <p className="form-label text-[10px] px-1">Type</p>
                                    <input type="text" placeholder="e.g. Engine Oil" value={currentProduct.oilType || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, oilType: e.target.value })}
                                        className="form-input text-sm" />
                                </div>
                                <div className="form-group">
                                    <p className="form-label text-[10px] px-1">Packaging</p>
                                    <select value={currentProduct.packaging || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, packaging: e.target.value })}
                                        className="form-select text-sm">
                                        <option value="">Pack Size</option>
                                        {['500ml', '1L', '2L', '5L', '10L', '15L', '20L', '50L', '210L'].map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <p className="form-label text-[10px] px-1">Qty</p>
                                    <input type="number" placeholder="0" value={currentProduct.quantity || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, quantity: parseInt(e.target.value) })}
                                        className="form-input text-sm" />
                                </div>
                                <div className="form-group">
                                    <p className="form-label text-[10px] px-1">Price/Unit</p>
                                    <input type="number" placeholder="₹0.00" value={currentProduct.price || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })}
                                        className="form-input text-sm font-bold text-amber-500" style={{ color: 'var(--primary)' }} />
                                </div>
                            </div>
                        )}

                        {currentCategory === 'Hardware Items' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="form-group">
                                    <p className="form-label text-[10px] px-1">Category</p>
                                    <input type="text" placeholder="e.g. Tools" value={currentProduct.category || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                                        className="form-input text-sm" />
                                </div>
                                <div className="form-group">
                                    <p className="form-label text-[10px] px-1">Item Name</p>
                                    <input type="text" placeholder="e.g. Spanner" value={currentProduct.itemName || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, itemName: e.target.value })}
                                        className="form-input text-sm" />
                                </div>
                                <div className="form-group">
                                    <p className="form-label text-[10px] px-1">Unit</p>
                                    <select value={currentProduct.unit || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, unit: e.target.value })}
                                        className="form-select text-sm">
                                        <option value="">Unit</option>
                                        {['pcs', 'kg', 'box', 'set', 'meter'].map(u => <option key={u} value={u}>{u}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <p className="form-label text-[10px] px-1">Qty</p>
                                    <input type="number" placeholder="0" value={currentProduct.quantity || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, quantity: parseInt(e.target.value) })}
                                        className="form-input text-sm" />
                                </div>
                                <div className="form-group">
                                    <p className="form-label text-[10px] px-1">Price/Unit</p>
                                    <input type="number" placeholder="₹0.00" value={currentProduct.price || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })}
                                        className="form-input text-sm font-bold text-amber-500" style={{ color: 'var(--primary)' }} />
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex justify-between items-center bg-stone-900/40 p-4 rounded-xl border border-stone-800/50">
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={addProduct}
                                    className="inject-btn"
                                >
                                    {editingIdx !== null ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    <span>{editingIdx !== null ? 'Update Item in list' : 'Add Item to Bill'}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingIdx(null);
                                        setCurrentProduct({});
                                    }}
                                    className="px-4 py-2 border border-stone-700 text-stone-400 rounded-lg text-[10px] font-bold uppercase hover:bg-stone-800 transition-all"
                                >
                                    Clear Form
                                </button>
                            </div>

                            {formData.products.length > 0 && (
                                <div className="text-right">
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#78716c', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Items in Bill: </span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary)' }}>{formData.products.length}</span>
                                </div>
                            )}
                        </div>

                        {/* Scrolled Products List */}
                        <div className="mt-8">
                            <h4 className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <Package className="w-3 h-3" />
                                Current Bill Items
                            </h4>

                            {formData.products.length > 0 ? (
                                <div className="added-items-list custom-scrollbar">
                                    {formData.products.map((product, idx) => (
                                        <div key={idx} className={`added-item group ${editingIdx === idx ? 'active-edit' : ''}`}>
                                            <div className="flex items-center gap-4">
                                                <div className="item-idx">{idx + 1}</div>
                                                <div>
                                                    <p className="font-bold text-stone-100 flex items-center gap-2">
                                                        {product.categoryType === 'Auto Parts' && `${product.brand} - ${product.partName}`}
                                                        {product.categoryType === 'Oil Products' && `${product.company} - ${product.oilType}`}
                                                        {product.categoryType === 'Hardware Items' && `${product.itemName}`}
                                                        <span className="text-[9px] px-1.5 py-0.5 bg-stone-800 rounded text-stone-500 uppercase">{product.categoryType}</span>
                                                    </p>
                                                    <p className="text-[10px] text-stone-500 font-mono">
                                                        {product.quantity} units @ ₹{product.pricePerUnit || product.price}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <p className="font-black text-amber-500 mr-4">₹{(product.quantity * (product.pricePerUnit || product.price)).toLocaleString()}</p>

                                                <button
                                                    type="button"
                                                    onClick={() => handleEditItem(idx)}
                                                    className="action-btn"
                                                    title="Edit Item"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (confirm('Remove this item from the bill?')) {
                                                            setFormData({
                                                                ...formData,
                                                                products: formData.products.filter((_, i) => i !== idx)
                                                            });
                                                        }
                                                    }}
                                                    className="action-btn delete"
                                                    title="Remove Item"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 border-2 border-dashed border-stone-800 rounded-2xl flex flex-col items-center justify-center text-stone-600">
                                    <Package className="w-8 h-8 mb-2 opacity-20" />
                                    <p className="text-xs font-bold uppercase tracking-widest">No products added yet</p>
                                    <p className="text-[9px] mt-1">Fill the details above and click "Add Item to Bill"</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary & Payment */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <h3 className="products-title">Final Settlement</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label text-[10px]">Total Billed</label>
                                    <div style={{ padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.05)', borderRadius: '1.25rem', border: '1px solid rgba(245, 158, 11, 0.2)', color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 900 }}>
                                        ₹{formData.totalAmount.toLocaleString()}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label text-[10px]">Paid Amount *</label>
                                    <input
                                        type="number"
                                        value={formData.paidAmount}
                                        onChange={(e) => setFormData({ ...formData, paidAmount: parseFloat(e.target.value) || 0 })}
                                        className="form-input"
                                        style={{ padding: '1rem', fontSize: '1.5rem', fontWeight: 900, height: 'auto' }}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label text-[10px]" style={{ fontFamily: 'monospace' }}>Select Payment Method</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {['Cash', 'UPI', 'NEFT', 'Credit'].map(mode => (
                                        <button
                                            key={mode}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, paymentMode: mode })}
                                            className={`category-btn ${formData.paymentMode === mode ? 'active' : 'inactive'}`}
                                            style={{ padding: '0.75rem', fontSize: '0.5625rem' }}
                                        >
                                            {mode}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="products-title">Attachment</h3>
                            <div className="group relative">
                                <div className="upload-area">
                                    {formData.billFile ? (
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-3">
                                                <Upload className="w-6 h-6 text-green-500" />
                                            </div>
                                            <p className="text-stone-200 font-bold truncate max-w-[200px]">{formData.billFile.name}</p>
                                            <button type="button" onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, billFile: null }) }} className="text-[10px] font-bold text-red-500 uppercase mt-2">Replace File</button>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="w-10 h-10 text-stone-600 mb-3 group-hover:scale-110 transition-transform" />
                                            <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Upload Tax Invoice</p>
                                            <p className="text-[10px] text-stone-600 mt-1 uppercase">PDF, PNG, JPG (MAX 10MB)</p>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        accept=".pdf,.png,.jpg,.jpeg"
                                        onChange={(e) => setFormData({ ...formData, billFile: e.target.files[0] })}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
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
                            {purchase ? 'Update Record' : 'Confirm & Save Purchase'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
