import React from 'react';
import Card from './Card';
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

const Body = ({ data }) => {
    // Parse values correctly
    const stockInitial = toNumber(data?.stocks?.initial);
    const stockCurrent = toNumber(data?.stocks?.current);
    const goldInitial = toNumber(data?.gold?.initial);
    const goldCurrent = toNumber(data?.gold?.current);

    const invested = stockInitial + goldInitial;
    const netWorth = stockCurrent + goldCurrent;
    const profitLoss = netWorth - invested;
    const isProfit = profitLoss >= 0;

    return (
        <main className="page-padding body body-container">
            <span className="chip">Hey millionaire 👋🏻</span>

            <h1 className="main-heading">
                You invested{' '}
                <span className="highlight-invested">{formatCurrency(invested)}</span> and your current total net worth is{' '}
                <span className={isProfit ? 'highlight-profit' : 'highlight-loss'}>
                    {formatCurrency(netWorth)}
                </span>.
            </h1>

            <p className="subtext">
                You {isProfit ? 'made a' : 'have a'}{' '}
                <span className={isProfit ? 'highlight-profit-span' : 'highlight-loss-span'}>
                    {formatCurrency(Math.abs(profitLoss))} {isProfit ? 'profit' : 'loss'}
                </span>
            </p>

            <div className="card-wrapper">
                <Card title="Stock Portfolio" data={data.stocks} />
                <Card title="Gold Portfolio" data={data.gold} />
            </div>
        </main>
    );
};

export default Body;
