import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Checkout from './pages/Checkout';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* This route allows the component to capture the order_id 
            from the URL: http://localhost:3001/checkout?order_id=... 
          */}
          <Route path="/checkout" element={<Checkout />} />
          
          {/* Optional: Redirect root to checkout */}
          <Route path="/" element={<Checkout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;