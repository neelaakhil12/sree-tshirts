import React from 'react'
import { Link } from 'react-router-dom'
import { products } from '../../data/products'
import ProductCard from '../shop/ProductCard'

const TrendingProducts = () => {
  // Take top 8 trending products
  const trending = products.slice(0, 8);

  return (
    <section className="py-8 md:py-24 bg-gray-50 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-8" data-aos="fade-up">
           <span className="text-accent font-black tracking-widest text-xs mb-3">CURATED FOR YOU</span>
           <h2 className="text-4xl md:text-5xl font-black text-black tracking-tighter text-center uppercase">
             MOST WANTED <span className="text-accent">TRENDS.</span>
           </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
          {trending.map((product, index) => (
            <div 
              key={product.id} 
              data-aos="fade-up" 
              data-aos-delay={index * 100}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center" data-aos="fade-up">
           <Link 
             to="/products"
             className="border-2 border-black text-black px-8 py-3 sm:px-12 sm:py-4 rounded-none font-black text-xs sm:text-base tracking-widest flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
           >
             VIEW ALL PRODUCT
           </Link>
        </div>
      </div>
    </section>
  )
}

export default TrendingProducts
