import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // No extension needed if "type": "module" is removed

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);