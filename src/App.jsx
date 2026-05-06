import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import WhatsAppButton from './components/ui/WhatsAppButton'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/admin/LoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProductManager from './pages/admin/ProductManager'
import InvoiceGenerator from './pages/admin/InvoiceGenerator'
import CategoryManager from './pages/admin/CategoryManager'
import ProtectedRoute from './components/admin/ProtectedRoute'
import { DataProvider } from './context/DataContext'

function App() {
  const location = useLocation()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <DataProvider>
      <div className="flex flex-col min-h-screen">
        {!isAdminPage && <Navbar />}
        
        <main className={`${!isAdminPage ? 'flex-grow' : ''}`}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/login" element={<LoginPage />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/products" 
              element={
                <ProtectedRoute>
                  <ProductManager />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/products/new" 
              element={
                <ProtectedRoute>
                  <ProductManager />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/categories" 
              element={
                <ProtectedRoute>
                  <CategoryManager />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/invoices" 
              element={
                <ProtectedRoute>
                  <InvoiceGenerator />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>

        {!isAdminPage && (
          <>
            <Footer />
            <WhatsAppButton />
          </>
        )}
      </div>
    </DataProvider>
  )
}

export default App
