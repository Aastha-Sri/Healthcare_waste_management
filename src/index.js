import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/styles.css'; // Make sure this path is correct and the file exists
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();


