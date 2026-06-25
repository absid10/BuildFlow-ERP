import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './store/AuthContext';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProjectsPage from './pages/projects/ProjectsPage';
import EmployeeListPage from './pages/office/EmployeeListPage';
import SalaryPage from './pages/office/SalaryPage';
import OfficeExpensePage from './pages/office/OfficeExpensePage';
import InvestmentListPage from './pages/investments/InvestmentListPage';
import SaleListPage from './pages/sales/SaleListPage';
import TuesdayPaymentPage from './pages/tuesday-payments/TuesdayPaymentPage';
import LoanListPage from './pages/loans/LoanListPage';
import ReportsPage from './pages/reports/ReportsPage';

// Route Guard Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="login-logo pulse" style={{ width: 48, height: 48, background: '#3B82F6', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>B</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route index element={<DashboardPage />} />
        
        {/* Projects */}
        <Route path="projects" element={<ProjectsPage />} />
        
        {/* Office Management */}
        <Route path="office/employees" element={<EmployeeListPage />} />
        <Route path="office/salaries" element={<SalaryPage />} />
        <Route path="office/expenses" element={<OfficeExpensePage />} />
        
        {/* Investments */}
        <Route path="investments" element={<InvestmentListPage />} />
        
        {/* Property Sales */}
        <Route path="sales" element={<SaleListPage />} />
        <Route path="sales/properties" element={<div style={{ padding: 24 }}><h2>Properties — Coming Soon</h2></div>} />
        <Route path="sales/customers" element={<div style={{ padding: 24 }}><h2>Customers — Coming Soon</h2></div>} />
        
        {/* Tuesday Payments */}
        <Route path="tuesday-payments" element={<TuesdayPaymentPage />} />
        
        {/* Loans */}
        <Route path="loans" element={<LoanListPage />} />
        
        {/* Reports */}
        <Route path="reports" element={<ReportsPage />} />
        
        {/* Documents & Users — Coming Soon */}
        <Route path="documents" element={<div style={{ padding: 24 }}><h2>Documents — Coming Soon</h2></div>} />
        <Route path="users" element={<div style={{ padding: 24 }}><h2>User Management — Coming Soon</h2></div>} />
        <Route path="contractors" element={<div style={{ padding: 24 }}><h2>Contractors — Coming Soon</h2></div>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
