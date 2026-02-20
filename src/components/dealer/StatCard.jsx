import React from 'react';

// Stat Card Component
export default function StatCard({ title, value, icon, color }) {
    return (
        <div className="stat-card">
            <div className="stat-header">
                <div className={`stat-icon-box bg-gradient-to-br ${color}`}>
                    {icon}
                </div>
            </div>

            <h3 className="stat-title">
                {title}
            </h3>
            <p className="stat-value">
                {value}
            </p>
        </div>
    );
}
