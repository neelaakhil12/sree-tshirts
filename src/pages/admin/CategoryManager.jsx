import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus, Edit2, Trash2, X, Save, Loader2,
  TrendingUp, Package, Layers, Upload, ImagePlus, ChevronRight
} from 'lucide-react'
import { useData } from '../../context/DataContext'
import { supabase } from '../../lib/supabase'
import AdminSidebar from '../../components/admin/AdminSidebar'

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

const uploadToCloudinary = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  const res = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData })
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.secure_url
}

const emptyCategory = { id: '', name: '', type: '', path: '', image: '' }

const CategoryManager = () => {
  const { categories, setCategories } = useData()
  const [modal, setModal] = useState(null) // null | { mode: 'add'|'edit', data: {} }
  const [isSaving, setIsSaving] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)

  /* ── Image Upload ── */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageUploading(true)
    try {
      const url = await uploadToCloudinary(file)
      setModal(prev => ({ ...prev, data: { ...prev.data, image: url } }))
    } catch (err) {
      alert('Image upload failed: ' + err.message)
    } finally {
      setImageUploading(false)
    }
  }

  /* ── Open Add ── */
  const openAdd = () => {
    setModal({ mode: 'add', data: { ...emptyCategory } })
  }

  /* ── Open Edit ── */
  const openEdit = (cat) => {
    setModal({ mode: 'edit', data: { ...cat } })
  }

  /* ── Save ── */
  const handleSave = async () => {
    const { mode, data } = modal
    if (!data.id.trim() || !data.name.trim() || !data.type.trim()) {
      return alert('Please fill in ID, Name, and Type fields.')
    }
    setIsSaving(true)
    try {
      if (mode === 'add') {
        const { error } = await supabase.from('categories').insert([{
          id: data.id.trim().toLowerCase().replace(/\s+/g, '-'),
          name: data.name.trim().toUpperCase(),
          type: data.type.trim(),
          path: data.path.trim() || `/products?category=${data.type.trim()}`,
          image: data.image || '',
        }])
        if (error) throw error
        setCategories(prev => [...prev, {
          ...data,
          id: data.id.trim().toLowerCase().replace(/\s+/g, '-'),
          name: data.name.trim().toUpperCase(),
          path: data.path.trim() || `/products?category=${data.type.trim()}`,
        }])
      } else {
        const { error } = await supabase.from('categories').update({
          name: data.name.trim().toUpperCase(),
          type: data.type.trim(),
          path: data.path.trim() || `/products?category=${data.type.trim()}`,
          image: data.image || '',
        }).eq('id', data.id)
        if (error) throw error
        setCategories(prev => prev.map(c =>
          c.id === data.id
            ? { ...data, name: data.name.trim().toUpperCase() }
            : c
        ))
      }
      setModal(null)
    } catch (err) {
      alert('Error saving category: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  /* ── Delete ── */
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? This cannot be undone.`)) return
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id)
      if (error) throw error
      setCategories(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      alert('Error deleting category: ' + err.message)
    }
  }

  /* ══════════════════════════════ RENDER ══════════════════════════════ */
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      {/* Main */}
      <main className="flex-1 ml-64 p-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center text-[10px] font-black tracking-widest text-gray-400 uppercase mb-4 space-x-2">
            <Link to="/admin/dashboard" className="hover:text-black">Dashboard</Link>
            <ChevronRight size={10} />
            <span className="text-black">Categories</span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black tracking-tighter uppercase">Category Manager</h2>
              <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mt-1">{categories.length} Categories</p>
            </div>
            <button onClick={openAdd}
              className="bg-black text-white px-8 h-12 flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all shadow-xl">
              <Plus size={16} /><span>New Category</span>
            </button>
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white border border-gray-100 shadow-sm overflow-hidden group hover:shadow-lg transition-all">
              {/* Category Image */}
              <div className="relative h-44 bg-gray-100 overflow-hidden">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImagePlus size={40} className="text-gray-200" />
                  </div>
                )}
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                  <button onClick={() => openEdit(cat)}
                    className="p-3 bg-white text-black hover:bg-accent hover:text-white transition-all shadow-xl">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-3 bg-red-500 text-white hover:bg-red-600 transition-all shadow-xl">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Category Info */}
              <div className="p-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-black mb-1">{cat.name}</h3>
                <div className="space-y-1 mt-2">
                  <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                    Type: <span className="text-gray-600">{cat.type}</span>
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                    Path: <span className="text-gray-600">{cat.path}</span>
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                    ID: <span className="text-gray-600">{cat.id}</span>
                  </p>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <button onClick={() => openEdit(cat)}
                    className="flex-1 flex items-center justify-center space-x-2 border border-gray-200 py-2 text-[10px] font-black uppercase tracking-widest hover:border-black hover:bg-black hover:text-white transition-all">
                    <Edit2 size={12} /><span>Edit</span>
                  </button>
                  <button onClick={() => handleDelete(cat.id, cat.name)}
                    className="flex-1 flex items-center justify-center space-x-2 border border-gray-200 py-2 text-[10px] font-black uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-all">
                    <Trash2 size={12} /><span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ════════════ ADD / EDIT MODAL ════════════ */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-black tracking-tighter uppercase">
                  {modal.mode === 'add' ? 'New Category' : 'Edit Category'}
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                  {modal.mode === 'add' ? 'Add a new storefront category' : `Editing: ${modal.data.name}`}
                </p>
              </div>
              <button onClick={() => setModal(null)} className="p-2 hover:bg-gray-100 transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div className="p-8 space-y-5">

              {/* Image Upload */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">Category Image</label>
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-200 flex-shrink-0 overflow-hidden">
                    {modal.data.image
                      ? <img src={modal.data.image} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><ImagePlus size={24} className="text-gray-300" /></div>
                    }
                  </div>
                  <label className={`flex-1 flex items-center justify-center space-x-2 border-2 border-dashed border-gray-200 cursor-pointer hover:border-black transition-all py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black ${imageUploading ? 'opacity-50' : ''}`}>
                    {imageUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    <span>{imageUploading ? 'Uploading...' : 'Upload to Cloudinary'}</span>
                    <input type="file" accept="image/*" className="hidden" disabled={imageUploading} onChange={handleImageUpload} />
                  </label>
                </div>
              </div>

              {/* ID (only for new) */}
              {modal.mode === 'add' && (
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">
                    Category ID <span className="text-gray-300 normal-case font-semibold">(unique slug, e.g. "hoodies")</span>
                  </label>
                  <input type="text" value={modal.data.id}
                    onChange={e => setModal(prev => ({ ...prev, data: { ...prev.data, id: e.target.value } }))}
                    placeholder="e.g. hoodies"
                    className="w-full bg-gray-50 border-none px-4 py-3 text-sm font-bold outline-none focus:ring-2 ring-black/10 transition-all" />
                </div>
              )}

              {/* Name */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Display Name</label>
                <input type="text" value={modal.data.name}
                  onChange={e => setModal(prev => ({ ...prev, data: { ...prev.data, name: e.target.value } }))}
                  placeholder="e.g. HOODIES RANGE"
                  className="w-full bg-gray-50 border-none px-4 py-3 text-sm font-bold outline-none focus:ring-2 ring-black/10 transition-all" />
              </div>

              {/* Type */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">
                  Type <span className="text-gray-300 normal-case font-semibold">(used to filter products)</span>
                </label>
                <input type="text" value={modal.data.type}
                  onChange={e => setModal(prev => ({ ...prev, data: { ...prev.data, type: e.target.value } }))}
                  placeholder="e.g. Hoodies"
                  className="w-full bg-gray-50 border-none px-4 py-3 text-sm font-bold outline-none focus:ring-2 ring-black/10 transition-all" />
              </div>

              {/* Path */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">
                  URL Path <span className="text-gray-300 normal-case font-semibold">(auto-generated if left blank)</span>
                </label>
                <input type="text" value={modal.data.path}
                  onChange={e => setModal(prev => ({ ...prev, data: { ...prev.data, path: e.target.value } }))}
                  placeholder="/products?category=Hoodies"
                  className="w-full bg-gray-50 border-none px-4 py-3 text-sm font-bold outline-none focus:ring-2 ring-black/10 transition-all" />
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-end space-x-4">
              <button onClick={() => setModal(null)}
                className="px-8 py-3 text-[10px] font-black uppercase tracking-widest border border-gray-200 hover:border-black transition-all">
                Cancel
              </button>
              <button onClick={handleSave} disabled={isSaving}
                className="px-8 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all flex items-center space-x-3 disabled:opacity-50">
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                <span>{isSaving ? 'Saving...' : modal.mode === 'add' ? 'Create Category' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryManager
