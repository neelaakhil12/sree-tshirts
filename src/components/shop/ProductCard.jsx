import React from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Star, Heart } from 'lucide-react'

const ProductCard = ({ product }) => {
  const whatsappNumber = '9398292014'

  const handleBuyNow = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const message = `Hello Wear Mingle! I'm interested in: ${product.name}. 
Can you please provide more details about this product?`
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="group relative bg-white border border-transparent hover:border-gray-50 product-card cursor-pointer">
      
      {/* Image Container */}
      <Link to={`/products/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-gray-50 border border-gray-100 italic">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
          onError={(e) => e.target.src = 'https://via.placeholder.com/300x400?text=' + product.name}
        />

        {/* Labels Overlay */}
        <div className="absolute top-4 left-0 space-y-2 flex flex-col items-start pointer-events-none">
           {product.discount && (
              <span className="bg-accent text-white text-[9px] font-black px-3 py-1 uppercase tracking-widest shadow-lg italic">
                {product.discount}
              </span>
           )}
           <span className="bg-black text-white text-[8px] font-black px-3 py-1 uppercase tracking-widest shadow-lg">
              {product.category}
           </span>
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-4 right-4 w-10 h-10 bg-white shadow-xl flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 transform translate-x-16 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
           <Heart size={16} />
        </div>
      </Link>

      {/* Info Container */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
           <div className="flex items-center space-x-1.5 font-black text-gray-800">
              <span className="text-sm">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-[10px] text-gray-300 line-through">₹{product.originalPrice}</span>
              )}
           </div>
           <div className="flex items-center space-x-1 text-yellow-500">
              <Star size={10} fill="currentColor" />
              <span className="text-[10px] font-black">{product.rating}</span>
           </div>
        </div>
        
        <h3 className="text-[11px] font-black text-gray-600 truncate group-hover:text-black uppercase tracking-widest leading-none pb-2">{product.name}</h3>
        
        {/* Buy Now Button */}
        <button 
          onClick={handleBuyNow}
          className="w-full bg-black text-white py-3.5 text-[9px] font-black tracking-[0.2em] flex items-center justify-center space-x-2 hover:bg-accent transition-all active:scale-95 shadow-lg"
        >
          <MessageCircle size={14} className="hidden sm:block" />
          <span className="whitespace-nowrap">QUICK INQUIRY</span>
        </button>
      </div>
    </div>
  )
}

export default ProductCard
