import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ]

  const categories = [
    { name: 'Men T-Shirts', path: '/products?category=Men' },
    { name: 'Women T-Shirts', path: '/products?category=Women' },
    { name: 'Kids T-Shirts', path: '/products?category=Kids' },
    { name: 'New Arrivals', path: '/products?filter=new' },
  ]

  return (
    <footer className="bg-gray-100 pt-16 pb-8 px-4 md:px-0">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand & Socials */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-black tracking-tighter text-black">
                WEAR <span className="text-accent">MINGLE</span>
              </span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your one-stop destination for premium quality T-shirts. We mingle comfort with style to bring you the best fashion experience.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white shadow-sm flex items-center justify-center rounded-full hover:bg-accent hover:text-white transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white shadow-sm flex items-center justify-center rounded-full hover:bg-accent hover:text-white transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white shadow-sm flex items-center justify-center rounded-full hover:bg-accent hover:text-white transition-all">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-sm font-black tracking-widest text-black">ONLINE SHOPPING</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-600 text-sm hover:text-accent transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
             <h4 className="text-sm font-black tracking-widest text-black">CATEGORIES</h4>
             <ul className="space-y-3">
               {categories.map((cat) => (
                 <li key={cat.name}>
                   <Link to={cat.path} className="text-gray-600 text-sm hover:text-accent transition-colors">
                     {cat.name}
                   </Link>
                 </li>
               ))}
             </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-6">
             <h4 className="text-sm font-black tracking-widest text-black">CONTACT US</h4>
             <ul className="space-y-4">
               <li className="flex items-start space-x-3 text-gray-600 text-sm">
                 <MapPin size={18} className="text-accent flex-shrink-0 mt-0.5" />
                 <span className="break-words">29/207-F1-8-4, SBI Colony, Revenue Ward -29, Nandyal – 518501</span>
               </li>
               <li className="flex items-center space-x-3 text-gray-600 text-sm cursor-pointer hover:text-accent transition-colors">
                 <Phone size={18} className="text-accent flex-shrink-0" />
                 <span>+91 9398292014</span>
               </li>
               <li className="flex items-center space-x-3 text-gray-600 text-sm cursor-pointer hover:text-accent transition-colors overflow-hidden">
                 <Mail size={18} className="text-accent flex-shrink-0" />
                 <span className="truncate">sreesaiapparels7@gmail.com</span>
               </li>
             </ul>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-xs">
            © {currentYear} Wear Mingle (Sree Sai Apparels). All rights reserved. Designed by Srikanth.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
