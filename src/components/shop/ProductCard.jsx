import React from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Star, Heart } from 'lucide-react'

const ProductCard = ({ product }) => {
  const whatsappNumber = '9398292014'

  const handleBuyNow = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const productUrl = `${window.location.origin}/products/${product.id}`
    const message = `Hello Wear Mingle! how can i get this product?
    
Product: ${product.name}
Link: ${productUrl}`
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
        </div>
        
        {/* Buy Now Button */}
        <button 
          onClick={handleBuyNow}
          className="w-[calc(100%+2.5rem)] -mx-5 mt-4 bg-black text-white py-2.5 text-[8px] font-black tracking-[0.2em] flex items-center justify-center space-x-2 hover:bg-accent transition-all active:scale-95 shadow-xl border-t border-gray-100"
        >
          <MessageCircle size={12} />
          <span className="whitespace-nowrap uppercase">BUY NOW</span>
        </button>
      </div>
    </div>
  )
}

export default ProductCard
