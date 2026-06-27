import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navigation from './components/Navigation';
import Chat from './pages/Chat';
import Documents from './pages/Documents';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-bg">
        <Navigation />
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/documents" element={<Documents />} />
        </Routes>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#111118',
              color: '#e4e4e7',
              border: '1px solid #1e1e26',
            },
            success: {
              iconTheme: {
                primary: '#00d97e',
                secondary: '#111118',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#111118',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
