import React, { useState } from 'react';
import { Download, ChevronUp, ChevronDown, FileText } from 'lucide-react';

// History View Component
export default function HistoryView({ purchases, dealers }) {
    const [expandedPurchase, setExpandedPurchase] = useState(null);

    return (
        <div className="animate-fade" style={{ marginTop: '1rem' }}>
            <div className="history-card">
                <div className="details-header">
                    <div>
                        <h2 className="details-title" style={{ color: 'var(--primary)' }}>Complete Purchase History</h2>
                        <p className="details-subtitle">View and export all purchase records</p>
                    </div>
                    <button className="export-btn">
                        <Download className="w-5 h-5" />
                        <span>Export CSV</span>
                    </button>
                </div>

                <div className="space-y-4">
                    {purchases.map((purchase) => {
                        const dealer = dealers.find(d => d.id === purchase.dealerId);
                        const isExpanded = expandedPurchase === purchase.id;

                        return (
                            <div key={purchase.id} className={`history-item ${isExpanded ? 'expanded' : ''}`}>
                                <div
                                    className="history-header"
                                    onClick={() => setExpandedPurchase(isExpanded ? null : purchase.id)}
                                >
                                    <div className="history-row-content">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-2">
                                                <h3 className="history-dealer-name">{dealer?.name}</h3>
                                                <span className="history-invoice-number">{purchase.invoiceNumber}</span>
                                                <span className="purchase-type-badge">{purchase.productType}</span>
                                            </div>
                                            <div className="history-meta-group">
                                                <div className="history-meta-item">
                                                    <div className="history-stat-dot"></div>
                                                    <span>{purchase.invoiceDate}</span>
                                                </div>
                                                <div className="history-meta-item">
                                                    <span className="history-amount">₹{purchase.totalAmount.toLocaleString()}</span>
                                                </div>
                                                <div className="history-meta-item">
                                                    <span className={`status-badge ${purchase.pendingAmount === 0 ? 'status-success' : 'status-error'}`}>
                                                        {purchase.pendingAmount === 0 ? 'Paid' : `Due: ₹${purchase.pendingAmount.toLocaleString()}`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            {isExpanded ? <ChevronUp className="w-5 h-5 text-amber-500" /> : <ChevronDown className="w-5 h-5 text-stone-500" />}
                                        </div>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="history-expanded-content">
                                        <div className="history-product-grid">
                                            {purchase.products.map((product, idx) => (
                                                <div key={idx} className="history-product-card">
                                                    {purchase.productType === 'Auto Parts' && (
                                                        <div className="space-y-2">
                                                            <div className="history-detail-row"><span className="prod-label">Part</span> <span className="prod-val">{product.partName}</span></div>
                                                            <div className="history-detail-row"><span className="prod-label">Model</span> <span className="text-stone-300">{product.brand} {product.model}</span></div>
                                                            <div className="history-detail-row"><span className="prod-label">Qty</span> <span className="prod-price">{product.quantity} × ₹{product.pricePerUnit}</span></div>
                                                        </div>
                                                    )}
                                                    {purchase.productType === 'Oil Products' && (
                                                        <div className="space-y-2">
                                                            <div className="history-detail-row"><span className="prod-label">Company</span> <span className="prod-val">{product.company}</span></div>
                                                            <div className="history-detail-row"><span className="prod-label">Details</span> <span className="text-stone-300">{product.oilType} ({product.packaging})</span></div>
                                                            <div className="history-detail-row"><span className="prod-label">Qty</span> <span className="prod-price">{product.quantity} × ₹{product.price}</span></div>
                                                        </div>
                                                    )}
                                                    {purchase.productType === 'Hardware Items' && (
                                                        <div className="space-y-2">
                                                            <div className="history-detail-row"><span className="prod-label">Item</span> <span className="prod-val">{product.itemName}</span></div>
                                                            <div className="history-detail-row"><span className="prod-label">Details</span> <span className="text-stone-300">{product.category} ({product.unit})</span></div>
                                                            <div className="history-detail-row"><span className="prod-label">Qty</span> <span className="prod-price">{product.quantity} × ₹{product.price}</span></div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="history-footer">
                                            <div className="history-payment-info">
                                                <span className="payment-mode-label">Payment Mode</span>
                                                <span className="payment-mode-val">{purchase.paymentMode}</span>
                                            </div>
                                            <button className="invoice-btn">
                                                <FileText className="w-4 h-4" />
                                                <span>View Original Invoice</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
