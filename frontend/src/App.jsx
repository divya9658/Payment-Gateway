import React, { useState, useEffect } from 'react';
import './App.css'; // Make sure to add the CSS below

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ total: 0, amount: 0, rate: 0 });
  const credentials = { key: "key_test_abc123", secret: "secret_test_xyz789" };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/payments', {
          headers: {
            'X-Api-Key': credentials.key,
            'X-Api-Secret': credentials.secret
          }
        });
        const data = await response.json();
        
        setTransactions(data);

        // Calculate Stats
        const successful = data.filter(t => t.status === 'paid' || t.status === 'success');
        const totalAmount = successful.reduce((acc, curr) => acc + curr.amount, 0);
        const successRate = data.length > 0 ? (successful.length / data.length) * 100 : 0;

        setStats({
          total: data.length,
          amount: (totalAmount / 100).toFixed(2),
          rate: successRate.toFixed(1)
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
    // Refresh every 10 seconds to show new payments automatically
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div data-test-id="dashboard" className="dashboard-wrapper">
      <header className="dashboard-header">
        <h1>Merchant Dashboard</h1>
        <div data-test-id="api-credentials" className="credentials-banner">
          <span><strong>API Key:</strong> <code data-test-id="api-key">{credentials.key}</code></span>
          <span><strong>Secret:</strong> <code data-test-id="api-secret">{credentials.secret}</code></span>
        </div>
      </header>

      <div data-test-id="stats-container" className="stats-grid">
        <div className="stat-card" data-test-id="total-transactions">
          <label>Total Transactions</label>
          <div className="value">{stats.total}</div>
        </div>
        <div className="stat-card" data-test-id="total-amount">
          <label>Total Revenue</label>
          <div className="value">₹{stats.amount}</div>
        </div>
        <div className="stat-card" data-test-id="success-rate">
          <label>Success Rate</label>
          <div className="value">{stats.rate}%</div>
        </div>
      </div>

      <div className="table-container">
        <h2>Recent Payments</h2>
        <table data-test-id="transactions-table" className="modern-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} data-test-id="transaction-row" data-payment-id={tx.id}>
                <td data-test-id="payment-id" className="mono">{tx.id}</td>
                <td data-test-id="status">
                  <span className={`status-tag ${tx.status}`}>{tx.status}</span>
                </td>
                <td data-test-id="amount">₹{(tx.amount / 100).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}