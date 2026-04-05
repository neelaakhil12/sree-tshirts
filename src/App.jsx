import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import WhatsAppButton from './components/ui/WhatsAppButton'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminLogin from './pages/admin/AdminLogin'
import Cart from './components/shop/Cart'
import { CartProvider } from './context/CartContext'

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const location = useLocation()
  const isAdminPath = location.pathname.startsWith('/admin')

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        {!isAdminPath && <Navbar />}
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin setIsAdminLoggedIn={setIsAdminLoggedIn} />} />
            <Route path="/admin" element={<AdminLayout isLoggedIn={isAdminLoggedIn} />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
            </Route>
          </Routes>
        </main>

        {!isAdminPath && <Footer />}
        {!isAdminPath && <WhatsAppButton />}
        
        {/* Shopping Cart Drawer */}
        <Cart />
      </div>
    </CartProvider>
  )
}

export default App
