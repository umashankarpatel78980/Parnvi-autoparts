import { Search, Plus, Trash2, FileText, Calendar, CreditCard, Edit2 } from 'lucide-react';

// Purchases View Component
export default function PurchasesView({ purchases, dealers, filterPaymentStatus, setFilterProductType, filterProductType, dateRange, setDateRange, onAddPurchase, onEditPurchase, onDelete }) {
    return (
        <div className="animate-fade" style={{ marginTop: '1rem' }}>
            {/* Filters */}
            <div className="filter-card">
                <h3 className="filter-title">Filter Purchases</h3>
                <div className="filter-grid">
                    <select
                        value={filterPaymentStatus}
                        onChange={(e) => setFilterPaymentStatus(e.target.value)}
                        className="filter-select"
                        style={{ width: '100%' }}
                    >
                        <option value="All">All Payments</option>
                        <option value="Paid">Paid</option>
                        <option value="Unpaid">Unpaid</option>
                        <option value="Partial">Partial</option>
                    </select>

                    <select
                        value={filterProductType}
                        onChange={(e) => setFilterProductType(e.target.value)}
                        className="filter-select"
                        style={{ width: '100%' }}
                    >
                        <option value="All">All Products</option>
                        <option value="Auto Parts">Auto Parts</option>
                        <option value="Oil Products">Oil Products</option>
                        <option value="Hardware Items">Hardware Items</option>
                    </select>

                    <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        className="search-input"
                    />

                    <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        className="search-input"
                    />
                </div>
            </div>

            {/* Add Purchase Button */}
            <div className="dealer-section-header">
                <button
                    onClick={onAddPurchase}
                    className="add-purchase-btn"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Purchase</span>
                </button>
            </div>

            {/* Purchases List */}
            <div className="space-y-6">
                {purchases.map((purchase) => {
                    const dealer = dealers.find(d => d.id === purchase.dealerId);
                    return (
                        <div key={purchase.id} className="purchase-card group">
                            <div className="purchase-header-row">
                                <div className="purchase-title-group">
                                    <div className="flex items-center gap-4 mb-3">
                                        <h3 className="purchase-dealer-name">{dealer?.name}</h3>
                                        <span className="purchase-type-badge">{purchase.productType}</span>
                                    </div>
                                    <div className="purchase-meta-row">
                                        <div className="purchase-meta-item">
                                            <FileText className="w-4 h-4 text-amber-500/70" />
                                            <span className="font-medium text-stone-300">{purchase.invoiceNumber}</span>
                                        </div>
                                        <div className="purchase-meta-item">
                                            <Calendar className="w-4 h-4 text-amber-500/70" />
                                            <span>{purchase.invoiceDate}</span>
                                        </div>
                                        <div className="purchase-meta-item">
                                            <CreditCard className="w-4 h-4 text-amber-500/70" />
                                            <span>{purchase.paymentMode}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="purchase-amount-group">
                                        <p className="total-amount-label">Total Amount</p>
                                        <p className="total-amount-val">₹{purchase.totalAmount.toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onEditPurchase(purchase); }}
                                            className="action-btn"
                                            title="Edit Purchase"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDelete(purchase.id); }}
                                            className="action-btn delete"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Status Cards */}
                            <div className="status-cards-grid">
                                <div className="mini-stat-card">
                                    <p className="mini-label">Paid Amount</p>
                                    <p className="val-paid">₹{purchase.paidAmount.toLocaleString()}</p>
                                </div>
                                <div className="mini-stat-card">
                                    <p className="mini-label">Pending Amount</p>
                                    <p className={purchase.pendingAmount > 0 ? "val-pending" : "val-pending-green"}>
                                        ₹{purchase.pendingAmount.toLocaleString()}
                                    </p>
                                </div>
                                <div className="mini-stat-card flex flex-col justify-center">
                                    <p className="mini-label" style={{ marginBottom: '0.5rem' }}>Payment Status</p>
                                    <div>
                                        <span className={`status-badge ${purchase.pendingAmount === 0 ? 'status-success' : purchase.paidAmount === 0 ? 'status-error' : 'status-pending'}`}>
                                            {purchase.pendingAmount === 0 ? 'Paid' : purchase.paidAmount === 0 ? 'Unpaid' : 'Partial'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Products */}
                            <div className="products-container">
                                <h4 className="products-title">Products Included</h4>
                                <div className="space-y-3">
                                    {purchase.products.map((product, idx) => {
                                        const type = product.categoryType || purchase.productType;
                                        return (
                                            <div key={idx} className="product-item">
                                                {type === 'Auto Parts' && (
                                                    <div className="product-grid">
                                                        <div><span className="prod-label">Brand</span><span className="prod-val">{product.brand}</span></div>
                                                        <div><span className="prod-label">Model</span><span className="prod-val">{product.model}</span></div>
                                                        <div><span className="prod-label">Part</span><span className="prod-val">{product.partName}</span></div>
                                                        <div><span className="prod-label">Qty & Price</span><span className="prod-price">{product.quantity} × ₹{product.pricePerUnit}</span></div>
                                                    </div>
                                                )}
                                                {type === 'Oil Products' && (
                                                    <div className="product-grid">
                                                        <div><span className="prod-label">Company</span><span className="prod-val">{product.company}</span></div>
                                                        <div><span className="prod-label">Type</span><span className="prod-val">{product.oilType}</span></div>
                                                        <div><span className="prod-label">Packaging</span><span className="prod-val">{product.packaging}</span></div>
                                                        <div><span className="prod-label">Qty & Price</span><span className="prod-price">{product.quantity} × ₹{product.price}</span></div>
                                                    </div>
                                                )}
                                                {type === 'Hardware Items' && (
                                                    <div className="product-grid">
                                                        <div><span className="prod-label">Category</span><span className="prod-val">{product.category}</span></div>
                                                        <div><span className="prod-label">Item</span><span className="prod-val">{product.itemName}</span></div>
                                                        <div><span className="prod-label">Unit</span><span className="prod-val">{product.unit}</span></div>
                                                        <div><span className="prod-label">Qty & Price</span><span className="prod-price">{product.quantity} × ₹{product.price}</span></div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* View Bill Action */}
                            <div className="flex justify-end pt-2">
                                <button className="invoice-btn">
                                    <FileText className="w-4 h-4" />
                                    <span>View/Download Invoice</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
