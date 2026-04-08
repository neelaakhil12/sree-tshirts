import React from 'react'
import Hero from '../components/home/Hero'
import CategorySection from '../components/home/CategorySection'
import TrendingProducts from '../components/home/TrendingProducts'
import { Link } from 'react-router-dom'
import { CheckCircle2, Truck, ShieldCheck, RefreshCw } from 'lucide-react'

const HomePage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <Hero />
      
      {/* Categories */}
      <CategorySection />

      {/* Trending Products */}
      <TrendingProducts />

      {/* Promotion/Offer Section */}
      <section className="py-14 md:py-24 bg-black text-white relative overflow-hidden" data-aos="zoom-in">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
           <div className="absolute w-96 h-96 bg-accent rounded-full -top-10 -left-10 blur-3xl animate-pulse"></div>
           <div className="absolute w-96 h-96 bg-blue-600 rounded-full -bottom-10 -right-10 blur-3xl animate-pulse"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
           <span className="text-accent font-black tracking-widest text-[10px] sm:text-xs mb-4 block">READY TO MINGLE?</span>
           <h2 className="text-3xl sm:text-6xl md:text-8xl font-black mb-8 leading-tight sm:leading-none tracking-tighter uppercase break-words">
             DISCOVER <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">PREMIUM ESSENTIALS.</span>
           </h2>
           <p className="text-gray-400 text-xs sm:text-lg md:text-xl max-w-2xl mx-auto mb-12">
             Experience the perfect blend of style and comfort. Refresh your wardrobe with our latest curated collections designed for the modern lifestyle.
           </p>
           <Link 
             to="/products"
             className="inline-block bg-white text-black px-8 sm:px-14 py-4 sm:py-6 rounded-none font-black text-xs sm:text-sm tracking-widest uppercase hover:bg-accent hover:text-white transition-all transform hover:scale-105"
           >
             Hurry, Shop Now
           </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
