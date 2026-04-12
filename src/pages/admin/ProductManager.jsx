import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  Filter,
  MoreVertical,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Package
} from 'lucide-react'
import { useData } from '../../context/DataContext'
import { supabase } from '../../lib/supabase'

const ProductManager = () => {
  const { products, categories, isLoaded } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id)
        if (error) throw error
        alert('Product deleted successfully from cloud.')
        // In a real app, we'd trigger a re-fetch in DataContext
      } catch (err) {
        alert('Error deleting product: ' + err.message)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Same as Dashboard */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-20">
        <div className="p-8 border-b border-gray-50">
          <h1 className="text-xl font-black tracking-tighter uppercase">Mingle Admin</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin/dashboard" className="flex items-center space-x-3 p-3 text-gray-500 hover:bg-gray-50 transition-all font-black text-xs tracking-widest uppercase">
            <TrendingUp size={16} />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/products" className="flex items-center space-x-3 p-3 bg-black text-white rounded-none font-black text-xs tracking-widest uppercase shadow-lg">
            <Package size={16} />
            <span>Products</span>
          </Link>
          <div className="flex items-center space-x-3 p-3 text-gray-400 font-black text-xs tracking-widest uppercase cursor-not-allowed opacity-50">
            <Plus size={16} />
            <span>Categories</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-12">
        <div className="mb-12">
           <div className="flex items-center text-[10px] font-black tracking-widest text-gray-400 uppercase mb-4 space-x-2">
              <Link to="/admin/dashboard" className="hover:text-black">Dashboard</Link>
              <ChevronRight size={10} />
              <span className="text-black">Products</span>
           </div>
           <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-black tracking-tighter uppercase">Product Catalog</h2>
                <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mt-1">Total {products.length} Items Listed</p>
              </div>
              <button className="bg-black text-white px-8 h-12 flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all shadow-xl">
                 <Plus size={16} />
                 <span>Add New Product</span>
              </button>
           </div>
        </div>

        {/* Filters & Actions Bar */}
        <div className="bg-white border border-gray-100 p-6 flex flex-col md:flex-row gap-4 mb-8">
           <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="text"
                placeholder="Search products by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border-none px-12 py-3 text-sm font-semibold focus:bg-white focus:ring-1 ring-black/5 outline-none transition-all"
              />
           </div>
           <div className="flex items-center space-x-4">
              <div className="relative group">
                 <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                 <select 
                   value={selectedCategory}
                   onChange={(e) => setSelectedCategory(e.target.value)}
                   className="bg-gray-50 border-none pl-12 pr-10 py-3 text-[10px] font-black uppercase tracking-widest focus:bg-white focus:ring-1 ring-black/5 outline-none appearance-none cursor-pointer"
                 >
                    <option value="All">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.type}>{cat.name}</option>
                    ))}
                 </select>
              </div>
           </div>
        </div>

        {/* Product Table */}
        <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Product</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {!isLoaded ? (
                   <tr>
                      <td colSpan="3" className="px-8 py-20 text-center text-xs font-black text-gray-300 uppercase animate-pulse">
                         Loading Catalog Details...
                      </td>
                   </tr>
                 ) : filteredProducts.length === 0 ? (
                   <tr>
                      <td colSpan="3" className="px-8 py-20 text-center text-xs font-black text-gray-300 uppercase">
                         No products found matching your search.
                      </td>
                   </tr>
                 ) : (
                   filteredProducts.map(product => (
                     <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                       <td className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                             <div className="w-12 h-12 bg-gray-50 border border-gray-100 p-1">
                                <img src={product.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                             </div>
                             <div>
                                <h4 className="text-xs font-black uppercase tracking-tight text-gray-900">{product.name}</h4>
                                <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1">ID: #{product.id}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <span className="text-[10px] font-black bg-gray-100 px-3 py-1 uppercase tracking-widest text-gray-500">
                             {product.category}
                          </span>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="p-2 text-gray-400 hover:text-black hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                                <Edit2 size={16} />
                             </button>
                             <button 
                               onClick={() => handleDelete(product.id)}
                               className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                             >
                                <Trash2 size={16} />
                             </button>
                             <div className="h-4 w-[1px] bg-gray-200"></div>
                             <Link 
                               to={`/products/${product.id}`}
                               target="_blank"
                               className="p-2 text-gray-400 hover:text-blue-500 transition-all"
                             >
                                <ExternalLink size={16} />
                             </Link>
                          </div>
                       </td>
                     </tr>
                   ))
                 )}
              </tbody>
           </table>
        </div>
      </main>
    </div>
  )
}

export default ProductManager
