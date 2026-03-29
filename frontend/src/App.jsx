import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CurrencyProvider } from './context/CurrencyContext'

import HomePage from './pages/HomePage'
import ListingsPage from './pages/ListingsPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import NotFoundPage from './pages/NotFoundPage'

import AdminLoginPage from './admin/AdminLoginPage'
import AdminDashboard from './admin/AdminDashboard'
import AdminProperties from './admin/AdminProperties'
import AdminAddProperty from './admin/AdminAddProperty'
import AdminEditProperty from './admin/AdminEditProperty'
import AdminEnquiries from './admin/AdminEnquiries'
import AdminSettings from './admin/AdminSettings'
import AdminGuard from './admin/AdminGuard'

export default function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/listings/:id" element={<PropertyDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Admin — login is public, everything else is guarded */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard"          element={<AdminGuard><AdminDashboard /></AdminGuard>} />
          <Route path="/admin/properties"          element={<AdminGuard><AdminProperties /></AdminGuard>} />
          <Route path="/admin/properties/new"      element={<AdminGuard><AdminAddProperty /></AdminGuard>} />
          <Route path="/admin/properties/:id/edit" element={<AdminGuard><AdminEditProperty /></AdminGuard>} />
          <Route path="/admin/enquiries"           element={<AdminGuard><AdminEnquiries /></AdminGuard>} />
          <Route path="/admin/settings"            element={<AdminGuard><AdminSettings /></AdminGuard>} />

          {/* Redirect /admin → dashboard */}
          <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      </CurrencyProvider>
    </AuthProvider>
  )
}
