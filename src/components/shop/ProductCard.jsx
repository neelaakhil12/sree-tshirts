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
    <div className="group relative bg-white border border-gray-100 hover:shadow-2xl hover:border-accent transition-all duration-300 product-card cursor-pointer flex flex-col h-full">
      
      {/* Image Container */}
      <Link to={`/products/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-gray-50 italic">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-1000 group-hover:scale-110"
          onError={(e) => e.target.src = 'https://via.placeholder.com/300x400?text=' + product.name}
        />

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-4 left-0 bg-accent text-white px-4 py-1.5 text-[10px] font-black tracking-widest uppercase shadow-lg">
             {product.discount}
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-4 right-0 bg-black text-white px-3 py-1 text-[8px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
           {product.category}
        </div>

        {/* Wishlist Button */}
        <div className="absolute bottom-4 right-4 w-10 h-10 bg-white shadow-xl flex items-center justify-center rounded-none text-gray-400 hover:text-red-500 transform translate-y-16 group-hover:translate-y-0 transition-all duration-500">
           <Heart size={16} />
        </div>
      </Link>

      {/* Info Container */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div className="space-y-2">
           <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-accent uppercase tracking-widest">{product.category}</span>
              <div className="flex items-center space-x-1 text-yellow-500">
                 <Star size={10} fill="currentColor" />
                 <span className="text-[10px] font-black">{product.rating}</span>
              </div>
           </div>
           
           <h3 className="text-xs font-black text-black uppercase leading-tight group-hover:text-accent transition-colors line-clamp-2">
              {product.name}
           </h3>

           <div className="flex items-center space-x-2 pt-2">
              <span className="text-sm font-black text-black">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-[10px] text-gray-300 line-through">₹{product.originalPrice}</span>
              )}
           </div>
        </div>
        
        {/* Buy Now Button */}
        <button 
          onClick={handleBuyNow}
          className="w-full mt-6 bg-black text-white py-4 text-[9px] font-black tracking-[0.2em] flex items-center justify-center space-x-2 hover:bg-accent transition-all active:scale-95 shadow-xl"
        >
          <MessageCircle size={14} />
          <span className="whitespace-nowrap">QUICK INQUIRY</span>
        </button>
      </div>
    </div>
  )
}

export default ProductCard
