import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Settings,
    Wrench,
    Package,
    Users,
    ClipboardList,
    Tag,
    BarChart3,
    LogOut,
    ChevronRight,
    X
} from 'lucide-react';
import './Sidebar.css';
import logo from '../assets/final_logo_1-removebg-preview.png';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    
    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/login');
        }
    };
    const menuItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'Parts Manage', path: '/parts', icon: <Package size={20} /> },
        { name: 'Service Requests', path: '/services', icon: <Wrench size={20} /> },
        { name: 'Billing', path: '/orders', icon: <ClipboardList size={20} /> },
        { name: 'Mechanics', path: '/mechanics', icon: <Users size={20} /> },
        { name: 'Dealers Manage', path: '/dealer', icon: <Users size={20} /> },
        { name: 'Customers Manage', path: '/customers', icon: <Users size={20} /> },
        { name: 'Offers & Promos', path: '/offers', icon: <Tag size={20} /> },
        { name: 'Reports', path: '/reports', icon: <BarChart3 size={20} /> },
        { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
    ];

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div className="logo" >
                    <div className="logo-wrapper" >
                        <img src={logo} alt="Pranavee Enterprises Logo" className="logo-image" />
                    </div>
                    <span className="brand-name">PRANAVI ENTERPRISES</span>
                </div>
                <button className="close-sidebar-btn" onClick={onClose}>
                    <X size={24} />
                </button>
            </div>
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-text">{item.name}</span>
                        <ChevronRight className="nav-arrow" size={14} />
                    </NavLink>
                ))}
            </nav>
            <div className="sidebar-footer">
                <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={20} />
                    <span>Logout Admin</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
