import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Search, X, Image as ImageIcon, Loader2, Upload } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { supabase } from '../../lib/supabase'
import { uploadToCloudinary } from '../../lib/cloudinary'

const AdminCategories = () => {
  const { categories, fetchData } = useData()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')

  const [formCategory, setFormCategory] = useState({
    name: '',
    image: '',
    path: '',
    type: ''
  })

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.type && c.type.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleImageUpload = async (file) => {
    try {
      setUploadStatus('Uploading...')
      const url = await uploadToCloudinary(file)
      setFormCategory({ ...formCategory, image: url })
      setUploadStatus('Done!')
      setTimeout(() => setUploadStatus(''), 2000)
    } catch (err) {
      alert('Upload failed: ' + err.message)
      setUploadStatus('Failed')
    }
  }

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const categoryData = {
      name: formCategory.name,
      image: formCategory.image,
      path: formCategory.path,
      type: formCategory.type
    }

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([categoryData])
        if (error) throw error
      }
      
      await fetchData()
      closeModal()
    } catch (err) {
      alert('Error saving category: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', id)
        if (error) throw error
        await fetchData()
      } catch (err) {
        alert('Error deleting category: ' + err.message)
      }
    }
  }

  const openEdit = (category) => {
    setEditingCategory(category)
    setFormCategory(category)
    setIsModalOpen(true)
  }

  const openAdd = () => {
    setEditingCategory(null)
    setFormCategory({ name: '', image: '', path: '', type: '' })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
    setUploadStatus('')
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
                   <th className="px-8 py-6 text-right">ACTIONS</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
                {filteredCategories.map((c) => (
                   <tr key={c.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-8 py-4 flex items-center space-x-4">
                         <div className="w-14 h-14 bg-gray-100 overflow-hidden ring-2 ring-transparent group-hover:ring-accent transition-all flex items-center justify-center italic tracking-tighter">
                            {c.image ? (
                               <img src={c.image} alt={c.name} className="w-full h-full object-contain mix-blend-multiply" />
                            ) : (
                               <ImageIcon className="text-gray-200" />
                            )}
                         </div>
                         <div>
                            <p className="text-sm font-black text-black uppercase">{c.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">ID: {c.id}</p>
                         </div>
                      </td>
                      <td className="px-8 py-4">
                         <span className="text-xs font-black text-gray-600 bg-teal-50 text-teal-700 px-3 py-1 font-mono uppercase">{c.path}</span>
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
            <div className="py-24 text-center space-y-4 bg-gray-50/50">
               <Loader2 size={48} className="mx-auto text-gray-200 animate-spin" />
               <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Awaiting Cloud Data...</p>
            </div>
          )}
       </div>

       {isModalOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>
            <div className="bg-white max-w-2xl w-full relative z-10 p-10 shadow-2xl animate-zoom-in rounded-none border-t-8 border-accent">
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
                   <h3 className="text-2xl font-black uppercase tracking-tight italic">
                      {editingCategory ? 'Edit Category' : 'New Category'}
                   </h3>
                   <button onClick={closeModal} className="p-2 border border-gray-100 hover:bg-gray-50">
                      <X size={20} />
                   </button>
                </div>

                <form onSubmit={handleCreateOrUpdate} className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">DISPLAY NAME</label>
                         <input 
                           type="text" 
                           className="w-full bg-gray-50 border-none p-5 text-sm font-bold focus:ring-2 focus:ring-accent transition-all uppercase" 
                           placeholder="e.g. T-SHIRTS" 
                           value={formCategory.name}
                           onChange={(e) => setFormCategory({...formCategory, name: e.target.value})}
                           required
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">FILTER TYPE / ID</label>
                         <input 
                           type="text" 
                           className="w-full bg-gray-50 border-none p-5 text-sm font-bold focus:ring-2 focus:ring-accent transition-all" 
                           placeholder="e.g. Tshirts" 
                           value={formCategory.type}
                           onChange={(e) => setFormCategory({...formCategory, type: e.target.value})}
                           required
                         />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">NAVIGATION PATH</label>
                      <input 
                        type="text" 
                        className="w-full bg-gray-50 border-none p-5 text-sm font-bold focus:ring-2 focus:ring-accent transition-all font-mono" 
                        placeholder="/products?category=Tshirts" 
                        value={formCategory.path}
                        onChange={(e) => setFormCategory({...formCategory, path: e.target.value})}
                        required
                      />
                   </div>

                   {/* CATEGORY IMAGE UPLOAD */}
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CATEGORY COVER IMAGE</label>
                      <div className="flex items-center space-x-6 bg-gray-50 p-6">
                         <div className="w-20 h-20 bg-white border border-gray-200 overflow-hidden flex items-center justify-center">
                            {formCategory.image ? (
                               <img src={formCategory.image} className="w-full h-full object-contain mix-blend-multiply" />
                            ) : (
                               <ImageIcon className="text-gray-200" size={32} />
                            )}
                         </div>
                         <div className="flex-1 space-y-2">
                            <label className="bg-black text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-accent transition-all inline-block">
                               <Upload size={14} className="inline mr-2" />
                               {formCategory.image ? 'CHANGE IMAGE' : 'UPLOAD IMAGE'}
                               <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e.target.files[0])}
                               />
                            </label>
                            {uploadStatus && <p className="text-[9px] font-black text-accent uppercase tracking-widest animate-pulse">{uploadStatus}</p>}
                         </div>
                      </div>
                   </div>

                   <div className="flex space-x-4 pt-10 border-t border-gray-100">
                      <button 
                        type="button" 
                        onClick={closeModal}
                        className="flex-1 border-2 border-black border-opacity-10 py-5 font-black text-xs uppercase tracking-widest"
                      >
                         CANCEL
                      </button>
                      <button 
                        type="submit" 
                        disabled={isLoading}
                        className="flex-1 bg-black text-white py-5 font-black text-xs uppercase tracking-widest hover:bg-accent transition-all shadow-xl flex items-center justify-center space-x-3 disabled:opacity-50"
                      >
                         {isLoading ? <Loader2 className="animate-spin" size={18} /> : (editingCategory ? 'UPDATE CLOUD' : 'SAVE TO CLOUD')}
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
