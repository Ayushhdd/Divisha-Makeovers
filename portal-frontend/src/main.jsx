import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './store/store';
import './index.css';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

// Remove the previous offline cache once so older portal builds cannot request
// JavaScript files that were removed by a newer deployment.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      registrations
        .filter((registration) => new URL(registration.scope).pathname.startsWith('/portal/'))
        .map((registration) => registration.unregister())
    );

    if ('caches' in window) {
      const cacheKeys = await caches.keys();
      await Promise.all(
        cacheKeys
          .filter((key) => /workbox|vite-plugin-pwa|google-fonts-cache/i.test(key))
          .map((key) => caches.delete(key))
      );
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
