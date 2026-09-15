import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const Layout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Get current page title based on path
  const getPageTitle = (path) => {
    switch (path) {
      case '/':
        return 'System Overview';
      case '/users':
        return 'User Directory';
      case '/metrics':
        return 'System Metrics';
      case '/settings':
        return 'Configuration & Settings';
      default:
        return 'Admin Portal';
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        closeMobileSidebar={() => setIsMobileOpen(false)}
      />

      {/* Main Workspace Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header
          pageTitle={getPageTitle(location.pathname)}
          toggleMobileSidebar={() => setIsMobileOpen((prev) => !prev)}
        />

        <main style={{ flex: 1, padding: '24px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
