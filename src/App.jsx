import React from 'react';
import { InventoryProvider } from './contexts/InventoryContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  return (
    <InventoryProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <Dashboard />
        </main>
      </div>
    </InventoryProvider>
  );
}

export default App;
