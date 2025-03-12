import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ToastProvider } from './components/ui/toast.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
          <App />
    </ToastProvider>

  </StrictMode>
);
