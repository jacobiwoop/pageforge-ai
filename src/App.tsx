/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Generate from './pages/Generate';
import Products from './pages/Products';
import Orders from './pages/Orders';
import { AuthProvider } from './contexts/AuthContext';
import AuthGuard from './components/AuthGuard';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthGuard>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/generate" element={<Generate />} />
              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<Orders />} />
            </Routes>
          </Layout>
        </AuthGuard>
      </Router>
    </AuthProvider>
  );
}
