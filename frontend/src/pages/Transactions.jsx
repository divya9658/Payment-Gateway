import React, { useState, useEffect } from 'react';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/v1/payments', {
                    headers: {
                        'X-Api-Key': 'key_test_abc123',
                        'X-Api-Secret': 'secret_test_xyz789',
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                
                // If data is an array, use it; if it's an object containing a list, use that
                setTransactions(Array.isArray(data) ? data : (data.content || []));
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    if (loading) return <div>Loading Transactions...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Payment Transactions</h2>
            <table data-test-id="transactions-table" border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: '#f4f4f4' }}>
                    <tr>
                        <th>Payment ID</th>
                        <th>Order ID</th>
                        <th>Amount (INR)</th>
                        <th>Method</th>
                        <th>Status</th>
                        <th>Created</th>
                    </tr>
                </thead>
              <tbody>
    {transactions.length > 0 ? (
        transactions.map((tx) => (
            <tr key={tx.id} data-test-id="transaction-row">
                <td data-test-id="payment-id">{tx.id}</td>
                <td data-test-id="order-id">{tx.orderId}</td>
                <td data-test-id="amount">₹{(tx.amount / 100).toFixed(2)}</td>
                {/* CHANGE: Use toLowerCase() to match API specs */}
                <td data-test-id="method">{tx.method ? tx.method.toLowerCase() : 'n/a'}</td>
                <td data-test-id="status" style={{ 
                    color: tx.status === 'success' ? 'green' : 'orange',
                    fontWeight: 'bold' 
                }}>
                    {tx.status}
                </td>
                <td data-test-id="created-at">{new Date(tx.createdAt).toLocaleString()}</td>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No transactions found.</td>
        </tr>
    )}
</tbody>
            </table>
        </div>
    );
};

export default Transactions;