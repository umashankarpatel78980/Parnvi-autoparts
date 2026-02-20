import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, User, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = ({ title, toggleSidebar }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/login');
        }
    };

    return (
        <header className="header">
            <div className="header-left">
                <button className="mobile-menu-btn" onClick={toggleSidebar}>
                    <Menu size={24} />
                </button>
                <h1 className="header-title">{title}</h1>
            </div>

            <div className="header-search">
                <Search size={18} className="search-icon" />
                <input type="text" placeholder="Search orders, parts, customers..." />
            </div>

            <div className="header-right">
                <button className="icon-btn">
                    <Bell size={20} />
                    <span className="notification-badge"></span>
                </button>
                <div className="user-profile">
                    <div className="user-info">
                        <span className="user-name">{'Sunil Mokati'}</span>
                        <span className="user-role">{'Shop Owner'}</span>
                    </div>
                    <div className="avatar">
                        <User size={20} />
                    </div>
                </div>
                <button className="icon-btn logout-btn" onClick={handleLogout} title="Logout">
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
};

export default Header;

