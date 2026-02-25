import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const Checkout = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('order_id');
    const [method, setMethod] = useState(null);
    const [status, setStatus] = useState('idle');
    const [paymentId, setPaymentId] = useState('');
    const [orderAmount, setOrderAmount] = useState('0.00');

    useEffect(() => {
        if (orderId) {
            fetch(`http://localhost:8000/api/v1/orders/${orderId}`, {
                headers: {
                    'X-Api-Key': 'key_test_abc123',
                    'X-Api-Secret': 'secret_test_xyz789'
                }
            })
            .then(res => res.json())
            .then(data => {
                if(data.amount) setOrderAmount((data.amount / 100).toFixed(2));
            });
        }
    }, [orderId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('processing');
        const formData = new FormData(e.target);
        
        const payload = {
            order_id: orderId,
            method: method,
            ...(method === 'upi' ? { vpa: formData.get('vpa') } : {
                card: {
                    number: formData.get('cardNumber'),
                    expiry_month: formData.get('expiry').split('/')[0],
                    expiry_year: "20" + formData.get('expiry').split('/')[1],
                    cvv: formData.get('cvv'),
                    holder_name: formData.get('name')
                }
            })
        };

        try {
            const response = await fetch('http://localhost:8000/api/v1/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const payment = await response.json();
            if (payment.id) {
                setPaymentId(payment.id);
                startPolling(payment.id);
            } else {
                setStatus('failed');
            }
        } catch (err) {
            setStatus('failed');
        }
    };

    const startPolling = (pid) => {
        const interval = setInterval(async () => {
            const res = await fetch(`http://localhost:8000/api/v1/payments/${pid}`);
            const data = await res.json();
            if (data.status !== 'processing') {
                setStatus(data.status);
                clearInterval(interval);
            }
        }, 2000);
    };

    // Styling constants
    const containerStyle = { padding: '40px', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto' };
    const cardStyle = { border: '1px solid #ddd', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
    const inputStyle = { display: 'block', width: '100%', marginBottom: '10px', padding: '8px', boxSizing: 'border-box' };
    const buttonStyle = { padding: '10px 20px', cursor: 'pointer', marginRight: '10px' };

    if (status === 'processing') return (
        <div style={containerStyle} data-test-id="processing-state">
            <div style={{ textAlign: 'center' }}>
                <div className="loader"></div> {/* Add CSS for loader if desired */}
                <h3 data-test-id="processing-message">Processing payment...</h3>
                <p>Please do not refresh the page.</p>
            </div>
        </div>
    );

    if (status === 'success') return (
        <div style={containerStyle} data-test-id="success-state">
            <div style={{ ...cardStyle, textAlign: 'center', borderColor: '#27ae60' }}>
                <h2 style={{ color: '#27ae60' }}>Payment Successful!</h2>
                <p>Payment ID: <strong data-test-id="payment-id">{paymentId}</strong></p>
                <span data-test-id="success-message">Your payment has been processed successfully</span>
                <button 
                onClick={() => window.location.href = 'http://localhost:3000/dashboard'}
                style={{ 
                    padding: '10px 20px', 
                    backgroundColor: '#2c3e50', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px', 
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}
            >
                Return to Merchant Dashboard
            </button>
            </div>
        </div>
    );

    if (status === 'failed') return (
        <div style={containerStyle} data-test-id="error-state">
            <div style={{ ...cardStyle, textAlign: 'center', borderColor: '#e74c3c' }}>
                <h2 style={{ color: '#e74c3c' }}>Payment Failed</h2>
                <span data-test-id="error-message">Payment could not be processed</span>
                <br /><br />
                <button style={buttonStyle} data-test-id="retry-button" onClick={() => setStatus('idle')}>Try Again</button>
            </div>
        </div>
    );

    return (
        <div style={containerStyle} data-test-id="checkout-container">
            <div style={{ marginBottom: '30px' }} data-test-id="order-summary">
                <h1 style={{ marginBottom: '5px' }}>Complete Payment</h1>
                <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>
                    <span data-test-id="order-amount">₹{orderAmount}</span>
                </div>
                <div style={{ color: '#666', fontSize: '0.9em' }}>
                    Order ID: <span data-test-id="order-id">{orderId}</span>
                </div>
            </div>

            <div style={{ marginBottom: '20px' }} data-test-id="payment-methods">
                <button style={buttonStyle} data-test-id="method-upi" onClick={() => setMethod('upi')}>UPI</button>
                <button style={buttonStyle} data-test-id="method-card" onClick={() => setMethod('card')}>Debit/Credit Card</button>
            </div>

            <div style={cardStyle}>
                {method === 'upi' && (
                    <form data-test-id="upi-form" onSubmit={handleSubmit}>
                        <h3>UPI Payment</h3>
                        <input style={inputStyle} name="vpa" data-test-id="vpa-input" placeholder="user@bank" required />
                        <button style={{ ...buttonStyle, width: '100%', backgroundColor: '#007bff', color: '#fff', border: 'none' }} data-test-id="pay-button" type="submit">
                            Pay ₹{orderAmount}
                        </button>
                    </form>
                )}

                {method === 'card' && (
                    <form data-test-id="card-form" onSubmit={handleSubmit}>
                        <h3>Card Details</h3>
                        <input style={inputStyle} name="cardNumber" data-test-id="card-number-input" placeholder="Card Number" required />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input style={inputStyle} name="expiry" data-test-id="expiry-input" placeholder="MM/YY" required />
                            <input style={inputStyle} name="cvv" data-test-id="cvv-input" placeholder="CVV" required />
                        </div>
                        <input style={inputStyle} name="name" data-test-id="cardholder-name-input" placeholder="Cardholder Name" required />
                        <button style={{ ...buttonStyle, width: '100%', backgroundColor: '#007bff', color: '#fff', border: 'none' }} data-test-id="pay-button" type="submit">
                            Pay ₹{orderAmount}
                        </button>
                    </form>
                )}

                {!method && <p style={{ color: '#999', textAlign: 'center' }}>Please select a payment method</p>}
            </div>
        </div>
    );
};

export default Checkout;