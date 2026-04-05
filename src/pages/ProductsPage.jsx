import React, { useState, useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { Filter, ChevronDown, Check, X, Search } from 'lucide-react'
import { products } from '../data/products'
import ProductCard from '../components/shop/ProductCard'

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || 'All'
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [selectedSizes, setSelectedSizes] = useState([])
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [sortBy, setSortBy] = useState('Recommended')
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false)

  const categories = ['All', 'Men', 'Women', 'Kids']
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const sortOptions = ['Recommended', 'Price: Low to High', 'Price: High to Low', 'Best Rated']

  useEffect(() => {
    let result = products
    const searchQuery = searchParams.get('search')?.toLowerCase() || ''

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory)
    }

    if (selectedSizes.length > 0) {
      result = result.filter(p => p.sizes.some(s => selectedSizes.includes(s)))
    }

    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery) || 
        p.description.toLowerCase().includes(searchQuery)
      )
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    if (sortBy === 'Price: Low to High') {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (sortBy === 'Price: High to Low') {
      result = [...result].sort((a, b) => b.price - a.price)
    } else if (sortBy === 'Best Rated') {
      result = [...result].sort((a, b) => b.rating - a.rating)
    }

    setFilteredProducts(result)
  }, [selectedCategory, selectedSizes, priceRange, sortBy])

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    )
  }

  return (
    <div className="pt-28 min-h-screen bg-white">
      <div className="container mx-auto px-4 md:px-0">
        
        {/* Breadcrumbs & Header */}
        <div className="py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-xl font-black tracking-widest text-black">
              {selectedCategory.toUpperCase()} COLLECTION ({filteredProducts.length})
            </h1>
            <p className="text-xs text-gray-400 font-bold mt-1">Home / Products / {selectedCategory}</p>
          </div>
          
          <div className="flex items-center space-x-6">
             {/* Sort Select */}
             <div className="relative group">
                <button className="flex items-center space-x-2 border border-gray-200 px-4 py-2 text-xs font-bold tracking-widest hover:border-black transition-colors">
                   <span>SORT BY: <span className="text-black font-black">{sortBy}</span></span>
                   <ChevronDown size={14} />
                </button>
                <div className="absolute top-full right-0 mt-1 bg-white shadow-xl border border-gray-100 min-w-[200px] z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                   {sortOptions.map(opt => (
                     <button 
                       key={opt}
                       onClick={() => setSortBy(opt)}
                       className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-gray-50 transition-colors uppercase tracking-widest"
                     >
                       {opt}
                     </button>
                   ))}
                </div>
             </div>
             
             {/* Mobile Filter Toggle */}
             <button 
               onClick={() => setIsFilterSidebarOpen(true)}
               className="md:hidden flex items-center space-x-2 border border-black bg-black text-white px-4 py-2 text-xs font-bold tracking-widest"
             >
                <Filter size={14} />
                <span>FILTERS</span>
             </button>
          </div>
        </div>

        <div className="flex pt-8 pb-16">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden md:block w-64 pr-12 space-y-10">
            {/* Categories */}
            <div className="space-y-4">
              <h4 className="text-sm font-black tracking-widest text-black">CATEGORIES</h4>
              <div className="space-y-2">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="category" 
                      className="hidden"
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                    />
                    <div className={`w-4 h-4 border ${selectedCategory === cat ? 'bg-accent border-accent' : 'border-gray-300 group-hover:border-black'}`}></div>
                    <span className={`text-sm tracking-wide ${selectedCategory === cat ? 'text-black font-black' : 'text-gray-600'}`}>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-4">
               <h4 className="text-sm font-black tracking-widest text-black">SIZE</h4>
               <div className="grid grid-cols-3 gap-2">
                 {sizes.map(size => (
                   <button 
                     key={size}
                     onClick={() => toggleSize(size)}
                     className={`py-2 text-[10px] font-black tracking-tighter border transition-all ${
                       selectedSizes.includes(size) ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-200 hover:border-black'
                     }`}
                   >
                     {size}
                   </button>
                 ))}
               </div>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
              <h4 className="text-sm font-black tracking-widest text-black">PRICE RANGE</h4>
              <div className="space-y-4">
                <input 
                  type="range" 
                  min="0" 
                  max="2000" 
                  step="100"
                  className="w-full accent-accent"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                />
                <div className="flex justify-between text-xs font-bold text-gray-500">
                   <span>Rs. 0</span>
                   <span>Rs. {priceRange[1]}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
             {filteredProducts.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-24 text-center">
                  <span className="text-6xl mb-4">😿</span>
                  <h3 className="text-xl font-black">OOPS! NO MINGLE FOUND.</h3>
                  <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms.</p>
                  <button 
                    onClick={() => {setSelectedCategory('All'); setSelectedSizes([]); setPriceRange([0, 2000])}}
                    className="mt-8 text-accent font-black text-xs border-b-2 border-accent pb-1"
                  >
                    CLEAR ALL FILTERS
                  </button>
               </div>
             ) : (
               <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                 {filteredProducts.map((product, idx) => (
                   <div key={product.id} data-aos="fade-up" data-aos-delay={(idx % 4) * 50}>
                     <ProductCard product={product} />
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay (Drawer) */}
      {isFilterSidebarOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-all md:hidden">
          <div className="absolute right-0 top-0 h-full w-4/5 bg-white shadow-2xl p-6 flex flex-col animate-slide-left">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-xl font-black">FILTERS</h2>
               <button onClick={() => setIsFilterSidebarOpen(false)} className="p-2 border border-gray-100 rounded-full">
                  <X size={20} />
               </button>
            </div>
            
            <div className="flex-grow overflow-y-auto space-y-10">
               {/* Mobile Filters Content (Same as desktop but styled for mobile) */}
               <div className="space-y-4">
                  <h4 className="text-xs font-black tracking-widest text-gray-400 uppercase">CATEGORY</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button 
                        key={cat} 
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 text-xs font-black border tracking-widest transition-all ${
                          selectedCategory === cat ? 'bg-black text-white' : 'bg-gray-50 text-black border-transparent'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="space-y-4">
                  <h4 className="text-xs font-black tracking-widest text-gray-400 uppercase">SIZES</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {sizes.map(size => (
                      <button 
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`py-3 text-xs font-black border ${
                          selectedSizes.includes(size) ? 'bg-black text-white border-black' : 'border-gray-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="space-y-4">
                  <h4 className="text-xs font-black tracking-widest text-gray-400 uppercase">MAX PRICE: Rs. {priceRange[1]}</h4>
                  <input 
                    type="range" 
                    min="0" 
                    max="2000" 
                    step="100"
                    className="w-full h-8 accent-accent"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  />
               </div>
            </div>

            <div className="pt-6 border-t">
               <button 
                 onClick={() => setIsFilterSidebarOpen(false)}
                 className="w-full bg-accent text-white py-4 font-black tracking-widest"
               >
                 APPLY FILTERS
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductsPage
