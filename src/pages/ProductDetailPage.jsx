import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MessageCircle, Heart, Share2, Star, Check, ShieldCheck, ChevronRight } from 'lucide-react'
import { useData } from '../context/DataContext'

// Default features shown if none are set in the admin panel
const DEFAULT_FEATURES = [
  { label: 'Material', value: 'Polyester' },
  { label: 'Neck Type', value: 'Round Neck' },
  { label: 'Fit', value: 'Regular Fit' },
  { label: 'Sleeve Type', value: 'Half Sleeves' },
  { label: 'Usage', value: 'Ideal for Promotions, Events, Branding, and Gifting' },
  { label: 'Customization', value: 'Sublimation (Only on white colour), DTF, screen printing can be done' },
  { label: 'Fabric Properties', value: 'Lightweight, Breathable, and Quick-Dry' },
  { label: 'Durability', value: 'Wrinkle-Resistant & Fade-Resistant' },
  { label: 'Available Sizes', value: 'S, M, L, XL, XXL' },
  { label: 'Color Options', value: 'Multiple Colors Available' },
]

// Default measurement chart shown if none is set
const DEFAULT_CHART = {
  columns: ['S', 'M', 'L', 'XL', 'XXL'],
  rows: [
    { name: 'Chest',    values: { S: 19, M: 20, L: 21, XL: 22, XXL: 23 } },
    { name: 'Length',   values: { S: 26, M: 27, L: 28, XL: 29, XXL: 30 } },
    { name: 'Shoulder', values: { S: 17.5, M: 18.5, L: 19.5, XL: 20.5, XXL: 21.5 } },
  ]
}

// Parse chart from product — handles both old and new formats
const getChartData = (measurementChart) => {
  if (measurementChart?.columns && measurementChart?.rows) {
    return measurementChart // New format
  } else if (Array.isArray(measurementChart) && measurementChart.length > 0) {
    return {
      columns: ['S', 'M', 'L', 'XL', 'XXL'],
      rows: measurementChart.map(r => ({
        name: r.name,
        values: { S: r.s, M: r.m, L: r.l, XL: r.xl, XXL: r.xxl }
      }))
    }
  }
  return DEFAULT_CHART
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

  // Navigation Logic
  const currentIndex = products.findIndex(p => p.id === parseInt(id))
  const prevProduct = currentIndex > 0 ? products[currentIndex - 1] : null
  const nextProduct = currentIndex < products.length - 1 ? products[currentIndex + 1] : null

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
        <h2 className="text-2xl font-black text-gray-200 uppercase">Loading Mingle Catalog...</h2>
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
      {/* Navigation & Breadcrumbs Bar */}
      <div className="container mx-auto px-4 md:px-0 mb-8 border-b border-gray-100 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
             <button 
               onClick={() => navigate(-1)}
               className="flex items-center space-x-2 text-[10px] font-black tracking-widest text-black hover:text-accent transition-all group border border-black/10 px-4 py-2 uppercase"
             >
                <ChevronRight size={14} className="rotate-180" />
                <span>Back</span>
             </button>
             <div className="hidden sm:flex items-center space-x-2 text-[9px] font-black tracking-[0.2em] text-gray-400">
                <Link to="/" className="hover:text-black uppercase">Home</Link>
                <ChevronRight size={10} />
                <Link to="/products" className="hover:text-black uppercase">Products</Link>
                <ChevronRight size={10} />
                <span className="text-black uppercase truncate max-w-[150px]">{product.name}</span>
             </div>
          </div>

          <div className="flex items-center space-x-2">
             {prevProduct && (
               <Link 
                 to={`/products/${prevProduct.id}`}
                 className="flex items-center space-x-2 text-[10px] font-black tracking-widest text-gray-500 hover:text-black transition-all border border-gray-100 px-4 py-2 hover:border-black uppercase bg-gray-50/50"
               >
                  <ChevronRight size={14} className="rotate-180" />
                  <span>Prev</span>
               </Link>
             )}
             {nextProduct && (
               <Link 
                 to={`/products/${nextProduct.id}`}
                 className="flex items-center space-x-2 text-[10px] font-black tracking-widest text-gray-500 hover:text-black transition-all border border-gray-100 px-4 py-2 hover:border-black uppercase bg-gray-50/50"
               >
                  <span>Next</span>
                  <ChevronRight size={14} />
               </Link>
             )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8 md:py-16">
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
                 </div>
                 <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-gray-900 leading-[1.1] uppercase">{product.name}</h1>
                 
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
                       {product.reviews} reviews
                    </span>
                 </div>
              </div>

             {/* Color Selection */}
             {product.colors && product.colors.length > 0 && (
               <div className="space-y-4">
                 <h4 className="text-[11px] font-black tracking-widest text-gray-400 uppercase">Color / <span className="text-black underline decoration-accent decoration-2 underline-offset-4">{selectedColor.toUpperCase()}</span></h4>
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
                   <h4 className="text-[11px] font-black tracking-widest text-gray-400 uppercase">Select Size</h4>
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
                   <span>BUY NOW ON WHATSAPP</span>
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

             {/* Core Description */}
             <div className="space-y-4 border-t border-gray-100 pt-10">
                <h4 className="text-xs font-black tracking-[0.2em] text-gray-400 uppercase">Description</h4>
                <p className="text-sm text-gray-600 font-medium leading-relaxed tracking-tight">
                   {product.description}
                </p>
             </div>

              {/* Features List - Uses admin-set features, falls back to default */}
              <div className="space-y-6 pt-10 border-t border-gray-100">
                 <h3 className="text-sm font-black text-black underline decoration-black underline-offset-4">Features :-</h3>
                 <ul className="space-y-2 list-disc pl-5">
                    {(product.features?.length > 0 ? product.features : DEFAULT_FEATURES).map((feature, idx) => (
                       <li key={idx} className="text-xs font-black text-gray-700 tracking-tight">
                          <span className="text-black">{feature.label}:</span> {feature.value}
                       </li>
                    ))}
                 </ul>
              </div>

             {/* Measurement Chart - RESTORED ORIGINAL FORMAT */}
             <div className="pt-12 border-t border-gray-100">
                <div className="bg-[#2D2D2D] p-10 text-white rounded-none shadow-2xl">
                   <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
                      {/* Diagram Placeholder Container */}
                      <div className="bg-white p-6 rounded-none flex items-center justify-center w-[220px] h-[220px] shrink-0 border border-gray-100 shadow-inner">
                         <svg viewBox="0 0 100 120" className="w-full h-full" fill="none">
                           {/* T-shirt Outline */}
                           <path d="M 25 20 Q 50 28 75 20 L 95 32 L 85 45 L 75 38 L 75 110 L 25 110 L 25 38 L 15 45 L 5 32 Z" fill="white" stroke="#333" strokeWidth="1" />
                           {/* Chest Line (1) */}
                           <path d="M 30 55 L 70 55" stroke="#FF5252" strokeWidth="1" strokeDasharray="3,3" />
                           <text x="50" y="52" fill="#FF5252" fontSize="6" fontWeight="900" textAnchor="middle">1</text>
                           <path d="M 28 55 L 32 55 M 68 55 L 72 55" stroke="#FF5252" strokeWidth="1" />
                           {/* Length Line (2) */}
                           <path d="M 50 25 L 50 110" stroke="#FF5252" strokeWidth="1" strokeDasharray="3,3" />
                           <text x="46" y="70" fill="#FF5252" fontSize="6" fontWeight="900" textAnchor="middle">2</text>
                           <path d="M 50 23 L 50 27 M 50 108 L 50 112" stroke="#FF5252" strokeWidth="1" />
                           {/* Shoulder Line (3) */}
                           <path d="M 25 18 L 75 18" stroke="#FF5252" strokeWidth="1" strokeDasharray="3,3" />
                           <text x="50" y="15" fill="#FF5252" fontSize="6" fontWeight="900" textAnchor="middle">3</text>
                           <path d="M 23 18 L 27 18 M 73 18 L 77 18" stroke="#FF5252" strokeWidth="1" />
                         </svg>
                      </div>

                      <div className="flex-1 w-full min-w-0 flex flex-col">
                         {/* TABLE HEADER BAR - CONSTANT AT TOP */}
                         <div className="bg-white py-3 px-4 mb-0.5 w-full shrink-0">
                            <h5 className="text-[12px] font-black tracking-[0.2em] text-[#001F5B] uppercase text-center">MEASUREMENT CHART</h5>
                         </div>
                         
                         {/* SCROLLABLE TABLE CONTENT */}
                         <div className="overflow-x-auto w-full border border-white/10">
                           <table className="w-full text-center text-[10px] font-bold border-collapse border border-white/20 uppercase">
                               <thead className="bg-[#1A1A1A]">
                                  {(() => {
                                    const { columns } = getChartData(product.measurementChart)
                                    return (
                                      <tr className="text-white border-b border-white">
                                        <th className="py-4 border-r border-white font-black px-4">S.NO</th>
                                        <th className="py-4 border-r border-white text-left pl-4 font-black">MEASUREMENTS</th>
                                        {columns.map(col => (
                                          <th key={col} className="py-4 border-r border-white font-black px-4">{col}</th>
                                        ))}
                                      </tr>
                                    )
                                  })()}
                               </thead>
                               <tbody className="divide-y divide-white/20">
                                  {(() => {
                                    const { columns, rows } = getChartData(product.measurementChart)
                                    return rows.map((row, idx) => (
                                      <tr key={idx}>
                                        <td className="py-4 border-r border-white/20 font-medium">{idx + 1}</td>
                                        <td className="py-4 border-r border-white/20 text-left pl-4 font-medium">{String(row.name).toUpperCase()}</td>
                                        {columns.map(col => (
                                          <td key={col} className="py-4 border-r border-white/20 font-medium">{row.values?.[col] ?? ''}</td>
                                        ))}
                                      </tr>
                                    ))
                                  })()}
                               </tbody>
                           </table>
                         </div>

                         <div className="mt-6 space-y-1 text-[9px] text-gray-400 font-bold uppercase tracking-widest text-center lg:text-left">
                            <p>*All the measurements in inches</p>
                            <p>*Tolerance(+/- 0.5 inch) acceptable</p>
                         </div>
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
