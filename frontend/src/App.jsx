import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LandingPage from './pages/Landing/LandingPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ProductsPage from './pages/Products/ProductsPage';
import CustomersPage from './pages/Customers/CustomersPage';
import OrdersPage from './pages/Orders/OrdersPage';

function App() {
  const [currentPage, setCurrentPage] = useState('landing'); // landing, dashboard, products, customers, orders
  const [userRole, setUserRole] = useState('Business Owner'); // Business Owner, Inventory Manager, Sales Executive

  // Automatically enforce page restrictions when the simulated user role shifts
  useEffect(() => {
    if (currentPage === 'landing') return;

    const permissions = {
      'Business Owner': ['dashboard', 'products', 'customers', 'orders'],
      'Inventory Manager': ['dashboard', 'products'],
      'Sales Executive': ['dashboard', 'products', 'customers', 'orders']
    };

    const allowedPages = permissions[userRole] || ['dashboard'];
    if (!allowedPages.includes(currentPage)) {
      console.warn(`Rerouting: Role '${userRole}' lacks access to '${currentPage}'. Defaulting to Dashboard.`);
      setCurrentPage('dashboard');
    }
  }, [userRole, currentPage]);

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard': return 'Command Center Dashboard';
      case 'products': return 'Products & Inventory Catalog';
      case 'customers': return 'B2B Client Directory';
      case 'orders': return 'Order Fulfillment Ledger';
      default: return 'InventoryFlow';
    }
  };

  const renderActivePage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage userRole={userRole} setCurrentPage={setCurrentPage} />;
      case 'products':
        return <ProductsPage userRole={userRole} />;
      case 'customers':
        return <CustomersPage userRole={userRole} />;
      case 'orders':
        return <OrdersPage userRole={userRole} />;
      default:
        return <DashboardPage userRole={userRole} setCurrentPage={setCurrentPage} />;
    }
  };

  // If on the Landing Page, render full screen landing without layout wrappers
  if (currentPage === 'landing') {
    return <LandingPage onNavigate={setCurrentPage} />;
  }

  return (
    <div className="app-container">
      
      {/* Decoupled Left Sidebar Navigation */}
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        userRole={userRole} 
      />

      {/* Main Workspace Frame */}
      <main className="main-content">
        
        {/* Unified Top Header Bar */}
        <Header 
          title={getPageTitle()} 
          userRole={userRole} 
          setUserRole={setUserRole} 
        />

        {/* Content canvas wrapper */}
        <div className="page-content">
          {renderActivePage()}
        </div>

      </main>

    </div>
  );
}

export default App;
