import React from 'react';
import { Search, Edit2, Trash2, Phone, Mail, MapPin, Plus, ChevronRight, Users, TrendingUp, CreditCard } from 'lucide-react';
import DealerDetails from './DealerDetails';
import StyledButton from '../StyledButton';

// Dealers View Component
export default function DealersView({ dealers, searchTerm, setSearchTerm, filterStatus, setFilterStatus, onEdit, onDelete, onViewDetails, onAdd, selectedDealer, setSelectedDealer, purchases, onEditPurchase, onDeletePurchase, onAddPurchase }) {

    // Calculate Summary Stats
    const totalDealers = dealers.length;
    const totalPending = dealers.reduce((acc, d) => acc + (d.pendingBalance || 0), 0);
    const totalBilled = dealers.reduce((acc, d) => acc + (d.totalBilled || 0), 0);

    return (
        <div className="dealer-mgmt animate-fade">
            {!selectedDealer && (
                <>
                    {/* Executive Summary Bar */}
                    <div className="executive-summary">
                        <div className="exec-stat-card">
                            <div className="exec-icon-box">
                                <Users size={24} />
                            </div>
                            <div className="exec-info">
                                <h3>Total Dealers</h3>
                                <p>{totalDealers}</p>
                            </div>
                        </div>
                        <div className="exec-stat-card">
                            <div className="exec-icon-box">
                                <TrendingUp size={24} />
                            </div>
                            <div className="exec-info">
                                <h3>Total Billing</h3>
                                <p>₹{(totalBilled / 100000).toFixed(1)}L</p>
                            </div>
                        </div>
                        <div className="exec-stat-card">
                            <div className="exec-icon-box" style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' }}>
                                <CreditCard size={24} />
                            </div>
                            <div className="exec-info">
                                <h3>Pending Dues</h3>
                                <p style={{ color: '#ef4444' }}>₹{(totalPending / 1000).toFixed(1)}K</p>
                            </div>
                        </div>
                    </div>

                    {/* Highly Impactful Control Bar */}
                    <div className="super-controls">
                        <div className="search-group" style={{ flex: 1 }}>
                            <Search className="search-icon" />
                            <input
                                type="text"
                                className="search-input super-search-input"
                                placeholder="Search Dealers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-4">
                            <select
                                className="filter-select"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="All">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>

                            <StyledButton variant="primary" icon={Plus} onClick={onAdd}>
                                Add Dealer
                            </StyledButton>
                        </div>
                    </div>

                    <div className="dealer-grid">
                        {dealers.map((dealer) => (
                            <div
                                key={dealer.id}
                                className="super-dealer-card"
                                onClick={() => setSelectedDealer(dealer)}
                            >
                                {/* Card Header */}
                                <div className="super-card-header">
                                    <div className="flex gap-5">
                                        <div className="super-avatar-glow">
                                            <Users size={32} />
                                        </div>
                                        <div className="super-card-title">
                                            <h4>{dealer.name}</h4>
                                            <span className={`status-badge-neon ${dealer.status === 'Active' ? 'status-active-neon' : 'status-error'}`}>
                                                <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                                                {dealer.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                                        <button onClick={() => onEdit(dealer)} className="p-2.5 hover:bg-white/5 rounded-xl text-stone-500 hover:text-amber-500 transition-all">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => onDelete(dealer.id)} className="p-2.5 hover:bg-white/5 rounded-xl text-stone-500 hover:text-red-500 transition-all">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Details Body */}
                                <div className="super-info-grid">
                                    <div className="super-info-row">
                                        <div className="icon-circle">
                                            <Phone size={12} />
                                        </div>
                                        <span className="text-sm font-black tracking-wide text-stone-300">{dealer.contact}</span>
                                    </div>
                                    <div className="super-info-row">
                                        <div className="icon-circle">
                                            <MapPin size={12} />
                                        </div>
                                        <span className="text-sm font-semibold text-stone-400 line-clamp-1 italic">{dealer.address}</span>
                                    </div>
                                </div>

                                {/* Financial Progress */}
                                <div className="mt-auto">
                                    <div className="flex justify-between mb-2 px-1">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">Financial Health</span>
                                        <span className="text-[10px] font-black text-amber-500">{(100 - (dealer.pendingBalance / dealer.totalBilled * 100 || 0)).toFixed(0)}% PAID</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-stone-900 rounded-full overflow-hidden border border-white/5">
                                        <div
                                            className="h-full bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all duration-1000"
                                            style={{ width: `${Math.max(5, 100 - (dealer.pendingBalance / dealer.totalBilled * 100 || 0))}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Visual Stats */}
                                <div className="super-stats-horizontal">
                                    <div className="stat-v-unit">
                                        <span className="stat-v-label">Total Volume</span>
                                        <span className="stat-v-value">₹{(dealer.totalBilled / 1000).toFixed(1)}K</span>
                                    </div>
                                    <div className="stat-v-unit">
                                        <span className="stat-v-label">Net Balance</span>
                                        <span className="stat-v-value" style={{ color: dealer.pendingBalance > 0 ? '#f87171' : '#4ade80' }}>
                                            ₹{(dealer.pendingBalance / 1000).toFixed(1)}K
                                        </span>
                                    </div>
                                </div>

                                {/* High Octane Action */}
                                <StyledButton
                                    variant="outline"
                                    onClick={() => setSelectedDealer(dealer)}
                                    style={{ marginTop: '1rem', width: '100%', justifyContent: 'space-between' }}
                                >
                                    <span>Intelligence Report</span>
                                    <ChevronRight size={16} />
                                </StyledButton>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {selectedDealer && (
                <DealerDetails
                    dealer={selectedDealer}
                    onBack={() => setSelectedDealer(null)}
                    purchases={purchases?.filter(p => p.dealerId === selectedDealer.id) || []}
                    onEditPurchase={onEditPurchase}
                    onDeletePurchase={onDeletePurchase}
                    onAddPurchase={onAddPurchase}
                />
            )}
        </div>
    );
}
