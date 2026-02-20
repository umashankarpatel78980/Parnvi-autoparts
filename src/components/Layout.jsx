import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const Layout = ({ children, title }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="admin-container">
            {isSidebarOpen && <div className="sidebar-backdrop" onClick={closeSidebar}></div>}
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            <div className="main-content">
                <Header title={title} toggleSidebar={toggleSidebar} />
                <main className="page-content animate-fade">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
