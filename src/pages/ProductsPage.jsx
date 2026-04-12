import React, { useState, useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { Filter, ChevronDown, Check, X, Search } from 'lucide-react'
import { useData } from '../context/DataContext'
import ProductCard from '../components/shop/ProductCard'

const ProductsPage = () => {
  const { products, categories, isLoaded } = useData()
  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || 'All'
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedSizes, setSelectedSizes] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [sortBy, setSortBy] = useState('Recommended')
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false)

  // Derive dynamic filters from data
  const filterCategories = ['All', ...categories.map(c => c.type || c.name)]
  const sizes = ['S', 'M', 'L', 'XL', 'XXL']
  const sortOptions = ['Recommended', 'Best Rated', 'Price: Low to High', 'Price: High to Low']

  useEffect(() => {
    if (!isLoaded) return

    let result = products
    const searchQuery = searchParams.get('search')?.toLowerCase() || ''

    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory)
    }

    // Size Filter
    if (selectedSizes.length > 0) {
      result = result.filter(p => p.sizes && p.sizes.some(s => selectedSizes.includes(s)))
    }

    // Search Query
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery) || 
        (p.description && p.description.toLowerCase().includes(searchQuery))
      )
    }

    // Sorting
    if (sortBy === 'Best Rated') {
      result = [...result].sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'Price: Low to High') {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (sortBy === 'Price: High to Low') {
      result = [...result].sort((a, b) => b.price - a.price)
    }

    setFilteredProducts(result)
  }, [selectedCategory, selectedSizes, sortBy, searchParams, products, isLoaded])

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    )
  }

  if (!isLoaded) return null

  return (
    <div className="pt-28 min-h-screen bg-white">
      <div className="container mx-auto px-4 md:px-0">
        
        {/* Breadcrumbs & Header */}
        <div className="py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-xl font-black tracking-widest text-black">
              {selectedCategory.toUpperCase()} COLLECTION ({filteredProducts.length})
            </h1>
            <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-tighter">Home / Products / {selectedCategory}</p>
          </div>
          
          <div className="flex items-center space-x-6">
             {/* Sort Select */}
             <div className="relative group">
                <button className="flex items-center space-x-2 border border-gray-200 px-6 py-3 text-xs font-black tracking-widest hover:border-black transition-all bg-white">
                   <span>SORT BY: <span className="text-accent underline decoration-black decoration-2 underline-offset-4">{sortBy.toUpperCase()}</span></span>
                   <ChevronDown size={14} />
                </button>
                <div className="absolute top-full right-0 mt-1 bg-white shadow-2xl border border-gray-100 min-w-[240px] z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                   {sortOptions.map(opt => (
                     <button 
                       key={opt}
                       onClick={() => setSortBy(opt)}
                       className={`w-full text-left px-6 py-4 text-xs font-black hover:bg-gray-50 transition-colors uppercase tracking-widest ${sortBy === opt ? 'text-accent' : 'text-gray-500'}`}
                     >
                       {opt}
                     </button>
                   ))}
                </div>
             </div>
             
             {/* Mobile Filter Toggle */}
             <button 
               onClick={() => setIsFilterSidebarOpen(true)}
               className="md:hidden flex items-center space-x-2 border-2 border-black bg-black text-white px-6 py-3 text-xs font-black tracking-widest shadow-xl active:scale-95 transition-all"
             >
                <Filter size={14} />
                <span>FILTERS</span>
             </button>
          </div>
        </div>

        <div className="flex pt-12 pb-24">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden md:block w-72 pr-12 space-y-12">
            {/* Categories */}
            <div className="p-6 bg-gray-50 border border-gray-100">
              <h4 className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase mb-6 border-b border-gray-200 pb-2">CATEGORIES</h4>
              <div className="space-y-3">
                {filterCategories.map(cat => (
                  <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="category" 
                      className="hidden"
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                    />
                    <div className={`w-3 h-3 border-2 transition-all ${selectedCategory === cat ? 'bg-accent border-accent scale-125' : 'border-gray-300 group-hover:border-black'}`}></div>
                    <span className={`text-[11px] tracking-widest uppercase transition-all ${selectedCategory === cat ? 'text-black font-black' : 'text-gray-500 font-bold hover:text-black'}`}>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="p-6 border border-gray-100">
               <h4 className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase mb-6 border-b border-gray-200 pb-2">SIZE CHART</h4>
               <div className="grid grid-cols-2 gap-2">
                 {sizes.map(size => (
                   <button 
                     key={size}
                     onClick={() => toggleSize(size)}
                     className={`py-3 text-[10px] font-black tracking-widest border transition-all ${
                       selectedSizes.includes(size) ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-100 hover:border-black'
                     }`}
                   >
                     {size}
                   </button>
                 ))}
               </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
             {filteredProducts.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-32 text-center bg-gray-50 border-2 border-dashed border-gray-100">
                  <span className="text-6xl mb-6">🔍</span>
                  <h3 className="text-2xl font-black tracking-tighter uppercase">No Products Found</h3>
                  <p className="text-gray-500 text-xs font-bold mt-2 uppercase tracking-widest">We couldn't find any mingle matching your selection.</p>
                  <button 
                    onClick={() => {setSelectedCategory('All'); setSelectedSizes([]);}}
                    className="mt-10 bg-black text-white px-10 py-4 text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-accent transition-all"
                  >
                    RESET ALL FILTERS
                  </button>
               </div>
             ) : (
               <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md transition-all md:hidden">
          <div className="absolute right-0 top-0 h-full w-[85%] bg-white shadow-2xl flex flex-col animate-slide-left p-0">
            <div className="flex items-center justify-between p-8 border-b border-gray-100">
               <h2 className="text-2xl font-black tracking-tighter">FILTERS</h2>
               <button onClick={() => setIsFilterSidebarOpen(false)} className="p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <X size={24} />
               </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-8 space-y-12 no-scrollbar">
               {/* Categories */}
               <div className="space-y-6">
                  <h4 className="text-[10px] font-black tracking-[0.2em] text-accent uppercase">CATEGORIES</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {filterCategories.map(cat => (
                      <button 
                         key={cat} 
                         onClick={() => setSelectedCategory(cat)}
                         className={`px-4 py-4 text-[10px] font-black border tracking-widest transition-all text-left uppercase ${
                           selectedCategory === cat ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-500 border-transparent'
                         }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
               </div>

               {/* Sizes */}
               <div className="space-y-6">
                  <h4 className="text-[10px] font-black tracking-[0.2em] text-accent uppercase">SIZES</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {sizes.map(size => (
                      <button 
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`py-5 text-xs font-black border transition-all ${
                          selectedSizes.includes(size) ? 'bg-black text-white border-black shadow-lg' : 'bg-gray-50 text-gray-400 border-transparent'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            <div className="p-8 border-t border-gray-100 bg-gray-50">
               <button 
                 onClick={() => setIsFilterSidebarOpen(false)}
                 className="w-full bg-black text-white h-16 text-xs font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all"
               >
                 APPLY SETTINGS
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductsPage
