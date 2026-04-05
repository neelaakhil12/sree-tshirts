import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react'
import { useCart } from '../../context/CartContext'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { cartItems, setIsCartOpen } = useCart()

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

  const isActive = (path) => location.pathname === path

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/80 backdrop-blur-md py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl sm:text-2xl font-black tracking-tighter text-black">
              WEAR <span className="text-accent">MINGLE</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
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

          {/* Search Bar - Myntra Style */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const term = e.target.search.value;
              window.location.href = `/products?search=${encodeURIComponent(term)}`;
            }}
            className="hidden lg:flex flex-grow max-w-md mx-8 px-4 py-2 bg-gray-100 rounded-lg items-center border border-transparent focus-within:border-gray-300 transition-all"
          >
            <Search className="w-4 h-4 text-gray-500" />
            <input 
              name="search"
              type="text" 
              placeholder="Search for products, brands and more" 
              className="bg-transparent border-none outline-none w-full ml-2 text-sm text-gray-700 font-bold"
            />
          </form>

          {/* Right Icons */}
          <div className="flex items-center space-x-5">
             <button 
               className="flex flex-col items-center group relative cursor-pointer"
               onClick={() => setIsCartOpen(true)}
             >
               <ShoppingBag className="w-5 h-5 group-hover:text-accent transition-colors" />
               <span className="text-[10px] font-bold mt-1 group-hover:text-accent transition-colors">BAG</span>
               {cartItems.length > 0 && (
                 <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                    {cartItems.length}
                 </span>
               )}
             </button>

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
            <div className="flex bg-gray-100 p-3 rounded-lg items-center">
              <Search className="w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none w-full ml-3 text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
