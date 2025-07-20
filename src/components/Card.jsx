// src/components/Card.jsx
import React from 'react';
import '../styles/styles.css';

// === Utility functions ===
const toNumber = (val) => {
    if (!val) return 0;
    const cleaned = val.toString().replace(/,/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
};

const formatCurrency = (num) =>
    `Rs. ${num.toLocaleString('en-PK', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

// ✅ Modified to accept `showChip` prop
const StatBox = ({ label, value, isUp, isLeft, showChip = true, percentage }) => (
    <div className={`stat-box ${isLeft ? 'left' : ''}`}>
        <p className="stat-label">{label}</p>
        <div className="stat-content">
            <h3 className="stat-value">{value}</h3>
            {showChip && (
                <span className={`status-chip ${isUp ? 'up' : 'down'}`}>
                    {percentage ? `${isUp ? '+' : ''}${percentage}%` : ''}
                </span>
            )}
        </div>
    </div>
);


const Card = ({ title, data }) => {
    const initial = toNumber(data?.initial);
    const current = toNumber(data?.current);
    const isUp = current >= initial;

    return (
        <div className="card">
            <h2 className="card-title">{title}</h2>
            <div className="stat-box-container">
                <StatBox
                    label="Total Investment"
                    value={formatCurrency(initial)}
                    isUp={isUp}
                    isLeft={true}
                    showChip={false}
                />
                <StatBox
                    label="Current Value"
                    value={formatCurrency(current)}
                    isUp={isUp}
                    percentage={toNumber(data?.percentage)} // ✅ HERE
                />
            </div>
        </div>
    );
};

export default Card;
