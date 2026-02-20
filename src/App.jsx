import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PartsManagement from './pages/PartsManagement';
import ServiceManagement from './pages/ServiceManagement';
import Orders from './pages/Orders';
import MechanicManagement from './pages/MechanicManagement';
import DealerManagement from './pages/DealerManagement';
import Offers from './pages/Offers';
import Reports from './pages/Reports';
import AddBrand from './pages/AddBrand';
import AddModel from './pages/AddModel';
import AddCategories from './pages/AddCategories';
import AddParts from './pages/AddParts';
import AddOil from './pages/AddOil';
import AddOilVariant from './pages/AddVarient';
import AddHardwareProduct from './pages/AddHardwareProduct';
import AddServiceRequest from './pages/AddServiceRequest';
import AddMechanic from './pages/AddMechanic';
import CustomerDashboard from './pages/CustomerServiceDashboard';
import CustomerManagementApp from './pages/CustomerManagement';

// Placeholder components for other pages
const Placeholder = ({ title }) => (
  <Layout title={title}>
    <div className="card">
      <h2>{title} Page</h2>
      <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
        This module is currently being implemented. Check back soon for full functionality!
      </p>
    </div>
  </Layout>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route - Login */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes - All Admin Pages */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout title="Dashboard">
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/parts" element={
            <ProtectedRoute>
              <Layout title="Parts Manage">
                <PartsManagement />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/add-brand" element={
            <ProtectedRoute>
              <Layout>
                <AddBrand />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/add-model" element={
            <ProtectedRoute>
              <Layout>
                <AddModel />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/add-categories" element={
            <ProtectedRoute>
              <Layout>
                <AddCategories />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/add-parts" element={
            <ProtectedRoute>
              <Layout>
                <AddParts />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/add-oil" element={
            <ProtectedRoute>
              <Layout>
                <AddOil />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/add-oil-variant" element={
            <ProtectedRoute>
              <Layout>
                <AddOilVariant />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/add-hardware" element={
            <ProtectedRoute>
              <Layout>
                <AddHardwareProduct />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/services" element={
            <ProtectedRoute>
              <Layout title="Service Requests">
                <ServiceManagement />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/add-service-request" element={
            <ProtectedRoute>
              <Layout>
                <AddServiceRequest />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/customer-dashboard" element={
            <ProtectedRoute>
              <Layout>
                <CustomerDashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/mechanics" element={
            <ProtectedRoute>
              <Layout title="Mechanics Manage">
                <MechanicManagement />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/add-mechanic" element={
            <ProtectedRoute>
              <Layout>
                <AddMechanic />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/orders" element={
            <ProtectedRoute>
              <Layout title="Billing">
                <Orders />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/dealer" element={
            <ProtectedRoute>
              <Layout title="Dealer Manage">
                <DealerManagement />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/customers" element={
            <ProtectedRoute>
              <Layout title="Customer Manage">
                <CustomerManagementApp />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/offers" element={
            <ProtectedRoute>
              <Layout title="Offers & Promos">
                <Offers />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/reports" element={
            <ProtectedRoute>
              <Layout title="Reports & Analytics">
                <Reports />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute>
              <Placeholder title="Settings" />
            </ProtectedRoute>
          } />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

