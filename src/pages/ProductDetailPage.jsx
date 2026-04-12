import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MessageCircle, Heart, Share2, Star, Check, ShieldCheck, ChevronRight } from 'lucide-react'
import { useData } from '../context/DataContext'

const measurementChartData = [
  { id: 1, name: 'Chest', s: 19, m: 20, l: 21, xl: 22, xxl: 23 },
  { id: 2, name: 'Length', s: 26, m: 27, l: 28, xl: 29, xxl: 30 },
  { id: 3, name: 'Shoulder', s: 17.5, m: 18.5, l: 19.5, xl: 20.5, xxl: 21.5 }
]

const getProductFeatures = (product) => {
   const isPolo = product.name?.toLowerCase().includes('polo')
   const isHoodie = product.name?.toLowerCase().includes('hoodie') || product.name?.toLowerCase().includes('zipper') || product.name?.toLowerCase().includes('sweatshirt')
   
   let material = "100% Polyester"
   if (product.category?.toLowerCase().includes('cotton') || product.name?.toLowerCase().includes('cotton')) material = "100% Premium Cotton"
   if (product.name?.toLowerCase().includes('polycotton')) material = "PolyCotton Blend"
   if (isHoodie) material = "Premium Fleece / Cotton Blend"

   return [
     { label: 'Material', value: material },
     { label: 'Neck Type', value: isHoodie ? 'Hooded / Round' : (isPolo ? 'Polo Collar' : 'Round Neck') },
     { label: 'Fit', value: 'Regular Fit' },
     { label: 'Sleeve Type', value: isHoodie ? 'Full Sleeves' : 'Half Sleeves' },
     { label: 'Usage', value: 'Ideal for Promotions, Events, Branding, and Gifting' },
     { label: 'Customization', value: 'Available for Logo Printing' },
     { label: 'Fabric Properties', value: 'Lightweight, Breathable, and Quick-Dry' },
     { label: 'Durability', value: 'Wrinkle-Resistant & Fade-Resistant' },
     { label: 'Available Sizes', value: product.sizes?.join(', ') || 'S, M, L, XL, XXL' },
     { label: 'Color Options', value: 'Multiple Colors Available' },
   ]
}

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, isLoaded } = useData()
  const product = products.find(p => p.id === parseInt(id))
  
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [activeImage, setActiveImage] = useState('')
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (product) {
      const defaultColor = product.colors?.[0] || 'White'
      setSelectedColor(defaultColor)
      setActiveImage(product.colorImages?.[defaultColor] || product.image)
    }
  }, [product])

  const handleColorSelect = (color) => {
    setSelectedColor(color)
    if (product?.colorImages?.[color]) {
      setActiveImage(product.colorImages[color])
    }
  }

  if (!isLoaded) return (
     <div className="pt-40 pb-40 text-center animate-pulse">
        <h2 className="text-2xl font-black text-gray-200">LOADING MINGLE...</h2>
     </div>
  )

  if (!product) {
    return (
      <div className="pt-32 pb-24 text-center">
        <h2 className="text-4xl font-black mb-4">404 - MINGLE NOT FOUND</h2>
        <Link to="/products" className="text-accent underline font-bold">Back to Collections</Link>
      </div>
    )
  }

  const handleWhatsAppBuy = () => {
    if (!selectedSize) {
      setError('PLEASE SELECT A SIZE')
      setTimeout(() => setError(''), 2000)
      return
    }
    
    const whatsappNumber = '9398292014'
    const message = `Hello Wear Mingle! I'm interested in: ${product.name}. 
Can you please provide more details about this product?

Size: ${selectedSize}
Color: ${selectedColor}`

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="pt-32 pb-16 bg-white">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4 text-[10px] font-black tracking-widest text-gray-400 flex items-center space-x-2">
        <Link to="/" className="hover:text-black">HOME</Link>
        <ChevronRight size={10} />
        <Link to="/products" className="hover:text-black">PRODUCTS</Link>
        <ChevronRight size={10} />
        <span className="text-black">{product.name.toUpperCase()}</span>
      </div>

      <div className="container mx-auto px-4 md:px-0">
        <div className="flex flex-col lg:flex-row lg:space-x-16">
          
          {/* Images Section */}
          <div className="w-full lg:w-2/5">
             <div className="aspect-[4/5] max-h-[520px] bg-gray-50 overflow-hidden relative group cursor-zoom-in rounded-sm border border-gray-100 italic tracking-tighter">
                <img 
                  src={activeImage} 
                  alt={product.name}
                  key={activeImage}
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/600x800?text=' + product.name}
                />
             </div>
          </div>

          {/* Details Section */}
          <div className="w-full lg:w-2/5 mt-10 lg:mt-0 space-y-8">
              <div className="space-y-4 border-b border-gray-100 pb-8">
                 <div className="flex items-center space-x-2">
                    <span className="bg-black text-white text-[9px] font-black px-2 py-1 tracking-widest">{product.category.toUpperCase()}</span>
                    {product.discount && <span className="text-accent text-[9px] font-black uppercase tracking-widest">({product.discount})</span>}
                 </div>
                 <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-gray-900 leading-[1.1]">{product.name}</h1>
                 
                 <div className="flex items-center space-x-6 pt-2">
                    <div className="flex items-center space-x-2">
                       <span className="text-lg font-black">{product.rating}</span>
                       <div className="flex">
                          {[...Array(5)].map((_, i) => (
                             <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-200"} />
                          ))}
                       </div>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest border-l border-gray-200 pl-6">
                       Verified {product.reviews} reviews
                    </span>
                 </div>

                 <div className="flex items-center space-x-4 pt-4">
                    <span className="text-3xl font-black text-black">₹{product.price}</span>
                    {product.originalPrice > product.price && (
                       <span className="text-lg font-bold text-gray-300 line-through">₹{product.originalPrice}</span>
                    )}
                 </div>
              </div>

             {/* Color Selection */}
             {product.colors && product.colors.length > 0 && (
               <div className="space-y-4">
                 <h4 className="text-[11px] font-black tracking-widest text-gray-400 uppercase">COLOR / <span className="text-black underline decoration-accent decoration-2 underline-offset-4">{selectedColor.toUpperCase()}</span></h4>
                 <div className="flex flex-wrap gap-3">
                    {product.colors.map(color => {
                      const colorKey = color.toLowerCase().trim()
                      const colorSwatchMap = {
                        'white': '#FFFFFF', 'black': '#111111', 'blue': '#1565C0',
                        'navy blue': '#001F5B', 'royal blue': '#4169E1',
                        'red': '#D32F2F', 'grey': '#9E9E9E', 'green': '#388E3C',
                        'yellow': '#FFC107', 'maroon': '#800000', 'orange': '#E64A19',
                        'dark grey': '#424242', 'sky blue': '#87CEEB', 'soft pink': '#FFB6C1',
                        'dark navy blue': '#001030', 'grey htr': '#D3D3D3', 'pink': '#FFC0CB',
                        'ocean blue': '#0077BE', 'lilac': '#C8A2C8', 'purple': '#800080',
                        'min': '#3EB489', 't pale  yellow': '#FFFFE0', 'kiwi green': '#8EE53F',
                        'sunset': '#FD5E53', 'cream': '#FFFDD0', 'brown': '#795548'
                      }
                      const swatchColor = colorSwatchMap[colorKey] || '#CCCCCC'
                      const isSelected = selectedColor === color
                      return (
                        <button
                          key={color}
                          title={color}
                          onClick={() => handleColorSelect(color)}
                          style={{ backgroundColor: swatchColor }}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            isSelected
                              ? 'border-black scale-125 ring-2 ring-gray-100'
                              : 'border-gray-100 hover:border-gray-300 hover:scale-110'
                          } ${colorKey === 'white' ? 'border-gray-200' : ''}`}
                        />
                      )
                    })}
                  </div>
               </div>
             )}

             {/* Size Selection */}
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <h4 className="text-[11px] font-black tracking-widest text-gray-400 uppercase">SELECT SIZE</h4>
                   <button className="text-black text-[10px] font-black underline hover:text-accent transition-colors">SIZE CHART</button>
                </div>
                {error && <p className="text-[10px] font-black text-red-500 bg-red-50 px-3 py-1 border-l-4 border-red-500 uppercase tracking-widest">{error}</p>}
                <div className="flex flex-wrap gap-2">
                   {(product.sizes || ['S', 'M', 'L', 'XL', 'XXL']).map(size => (
                     <button 
                       key={size}
                       onClick={() => setSelectedSize(size)}
                       className={`w-12 h-12 flex items-center justify-center border-2 text-[11px] font-black transition-all ${
                         selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-100 hover:border-black text-gray-400'
                       }`}
                     >
                       {size}
                     </button>
                   ))}
                </div>
             </div>

             {/* Purchase Actions */}
             <div className="flex space-x-3 pt-4">
                <button 
                  onClick={handleWhatsAppBuy}
                  className="flex-1 bg-black text-white px-8 h-16 font-black tracking-[0.2em] flex items-center justify-center space-x-4 hover:bg-accent transition-all shadow-2xl active:scale-95 text-xs"
                >
                   <MessageCircle size={20} />
                   <span>INQUIRE ON WHATSAPP</span>
                </button>
                <button 
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-16 h-16 border-2 flex items-center justify-center transition-all shadow-lg active:scale-90 ${
                    isWishlisted ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-100 text-gray-400 hover:border-black'
                  }`}
                >
                   <Heart size={20} className={isWishlisted ? 'fill-red-500' : ''} />
                </button>
             </div>

             {/* Product Description */}
             <div className="space-y-4 border-t border-gray-100 pt-10">
                <h4 className="text-xs font-black tracking-[0.2em] text-gray-400 uppercase">DESCRIPTION</h4>
                <p className="text-sm text-gray-600 font-medium leading-relaxed tracking-tight">
                   {product.description}
                </p>
             </div>

             {/* Features List */}
             <div className="space-y-6 pt-10 border-t border-gray-100">
                <h4 className="text-xs font-black tracking-[0.2em] text-gray-400 uppercase">CORE FEATURES</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {getProductFeatures(product).map((feature, idx) => (
                      <li key={idx} className="flex flex-col space-y-1 p-4 bg-gray-50 border border-gray-100">
                         <span className="text-[10px] font-black text-accent uppercase tracking-widest">{feature.label}</span>
                         <span className="text-xs font-bold text-black uppercase tracking-tight">{feature.value}</span>
                      </li>
                   ))}
                </ul>
             </div>

             {/* Measurement Chart */}
             <div className="pt-12 border-t border-gray-100 overflow-hidden">
                <div className="bg-[#1A1A1A] p-6 sm:p-10 text-white rounded-none shadow-2xl">
                   <div className="flex flex-col lg:flex-row gap-8">
                      {/* Diagram Placeholder / Simplified Version */}
                      <div className="bg-white/5 p-6 rounded flex items-center justify-center min-w-[180px]">
                         <svg viewBox="0 0 100 120" className="w-24 h-32" fill="none" stroke="white" strokeWidth="1">
                           <path d="M 25 20 Q 50 35 75 20 L 95 35 L 85 50 L 75 42 L 75 110 L 25 110 L 25 42 L 15 50 L 5 35 Z" stroke="white" strokeWidth="2" />
                           <path d="M 30 50 L 70 50" stroke="#FF3D00" strokeDasharray="2,2" />
                           <path d="M 50 30 L 50 110" stroke="#FF3D00" strokeDasharray="2,2" />
                         </svg>
                      </div>

                      <div className="flex-1 overflow-x-auto">
                         <h5 className="text-[10px] font-black tracking-[0.3em] text-accent mb-6">STANDARDIZED MEASUREMENTS (INCHES)</h5>
                         <table className="w-full text-center text-[10px] font-black uppercase tracking-widest">
                            <thead>
                               <tr className="border-b border-white/10 text-gray-400">
                                  <th className="py-4 text-left">SPEC</th>
                                  <th>S</th>
                                  <th>M</th>
                                  <th>L</th>
                                  <th>XL</th>
                                  <th>XXL</th>
                               </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                               {measurementChartData.map(row => (
                                  <tr key={row.id} className="hover:bg-white/5 transition-colors">
                                     <td className="py-4 text-left font-bold text-white">{row.name}</td>
                                     <td className="py-4">{row.s}</td>
                                     <td className="py-4">{row.m}</td>
                                     <td className="py-4">{row.l}</td>
                                     <td className="py-4">{row.xl}</td>
                                     <td className="py-4">{row.xxl}</td>
                                  </tr>
                               ))}
                            </tbody>
                         </table>
                         <p className="mt-6 text-[9px] text-gray-500 font-bold tracking-widest leading-relaxed uppercase">
                            * TOLERANCE +/- 0.5" | PRE-SHRUNK FABRIC | BIO-WASHED FINISH
                         </p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
