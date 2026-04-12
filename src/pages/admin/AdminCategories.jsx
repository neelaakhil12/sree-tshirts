import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Search, X, Image as ImageIcon } from 'lucide-react'
import { useData } from '../../context/DataContext'

const AdminCategories = () => {
  const { categories, setCategories } = useData()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [newCategory, setNewCategory] = useState({
    name: '',
    image: '',
    path: '',
    type: ''
  })

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.type && c.type.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleCreateOrUpdate = (e) => {
    e.preventDefault()
    if (editingCategory) {
      setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, ...newCategory } : c))
      setEditingCategory(null)
    } else {
      const id = Date.now() // Unique ID
      setCategories(prev => [{ ...newCategory, id, count: 0 }, ...prev])
    }
    setIsModalOpen(false)
    setNewCategory({ name: '', image: '', path: '', type: '' })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(c => c.id !== id))
    }
  }

  const openEdit = (category) => {
    setEditingCategory(category)
    setNewCategory(category)
    setIsModalOpen(true)
  }

  const openAdd = () => {
    setEditingCategory(null)
    setNewCategory({ name: '', image: '', path: '', type: '' })
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-8 pb-32">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="relative group max-w-md w-full">
             <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent" />
             <input 
               type="text" 
               placeholder="Search categories..." 
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
             <span>ADD NEW CATEGORY</span>
          </button>
       </div>

       <div className="bg-white border border-gray-100 overflow-x-auto rounded-none">
          <table className="w-full text-left border-collapse">
             <thead>
                <tr className="bg-gray-50 border-b border-gray-100 font-black text-[10px] uppercase tracking-widest text-gray-500">
                   <th className="px-8 py-6">CATEGORY</th>
                   <th className="px-8 py-6">PATH / IDENTIFIER</th>
                   <th className="px-8 py-6">PRODUCTS COUNT</th>
                   <th className="px-8 py-6 text-right">ACTIONS</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
                {filteredCategories.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors group">
                     <td className="px-8 py-4 flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gray-100 overflow-hidden ring-2 ring-transparent group-hover:ring-accent transition-all flex items-center justify-center">
                           {c.image ? <img src={c.image} alt={c.name} className="w-full h-full object-contain" /> : <ImageIcon className="text-gray-300" />}
                        </div>
                        <div>
                           <p className="text-sm font-black text-black uppercase">{c.name}</p>
                           <p className="text-[10px] font-bold text-gray-400 uppercase">ID: {c.id}</p>
                        </div>
                     </td>
                     <td className="px-8 py-4">
                        <span className="text-xs font-black text-gray-600 bg-gray-100 px-3 py-1 font-mono">{c.path}</span>
                     </td>
                     <td className="px-8 py-4">
                        <span className="text-sm font-black text-black">{c.count || 0} Items</span>
                     </td>
                     <td className="px-8 py-4 text-right">
                         <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(c)} className="p-3 bg-white text-black hover:bg-black hover:text-white border border-gray-100 transition-all shadow-sm">
                               <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(c.id)} className="p-3 bg-white text-red-500 hover:bg-red-500 hover:text-white border border-gray-100 transition-all shadow-sm">
                               <Trash2 size={16} />
                            </button>
                         </div>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
          {filteredCategories.length === 0 && (
            <div className="py-20 text-center space-y-4">
               <ImageIcon size={48} className="mx-auto text-gray-200" />
               <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No categories found</p>
            </div>
          )}
       </div>

       {isModalOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="bg-white max-w-2xl w-full relative z-10 p-10 shadow-2xl animate-zoom-in rounded-none border-t-8 border-accent">
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
                   <h3 className="text-2xl font-black uppercase tracking-tight">{editingCategory ? 'EDIT CATEGORY' : 'ADD NEW CATEGORY'}</h3>
                   <button onClick={() => setIsModalOpen(false)} className="p-2 border border-gray-100 hover:bg-gray-50">
                      <X size={20} />
                   </button>
                </div>

                <form onSubmit={handleCreateOrUpdate} className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CATEGORY DISPLAY NAME</label>
                         <input 
                           type="text" 
                           className="w-full bg-gray-50 border-none p-5 text-sm font-bold focus:ring-2 focus:ring-accent transition-all uppercase" 
                           placeholder="e.g. SUMMER COLLECTION" 
                           value={newCategory.name}
                           onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                           required
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">FILTER TYPE (Used in logic)</label>
                         <input 
                           type="text" 
                           className="w-full bg-gray-50 border-none p-5 text-sm font-bold focus:ring-2 focus:ring-accent transition-all" 
                           placeholder="e.g. Summer" 
                           value={newCategory.type}
                           onChange={(e) => setNewCategory({...newCategory, type: e.target.value})}
                           required
                         />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">LINK ROUTE PATH</label>
                      <input 
                        type="text" 
                        className="w-full bg-gray-50 border-none p-5 text-sm font-bold focus:ring-2 focus:ring-accent transition-all font-mono" 
                        placeholder="/products?category=Summer" 
                        value={newCategory.path}
                        onChange={(e) => setNewCategory({...newCategory, path: e.target.value})}
                        required
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">IMAGE URL</label>
                      <input 
                        type="text" 
                        className="w-full bg-gray-50 border-none p-5 text-sm font-bold focus:ring-2 focus:ring-accent transition-all" 
                        placeholder="/images/products/categories/summer.png" 
                        value={newCategory.image}
                        onChange={(e) => setNewCategory({...newCategory, image: e.target.value})}
                      />
                   </div>

                   <div className="flex space-x-4 pt-4">
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
                         {editingCategory ? 'SAVE CHANGES' : 'CREATE CATEGORY'}
                      </button>
                   </div>
                </form>
            </div>
         </div>
       )}
    </div>
  )
}

export default AdminCategories
