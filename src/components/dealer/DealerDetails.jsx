import React, { useState, useMemo } from 'react';
import { ChevronDown, Edit2, Phone, Mail, MapPin, FileText, Trash2, PieChart, List, Plus, Search, X, Download, Eye, ArrowLeft, Users, TrendingUp, CreditCard } from 'lucide-react';

export default function DealerDetails({ dealer, purchases, onBack, onEdit, onEditPurchase, onDeletePurchase, onAddPurchase }) {
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'ledger'
    const [expandedID, setExpandedID] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [previewBill, setPreviewBill] = useState(null);

    // Filter and Sort purchases
    const filteredPurchases = useMemo(() => {
        let result = [...purchases];

        if (startDate) {
            result = result.filter(p => p.invoiceDate >= startDate);
        }
        if (endDate) {
            result = result.filter(p => p.invoiceDate <= endDate);
        }

        return result.sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate));
    }, [purchases, startDate, endDate]);

    const handleDownload = (e, url, fileName) => {
        e.stopPropagation();
        if (!url) return;
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || 'bill.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="animate-fade" style={{ marginTop: '0.8rem' }}>
            {/* Bill Preview Overlay */}
            {previewBill && (
                <div className="bill-preview-overlay" style={{ backdropFilter: 'blur(10px)', background: 'rgba(0,0,0,0.85)' }} onClick={() => setPreviewBill(null)}>
                    <div className="bill-preview-header" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-4">
                            <h3 className="text-xl font-bold text-white">Invoice: {previewBill.invoiceNumber}</h3>
                            <button
                                className="bill-download-btn"
                                onClick={(e) => { handleDownload(e, previewBill.billUrl, `${previewBill.invoiceNumber}.pdf`); }}
                            >
                                <Download className="w-4 h-4" />
                                <span>Download PDF</span>
                            </button>
                        </div>
                        <button className="close-preview-btn" onClick={() => setPreviewBill(null)}>
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}

            {/* Cyber Top Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <button onClick={onBack} className="floating-back-btn">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Intelligence</span>
                </button>

                <div className="neon-tab-bar">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`neon-tab-btn ${viewMode === 'list' ? 'active' : ''}`}
                    >
                        <List className="w-4 h-4" />
                        <span>Tactical List</span>
                    </button>
                    <button
                        onClick={() => setViewMode('ledger')}
                        className={`neon-tab-btn ${viewMode === 'ledger' ? 'active' : ''}`}
                    >
                        <PieChart className="w-4 h-4" />
                        <span>Strategic Ledger</span>
                    </button>
                </div>
            </div>

            {/* Dealer Executive Identity Card */}
            <div className="super-details-card" style={{ marginBottom: '3rem' }}>
                <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
                    <div className="flex-1">
                        <div className="flex items-center gap-6 mb-6">
                            <div className="super-avatar-glow" style={{ width: '4rem', height: '4rem' }}>
                                <Users size={32} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-white tracking-tighter mb-1">{dealer.name}</h2>
                                <span className={`status-badge-neon ${dealer.status === 'Active' ? 'status-active-neon' : 'status-error'}`}>
                                    <div className="w-2.5 h-2.5 rounded-full bg-current animate-pulse"></div>
                                    {dealer.status}
                                </span>
                            </div>
                        </div>

                        <div className="super-info-grid" style={{ maxWidth: '600px' }}>
                            <div className="super-info-row">
                                <div className="icon-circle">
                                    <Phone size={14} />
                                </div>
                                <span className="text-lg font-black text-stone-200">{dealer.contact}</span>
                            </div>
                            {dealer.email && (
                                <div className="super-info-row">
                                    <div className="icon-circle">
                                        <Mail size={14} />
                                    </div>
                                    <span className="text-lg font-bold text-stone-300">{dealer.email}</span>
                                </div>
                            )}
                            <div className="super-info-row">
                                <div className="icon-circle">
                                    <MapPin size={14} />
                                </div>
                                <span className="text-lg font-medium text-stone-400 italic">{dealer.address}</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-auto flex flex-col gap-2">
                        <button onClick={onAddPurchase} className="btn-primary" style={{ height: '48px', padding: '0 1.5rem', borderRadius: '0.875rem', fontSize: '0.75rem' }}>
                            <Plus className="w-5 h-5" />
                            <span>Inject New Record</span>
                        </button>
                        <button onClick={() => onEdit(dealer)} className="floating-back-btn" style={{ justifyContent: 'center', height: '48px', padding: '0 1.5rem', color: '#fff', transform: 'none' }}>
                            <Edit2 className="w-4 h-4" />
                            <span>Modify Identity</span>
                        </button>
                    </div>
                </div>

                {/* Financial Summary (Inside Card) */}
                <div className="executive-summary" style={{ marginTop: '1.5rem', marginBottom: '0', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                    <div className="exec-stat-card" style={{ background: 'rgba(255,255,255,0.03)', border: 'none' }}>
                        <div className="exec-icon-box">
                            <TrendingUp size={20} />
                        </div>
                        <div className="exec-info">
                            <h3>Total Volume</h3>
                            <p>₹{(dealer.totalBilled / 1000).toFixed(1)}K</p>
                        </div>
                    </div>
                    <div className="exec-stat-card" style={{ background: 'rgba(255,255,255,0.03)', border: 'none' }}>
                        <div className="exec-icon-box" style={{ color: '#4ade80', background: 'rgba(34, 197, 94, 0.1)' }}>
                            <CreditCard size={20} />
                        </div>
                        <div className="exec-info">
                            <h3>Total Settled</h3>
                            <p style={{ color: '#4ade80' }}>₹{(dealer.totalPaid / 1000).toFixed(1)}K</p>
                        </div>
                    </div>
                    <div className="exec-stat-card" style={{ background: 'rgba(255,255,255,0.03)', border: 'none' }}>
                        <div className="exec-icon-box" style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' }}>
                            <CreditCard size={20} />
                        </div>
                        <div className="exec-info">
                            <h3>Net Liability</h3>
                            <p style={{ color: '#ef4444' }}>₹{(dealer.pendingBalance / 1000).toFixed(1)}K</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            {viewMode === 'list' ? (
                <div className="super-details-card animate-slideUp" style={{ marginTop: '1.25rem' }}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <h3 className="text-2xl font-black text-white tracking-tight">Record Stream</h3>

                        {/* Cyborg Filter */}
                        <div className="super-controls" style={{ margin: 0, padding: '0.5rem 1rem !important' }}>
                            <div className="flex items-center gap-3 px-4">
                                <span className="text-[10px] font-black text-stone-500 uppercase">Chronology</span>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="bg-transparent border-none text-stone-200 text-xs font-bold focus:ring-0 cursor-pointer"
                                />
                                <span className="text-stone-700">|</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="bg-transparent border-none text-stone-200 text-xs font-bold focus:ring-0 cursor-pointer"
                                />
                            </div>
                            {(startDate || endDate) && (
                                <button onClick={() => { setStartDate(''); setEndDate(''); }} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {filteredPurchases.length > 0 ? filteredPurchases.map((purchase) => (
                            <div
                                key={purchase.id}
                                className={`super-dealer-card ${expandedID === purchase.id ? 'border-amber-500/50' : ''}`}
                                style={{ minHeight: 'auto', padding: '0', cursor: 'pointer' }}
                                onClick={() => setExpandedID(expandedID === purchase.id ? null : purchase.id)}
                            >
                                <div style={{ padding: '2rem' }}>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-6">
                                            <div className="super-avatar-glow" style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1rem' }}>
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <p className="text-white font-black text-xl leading-none">{purchase.invoiceNumber}</p>
                                                    <button className="super-pill" style={{ fontSize: '0.6rem' }}>{purchase.productType}</button>
                                                </div>
                                                <p className="text-stone-500 text-[10px] font-black uppercase tracking-widest">
                                                    {new Date(purchase.invoiceDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-10">
                                            <div className="text-right">
                                                <p className="text-2xl font-black text-white">₹{purchase.totalAmount.toLocaleString()}</p>
                                                <span className={`status-badge-neon ${purchase.pendingAmount === 0 ? 'status-active-neon' : 'status-error'}`} style={{ marginTop: '0.5rem', fontSize: '0.65rem' }}>
                                                    {purchase.pendingAmount === 0 ? 'FULLY SETTLED' : `DUE: ₹${purchase.pendingAmount.toLocaleString()}`}
                                                </span>
                                            </div>
                                            <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                                                <button onClick={() => onEditPurchase(purchase)} className="p-2.5 hover:bg-amber-500/10 rounded-xl text-stone-500 hover:text-amber-500 transition-all"><Edit2 size={18} /></button>
                                                <button onClick={() => onDeletePurchase(purchase.id)} className="p-2.5 hover:bg-red-500/10 rounded-xl text-stone-500 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {expandedID === purchase.id && (
                                    <div className="animate-slideDown" style={{ padding: '0 2rem 2rem 2rem', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
                                            {purchase.products?.map((prod, pIdx) => (
                                                <div key={pIdx} className="super-info-row" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '1.25rem' }}>
                                                    <div className="flex justify-between w-full mb-3">
                                                        <span className="super-pill" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--neon-amber)', border: 'none' }}>
                                                            {prod.categoryType || purchase.productType}
                                                        </span>
                                                        <span className="text-white font-black">₹{(prod.quantity * (prod.pricePerUnit || prod.price)).toLocaleString()}</span>
                                                    </div>
                                                    <p className="text-stone-200 font-bold text-sm mb-3">
                                                        {prod.partName || prod.oilType || prod.itemName}
                                                    </p>
                                                    <div className="flex gap-4">
                                                        <span className="text-[10px] font-black text-stone-500 uppercase">QTY: <span className="text-white">{prod.quantity}</span></span>
                                                        <span className="text-[10px] font-black text-stone-500 uppercase">RATE: <span className="text-white">₹{prod.pricePerUnit || prod.price}</span></span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 mt-8 border-t border-white/5 gap-6">
                                            <div className="flex items-center gap-4">
                                                <span className="text-stone-500 text-[10px] font-black uppercase tracking-widest">Protocol</span>
                                                <span className="super-pill">{purchase.paymentMode}</span>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    className="floating-back-btn" style={{ transform: 'none', fontSize: '0.65rem' }}
                                                    onClick={(e) => { e.stopPropagation(); setPreviewBill(purchase); }}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    <span>View Evidence</span>
                                                </button>
                                                <button
                                                    className="floating-back-btn" style={{ transform: 'none', fontSize: '0.65rem', background: 'var(--neon-amber)', color: '#000' }}
                                                    onClick={(e) => handleDownload(e, purchase.billUrl, `${purchase.invoiceNumber}.pdf`)}
                                                >
                                                    <Download className="w-4 h-4" />
                                                    <span>Download Data</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )) : (
                            <div className="flex flex-col items-center justify-center py-24 bg-white/2 rounded-[2rem] border border-dashed border-white/5">
                                <Search className="w-16 h-16 text-stone-800 mb-6" />
                                <p className="text-stone-500 font-black uppercase tracking-widest text-sm">No Tactical Records Found</p>
                                <button
                                    onClick={() => { setStartDate(''); setEndDate(''); }}
                                    className="text-amber-500 text-xs font-black mt-4 hover:underline uppercase tracking-widest"
                                >
                                    Reset Protocols
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="super-details-card animate-slideUp">
                    <div className="flex items-center justify-between mb-12">
                        <h3 className="text-3xl font-black text-white tracking-tight">Strategic Ledger</h3>
                        <div className="super-pill">
                            Cycle 2025-26
                        </div>
                    </div>
                    <div className="custom-scrollbar overflow-x-auto">
                        <table className="w-full text-left" style={{ borderCollapse: 'separate', borderSpacing: '0 0.75rem' }}>
                            <thead>
                                <tr className="text-[10px] text-stone-600 font-black uppercase tracking-[0.2em]">
                                    <th className="px-8 py-2">Cycle Date</th>
                                    <th className="px-8 py-2">Transaction Particulars</th>
                                    <th className="px-8 py-2 text-right">Debit Balance</th>
                                    <th className="px-8 py-2 text-right">Credit Intake</th>
                                    <th className="px-8 py-2 text-right">Running Position</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(() => {
                                    let runningBalance = 0;
                                    const ledgerItems = [...purchases].sort((a, b) => new Date(a.invoiceDate) - new Date(b.invoiceDate));

                                    return ledgerItems.map((item) => {
                                        runningBalance += (item.totalAmount - item.paidAmount);
                                        return (
                                            <tr key={item.id} className="super-ledger-row">
                                                <td className="px-8 py-6 rounded-l-2xl">
                                                    <p className="text-stone-400 font-mono text-xs">{item.invoiceDate}</p>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-2 bg-stone-900 rounded-lg">
                                                            <FileText className="w-4 h-4 text-amber-500" />
                                                        </div>
                                                        <span className="text-white font-black text-sm">Invoice {item.invoiceNumber}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right font-black text-red-500/90 text-sm">₹{item.totalAmount.toLocaleString()}</td>
                                                <td className="px-8 py-6 text-right font-black text-green-500/90 text-sm">₹{item.paidAmount.toLocaleString()}</td>
                                                <td className="px-8 py-6 text-right rounded-r-2xl">
                                                    <span className={`inline-block px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest ${runningBalance > 0 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                                        ₹{runningBalance.toLocaleString()} {runningBalance > 0 ? 'DR' : 'CR'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    });
                                })()}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
