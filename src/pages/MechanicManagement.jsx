import React, { useState } from 'react';
import {
    Plus,
    Search,
    User,
    Phone,
    Settings,
    Award,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowLeft,
    MapPin,
    Star,
} from 'lucide-react';
import './MechanicManagement.css';
import { useNavigate } from 'react-router-dom';
import StyledButton from '../components/StyledButton';


/* ---------------- MAIN COMPONENT ---------------- */
const MechanicManagement = () => {
    const [mechanics, setMechanics] = useState([
        {
            id: 1,
            name: 'Vikram Singh',
            skill: 'Engine & Transmission',
            contact: '+91 98765 43210',
            status: 'Active',
            rating: 4.8,
            address: 'Village Rampur, Sector 4',
            services: [
                {
                    serviceId: 'S101',
                    customerName: 'Rajesh Kumar',
                    title: 'Engine Overhaul',
                    tractorModel: 'Mahindra 575 DI',
                    date: '12 Jan 2026',
                    status: 'Completed',
                    cost: 8500,
                },
                {
                    serviceId: 'S102',
                    customerName: 'Sanjay Yadav',
                    title: 'Clutch Plate Replacement',
                    tractorModel: 'Sonalika DI 745',
                    date: '18 Jan 2026',
                    status: 'Completed',
                    cost: 4200,
                },
                {
                    serviceId: 'S103',
                    customerName: 'Mukesh Sharma',
                    title: 'Transmission Repair',
                    tractorModel: 'John Deere 5310',
                    date: '25 Jan 2026',
                    status: 'In Progress',
                    cost: 3000,
                },
            ],
        },
        {
            id: 2,
            name: 'Rahul Verma',
            skill: 'Hydraulics & Implements',
            contact: '+91 98765 43211',
            status: 'Busy',
            rating: 4.5,
            address: 'Sector 12, City Center',
            services: [
                {
                    serviceId: 'S201',
                    customerName: 'Anil Kumar',
                    title: 'Hydraulic Pump Repair',
                    tractorModel: 'New Holland 3630',
                    date: '10 Jan 2026',
                    status: 'Completed',
                    cost: 5200,
                },
                {
                    serviceId: 'S202',
                    customerName: 'Vijay Singh',
                    title: 'Lift System Adjustment',
                    tractorModel: 'Massey Ferguson 245',
                    date: '22 Jan 2026',
                    status: 'Pending',
                    cost: 1800,
                },
            ],
        },
        {
            id: 3,
            name: 'Sameer Khan',
            skill: 'Electrical & Electronics',
            contact: '+91 98765 43212',
            status: 'Active',
            rating: 4.9,
            address: 'Downtown, Main Street',
            services: [
                {
                    serviceId: 'S301',
                    customerName: 'Ramesh Patel',
                    title: 'Wiring Harness Replacement',
                    tractorModel: 'Mahindra Arjun 605',
                    date: '08 Jan 2026',
                    status: 'Completed',
                    cost: 2600,
                },
                {
                    serviceId: 'S302',
                    customerName: 'Suresh Patel',
                    title: 'Battery & Alternator Check',
                    tractorModel: 'Powertrac Euro 50',
                    date: '16 Jan 2026',
                    status: 'Completed',
                    cost: 1200,
                },
                {
                    serviceId: 'S303',
                    customerName: 'Dinesh Kumar',
                    title: 'Starter Motor Repair',
                    tractorModel: 'Eicher 380',
                    date: '27 Jan 2026',
                    status: 'Completed',
                    cost: 1900,
                },
            ],
        },
        {
            id: 4,
            name: 'Amit Dogra',
            skill: 'General Servicing',
            contact: '+91 98765 43213',
            status: 'Inactive',
            rating: 4.2,
            address: 'Greenfield, Block B',
            services: [],
        },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMechanic, setSelectedMechanic] = useState(null);
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // Handle window resize
    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    /* ---------------- DETAIL VIEW ---------------- */
    if (selectedMechanic) {
        return (
            <div className="mechanic-detail-page">
                <div className="detail-page-header">
                    <StyledButton
                        variant="secondary"
                        icon={ArrowLeft}
                        onClick={() => setSelectedMechanic(null)}
                    >
                        Back
                    </StyledButton>
                </div>

                <div className="mechanic-detail-container">
                    {isMobile ? (
                        /* 📱 MOBILE VIEW */
                        <div className="mechanic-card-detail mobile">
                            {/* Avatar Section */}
                            <div className="detail-avatar-section">
                                <div className="detail-avatar">
                                    <User size={32} />
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="detail-info-section">
                                <h2 className="detail-name">{selectedMechanic.name}</h2>
                                <p className="detail-skill">{selectedMechanic.skill}</p>

                                <span className={`detail-status-badge status-${selectedMechanic.status.toLowerCase()}`}>
                                    <span className="status-dot"></span>
                                    {selectedMechanic.status}
                                </span>
                            </div>

                            {/* Stats Grid - Mobile */}
                            <div className="detail-stats-mobile">
                                <div className="stat-box">
                                    <Phone size={18} className="stat-icon-red" />
                                    <span className="stat-value">{selectedMechanic.contact}</span>
                                </div>
                                <div className="stat-box">
                                    <Star size={18} className="stat-icon-yellow" />
                                    <span className="stat-value">{selectedMechanic.rating}</span>
                                </div>
                                <div className="stat-box">
                                    <span className="stat-value">{selectedMechanic.services.length} Services</span>
                                </div>
                            </div>

                            {/* Address - Mobile */}
                            <div className="detail-address-mobile">
                                <MapPin size={16} className="address-icon" />
                                <span>{selectedMechanic.address}</span>
                            </div>
                        </div>
                    ) : (
                        /* 💻 DESKTOP VIEW */
                        <div className="mechanic-card-detail desktop">
                            <div className="detail-top-row">
                                <div className="detail-left-section">
                                    <div className="detail-avatar">
                                        <User size={48} />
                                    </div>
                                    <div className="detail-info-text">
                                        <h2 className="detail-name">{selectedMechanic.name}</h2>
                                        <p className="detail-skill">{selectedMechanic.skill}</p>
                                    </div>
                                </div>

                                <span className={`detail-status-badge status-${selectedMechanic.status.toLowerCase()}`}>
                                    <span className="status-dot"></span>
                                    {selectedMechanic.status}
                                </span>
                            </div>

                            {/* Stats Row - Desktop */}
                            <div className="detail-stats-desktop">
                                <div className="stat-column">
                                    <Phone size={24} className="stat-icon-red" />
                                    <span className="stat-label">CONTACT</span>
                                    <span className="stat-value">{selectedMechanic.contact}</span>
                                </div>
                                <div className="stat-divider-vertical"></div>
                                <div className="stat-column">
                                    <Star size={24} className="stat-icon-yellow" />
                                    <span className="stat-label">RATING</span>
                                    <span className="stat-value">{selectedMechanic.rating}</span>
                                </div>
                                <div className="stat-divider-vertical"></div>
                                <div className="stat-column">
                                    <span className="stat-label">COMPLETED</span>
                                    <span className="stat-value">{selectedMechanic.services.length} Services</span>
                                </div>
                            </div>

                            {/* Bottom Row - Address & Button */}
                            <div className="detail-bottom-row">
                                <div className="detail-address-desktop">
                                    <MapPin size={18} className="address-icon" />
                                    <span>{selectedMechanic.address}</span>
                                </div>
                                <StyledButton variant="danger" className="terminate-button">Terminate</StyledButton>
                            </div>
                        </div>
                    )}

                    {/* Service History Section */}
                    <div className="service-history-section">
                        <h3 className="service-history-title">
                            <Settings size={20} />
                            Service History
                        </h3>

                        {selectedMechanic.services.length === 0 ? (
                            <div className="no-services">No services done yet</div>
                        ) : (
                            <div className="service-history-list">
                                {selectedMechanic.services.map((service) => (
                                    <div key={service.serviceId} className="service-history-card">
                                        <div className="service-row">
                                            <span className="service-label">Service ID:</span>
                                            <span className="service-value service-id">{service.serviceId}</span>
                                        </div>
                                        <div className="service-row">
                                            <span className="service-label">Customer:</span>
                                            <span className="service-value">{service.customerName}</span>
                                        </div>
                                        <div className="service-row">
                                            <span className="service-label">Title:</span>
                                            <span className="service-value">{service.title}</span>
                                        </div>
                                        <div className="service-row">
                                            <span className="service-label">Tractor:</span>
                                            <span className="service-value">{service.tractorModel}</span>
                                        </div>
                                        <div className="service-row">
                                            <span className="service-label">Date:</span>
                                            <span className="service-value">{service.date}</span>
                                        </div>
                                        <div className="service-row">
                                            <span className="service-label">Status:</span>
                                            <span className={`service-status status-${service.status.toLowerCase().replace(' ', '-')}`}>
                                                {service.status}
                                            </span>
                                        </div>
                                        <div className="service-row">
                                            <span className="service-label">Cost:</span>
                                            <span className="service-value service-cost">₹{service.cost}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    /* ---------------- LIST VIEW ---------------- */
    return (
        <div className="mechanic-mgmt">
            <div className="page-header">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search mechanic..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <StyledButton variant="primary" icon={Plus} onClick={() => navigate('/add-mechanic')}>
                    Add Mechanic
                </StyledButton>
            </div>

            <div className="mechanics-grid">
                {mechanics
                    .filter((m) =>
                        (m.name + m.skill)
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                    )
                    .map((mech) => (
                        <div key={mech.id} className="mechanic-card">
                            <div className="mech-card-headers">
                                <div className="mech-avatar-large">
                                    <User />
                                    <span
                                        className={`status-indicator ${mech.status.toLowerCase()}`}
                                    ></span>
                                </div>
                                <div>
                                    <h4>{mech.name}</h4>
                                    <div className="rating">
                                        <Award size={14} /> {mech.rating}
                                    </div>
                                </div>
                            </div>

                            <div className="mech-card-body">
                                <div className="info-row">
                                    <Settings size={16} /> {mech.skill}
                                </div>
                                <div className="info-row">
                                    <Phone size={16} /> {mech.contact}
                                </div>
                                <div className="info-row">
                                    <Clock size={16} /> {mech.services.length} Services
                                </div>
                            </div>

                            <div className="mech-card-footer">
                                <div className="status-badge">
                                    {mech.status === 'Active' && <CheckCircle2 size={14} />}
                                    {mech.status === 'Inactive' && <XCircle size={14} />}
                                    {mech.status === 'Busy' && <Clock size={14} />}
                                    <span>{mech.status}</span>
                                </div>

                                <StyledButton variant="outline" onClick={() => setSelectedMechanic(mech)}>
                                    View History
                                </StyledButton>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default MechanicManagement;