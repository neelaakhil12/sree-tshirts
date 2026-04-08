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
    <div className="group relative bg-white border border-transparent hover:border-gray-100 product-card cursor-pointer">
      
      {/* Image Container */}
      <Link to={`/products/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-gray-50">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/90 backdrop-blur-sm shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.1)] flex items-center justify-between">
           <button 
             onClick={handleBuyNow}
             className="bg-accent text-white px-4 py-2 text-xs font-black tracking-widest flex items-center space-x-2 w-full justify-center group-hover:opacity-100 transition-opacity hover:bg-black"
           >
              <MessageCircle size={14} />
              <span>BUY NOW</span>
           </button>
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-4 right-4 w-10 h-10 bg-white shadow-premium flex items-center justify-center rounded-full text-gray-400 hover:text-accent transform -translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
           <Heart size={18} />
        </button>

        {/* Discount Badge Removed */}
      </Link>

      {/* Info Container */}
      <div className="p-4 space-y-1">
        <div className="flex items-center space-x-1 mb-2">
           <div className="flex bg-gray-100 px-1 py-0.5 items-center space-x-1 rounded">
              <span className="text-[10px] font-black">{product.rating}</span>
              <Star size={10} className="text-yellow-500 fill-yellow-500" />
           </div>
           <span className="text-[10px] font-bold text-gray-400">| {product.reviews}</span>
        </div>
        
        <h3 className="text-sm font-bold text-gray-700 truncate group-hover:text-black">{product.name}</h3>
        
        <div className="flex items-center space-x-2 pt-1">
           <span className="text-sm font-black text-black">Rs. {product.price}</span>
           <span className="text-xs text-gray-400 line-through">Rs. {product.originalPrice}</span>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
