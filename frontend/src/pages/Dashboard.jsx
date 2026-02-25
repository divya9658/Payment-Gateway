import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [stats, setStats] = useState({ count: 0, sum: 0, rate: 0 });
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('overview'); 
    const [orderAmount, setOrderAmount] = useState('');
    const [generatedLink, setGeneratedLink] = useState('');

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/payments', {
                method: 'GET',
                headers: {
                    'X-Api-Key': 'key_test_abc123',
                    'X-Api-Secret': 'secret_test_xyz789',
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            const payments = Array.isArray(data) ? data : (data.content || []);

            if (payments.length > 0) {
                const successPayments = payments.filter(p => p.status === 'success');
                const totalSum = successPayments.reduce((acc, p) => acc + (p.amount || 0), 0);
                // Success rate calculation: (successful / total) * 100
                const successRate = Math.round((successPayments.length / payments.length) * 100);

                setStats({
                    count: payments.length,
                    sum: totalSum,
                    rate: successRate
                });
            }
        } catch (err) {
            console.error("Failed to fetch stats:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStats(); }, []);

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/v1/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': 'key_test_abc123',
                    'X-Api-Secret': 'secret_test_xyz789'
                },
                body: JSON.stringify({ 
                    amount: Math.round(parseFloat(orderAmount) * 100), 
                    currency: 'INR', 
                    receipt: `rcpt_${Date.now()}` 
                })
            });
            const data = await response.json();
            if (data.id) {
                setGeneratedLink(`http://localhost:3001/checkout?order_id=${data.id}`);
            }
        } catch (err) {
            alert("Failed to create order");
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading Dashboard...</div>;

    return (
        <div data-test-id="dashboard" style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ margin: 0, color: '#2c3e50' }}>Merchant Dashboard</h1>
                <nav>
                    <button onClick={() => setView('overview')} style={navBtnStyle(view === 'overview')}>Overview</button>
                    <button onClick={() => setView('create')} style={navBtnStyle(view === 'create')}>+ Create Order</button>
                </nav>
            </div>

            <hr style={{ border: '0', borderTop: '1px solid #eee', marginBottom: '30px' }} />

            {view === 'overview' ? (
                <>
                    {/* REQUIRED STATS CONTAINER */}
                    <div data-test-id="stats-container" style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                        <StatCard testId="total-transactions" label="Transactions" value={stats.count} color="#333" />
                        <StatCard 
                            testId="total-amount" 
                            label="Total Revenue" 
                            value={`₹${(stats.sum / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} 
                            color="#2e7d32" 
                        />
                        <StatCard testId="success-rate" label="Success Rate" value={`${stats.rate}%`} color="#2e7d32" />
                    </div>

                    {/* REQUIRED API CREDENTIALS CONTAINER */}
                    <div data-test-id="api-credentials" style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '12px', border: '1px solid #e9ecef' }}>
                        <h3 style={{ marginTop: 0 }}>API Credentials</h3>
                        <div>
                            <label style={{ fontWeight: 'bold' }}>API Key: </label>
                            <span data-test-id="api-key">key_test_abc123</span>
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <label style={{ fontWeight: 'bold' }}>API Secret: </label>
                            <span data-test-id="api-secret">secret_test_xyz789</span>
                        </div>
                    </div>
                </>
            ) : (
                <div style={{ maxWidth: '500px', padding: '30px', border: '1px solid #ddd', borderRadius: '12px' }}>
                    <h3>Generate New Payment Link</h3>
                    <form onSubmit={handleCreateOrder}>
                        <label style={{ display: 'block', marginBottom: '10px' }}>Amount (INR)</label>
                        <input 
                            type="number" 
                            placeholder="e.g. 500.00" 
                            value={orderAmount} 
                            onChange={(e) => setOrderAmount(e.target.value)}
                            style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '6px', border: '1px solid #ccc' }}
                            required 
                        />
                        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                            Generate Link
                        </button>
                    </form>

                    {generatedLink && (
                        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '1px solid #b3d7ff' }}>
                            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Checkout URL:</p>
                            <a href={generatedLink} target="_blank" rel="noreferrer" style={{ wordBreak: 'break-all' }}>
                                {generatedLink}
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Helper components using data-test-id
const StatCard = ({ label, value, color, testId }) => (
    <div style={{ flex: 1, border: '1px solid #eee', padding: '25px', borderRadius: '12px', backgroundColor: 'white' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '0.9em', textTransform: 'uppercase' }}>{label}</h4>
        <div data-test-id={testId} style={{ fontSize: '32px', fontWeight: 'bold', color }}>{value}</div>
    </div>
);

const navBtnStyle = (active) => ({
    padding: '10px 20px',
    marginLeft: '10px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: active ? '#2c3e50' : '#f1f3f5',
    color: active ? 'white' : '#2c3e50',
    cursor: 'pointer',
    fontWeight: '600'
});

export default Dashboard;