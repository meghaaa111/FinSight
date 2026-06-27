import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useHealth from '../hooks/useHealth';

const Navigation = () => {
  const location = useLocation();
  const { isHealthy, loading } = useHealth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-dark-card border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent-primary">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                <circle cx="16" cy="16" r="4" strokeWidth={2} />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 18l-1.5-1.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">FinSight</h1>
              <p className="text-xs text-gray-400">Financial Intelligence</p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/')
                  ? 'bg-accent-primary text-white'
                  : 'text-gray-300 hover:bg-dark-border hover:text-white'
              }`}
            >
              Chat
            </Link>
            <Link
              to="/documents"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/documents')
                  ? 'bg-accent-primary text-white'
                  : 'text-gray-300 hover:bg-dark-border hover:text-white'
              }`}
            >
              Documents
            </Link>
          </div>

          {/* API Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              loading ? 'bg-gray-500 animate-pulse' : isHealthy ? 'bg-success' : 'bg-red-500'
            }`} />
            <span className="text-sm text-gray-400">
              {loading ? 'Checking...' : isHealthy ? 'API Connected' : 'API Disconnected'}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
