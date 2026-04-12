import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Search, X, Check, Upload, Image as ImageIcon } from 'lucide-react'
import { products as initialProducts } from '../../data/products'

const AdminProducts = () => {
  const [products, setProducts] = useState(initialProducts)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Men',
    price: '',
    originalPrice: '',
    description: '',
    sizes: ['S', 'M', 'L', 'XL'],
    image: '/images/products/pure-cotton-bio-washed/black.png',
  })

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateOrUpdate = (e) => {
    e.preventDefault()
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...newProduct } : p))
      setEditingProduct(null)
    } else {
      const id = products.length + 1
      setProducts(prev => [{ ...newProduct, id, rating: 4.5, reviews: 0, discount: 'NEW' }, ...prev])
    }
    setIsModalOpen(false)
    setNewProduct({ name: '', category: 'Men', price: '', originalPrice: '', description: '', sizes: ['S', 'M', 'L', 'XL'], image: '' })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id))
    }
  }

  const openEdit = (product) => {
    setEditingProduct(product)
    setNewProduct(product)
    setIsModalOpen(true)
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
            onClick={() => {setEditingProduct(null); setIsModalOpen(true)}}
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
                   <th className="px-8 py-6">STATUS</th>
                   <th className="px-8 py-6 text-right">ACTIONS</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                     <td className="px-8 py-4 flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gray-100 overflow-hidden ring-2 ring-transparent group-hover:ring-accent transition-all">
                           <img src={p.image} className="w-full h-full object-cover object-top" />
                        </div>
                        <div>
                           <p className="text-sm font-black text-black">{p.name}</p>
                           <p className="text-[10px] font-bold text-gray-400 uppercase">ID: WM-{p.id}</p>
                        </div>
                     </td>
                     <td className="px-8 py-4">
                        <span className="text-xs font-black text-gray-600 uppercase bg-gray-100 px-3 py-1">{p.category}</span>
                     </td>
                     <td className="px-8 py-4">
                         <div className="flex flex-col">
                            <span className="text-sm font-black text-black">₹{p.price}</span>
                            <span className="text-[10px] text-gray-400 line-through">₹{p.originalPrice}</span>
                         </div>
                     </td>
                     <td className="px-8 py-4">
                        <div className="flex items-center space-x-2 text-green-500">
                           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                           <span className="text-[10px] font-black uppercase tracking-widest">In Stock</span>
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
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center space-y-4">
               <ImageIcon size={48} className="mx-auto text-gray-200" />
               <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No products found matching your criteria</p>
            </div>
          )}
       </div>

       {/* Modal - Add/Edit Product */}
       {isModalOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10 p-10 shadow-2xl animate-zoom-in rounded-none border-t-8 border-accent">
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
                   <h3 className="text-2xl font-black uppercase tracking-tight">{editingProduct ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}</h3>
                   <button onClick={() => setIsModalOpen(false)} className="p-2 border border-gray-100 hover:bg-gray-50">
                      <X size={20} />
                   </button>
                </div>

                <form onSubmit={handleCreateOrUpdate} className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PRODUCT NAME</label>
                         <input 
                           type="text" 
                           className="w-full bg-gray-50 border-none p-5 text-sm font-bold focus:ring-2 focus:ring-accent transition-all" 
                           placeholder="Enter product title" 
                           value={newProduct.name}
                           onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                           required
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CATEGORY</label>
                         <select 
                           className="w-full bg-gray-50 border-none p-5 text-sm font-bold focus:ring-2 focus:ring-accent transition-all"
                           value={newProduct.category}
                           onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                         >
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Kids">Kids</option>
                            <option value="Tshirts">Tshirts</option>
                            <option value="School uniform">School uniform</option>
                            <option value="Hoodies">Hoodies</option>
                            <option value="Caps">Caps</option>
                            <option value="Tote Bags">Tote Bags</option>
                            <option value="Diary">Diary</option>
                            <option value="Pens">Pens</option>
                            <option value="Bottle">Bottle</option>
                            <option value="College/School Bag">College/School Bag</option>
                            <option value="Laptop Bags">Laptop Bags</option>
                            <option value="Corporate Giftings">Corporate Giftings</option>
                         </select>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SELLING PRICE (₹)</label>
                         <input 
                           type="number" 
                           className="w-full bg-gray-50 border-none p-5 text-sm font-bold focus:ring-2 focus:ring-accent transition-all" 
                           placeholder="Price" 
                           value={newProduct.price}
                           onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                           required
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">MRP / ORIGINAL PRICE (₹)</label>
                         <input 
                           type="number" 
                           className="w-full bg-gray-50 border-none p-5 text-sm font-bold focus:ring-2 focus:ring-accent transition-all" 
                           placeholder="Original Price" 
                           value={newProduct.originalPrice}
                           onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})}
                           required
                         />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">DESCRIPTION</label>
                      <textarea 
                        className="w-full bg-gray-50 border-none p-5 text-sm font-bold focus:ring-2 focus:ring-accent transition-all resize-none" 
                        rows="4" 
                        placeholder="Product description and details..."
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        required
                      ></textarea>
                   </div>

                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">IMAGE UPLOAD (SIMULATED)</label>
                      <div className="border-2 border-dashed border-gray-200 p-10 text-center hover:border-accent transition-colors cursor-pointer group bg-gray-50">
                         <Upload size={32} className="mx-auto text-gray-300 group-hover:text-accent mb-3" />
                         <p className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-black">Drag and drop or click to upload</p>
                         <p className="text-[10px] text-gray-400 mt-1 uppercase">Support: JPG, PNG (Max 5MB)</p>
                         {newProduct.image && <p className="mt-4 text-[10px] font-black text-green-500 uppercase">✓ IMAGE SELECTED</p>}
                      </div>
                   </div>

                   <div className="flex space-x-4 pt-10">
                      <button 
                        type="button" 
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 border-2 border-black border-opacity-10 py-5 font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
                      >
                         CANCEL
                      </button>
                      <button 
                        type="submit" 
                        className="flex-1 bg-black text-white py-5 font-black text-xs uppercase tracking-widest hover:bg-accent transition-all shadow-xl"
                      >
                         {editingProduct ? 'SAVE CHANGES' : 'PUBLISH PRODUCT'}
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
