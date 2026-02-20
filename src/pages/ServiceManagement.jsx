import React, { useState, useMemo, useEffect } from 'react';
import {
    Plus,
    MapPin,
    Calendar,
    User,
    Wrench,
    ChevronRight,
    Filter,
    Search,
    AlertTriangle
} from 'lucide-react';
import './ServiceManagement.css';
import { useNavigate } from 'react-router-dom';
import { BRANDS, MODELS, ALL_PARTS, CATEGORIES  } from './PartsData';

const ServiceManagement = () => {
    const [activeTab, setActiveTab] = useState('Today');
    const [serviceTypeFilter, setServiceTypeFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [dateFilter, setDateFilter] = useState('');
    const navigate = useNavigate();

    // Example dataset with ISO dates (replace with API data as needed)
    const initialServices = [
        { id: 'SR-1025', customer: 'Harish Verma', tractor: 'New Holland 3630', type: 'Home Service', location: 'Village Rampur', status: 'Pending', priority: 'Emergency', dateISO: '2026-01-30T09:00:00', mechanic: null },
        { id: 'SR-1024', customer: 'Rajesh Kumar', tractor: 'Mahindra Arjun 555 DI', type: 'Shop Service', location: 'Shop', status: 'In Progress', priority: 'Normal', mechanic: 'Vikram Singh', dateISO: '2026-01-30T14:30:00' },
        { id: 'SR-1026', customer: 'Mahesh Kumar', tractor: 'Mahindra Arjun 555 DI', type: 'Shop Service', location: 'Shop', status: 'In Progress', priority: 'Normal', mechanic: 'Vikram Singh', dateISO: '2026-01-30T14:30:00' },
        { id: 'SR-1023', customer: 'Suresh Singh', tractor: 'Sonalika Worldtrac 60', type: 'Home Service', location: 'District Cantt', status: 'Pending', priority: 'Normal', mechanic: null, dateISO: '2026-01-08T11:15:00' },
        { id: 'SR-1022', customer: 'Amit Patel', tractor: 'John Deere 5310', type: 'Shop Service', location: 'Shop', status: 'Completed', priority: 'Normal', mechanic: 'Rahul Verma', dateISO: '2026-01-08T16:45:00' },
        { id: 'SR-1019', customer: 'Ramesh Das', tractor: 'Sonalika 50', type: 'Home Service', location: 'Village A', status: 'Completed', priority: 'Normal', mechanic: 'Sameer Khan', dateISO: '2026-01-02T10:00:00' },
        { id: 'SR-0999', customer: 'Old Customer', tractor: 'John Deere 3020', type: 'Shop Service', location: 'Shop', status: 'Completed', priority: 'Normal', mechanic: 'Rahul Verma', dateISO: '2025-12-28T13:30:00' },
    ];
    const [servicesState, setServicesState] = useState(initialServices);

    const [mechanicsState, setMechanicsState] = useState([
        { name: 'Vikram Singh', skill: 'Engine Expert', status: 'Busy' },
        { name: 'Rahul Verma', skill: 'Hydraulics', status: 'Available' },
        { name: 'Sameer Khan', skill: 'Electrical', status: 'Available' },
    ]);
    const [showManage, setShowManage] = useState(false);
    const [showAddList, setShowAddList] = useState(false);
    const [showPresent, setShowPresent] = useState(false);

    // Load persisted state from localStorage on mount
    useEffect(() => {
        try {
            const ms = localStorage.getItem('sm_mechanics');
            const ss = localStorage.getItem('sm_services');
            if (ms) setMechanicsState(JSON.parse(ms));
            if (ss) setServicesState(JSON.parse(ss));
        } catch (e) {
            console.warn('Failed to load persisted state', e);
        }
    }, []);

    // Persist when mechanics or services change
    useEffect(() => {
        try {
            localStorage.setItem('sm_mechanics', JSON.stringify(mechanicsState));
        } catch (e) { }
    }, [mechanicsState]);
    useEffect(() => {
        try {
            localStorage.setItem('sm_services', JSON.stringify(servicesState));
        } catch (e) { }
    }, [servicesState]);

    const toggleMechanicStatus = (idx) => {
        setMechanicsState(prev => {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], status: copy[idx].status === 'Available' ? 'Busy' : 'Available' };
            return copy;
        });
    };

    // Date helpers
    const toDate = (iso) => new Date(iso);
    const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
    const getWeekStart = (d) => { const c = new Date(d); const day = c.getDay(); c.setDate(c.getDate() - day); c.setHours(0, 0, 0, 0); return c; };
    const isSameWeek = (d, ref) => getWeekStart(d).getTime() === getWeekStart(ref).getTime();
    const isSameMonth = (d, ref) => d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();

    const today = new Date();

    // Derived lists according to rules
    const servicesWithDate = servicesState.map(s => ({ ...s, dateObj: toDate(s.dateISO) }));

    // Current working services: show only 'In Progress' here
    const currentWorkingServices = useMemo(() => servicesWithDate.filter(s => s.status === 'In Progress'), [servicesWithDate]);

    // Master mechanics list (can be replaced by API)
    const masterMechanics = [
        { name: 'Vikram Singh', skill: 'Engine Expert' },
        { name: 'Rahul Verma', skill: 'Hydraulics' },
        { name: 'Sameer Khan', skill: 'Electrical' },
        { name: 'Ankit Sharma', skill: 'Transmission' },
        { name: 'Rohit Patel', skill: 'Brakes' },
    ];

    // Assign mechanic panel state
    const [assigningServiceId, setAssigningServiceId] = useState(null);

    const openAssignPanel = (serviceId) => setAssigningServiceId(serviceId);
    const closeAssignPanel = () => setAssigningServiceId(null);

    const parseTractor = (tractorStr) => {
        if (!tractorStr) return { BRANDS: null, model: null };
        // try to find matching brand and model by name inclusion
        const brand = BRANDS.find(b => tractorStr.toLowerCase().includes(b.name.toLowerCase())) || null;
        const model = MODELS.find(m => tractorStr.toLowerCase().includes(m.name.toLowerCase())) || null;
        return { brand, model };
    };

    const partsForSelectedModel = (model) => {
        if (!model) return [];
        return ALL_PARTS.filter(p => p.modelId === model.id);
    };

    // Tabbed lists
    const todayServices = servicesWithDate.filter(s => isSameDay(s.dateObj, today));
    const weeklyCompleted = servicesWithDate.filter(s => s.status === 'Completed' && isSameWeek(s.dateObj, today));
    const monthlyCompleted = servicesWithDate.filter(s => s.status === 'Completed' && isSameMonth(s.dateObj, today));

    // Apply filters (type/status/date) to a list
    const applyFilters = (list) => list.filter(s => {
        if (serviceTypeFilter !== 'All' && s.type !== serviceTypeFilter) return false;
        if (statusFilter !== 'All' && s.status !== statusFilter) return false;
        if (dateFilter) {
            const picked = new Date(dateFilter);
            if (!isSameDay(s.dateObj, picked)) return false;
        }
        return true;
    });

    let filteredServices = [];
    if (activeTab === 'Today') filteredServices = applyFilters(todayServices);
    if (activeTab === 'Weekly') filteredServices = applyFilters(weeklyCompleted);
    if (activeTab === 'Monthly') filteredServices = applyFilters(monthlyCompleted);

    // Assigned mechanics (show in sidebar) - unique mechanics assigned to any service
    const assignedMechanics = useMemo(() => {
        const names = servicesState.filter(s => s.mechanic).map(s => s.mechanic);
        const unique = [...new Set(names)];
        const mapped = unique.map(n => mechanicsState.find(m => m.name === n) || { name: n, skill: '' });
        // sort so mechanics available today appear at top
        return mapped.sort((a, b) => (b.status === 'Available') - (a.status === 'Available'));
    }, [servicesState, mechanicsState]);

    const assignedNamesSet = useMemo(() => new Set(servicesState.filter(s => s.mechanic).map(s => s.mechanic)), [servicesState]);
    // Available mechanics not assigned
    const availableUnassigned = useMemo(() => mechanicsState.filter(m => m.status === 'Available' && !assignedNamesSet.has(m.name)), [mechanicsState, assignedNamesSet]);

    // Handle navigation to Customer Service Dashboard with brand/model detection
    const handleViewDetails = (service) => {
        // Only navigate to dashboard if service is "In Progress"
        if (service.status === 'In Progress') {
            // Try to detect brand and model from tractor string
            const tractorStr = service.tractor.toLowerCase();
            const detectedBrand = BRANDS.find(b =>
                tractorStr.includes(b.name.toLowerCase())
            );
            const detectedModel = detectedBrand
                ? MODELS.find(m =>
                    m.brandId === detectedBrand.id &&
                    tractorStr.includes(m.name.toLowerCase())
                )
                : null;

            navigate('/customer-dashboard', {
                state: {
                    service: {
                        ...service,
                        brandId: detectedBrand?.id,
                        modelId: detectedModel?.id
                    }
                }
            });
        } else {
            // For other statuses, you can implement different behavior
            alert('Service details are only available for services In Progress');
        }
    };

    return (
        <div className="service-mgmt">
            <div className="page-header">
                <div className="tabs">
                    {['Today', 'Weekly', 'Monthly'].map(tab => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="header-actions">
                    <div className="filters">
                        <select value={serviceTypeFilter} onChange={e => setServiceTypeFilter(e.target.value)}>
                            <option value="All">All Types</option>
                            <option value="Shop Service">Shop Service</option>
                            <option value="Home Service">Home Service</option>
                        </select>

                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                            <option value="All">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>

                        <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
                    </div>

                    <button className="btn primary" onClick={() => navigate("/add-service-request")}>
                        <Plus size={18} />
                        <span>New Service Request</span>
                    </button>
                </div>
            </div>

            <div className="services-grid">
                <div className="services-list">
                    {filteredServices.length === 0 ? (
                        <div className="empty-state">No services match the current selection.</div>
                    ) : (
                        filteredServices.map(service => (
                            <div key={service.id} className={`service-card-flat ${service.priority === 'Emergency' ? 'priority' : ''}`}>
                                <div className="service-main">
                                    <div className="service-info-group">
                                        <div className="service-id-cont">
                                            <span className="id-badge">{service.id}</span>
                                            {service.priority === 'Emergency' && <span className="urgent-badge"><AlertTriangle size={12} /> Emergency</span>}
                                        </div>
                                        <h4 className="customer-name">{service.customer}</h4>
                                        <p className="tractor-model">{service.tractor}</p>
                                    </div>

                                    <div className="service-meta">
                                        <div className="meta-item">
                                            <MapPin size={14} />
                                            <span>{service.location}</span>
                                        </div>
                                        <div className="meta-item">
                                            <Calendar size={14} />
                                            <span>{service.dateObj.toLocaleString()}</span>
                                        </div>
                                        <div className="meta-item">
                                            <Wrench size={14} />
                                            <span>{service.type}</span>
                                        </div>
                                    </div>

                                    <div className="service-status-section">
                                        <span className={`status-pill ${service.status.toLowerCase().replace(' ', '-')}`}>
                                            {service.status}
                                        </span>
                                        {service.mechanic ? (
                                            <div className="mechanic-assigned">
                                                <User size={14} />
                                                <span>{service.mechanic}</span>
                                            </div>

                                        ) : (
                                            <div style={{ position: 'relative' }}>
                                                <button className="btn-sm primary-outline" onClick={() => openAssignPanel(service.id)}>Assign Mechanic</button>
                                                {assigningServiceId === service.id && (
                                                    <div className="assign-panel">
                                                        <div className="assign-header">Available mechanics (today)</div>
                                                        {(() => {
                                                            const assigned = new Set(servicesState.filter(x => x.mechanic).map(x => x.mechanic));
                                                            const candidates = mechanicsState.filter(m => m.status === 'Available' && !assigned.has(m.name));
                                                            if (candidates.length === 0) return <div className="empty-small">No available mechanics to assign.</div>;
                                                            return candidates.map((m, mi) => (
                                                                <div key={mi} className="assign-item">
                                                                    <div className="mech-left">
                                                                        <span className="mech-name">{m.name}</span>
                                                                        <span className="mech-skill">{m.skill}</span>
                                                                    </div>
                                                                    <div className="mech-right">
                                                                        <button className="btn-sm primary" onClick={() => {
                                                                            // assign
                                                                            setServicesState(prev => prev.map(s => s.id === service.id ? { ...s, mechanic: m.name, status: s.status === 'Pending' ? 'In Progress' : s.status } : s));
                                                                            setMechanicsState(prev => prev.map(mm => mm.name === m.name ? { ...mm, status: 'Busy' } : mm));
                                                                            closeAssignPanel();
                                                                        }}>Assign</button>
                                                                    </div>
                                                                </div>
                                                            ));
                                                        })()}
                                                        <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                                                            <button className="btn-sm primary-outline" onClick={closeAssignPanel}>Close</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        className="view-details"
                                        onClick={() => handleViewDetails(service)}
                                        title={service.status === 'In Progress' ? 'View service details' : 'Only available for In Progress services'}
                                        style={{
                                            opacity: service.status === 'In Progress' ? 1 : 0.5,
                                            cursor: service.status === 'In Progress' ? 'pointer' : 'not-allowed'
                                        }}
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mechanic-sidebar">
                    <div className="card current-working">
                        <div className="card-header">
                            <h3>Current Working Services</h3>
                        </div>
                        <div className="current-list">
                            {currentWorkingServices.length === 0 ? <div className="empty-small">No active services</div> : (
                                currentWorkingServices.map((s) => (
                                    <div key={s.id} className="current-item">
                                        <div className="left">
                                            <span className="id">{s.id}</span>
                                            <span className="name">{s.customer}</span>
                                        </div>
                                        <div className="right">
                                            <span className={`status-mini ${s.status.toLowerCase().replace(' ', '-')}`}>{s.status}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h3>Today Mechanics Availability</h3>
                        </div>
                        <div className="mechanic-list">
                            {assignedMechanics.length === 0 ? (
                                <div className="empty-small">No mechanics assigned</div>
                            ) : (
                                assignedMechanics.map((mech, idx) => (
                                    <div key={idx} className="mechanic-item">
                                        <div className="mech-avatar">
                                            <User size={18} />
                                        </div>
                                        <div className="mech-info">
                                            <span className="mech-name">{mech.name}</span>
                                            <span className="mech-skill">{mech.skill}</span>
                                        </div>
                                        <span className={`status-dot ${(mech.status || 'busy').toLowerCase()}`}></span>
                                    </div>
                                ))
                            )}

                            {/* Available mechanics (not assigned) shown below assigned mechanics */}
                            {availableUnassigned.length > 0 && (
                                <>
                                    {availableUnassigned.map((mech, idx) => (
                                        <div key={`avail-${idx}`} className="mechanic-item">
                                            <div className="mech-avatar">
                                                <User size={18} />
                                            </div>
                                            <div className="mech-info">
                                                <span className="mech-name">{mech.name}</span>
                                                <span className="mech-skill">{mech.skill}</span>
                                            </div>
                                            <span className={`status-dot ${mech.status.toLowerCase()}`}></span>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                        <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                            <div>
                                <button className="btn-sm primary-outline" onClick={() => setShowPresent(v => !v)}>{showPresent ? 'Close Present' : 'Present'}</button>
                            </div>
                        </div>

                        {showPresent && (
                            <div className="present-panel">
                                <div className="assign-header">Total mechanics</div>
                                {(() => {
                                    const candidates = masterMechanics.filter(mm => !mechanicsState.find(m => m.name === mm.name));
                                    if (candidates.length === 0) return <div className="empty-small">No mechanics to add</div>;
                                    return candidates.map((mm, idx) => (
                                        <div key={idx} className="manage-item">
                                            <div className="mech-left">
                                                <span className="mech-name">{mm.name}</span>
                                                <span className="mech-skill">{mm.skill}</span>
                                            </div>
                                            <div className="mech-right">
                                                <button className="btn-sm primary" onClick={() => {
                                                    setMechanicsState(prev => [...prev, { name: mm.name, skill: mm.skill, status: 'Available' }]);
                                                }}>Add</button>
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        )}

                        {showManage && (
                            <div className="manage-panel">
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                                    <button className="btn-sm primary-outline" onClick={() => setShowAddList(s => !s)}>{/* toggle add list */}Add Mechanics</button>
                                </div>
                                {typeof showAddList !== 'undefined' && showAddList && (
                                    <div className="add-list">
                                        {masterMechanics.filter(mm => !mechanicsState.find(m => m.name === mm.name)).map((mm, idx) => (
                                            <div key={idx} className="manage-item">
                                                <div className="mech-left">
                                                    <span className="mech-name">{mm.name}</span>
                                                    <span className="mech-skill">{mm.skill}</span>
                                                </div>
                                                <div className="mech-right">
                                                    <button className="btn-sm primary" onClick={() => {
                                                        setMechanicsState(prev => [...prev, { name: mm.name, skill: mm.skill, status: 'Available' }]);
                                                    }}>Add</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {mechanicsState.slice().sort((a, b) => (b.status === 'Available') - (a.status === 'Available')).map((mech, i) => (
                                    <div key={i} className="manage-item">
                                        <div className="mech-left">
                                            <span className="mech-name">{mech.name}</span>
                                            <span className="mech-skill">{mech.skill}</span>
                                        </div>
                                        <div className="mech-right">
                                            <button className={`toggle-btn ${mech.status === 'Available' ? 'available' : 'busy'}`} onClick={() => toggleMechanicStatus(i)}>
                                                {mech.status === 'Available' ? 'Available' : 'Busy'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="card promo-card">
                    <h4>Home Service Efficiency</h4>
                    <div className="promo-stat">
                        <span className="value">92%</span>
                        <span className="label">On-time Completion</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceManagement;