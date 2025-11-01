import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AppProvider } from './contexts/AppContext';
import './index.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <AppProvider>
        <App />
      </AppProvider>
    </React.StrictMode>
  );
}
