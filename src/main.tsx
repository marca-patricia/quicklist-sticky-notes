
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('main.tsx: Starting React application');

const container = document.getElementById("root");
if (!container) {
  console.error('main.tsx: Root element not found');
  throw new Error('Root element not found');
}

console.log('main.tsx: Root element found, creating React root');

const root = createRoot(container);

console.log('main.tsx: Rendering App component');

root.render(<App />);

console.log('main.tsx: App component rendered successfully');
