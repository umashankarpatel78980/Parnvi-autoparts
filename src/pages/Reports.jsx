import React from 'react';
import {
    BarChart3,
    TrendingUp,
    PieChart,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Calendar
} from 'lucide-react';
import './Reports.css';

const Reports = () => {
    const summary = [
        { label: 'Revenue', value: '₹12.4L', trend: '+18%', icon: <DollarSign />, up: true },
        { label: 'Parts Sold', value: '458', trend: '+12%', icon: <TrendingUp />, up: true },
        { label: 'Services', value: '84', trend: '-5%', icon: <BarChart3 />, up: false },
        { label: 'Growth', value: '24%', trend: '+4%', icon: <PieChart />, up: true },
    ];

    return (
        <div className="reports-page">
            <div className="page-header">
                <h2>Analytics & Reports</h2>
                <div className="header-actions">
                    <button className="btn outline">
                        <Calendar size={18} />
                        <span>Last 30 Days</span>
                    </button>
                    <button className="btn primary">
                        <Download size={18} />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            <div className="reports-grid">
                {summary.map((item, idx) => (
                    <div key={idx} className="report-stat-card">
                        <div className="stat-header">
                            <span className="stat-label">{item.label}</span>
                            <div className="stat-icon-bg">{item.icon}</div>
                        </div>
                        <div className="stat-main">
                            <h3>{item.value}</h3>
                            <div className={`trend-pill ${item.up ? 'up' : 'down'}`}>
                                {item.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                <span>{item.trend}</span>
                            </div>
                        </div>
                        <p className="stat-footer">vs previous period</p>
                    </div>
                ))}
            </div>

            <div className="charts-container">
                <div className="card chart-card">
                    <div className="card-header">
                        <h3>Revenue Growth</h3>
                    </div>
                    <div className="mock-chart bar-chart">
                        {[65, 45, 75, 50, 90, 60, 80].map((h, i) => (
                            <div key={i} className="bar-wrapper">
                                <div className="bar" style={{ height: `${h}%` }}></div>
                                <span className="label">M{i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card table-card">
                    <div className="card-header">
                        <h3>Top Selling Parts</h3>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Part Name</th>
                                <th>Quantity Sold</th>
                                <th>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>Clutch Plate Mahindra</td><td>124</td><td>₹5.5L</td></tr>
                            <tr><td>Oil Filter XL</td><td>85</td><td>₹72K</td></tr>
                            <tr><td>Hydraulic Pump</td><td>32</td><td>₹4.0L</td></tr>
                            <tr><td>Brake Liner Kit</td><td>24</td><td>₹52K</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;
