import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/animations.css';

import App from './App';
import { AuthProvider } from './context/AuthContext';

// The entry point creates the root React tree and wraps it in the
// authentication provider so every component can access session data.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
