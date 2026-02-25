import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      console.log("Login successful! Navigating...");
      navigate('/dashboard'); 
    } else {
      alert("Please enter your password");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Logo or Brand Icon Placeholder */}
        <div style={logoCircleStyle}>💳</div>
        
        <h2 style={titleStyle}>Merchant Login</h2>
        <p style={subtitleStyle}>Access your payments dashboard</p>

        <form data-test-id="login-form" onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email Address</label>
            <input 
              data-test-id="email-input" 
              type="email" 
              placeholder="e.g. test@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password</label>
            <input 
              data-test-id="password-input" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button 
            data-test-id="login-button" 
            type="submit" 
            style={buttonStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1a252f'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#2c3e50'}
          >
            Login
          </button>
        </form>
        
        <div style={footerStyle}>
          Forgot password? <span style={{color: '#007bff', cursor: 'pointer'}}>Contact Support</span>
        </div>
      </div>
    </div>
  );
};

// --- STYLING OBJECTS ---

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
};

const cardStyle = {
  width: '100%',
  maxWidth: '400px',
  padding: '40px',
  backgroundColor: 'white',
  borderRadius: '16px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
  textAlign: 'center'
};

const logoCircleStyle = {
  width: '60px',
  height: '60px',
  backgroundColor: '#f1f3f5',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '24px',
  margin: '0 auto 20px auto'
};

const titleStyle = {
  margin: '0 0 10px 0',
  color: '#2c3e50',
  fontSize: '1.5rem',
  fontWeight: '700'
};

const subtitleStyle = {
  margin: '0 0 30px 0',
  color: '#7f8c8d',
  fontSize: '0.9rem'
};

const formStyle = {
  textAlign: 'left'
};

const inputGroupStyle = {
  marginBottom: '20px'
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '0.85rem',
  fontWeight: '600',
  color: '#34495e'
};

const inputStyle = {
  width: '100%',
  padding: '12px 15px',
  borderRadius: '8px',
  border: '1px solid #dee2e6',
  fontSize: '1rem',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.2s'
};

const buttonStyle = {
  width: '100%',
  padding: '14px',
  backgroundColor: '#2c3e50',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  marginTop: '10px',
  transition: 'background-color 0.2s'
};

const footerStyle = {
  marginTop: '25px',
  fontSize: '0.85rem',
  color: '#95a5a6'
};

export default Login;