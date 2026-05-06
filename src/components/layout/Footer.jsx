import React from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Twitter, Facebook, MapPin, Phone, Mail } from 'lucide-react'
import { useData } from '../../context/DataContext'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { categories } = useData()

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ]

  // Take first 6 categories for footer
  const footerCategories = categories.slice(0, 6).map(cat => ({
    name: cat.name,
    path: cat.path
  }))

  return (
    <footer className="bg-gray-100 pt-16 pb-8 px-4 md:px-0">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand & Socials */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center">
              <img src="/images/logo.png" alt="Wear Mingle Logo" className="h-28 w-28 object-contain" />
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your one-stop destination for premium quality T-shirts. We mingle comfort with style to bring you the best fashion experience.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/wearmingle2" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white shadow-sm flex items-center justify-center rounded-full hover:bg-accent hover:text-white transition-all">
                <Instagram size={18} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61589351600402" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white shadow-sm flex items-center justify-center rounded-full hover:bg-accent hover:text-white transition-all">
                <Facebook size={18} />
              </a>
              <a href="https://x.com/Wearmingle96203" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white shadow-sm flex items-center justify-center rounded-full hover:bg-accent hover:text-white transition-all">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-sm font-black tracking-widest text-black underline decoration-accent decoration-2 underline-offset-4">ONLINE SHOPPING</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-600 text-sm hover:text-accent transition-colors font-bold uppercase tracking-tight">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
             <h4 className="text-sm font-black tracking-widest text-black underline decoration-accent decoration-2 underline-offset-4">CATEGORIES</h4>
             <ul className="space-y-3">
               {footerCategories.map((cat) => (
                 <li key={cat.name}>
                   <Link to={cat.path} className="text-gray-600 text-sm hover:text-accent transition-colors font-bold uppercase tracking-tight">
                     {cat.name}
                   </Link>
                 </li>
               ))}
             </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-6">
             <h4 className="text-sm font-black tracking-widest text-black underline decoration-accent decoration-2 underline-offset-4">CONTACT US</h4>
             <ul className="space-y-4">
               <li className="flex items-start space-x-3 text-gray-600 text-sm font-bold">
                 <MapPin size={18} className="text-accent flex-shrink-0 mt-0.5" />
                 <span className="break-words">29/207-F1-8-4, SBI Colony, Revenue Ward -29, Nandyal – 518501</span>
               </li>
               <li className="flex items-center space-x-3 text-gray-600 text-sm font-bold cursor-pointer hover:text-accent transition-colors">
                 <Phone size={18} className="text-accent flex-shrink-0" />
                 <span>+91 9398292014</span>
               </li>
               <li className="flex items-center space-x-3 text-gray-600 text-sm font-bold cursor-pointer hover:text-accent transition-colors overflow-hidden">
                 <Mail size={18} className="text-accent flex-shrink-0" />
                 <span className="truncate">support@wearmingle.in</span>
               </li>
             </ul>
          </div>

        </div>

        <div className="mt-10 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
            © {currentYear} Wear Mingle. All rights reserved. <br className="sm:hidden" />
            Developed by <a href="https://codtechitsolutions.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Codtech IT Solutions</a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
