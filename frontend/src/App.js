import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; 
import Transactions from './pages/Transactions';

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <div className="App" style={{ minHeight: '100vh', backgroundColor: '#fdfdfd' }}>
      {!isLoginPage && (
        <header style={headerStyle}>
          <h1 style={{ margin: 0, color: '#1a202c', fontSize: '1.4rem', fontWeight: '700' }}>
            Merchant Dashboard
          </h1>
          
          <nav style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Link to="/dashboard" style={linkStyle(location.pathname === "/dashboard")}>
              Home
            </Link>
            <Link to="/dashboard/transactions" style={linkStyle(location.pathname === "/dashboard/transactions")}>
              Transactions
            </Link>
          </nav>
        </header>
      )}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/transactions" element={<Transactions />} />
      </Routes>
    </div>
  );
};

// --- UPDATED STYLING OBJECTS ---

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '18px 50px',
  // Light modern background color (soft blue-gray)
  backgroundColor: '#f8f9fc', 
  borderBottom: '1px solid #e2e8f0',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  fontFamily: '"Inter", sans-serif',
  marginBottom: '20px'
};

const linkStyle = (isActive) => ({
  padding: '10px 20px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '0.9rem',
  fontWeight: '600',
  transition: 'all 0.3s ease',
  // Active state uses a white "card" look against the light header
  backgroundColor: isActive ? '#ffffff' : 'transparent',
  color: isActive ? '#6610f2' : '#718096',
  boxShadow: isActive ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
  border: isActive ? '1px solid #e2e8f0' : '1px solid transparent'
});

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;