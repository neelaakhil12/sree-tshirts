import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Menu, X, User } from 'lucide-react'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  const isActive = (path) => {
    const currentPath = location.pathname.replace(/\/$/, '') || '/';
    const targetPath = path.replace(/\/$/, '') || '/';
    return currentPath === targetPath;
  }

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-1' : 'bg-white/80 backdrop-blur-md py-2'
      }`}
    >
      <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/images/logo.png" alt="Wear Mingle Logo" className="h-20 w-20 sm:h-28 sm:w-28 object-contain" />
          </Link>

          {/* Right Side Items */}
          <div className="flex items-center justify-end space-x-4 lg:space-x-8">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={`text-sm font-bold tracking-wide transition-colors hover:text-accent ${
                    isActive(link.path) ? 'text-accent border-b-2 border-accent' : 'text-black'
                  }`}
                >
                  {link.name.toUpperCase()}
                </Link>
              ))}
            </div>

            {/* Search Bar */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const term = e.target.search.value;
                if (term.trim()) {
                  window.location.href = `/products?search=${encodeURIComponent(term)}`;
                }
              }}
              className="hidden lg:flex w-64 xl:w-80 px-4 py-2 bg-gray-100 rounded-lg items-center border border-transparent focus-within:border-gray-300 transition-all"
            >
              <button type="submit" className="hover:scale-110 transition-transform">
                <Search className="w-4 h-4 text-gray-500" />
              </button>
              <input 
                name="search"
                type="text" 
                placeholder="Search products..." 
                className="bg-transparent border-none outline-none w-full ml-2 text-sm text-gray-700 font-bold"
              />
            </form>

            {/* Mobile Menu Icon */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl animate-fade-down border-t">
          <div className="flex flex-col p-4 space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-lg font-bold tracking-wide py-2 ${
                  isActive(link.path) ? 'text-accent' : 'text-black'
                }`}
              >
                {link.name.toUpperCase()}
              </Link>
            ))}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const term = e.target.mobileSearch.value;
                if (term.trim()) {
                  setIsMobileMenuOpen(false);
                  window.location.href = `/products?search=${encodeURIComponent(term)}`;
                }
              }}
              className="flex bg-gray-100 p-3 rounded-lg items-center"
            >
              <button type="submit">
                <Search className="w-4 h-4 text-gray-500" />
              </button>
              <input 
                name="mobileSearch"
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none w-full ml-3 text-sm font-bold"
              />
            </form>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
