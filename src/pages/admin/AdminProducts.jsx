import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Search, X, Check, Upload, Image as ImageIcon, Star, Loader2 } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { supabase } from '../../lib/supabase'

const AdminProducts = () => {
  const { products, fetchData, categories } = useData()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Form State
  const [formProduct, setFormProduct] = useState({
    name: '',
    category: 'Tshirts',
    price: '',
    original_price: '',
    discount: '',
    rating: 4.5,
    reviews: 0,
    description: '',
    image: '',
    sizes: [],
    colors: [],
    color_images: {}
  })

  const [tempSize, setTempSize] = useState('')
  const [tempColor, setTempColor] = useState('')

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    const productData = {
      name: formProduct.name,
      category: formProduct.category,
      price: Number(formProduct.price),
      original_price: Number(formProduct.original_price),
      discount: formProduct.discount,
      rating: Number(formProduct.rating),
      reviews: Number(formProduct.reviews),
      description: formProduct.description,
      image: formProduct.image,
      sizes: formProduct.sizes || [],
      colors: formProduct.colors || [],
      color_images: formProduct.color_images || {}
    }

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData])
        if (error) throw error
      }
      
      await fetchData() // Refresh global state
      closeModal()
    } catch (err) {
      alert('Error saving product: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id)
        if (error) throw error
        await fetchData()
      } catch (err) {
        alert('Error deleting product: ' + err.message)
      }
    }
  }

  const openEdit = (product) => {
    setEditingProduct(product)
    setFormProduct({
      ...product,
      original_price: product.original_price || product.originalPrice // Handle legacy naming if any
    })
    setIsModalOpen(true)
  }

  const openAdd = () => {
    setEditingProduct(null)
    setFormProduct({
      name: '',
      category: categories[0]?.type || categories[0]?.name || 'Tshirts',
      price: '',
      original_price: '',
      discount: '',
      rating: 4.5,
      reviews: 0,
      description: '',
      image: '',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: [],
      color_images: {}
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  // List Management
  const addSize = () => {
    if (tempSize && !formProduct.sizes.includes(tempSize)) {
      setFormProduct({ ...formProduct, sizes: [...formProduct.sizes, tempSize] })
      setTempSize('')
    }
  }

  const removeSize = (size) => {
    setFormProduct({ ...formProduct, sizes: formProduct.sizes.filter(s => s !== size) })
  }

  const addColor = () => {
    if (tempColor && !formProduct.colors.includes(tempColor)) {
      setFormProduct({ 
        ...formProduct, 
        colors: [...formProduct.colors, tempColor],
        color_images: { ...formProduct.color_images, [tempColor]: '' }
      })
      setTempColor('')
    }
  }

  const removeColor = (color) => {
    const newColorImages = { ...formProduct.color_images }
    delete newColorImages[color]
    setFormProduct({ 
      ...formProduct, 
      colors: formProduct.colors.filter(c => c !== color),
      color_images: newColorImages
    })
  }

  const updateColorImage = (color, path) => {
    setFormProduct({
      ...formProduct,
      color_images: { ...formProduct.color_images, [color]: path }
    })
  }

  return (
    <div className="space-y-8 pb-32">
       {/* Actions Bar */}
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="relative group max-w-md w-full">
             <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent" />
             <input 
               type="text" 
               placeholder="Search by name, category..." 
               className="w-full bg-white border border-gray-100 p-4 pl-12 text-sm font-bold tracking-tight focus:ring-2 focus:ring-accent outline-none" 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <button 
            onClick={openAdd}
            className="bg-black text-white px-10 py-4 font-black text-xs uppercase tracking-widest flex items-center space-x-3 shadow-xl hover:bg-accent transition-all"
          >
             <Plus size={18} />
             <span>ADD NEW PRODUCT</span>
          </button>
       </div>

       {/* Products Table */}
       <div className="bg-white border border-gray-100 overflow-x-auto rounded-none">
          <table className="w-full text-left border-collapse">
             <thead>
                <tr className="bg-gray-50 border-b border-gray-100 font-black text-[10px] uppercase tracking-widest text-gray-500">
                   <th className="px-8 py-6">PRODUCT</th>
                   <th className="px-8 py-6">CATEGORY</th>
                   <th className="px-8 py-6">PRICE</th>
                   <th className="px-8 py-6">RATING</th>
                   <th className="px-8 py-6 text-right">ACTIONS</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
                {filteredProducts.map((p) => (
                   <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-8 py-4 flex items-center space-x-4">
                         <div className="w-14 h-14 bg-gray-100 overflow-hidden ring-2 ring-transparent group-hover:ring-accent transition-all flex items-center justify-center">
                            <img src={p.image} className="w-full h-full object-contain mix-blend-multiply" onError={(e) => e.target.src = 'https://via.placeholder.com/150'} />
                         </div>
                         <div>
                            <p className="text-sm font-black text-black">{p.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">ID: {p.id}</p>
                         </div>
                      </td>
                      <td className="px-8 py-4">
                         <span className="text-xs font-black text-gray-600 uppercase bg-gray-100 px-3 py-1">{p.category}</span>
                      </td>
                      <td className="px-8 py-4">
                          <div className="flex flex-col">
                             <span className="text-sm font-black text-black">₹{p.price}</span>
                             {p.original_price > p.price && (
                               <span className="text-[10px] text-gray-400 line-through">₹{p.original_price}</span>
                             )}
                          </div>
                      </td>
                      <td className="px-8 py-4">
                         <div className="flex items-center space-x-1 text-yellow-500">
                            <Star size={12} fill="currentColor" />
                            <span className="text-xs font-black">{p.rating} ({p.reviews})</span>
                         </div>
                      </td>
                      <td className="px-8 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => openEdit(p)} className="p-3 bg-white text-black hover:bg-black hover:text-white border border-gray-100 transition-all shadow-sm">
                                <Edit2 size={16} />
                             </button>
                             <button onClick={() => handleDelete(p.id)} className="p-3 bg-white text-red-500 hover:bg-red-500 hover:text-white border border-gray-100 transition-all shadow-sm">
                                <Trash2 size={16} />
                             </button>
                          </div>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>

       {/* Modal */}
       {isModalOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>
            <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto relative z-10 p-10 shadow-2xl rounded-none border-t-8 border-accent">
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
                   <h3 className="text-2xl font-black uppercase tracking-tight italic">
                      {editingProduct ? 'Update Product' : 'Create Product'}
                   </h3>
                   <button onClick={closeModal} className="p-2 border border-gray-100 hover:bg-gray-50">
                      <X size={20} />
                   </button>
                </div>

                <form onSubmit={handleCreateOrUpdate} className="space-y-12">
                   {/* Basic Info */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PRODUCT NAME</label>
                         <input 
                           type="text" 
                           className="w-full bg-gray-50 border-none p-5 text-sm font-bold focus:ring-2 focus:ring-accent transition-all" 
                           value={formProduct.name}
                           onChange={(e) => setFormProduct({...formProduct, name: e.target.value})}
                           required
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CATEGORY</label>
                         <select 
                           className="w-full bg-gray-50 border-none p-5 text-sm font-bold focus:ring-2 focus:ring-accent transition-all"
                           value={formProduct.category}
                           onChange={(e) => setFormProduct({...formProduct, category: e.target.value})}
                         >
                            {categories.map(cat => (
                               <option key={cat.id} value={cat.type || cat.name}>{cat.name}</option>
                            ))}
                         </select>
                      </div>
                   </div>

                   {/* Pricing */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PRICE (₹)</label>
                         <input type="number" className="w-full bg-gray-50 border-none p-5 text-sm font-bold font-mono" value={formProduct.price} onChange={(e) => setFormProduct({...formProduct, price: e.target.value})} required />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">MRP (₹)</label>
                         <input type="number" className="w-full bg-gray-50 border-none p-5 text-sm font-bold font-mono" value={formProduct.original_price} onChange={(e) => setFormProduct({...formProduct, original_price: e.target.value})} required />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">DISCOUNT TAG</label>
                         <input type="text" className="w-full bg-gray-50 border-none p-5 text-sm font-bold" placeholder="e.g. 50% OFF" value={formProduct.discount} onChange={(e) => setFormProduct({...formProduct, discount: e.target.value})} />
                      </div>
                      <div className="space-y-2 flex gap-4">
                         <div className="flex-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">RATING</label>
                            <input type="number" step="0.1" className="w-full bg-gray-50 border-none p-5 text-sm font-bold" value={formProduct.rating} onChange={(e) => setFormProduct({...formProduct, rating: e.target.value})} />
                         </div>
                         <div className="flex-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">REVIEWS</label>
                            <input type="number" className="w-full bg-gray-50 border-none p-5 text-sm font-bold" value={formProduct.reviews} onChange={(e) => setFormProduct({...formProduct, reviews: e.target.value})} />
                         </div>
                      </div>
                   </div>

                   {/* Image & Description */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">MEDIA URL (MAIN)</label>
                          <input type="text" className="w-full bg-gray-50 border-none p-5 text-sm font-bold font-mono" value={formProduct.image} onChange={(e) => setFormProduct({...formProduct, image: e.target.value})} required />
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">DESCRIPTION</label>
                          <textarea className="w-full bg-gray-50 border-none p-5 text-sm font-bold resize-none" rows="1" value={formProduct.description} onChange={(e) => setFormProduct({...formProduct, description: e.target.value})}></textarea>
                      </div>
                   </div>

                   {/* Variants */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-6 border-t border-gray-100">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SIZES</label>
                         <div className="flex flex-wrap gap-2 mb-4">
                            {formProduct.sizes?.map(size => (
                               <span key={size} className="bg-black text-white text-[10px] font-black px-3 py-2 flex items-center gap-2">
                                 {size} <button type="button" onClick={() => removeSize(size)}><X size={12} /></button>
                               </span>
                            ))}
                         </div>
                         <div className="flex gap-2">
                            <input type="text" className="flex-1 bg-gray-50 border-none p-3 text-sm font-bold" value={tempSize} onChange={(e) => setTempSize(e.target.value)} placeholder="e.g. S" />
                            <button type="button" onClick={addSize} className="bg-gray-200 px-4 font-black text-[10px] uppercase">ADD</button>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">COLORS</label>
                         <div className="flex flex-wrap gap-2 mb-4">
                            {formProduct.colors?.map(color => (
                               <span key={color} className="bg-accent text-white text-[10px] font-black px-3 py-2 flex items-center gap-2">
                                 {color} <button type="button" onClick={() => removeColor(color)}><X size={12} /></button>
                               </span>
                            ))}
                         </div>
                         <div className="flex gap-2">
                            <input type="text" className="flex-1 bg-gray-50 border-none p-3 text-sm font-bold" value={tempColor} onChange={(e) => setTempColor(e.target.value)} placeholder="e.g. Royal Blue" />
                            <button type="button" onClick={addColor} className="bg-gray-200 px-4 font-black text-[10px] uppercase">ADD</button>
                         </div>
                      </div>
                   </div>

                   {/* Color Images Mapping */}
                   {formProduct.colors?.length > 0 && (
                      <div className="space-y-4 pt-6 bg-gray-50 p-6">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">COLOR-IMAGE MAPPING</label>
                         <div className="space-y-3">
                            {formProduct.colors.map(color => (
                               <div key={color} className="flex items-center gap-4">
                                  <span className="w-32 text-[10px] font-black uppercase text-accent truncate">{color}</span>
                                  <input 
                                    type="text" 
                                    className="flex-1 bg-white border border-gray-100 p-3 text-[10px] font-bold font-mono" 
                                    placeholder="Image URL..." 
                                    value={formProduct.color_images?.[color] || ''} 
                                    onChange={(e) => updateColorImage(color, e.target.value)}
                                  />
                               </div>
                            ))}
                         </div>
                      </div>
                   )}

                   <div className="flex space-x-4 pt-10 border-t border-gray-100">
                      <button type="button" onClick={closeModal} className="flex-1 border-2 border-black border-opacity-10 py-5 font-black text-xs uppercase tracking-widest">CANCEL</button>
                      <button 
                        type="submit" 
                        disabled={isLoading}
                        className="flex-1 bg-black text-white py-5 font-black text-xs uppercase tracking-widest hover:bg-accent transition-all shadow-xl flex items-center justify-center space-x-3 disabled:opacity-50"
                      >
                         {isLoading ? <Loader2 className="animate-spin" size={18} /> : (editingProduct ? 'UPDATE IN CLOUD' : 'SAVE TO CLOUD')}
                      </button>
                   </div>
                </form>
            </div>
         </div>
       )}
    </div>
  )
}

export default AdminProducts
