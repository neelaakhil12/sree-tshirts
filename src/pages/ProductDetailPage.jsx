import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MessageCircle, Heart, Share2, Star, Check, ShieldCheck, ChevronRight } from 'lucide-react'
import { products } from '../data/products'

const measurementChartData = [
  { id: 1, name: 'Chest', s: 19, m: 20, l: 21, xl: 22, xxl: 23 },
  { id: 2, name: 'Length', s: 26, m: 27, l: 28, xl: 29, xxl: 30 },
  { id: 3, name: 'Shoulder', s: 17.5, m: 18.5, l: 19.5, xl: 20.5, xxl: 21.5 }
]

const getProductFeatures = (product) => {
   const isPolo = product.name.toLowerCase().includes('polo')
   const isHoodie = product.name.toLowerCase().includes('hoodie') || product.name.toLowerCase().includes('zipper') || product.name.toLowerCase().includes('sweatshirt')
   
   let material = "100% Polyester"
   if (product.category.toLowerCase().includes('cotton') || product.name.toLowerCase().includes('cotton')) material = "100% Premium Cotton"
   if (product.name.toLowerCase().includes('polycotton')) material = "PolyCotton Blend"
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
  const product = products.find(p => p.id === parseInt(id))
  
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || 'White')
  const [activeImage, setActiveImage] = useState(
    product?.colorImages?.[product?.colors?.[0]] || product?.image
  )
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
    if (product.colorImages?.[color]) {
      setActiveImage(product.colorImages[color])
    }
  }

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
      <div className="container mx-auto px-4 py-4 text-xs font-bold text-gray-400 flex items-center space-x-2">
        <Link to="/" className="hover:text-black">HOME</Link>
        <ChevronRight size={12} />
        <Link to="/products" className="hover:text-black">PRODUCTS</Link>
        <ChevronRight size={12} />
        <span className="text-black">{product.name.toUpperCase()}</span>
      </div>

      <div className="container mx-auto px-4 md:px-0">
        <div className="flex flex-col lg:flex-row lg:space-x-16">
          
          {/* Images Section - Single image that changes with color */}
          <div className="w-full lg:w-2/5">
             <div className="aspect-[4/5] max-h-[480px] bg-gray-50 overflow-hidden relative group cursor-zoom-in rounded-sm mx-auto">
                <img 
                  src={activeImage} 
                  alt={product.name}
                  key={activeImage}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
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

             <div className="pt-2">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Premium Quality Gear</p>
             </div>

             {/* Color Selection */}
             {product.colors && product.colors.length > 0 && (
               <div className="space-y-4">
                 <h4 className="text-sm font-black tracking-widest">SELECT COLOR: <span className="text-accent">{selectedColor.toUpperCase()}</span></h4>
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
                        'sunset': '#FD5E53', 'cream': '#FFFDD0', 'brown': '#795548',
                        // Combos
                        'royal blue with white': '#4169E1', 'navy blue with white': '#001F5B',
                        'black with red': '#111111', 'cream with red': '#FFFDD0',
                        'navy bluee with white': '#001F5B' // typo catch just in case
                      }
                      const swatchColor = colorSwatchMap[colorKey] || '#CCCCCC'
                      const isSelected = selectedColor === color
                      return (
                        <button
                          key={color}
                          title={color}
                          onClick={() => handleColorSelect(color)}
                          style={{ backgroundColor: swatchColor }}
                          className={`w-10 h-10 rounded-full border-2 transition-all ${
                            isSelected
                              ? 'border-accent scale-110 shadow-lg shadow-accent/30'
                              : 'border-gray-200 hover:border-gray-400 hover:scale-105'
                          } ${colorKey === 'white' ? 'border-gray-300' : ''}`}
                        />
                      )
                    })}
                  </div>
               </div>
             )}

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
                  onClick={handleWhatsAppBuy}
                  className="flex-1 bg-green-500 text-white h-16 rounded-none font-black tracking-widest flex items-center justify-center space-x-3 hover:bg-green-600 transition-all shadow-xl shadow-green-200"
                >
                   <MessageCircle size={20} className="hidden sm:block" />
                   <span className="whitespace-nowrap">BUY NOW</span>
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


             {/* Product Description */}
             <div className="space-y-4 border-t border-gray-100 pt-8">
                <h4 className="text-sm font-black tracking-widest uppercase">PRODUCT DETAILS</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                   {product.description}
                </p>
             </div>

             {/* Dynamic Features List */}
             <div className="space-y-4 border-t border-gray-100 pt-8">
                <h4 className="text-xl font-black tracking-tight border-b-2 border-black inline-block pb-1">Features :-</h4>
                <ul className="space-y-3 text-[15px] text-black pt-2">
                   {getProductFeatures(product).map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                         <span className="text-black text-lg leading-none mt-0.5">•</span>
                         <span className="leading-snug">
                            <span className="font-extrabold">{feature.label}:</span> <span className="text-gray-800">{feature.value}</span>
                         </span>
                      </li>
                   ))}
                </ul>
             </div>

             {/* Measurement Chart */}
             <div className="space-y-4 border-t border-gray-100 pt-10 mt-10">
                <div className="flex flex-col lg:flex-row gap-6 bg-[#333333] text-white p-6 md:p-8 rounded-sm shadow-xl">
                   {/* Illustration box */}
                   <div className="bg-[#f0f0f0] p-4 rounded min-w-[200px] flex items-center justify-center relative self-center lg:self-stretch">
                      <svg viewBox="0 0 100 120" className="w-32 h-40 drop-shadow-md" fill="white" stroke="#333" strokeWidth="1.5">
                          <path d="M 25 20 Q 50 40 75 20 L 95 40 L 85 55 L 75 45 L 75 110 L 25 110 L 25 45 L 15 55 L 5 40 Z" />
                          <path d="M 25 20 C 35 45 65 45 75 20" fill="none" />
                      </svg>
                      {/* Interactive Arrows to match image */}
                      <div className="absolute top-[40%] left-[25%] right-[25%] border-t-[1.5px] border-red-600 border-dashed flex justify-between items-center z-10">
                         <div className="w-1.5 h-1.5 border-l-[1.5px] border-b-[1.5px] border-red-600 transform rotate-45 -ml-[3px]"></div>
                         <span className="text-[10px] font-black text-black bg-[#f0f0f0] px-1 translate-y-3 rounded-full border border-black w-4 h-4 flex items-center justify-center shadow-sm">1</span>
                         <div className="w-1.5 h-1.5 border-r-[1.5px] border-t-[1.5px] border-red-600 transform rotate-45 -mr-[3px]"></div>
                      </div>
                      <div className="absolute top-[25%] bottom-[10%] left-[35%] border-l-[1.5px] border-red-600 border-dashed flex flex-col justify-between items-center z-10">
                         <div className="w-1.5 h-1.5 border-t-[1.5px] border-l-[1.5px] border-red-600 transform rotate-45 -mt-[3px]"></div>
                         <span className="text-[10px] font-black text-black bg-[#f0f0f0] -ml-5 rounded-full border border-black w-4 h-4 flex items-center justify-center shadow-sm">2</span>
                         <div className="w-1.5 h-1.5 border-b-[1.5px] border-r-[1.5px] border-red-600 transform rotate-45 -mb-[3px]"></div>
                      </div>
                      <div className="absolute top-[12%] left-[15%] right-[15%] border-t-[1.5px] border-red-600 border-dashed flex justify-between items-center z-10">
                         <div className="w-1.5 h-1.5 border-l-[1.5px] border-b-[1.5px] border-red-600 transform rotate-45 -ml-[3px]"></div>
                         <span className="text-[10px] font-black text-black bg-[#f0f0f0] px-1 -translate-y-3 rounded-full border border-black w-4 h-4 flex items-center justify-center shadow-sm">3</span>
                         <div className="w-1.5 h-1.5 border-r-[1.5px] border-t-[1.5px] border-red-600 transform rotate-45 -mr-[3px]"></div>
                      </div>
                   </div>

                   {/* Table & Notes */}
                   <div className="flex-1 overflow-x-auto">
                      <table className="w-full text-center border-collapse text-sm">
                         <thead>
                            <tr className="border border-white/20">
                               <th colSpan="7" className="text-[#a0c4ff] font-medium tracking-widest py-3 bg-white/5 border border-white/20 uppercase">
                                  MEASUREMENT CHART
                               </th>
                            </tr>
                            <tr className="border border-white/20 bg-white/5 text-xs font-semibold tracking-wider">
                               <th className="py-3 px-2 border-r border-white/20 uppercase font-bold text-gray-200">S.NO</th>
                               <th className="py-3 px-2 border-r border-white/20 uppercase font-bold text-left text-gray-200">MEASUREMENTS</th>
                               <th className="py-3 px-2 border-r border-white/20 font-bold text-gray-200">S</th>
                               <th className="py-3 px-2 border-r border-white/20 font-bold text-gray-200">M</th>
                               <th className="py-3 px-2 border-r border-white/20 font-bold text-gray-200">L</th>
                               <th className="py-3 px-2 border-r border-white/20 font-bold text-gray-200">XL</th>
                               <th className="py-3 px-2 font-bold text-gray-200">XXL</th>
                            </tr>
                         </thead>
                         <tbody className="text-sm">
                            {measurementChartData.map((row) => (
                               <tr key={row.id} className="border border-white/20 hover:bg-white/5 transition-colors">
                                  <td className="py-2.5 px-2 border-r border-white/20">{row.id}</td>
                                  <td className="py-2.5 px-2 border-r border-white/20 text-left pl-3">{row.name}</td>
                                  <td className="py-2.5 px-2 border-r border-white/20">{row.s}</td>
                                  <td className="py-2.5 px-2 border-r border-white/20">{row.m}</td>
                                  <td className="py-2.5 px-2 border-r border-white/20">{row.l}</td>
                                  <td className="py-2.5 px-2 border-r border-white/20">{row.xl}</td>
                                  <td className="py-2.5 px-2">{row.xxl}</td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                      <div className="text-[11px] font-bold tracking-wide mt-4 space-y-1 text-gray-300">
                         <p className="flex items-center space-x-1"><span>*All the measurements in inches</span></p>
                         <p className="flex items-center space-x-1"><span>*Tolerance(+/- 0.5 inch) acceptable</span></p>
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
