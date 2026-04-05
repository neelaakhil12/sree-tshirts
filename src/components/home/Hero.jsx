import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-white overflow-hidden pt-28 pb-12 md:pt-28 md:pb-20">
      {/* Background Decorative Elements */}
      <div className="absolute top-20 right-0 w-1/3 h-full bg-gray-50 -z-10 transform skew-x-12 translate-x-20"></div>
      
      <div className="container mx-auto px-4 md:px-0 flex flex-col md:flex-row items-center">
        
        {/* Text Content */}
        <div className="w-full md:w-1/2 z-10" data-aos="fade-right">
          <span className="text-accent font-black tracking-widest text-[10px] sm:text-sm mb-4 block underline decoration-accent/20">NEW COLLECTION 2026</span>
          <h1 className="text-3xl sm:text-6xl md:text-8xl font-black text-black leading-tight tracking-tighter mb-6 uppercase">
            MINGLE <br /> 
            WITH <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-400">STYLE.</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-lg md:text-xl max-w-lg mb-10 leading-relaxed">
            Discover the ultimate comfort in our premium cotton T-shirts. Styled for everyone, designed for you.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
             <Link 
               to="/products"
               className="bg-black text-white px-10 py-5 rounded-none font-black tracking-widest flex items-center justify-center group hover:bg-accent transition-all duration-300"
             >
               SHOP NOW 
               <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={20} />
             </Link>
             <Link 
               to="/about"
               className="border-2 border-black text-black px-10 py-5 rounded-none font-black tracking-widest flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
             >
               OUR STORY
             </Link>
          </div>
          
          <div className="mt-12 flex items-center space-x-8">
             <div className="flex flex-col py-2">
               <span className="text-3xl font-black text-black">42+</span>
               <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Designs</span>
             </div>
             <div className="w-px h-10 bg-gray-200"></div>
             <div className="flex flex-col py-2">
               <span className="text-3xl font-black text-black">Premium</span>
               <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Fabric</span>
             </div>
             <div className="w-px h-10 bg-gray-200"></div>
             <div className="flex flex-col py-2">
               <span className="text-3xl font-black text-black">Free</span>
               <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Delivery</span>
             </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="w-full md:w-1/2 mt-12 md:mt-0 relative" data-aos="zoom-in" data-aos-delay="200">
          <div className="relative z-10 w-full max-w-lg mx-auto">
             <img 
               src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1000" 
               alt="Hero T-Shirt"
               className="w-full h-auto shadow-2xl grayscale hover:grayscale-0 transition-all duration-700" 
             />
             {/* Float badge */}
             <div className="absolute -bottom-6 -left-6 bg-accent text-white p-6 shadow-xl animate-bounce">
                <span className="block text-2xl font-black">GET 50% OFF</span>
                <span className="text-xs font-bold uppercase tracking-widest">On First Order</span>
             </div>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-gray-100 rounded-full -z-10 animate-spin-slow"></div>
        </div>

      </div>
    </section>
  )
}

export default Hero
