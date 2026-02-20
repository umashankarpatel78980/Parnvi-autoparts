import React from 'react';
import {
    TrendingUp,
    Users,
    AlertTriangle,
    Wrench,
    Package,
    ChevronRight,
    IndianRupee
} from 'lucide-react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const stats = [
        { label: 'Total Sales', value: '₹45,231', icon: <IndianRupee size={24} />, color: '#10b981', trend: '+12.5%' },
        { label: 'Active Services', value: '12', icon: <Wrench size={24} />, color: '#3b82f6', trend: 'In Progress' },
        { label: 'Total Customers', value: '1,284', icon: <Users size={24} />, color: '#6366f1', trend: '+4.3%' },
        { label: 'Low Stock', value: '08', icon: <AlertTriangle size={24} />, color: '#ef4444', trend: 'Urgent' },
    ];

    const recentServices = [
        { id: 'SR-1024', customer: 'Rajesh Kumar', tractor: 'Mahindra Arjun 555', type: 'Home Service', status: 'In Progress', date: 'Oct 24, 02:30 PM' },
        { id: 'SR-1023', customer: 'Suresh Singh', tractor: 'Sonalika Worldtrac 60', type: 'Shop Service', status: 'Pending', date: 'Oct 24, 11:15 AM' },
        { id: 'SR-1022', customer: 'Amit Patel', tractor: 'John Deere 5310', type: 'Home Service', status: 'Completed', date: 'Oct 23, 04:45 PM' },
    ];

    return (
        <div className="dashboard">
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="stat-card"
                        onClick={() => stat.label === 'Low Stock' ? navigate('/parts', { state: { view: 'low-stock' } }) : null}
                        style={{ cursor: stat.label === 'Low Stock' ? 'pointer' : 'default' }}
                    >
                        <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">{stat.label}</span>
                            <h3 className="stat-label">{stat.value}</h3>
                            <span className="stat-trend" style={{ color: stat.trend.includes('+') ? '#10b981' : (stat.trend === 'Urgent' ? '#ef4444' : '#94a3b8') }}>
                                {stat.trend}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                <div className="card service-card">
                    <div className="card-header">
                        <h3>Recent Service Requests</h3>
                        <button className="view-all" onClick={() => navigate('/services')}>View All <ChevronRight size={16} /></button>
                    </div>
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Request ID</th>
                                    <th>Customer</th>
                                    <th>Tractor</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentServices.map((service) => (
                                    <tr key={service.id}>
                                        <td><span className="id-badge">{service.id}</span></td>
                                        <td>{service.customer}</td>
                                        <td>{service.tractor}</td>
                                        <td>{service.type}</td>
                                        <td>
                                            <span className={`status-pill ${service.status.toLowerCase().replace(' ', '-')}`}>
                                                {service.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card quick-actions">
                    <div className="card-header">
                        <h3>Quick Actions</h3>
                    </div>
                    <div className="action-buttons">
                        <button className="action-btns primary" onClick={() => navigate('/parts')}>
                            <Package size={20} />
                            <span >Add New Part</span>
                        </button>
                        <button className="action-btns info" onClick={() => navigate('/services')}>
                            <Wrench size={20} />
                            <span >New Service</span>
                        </button>
                        <button className="action-btns secondary" onClick={() => navigate('/mechanics')}>
                            <Users size={20} />
                            <span >Add Mechanic</span>
                        </button>
                        <button className="action-btns accent" onClick={() => navigate('/reports')}>
                            <TrendingUp size={20} />
                            <span >View Reports</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
