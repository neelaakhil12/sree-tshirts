import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingBag, Heart, Share2, Star, Check, Truck, RotateCcw, ShieldCheck, ChevronRight } from 'lucide-react'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'

const ProductDetailPage = () => {
  const { id } = useParams()
  const { addToCart } = useCart()
  const product = products.find(p => p.id === parseInt(id))
  
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || 'White')
  const [activeImage, setActiveImage] = useState(product?.image)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (product) setActiveImage(product.image)
  }, [product])

  if (!product) {
    return (
      <div className="pt-32 pb-24 text-center">
        <h2 className="text-4xl font-black mb-4">404 - MINGLE NOT FOUND</h2>
        <Link to="/products" className="text-accent underline font-bold">Back to Collections</Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError('PLEASE SELECT A SIZE')
      setTimeout(() => setError(''), 2000)
      return
    }
    addToCart(product, selectedSize, selectedColor)
  }

  const features = [
    { icon: Truck, title: 'Speedy Delivery', desc: 'Get it by Wednesday, Apr 10' },
    { icon: RotateCcw, title: 'Easy Returns', desc: '14-day hassle free return' },
    { icon: ShieldCheck, title: 'Authentic Product', desc: '100% genuine quality' },
  ];

  return (
    <div className="pt-32 pb-16 bg-white">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4 text-xs font-bold text-gray-400 flex items-center space-x-2">
        <Link to="/" className="hover:text-black">HOME</Link>
        <ChevronRight size={12} />
        <Link to="/products" className="hover:text-black">PRODUCTS</Link>
        <ChevronRight size={12} />
        <span className="text-black">{product.name.toUpperCase()}</span>
      </div>

      <div className="container mx-auto px-4 md:px-0">
        <div className="flex flex-col lg:flex-row lg:space-x-16">
          
          {/* Images Section */}
          <div className="w-full lg:w-3/5">
             <div className="flex md:grid md:grid-cols-2 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar pb-4 md:pb-0">
                <div className="min-w-[85vw] sm:min-w-[400px] md:min-w-0 aspect-[3/4] bg-gray-50 overflow-hidden relative group cursor-zoom-in snap-center sm:snap-start">
                   <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                {/* Secondary images (simulated icons for now) */}
                <div className="min-w-[85vw] sm:min-w-[400px] md:min-w-0 aspect-[3/4] bg-gray-100 overflow-hidden relative snap-center sm:snap-start">
                   <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-80" />
                   <div className="absolute inset-0 bg-black/5"></div>
                </div>
                <div className="min-w-[85vw] sm:min-w-[400px] md:min-w-0 aspect-[3/4] bg-gray-100 overflow-hidden relative snap-center sm:snap-start">
                   <img src={product.image} alt={product.name} className="w-full h-full object-cover transform scale-x-[-1] opacity-70" />
                   <div className="absolute inset-0 bg-black/5"></div>
                </div>
                <div className="min-w-[85vw] sm:min-w-[400px] md:min-w-0 aspect-[3/4] bg-gray-100 flex items-center justify-center p-8 text-center border-2 border-dashed border-gray-200 snap-center sm:snap-start">
                   <div>
                     <Star size={32} className="mx-auto mb-2 text-gray-300" />
                     <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase italic">MORE SHOTS COMING SOON</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Details Section */}
          <div className="w-full lg:w-2/5 mt-10 lg:mt-0 space-y-8">
              <div className="space-y-2 border-b border-gray-100 pb-6">
                 <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-gray-900 leading-tight">{product.name}</h1>
                 <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Wear Mingle Essentials</p>
                 
                 <div className="flex items-center space-x-3 pt-2">
                    <div className="flex bg-white px-2 sm:px-3 py-1 items-center space-x-1 border border-gray-200 rounded">
                       <span className="text-xs sm:text-sm font-black">{product.rating}</span>
                       <Star size={12} className="text-green-500 fill-green-500 sm:w-3.5 sm:h-3.5" />
                    </div>
                    <span className="text-[10px] sm:text-sm border-l border-gray-200 pl-3 font-bold text-gray-400 uppercase tracking-widest">
                       {product.reviews} reviews
                    </span>
                 </div>
              </div>

              <div className="space-y-1">
                 <div className="flex items-center space-x-2 sm:space-x-3 flex-wrap">
                    <span className="text-2xl sm:text-3xl font-black tracking-tight text-black">₹{product.price}</span>
                    <span className="text-lg sm:text-xl text-gray-400 line-through">MRP ₹{product.originalPrice}</span>
                    <span className="text-lg sm:text-xl text-orange-500 font-black">({product.discount})</span>
                 </div>
                 <p className="text-green-600 text-[10px] font-black tracking-widest uppercase">INCLUSIVE OF ALL TAXES</p>
              </div>

             {/* Size Selection */}
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <h4 className="text-sm font-black tracking-widest">SELECT SIZE</h4>
                   <button className="text-accent text-xs font-black underline">SIZE CHART</button>
                </div>
                {error && <p className="text-xs font-black text-red-500 animate-pulse">{error}</p>}
                <div className="flex flex-wrap gap-3">
                   {product.sizes.map(size => (
                     <button 
                       key={size}
                       onClick={() => setSelectedSize(size)}
                       className={`w-14 h-14 flex items-center justify-center border-2 text-sm font-black transition-all rounded-full ${
                         selectedSize === size ? 'border-accent text-accent' : 'border-gray-200 hover:border-black text-black'
                       }`}
                     >
                       {size}
                     </button>
                   ))}
                </div>
             </div>

             {/* Buttons */}
             <div className="flex space-x-4">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-accent text-white h-16 rounded-none font-black tracking-widest flex items-center justify-center space-x-3 hover:bg-opacity-90 transition-all shadow-xl shadow-accent/20"
                >
                   <ShoppingBag size={20} />
                   <span>ADD TO BAG</span>
                </button>
                <button 
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-16 h-16 border-2 flex items-center justify-center transition-all ${
                    isWishlisted ? 'border-accent text-accent bg-accent/5' : 'border-gray-200 hover:border-black'
                  }`}
                >
                   <Heart size={24} className={isWishlisted ? 'fill-accent' : ''} />
                </button>
             </div>

             {/* Delivery Features */}
             <div className="bg-gray-50 p-6 space-y-6">
                {features.map((f, i) => (
                  <div key={i} className="flex items-start space-x-4">
                     <f.icon className="text-black flex-shrink-0" size={20} />
                     <div>
                        <h5 className="text-xs font-black uppercase tracking-widest">{f.title}</h5>
                        <p className="text-[10px] font-bold text-gray-500 mt-0.5">{f.desc}</p>
                     </div>
                  </div>
                ))}
             </div>

             {/* Product Description */}
             <div className="space-y-4 border-t border-gray-100 pt-8">
                <h4 className="text-sm font-black tracking-widest uppercase">PRODUCT DETAILS</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                   {product.description}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                   <li className="flex items-center space-x-2">
                      <Check size={14} className="text-green-500" />
                      <span>100% Cotton, bio-washed fabric</span>
                   </li>
                   <li className="flex items-center space-x-2">
                      <Check size={14} className="text-green-500" />
                      <span>Comfortable regular fit</span>
                   </li>
                   <li className="flex items-center space-x-2">
                      <Check size={14} className="text-green-500" />
                      <span>Classic round neck design</span>
                   </li>
                </ul>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
