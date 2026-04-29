import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Filter, ChevronDown, X } from 'lucide-react'
import { useData } from '../context/DataContext'
import ProductCard from '../components/shop/ProductCard'
import SEO from '../components/common/SEO'

const ProductsPage = () => {
  const { products, categories, isLoaded } = useData()
  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || 'All'
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedSubCategories, setSelectedSubCategories] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [sortBy, setSortBy] = useState('Recommended')
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false)

  // SEO dynamic title
  const seoTitle = selectedCategory === 'All' ? 'Shop All Collections' : `Shop ${selectedCategory} Collection`

  // Sub-categories for T-shirts
  const sizes = ['S', 'M', 'L', 'XL', 'XXL']
  const sortOptions = ['Recommended', 'Best Rated', 'Price: Low to High', 'Price: High to Low']

  useEffect(() => {
    if (!isLoaded) return

    let result = products
    const searchQuery = searchParams.get('search')?.toLowerCase() || ''

    // Category Filter (Primary)
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.displayCategory === selectedCategory || p.category === selectedCategory)
    }


    // Search Query
    if (searchQuery) {
      const keywords = searchQuery.split(/\s+/).filter(k => k.length > 0);
      
      // Auto-correct common typos
      const normalizedKeywords = keywords.map(k => {
        if (k === 'polyster') return 'polyester';
        if (k === 'tshirt') return 't-shirt';
        return k;
      });

      result = result.filter(p => {
        const targetText = `${p.name} ${p.description || ''} ${p.category || ''}`.toLowerCase();
        // Match if ALL keywords are present in the product info
        return normalizedKeywords.every(k => targetText.includes(k));
      });
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
  }, [selectedCategory, selectedSubCategories, sortBy, searchParams, products, isLoaded])


  if (!isLoaded) return null

  return (
    <div className="pt-20 min-h-screen bg-white">
      <SEO 
        title={seoTitle}
        description={`Browse our premium ${selectedCategory} collection at Wear Mingle. Affordable custom fashion and essential wear.`}
        url={selectedCategory === 'All' ? '/products' : `/products?category=${selectedCategory}`}
      />
      <div className="container mx-auto px-4 md:px-0">
        
        {/* Header */}
        <div className="py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-xl font-black tracking-widest text-black uppercase">
              {selectedCategory === 'Tshirts' ? 'TSHIRTS COLLECTION' : selectedCategory.toUpperCase()} ({filteredProducts.length})
            </h1>
            <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tighter italic">Home / Products / {selectedCategory}</p>
          </div>
          
          <div className="flex items-center space-x-6">
             
          </div>
        </div>

        <div className="flex pt-8 pb-12">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-72 pr-12 space-y-12">
            {/* Main Categories */}
            <div className="p-6 bg-gray-50 border border-gray-100">
              <h4 className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase mb-6 border-b border-gray-200 pb-2">Collections</h4>
              <div className="space-y-3">
                {['All', ...categories.map(c => c.type)].map(cat => (
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
               <h4 className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase mb-6 border-b border-gray-200 pb-2">Size Chart</h4>
               <div className="grid grid-cols-2 gap-2">
                 {sizes.map(size => (
                   <div 
                     key={size}
                     className="py-3 text-[10px] font-black tracking-widest border border-gray-100 text-center uppercase"
                   >
                     {size}
                   </div>
                 ))}
               </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
             {filteredProducts.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-32 text-center bg-gray-50 border-2 border-dashed border-gray-100">
                  <span className="text-6xl mb-6">🔍</span>
                  <h3 className="text-2xl font-black tracking-tighter uppercase italic">No Products Found</h3>
                  <p className="text-gray-500 text-[10px] font-bold mt-2 uppercase tracking-widest">We couldn't find any mingle matching your selection.</p>
                  <button 
                    onClick={() => {
                      setSelectedCategory('All'); 
                      setSelectedSubCategories([]);
                      window.location.href = '/products';
                    }}
                    className="mt-10 bg-black text-white px-10 py-4 text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-accent transition-all"
                  >
                    RESET ALL FILTERS
                  </button>
               </div>
             ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {filteredProducts.map((product, idx) => (
                   <div key={product.id}>
                     <ProductCard product={product} />
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterSidebarOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md transition-all md:hidden">
          <div className="absolute right-0 top-0 h-full w-[85%] bg-white shadow-2xl flex flex-col p-8 space-y-12">
             <div className="flex items-center justify-between border-b pb-6">
                <h2 className="text-2xl font-black tracking-tighter italic">FILTERS</h2>
                <button onClick={() => setIsFilterSidebarOpen(false)}><X size={24} /></button>
             </div>
             
             
             <button 
               onClick={() => setIsFilterSidebarOpen(false)}
               className="w-full bg-black text-white h-16 text-xs font-black uppercase tracking-widest shadow-2xl"
             >
               APPLY SETTINGS
             </button>
          </div>
        </div>
      )}
    </div>
  )
}

const Check = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default ProductsPage
