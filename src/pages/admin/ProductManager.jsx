import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, Search, Edit2, Trash2, Filter, ExternalLink, ChevronRight,
  X, Save, Loader2, Upload, Palette, Ruler, Tag, ImagePlus
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

/* ─────────── TABS ─────────── */
const TABS = ['Basic Info', 'Colors', 'Features', 'Measurement Chart']

const ProductManager = () => {
  const { products, setProducts, categories, isLoaded } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [editProduct, setEditProduct] = useState(null)
  const [addModal, setAddModal] = useState(false)
  const [isBulkFeaturesMode, setIsBulkFeaturesMode] = useState(false)
  const [bulkFeaturesText, setBulkFeaturesText] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [imageUploading, setImageUploading] = useState(false)
  const [colorImageUploading, setColorImageUploading] = useState(null)

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id)
        if (error) throw error
        setProducts(prev => prev.filter(p => p.id !== id))
      } catch (err) {
        alert('Error deleting product: ' + err.message)
      }
    }
  }

  const handleEditOpen = (product) => {
    setIsBulkFeaturesMode(false)
    setBulkFeaturesText('')
    const defaultFeatures = [
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

    // Convert chart to dynamic { columns, rows } format
    const rawChart = product.measurementChart
    let chartData
    if (rawChart?.columns && rawChart?.rows) {
      chartData = rawChart // Already new format
    } else if (Array.isArray(rawChart) && rawChart.length > 0) {
      chartData = {
        columns: ['S', 'M', 'L', 'XL', 'XXL'],
        rows: rawChart.map(r => ({
          name: r.name,
          values: { S: r.s ?? '', M: r.m ?? '', L: r.l ?? '', XL: r.xl ?? '', XXL: r.xxl ?? '' }
        }))
      }
    } else {
      chartData = {
        columns: ['S', 'M', 'L', 'XL', 'XXL'],
        rows: [
          { name: 'Chest',    values: { S: 19, M: 20, L: 21, XL: 22, XXL: 23 } },
          { name: 'Length',   values: { S: 26, M: 27, L: 28, XL: 29, XXL: 30 } },
          { name: 'Shoulder', values: { S: 17.5, M: 18.5, L: 19.5, XL: 20.5, XXL: 21.5 } },
        ]
      }
    }

    setEditProduct({
      ...product,
      features: product.features?.length > 0 ? product.features : defaultFeatures,
      measurementChart: chartData,
      colors: product.colors || [],
      colorImages: product.colorImages || {},
    })
    setActiveTab(0)
  }

  /* ── Main image upload ── */
  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageUploading(true)
    try {
      const url = await uploadToCloudinary(file)
      setEditProduct(prev => ({ ...prev, image: url }))
    } catch (err) {
      alert('Image upload failed: ' + err.message)
    } finally {
      setImageUploading(false)
    }
  }

  /* ── Color image upload ── */
  const handleColorImageUpload = async (e, colorName) => {
    const file = e.target.files[0]
    if (!file) return
    setColorImageUploading(colorName)
    try {
      const url = await uploadToCloudinary(file)
      setEditProduct(prev => ({
        ...prev,
        colorImages: { ...prev.colorImages, [colorName]: url }
      }))
    } catch (err) {
      alert('Color image upload failed: ' + err.message)
    } finally {
      setColorImageUploading(null)
    }
  }

  /* ── Add new color ── */
  const addColor = () => {
    const name = prompt('Enter color name (e.g. "Dark Green"):')
    if (!name || !name.trim()) return
    const color = name.trim()
    if (editProduct.colors.includes(color)) return alert('Color already exists.')
    setEditProduct(prev => ({
      ...prev,
      colors: [...prev.colors, color],
    }))
  }

  const removeColor = (color) => {
    setEditProduct(prev => {
      const ci = { ...prev.colorImages }
      delete ci[color]
      return {
        ...prev,
        colors: prev.colors.filter(c => c !== color),
        colorImages: ci,
      }
    })
  }

  /* ── Features ── */
  const updateFeature = (index, key, value) => {
    const updated = [...editProduct.features]
    updated[index] = { ...updated[index], [key]: value }
    setEditProduct(prev => ({ ...prev, features: updated }))
  }

  const addFeature = () => {
    setEditProduct(prev => ({
      ...prev,
      features: [...prev.features, { label: '', value: '' }]
    }))
  }

  const removeFeature = (index) => {
    setEditProduct(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const toggleFeaturesMode = () => {
    if (isBulkFeaturesMode) {
      // Switching from Bulk to Standard: Parse text
      const lines = bulkFeaturesText.split('\n').filter(line => line.trim())
      const parsed = lines.map(line => {
        const firstColon = line.indexOf(':')
        if (firstColon !== -1) {
          return {
            label: line.substring(0, firstColon).trim(),
            value: line.substring(firstColon + 1).trim()
          }
        }
        return { label: 'Feature', value: line.trim() }
      })
      setEditProduct(prev => ({ ...prev, features: parsed }))
    } else {
      // Switching from Standard to Bulk: Create text
      const text = editProduct.features.map(f => `${f.label}: ${f.value}`).join('\n')
      setBulkFeaturesText(text)
    }
    setIsBulkFeaturesMode(!isBulkFeaturesMode)
  }

  /* ── Measurement Chart (Dynamic Columns) ── */
  const updateChartRow = (index, col, value) => {
    const updatedRows = [...editProduct.measurementChart.rows]
    if (col === 'name') {
      updatedRows[index] = { ...updatedRows[index], name: value }
    } else {
      updatedRows[index] = { ...updatedRows[index], values: { ...updatedRows[index].values, [col]: value } }
    }
    setEditProduct(prev => ({ ...prev, measurementChart: { ...prev.measurementChart, rows: updatedRows } }))
  }

  const addChartRow = () => {
    const emptyValues = {}
    editProduct.measurementChart.columns.forEach(col => { emptyValues[col] = '' })
    setEditProduct(prev => ({
      ...prev,
      measurementChart: {
        ...prev.measurementChart,
        rows: [...prev.measurementChart.rows, { name: '', values: emptyValues }]
      }
    }))
  }

  const removeChartRow = (index) => {
    setEditProduct(prev => ({
      ...prev,
      measurementChart: {
        ...prev.measurementChart,
        rows: prev.measurementChart.rows.filter((_, i) => i !== index)
      }
    }))
  }

  const addColumn = () => {
    const name = prompt('Enter new column name (e.g. "3XL"):')
    if (!name || !name.trim()) return
    const col = name.trim().toUpperCase()
    if (editProduct.measurementChart.columns.includes(col)) return alert('Column already exists.')
    setEditProduct(prev => ({
      ...prev,
      measurementChart: {
        columns: [...prev.measurementChart.columns, col],
        rows: prev.measurementChart.rows.map(row => ({ ...row, values: { ...row.values, [col]: '' } }))
      }
    }))
  }

  const removeColumn = (col) => {
    setEditProduct(prev => ({
      ...prev,
      measurementChart: {
        columns: prev.measurementChart.columns.filter(c => c !== col),
        rows: prev.measurementChart.rows.map(row => {
          const values = { ...row.values }
          delete values[col]
          return { ...row, values }
        })
      }
    }))
  }

  /* ── Save ── */
  const handleEditSave = async () => {
    setIsSaving(true)
    try {
      let currentFeatures = editProduct.features
      if (isBulkFeaturesMode) {
        // Parse current bulk text before saving
        const lines = bulkFeaturesText.split('\n').filter(line => line.trim())
        currentFeatures = lines.map(line => {
          const firstColon = line.indexOf(':')
          if (firstColon !== -1) {
            return {
              label: line.substring(0, firstColon).trim(),
              value: line.substring(firstColon + 1).trim()
            }
          }
          return { label: 'Feature', value: line.trim() }
        })
      }

      const payload = {
        id: editProduct.id,
        name: editProduct.name,
        category: editProduct.category,
        image: editProduct.image,
        description: editProduct.description || '',
        rating: parseFloat(editProduct.rating) || 4.5,
        reviews: parseInt(editProduct.reviews) || 0,
        sizes: editProduct.sizes || [],
        colors: editProduct.colors || [],
        color_images: editProduct.colorImages || {},
        features: currentFeatures || [],
        measurement_chart: editProduct.measurementChart || [],
      }

      const { error } = await supabase.from('products').update(payload).eq('id', editProduct.id)
      if (error) throw error

      setProducts(prev => prev.map(p =>
        p.id === editProduct.id
          ? { ...p, ...editProduct }
          : p
      ))
      setEditProduct(null)
    } catch (err) {
      alert('Error saving: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  /* ── Add New Product ── */
  const emptyNew = () => ({
    name: '', category: '', description: '', image: '',
    sizes: ['S','M','L','XL','XXL'], colors: [], colorImages: {},
    features: [], measurementChart: { columns: ['S','M','L','XL','XXL'], rows: [] }
  })
  const [newProduct, setNewProduct] = useState(emptyNew())
  const [newImageUploading, setNewImageUploading] = useState(false)

  const handleNewImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setNewImageUploading(true)
    try {
      const url = await uploadToCloudinary(file)
      setNewProduct(prev => ({ ...prev, image: url }))
    } catch (err) { alert('Upload failed: ' + err.message) }
    finally { setNewImageUploading(false) }
  }

  const handleAddProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.category.trim()) {
      return alert('Please fill in at least Name and Category.')
    }
    setIsSaving(true)
    try {
      const nextId = Math.max(0, ...products.map(p => Number(p.id) || 0)) + 1
      const payload = {
        id: nextId,
        name: newProduct.name.trim(),
        category: newProduct.category.trim(),
        description: newProduct.description || '',
        image: newProduct.image || '',
        price: 0, original_price: 0, rating: 4.5, reviews: 0,
        sizes: newProduct.sizes || [],
        colors: newProduct.colors || [],
        color_images: newProduct.colorImages || {},
        features: newProduct.features || [],
        measurement_chart: newProduct.measurementChart || [],
      }
      const { error } = await supabase.from('products').insert([payload])
      if (error) throw error
      setProducts(prev => {
        const exists = prev.some(p => p.id === payload.id);
        if (exists) return prev;
        return [...prev, {
          ...payload,
          originalPrice: 0,
          colorImages: payload.color_images,
          measurementChart: payload.measurement_chart,
        }];
      })
      setAddModal(false)
      setNewProduct(emptyNew())
    } catch (err) {
      alert('Error adding product: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  /* ══════════════════════════════ RENDER ══════════════════════════════ */
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      {/* Main */}
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
              <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mt-1">Total {products.length} Items</p>
            </div>
            <button
              onClick={() => setAddModal(true)}
              className="bg-black text-white px-8 h-12 flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all shadow-xl">
              <Plus size={16} /><span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-100 p-6 flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input type="text" placeholder="Search products..." value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border-none px-12 py-3 text-sm font-semibold outline-none transition-all" />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
              className="bg-gray-50 border-none pl-12 pr-10 py-3 text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer">
              <option value="All">All Categories</option>
              {categories.map(cat => <option key={cat.id} value={cat.type}>{cat.name}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
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
                <tr><td colSpan="3" className="px-8 py-20 text-center text-xs font-black text-gray-300 uppercase animate-pulse">Loading Catalog...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="3" className="px-8 py-20 text-center text-xs font-black text-gray-300 uppercase">No products found.</td></tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-50 border border-gray-100 p-1 flex-shrink-0">
                          <img src={product.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-tight text-gray-900">{product.name}</h4>
                          <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1">ID: #{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black bg-gray-100 px-3 py-1 uppercase tracking-widest text-gray-500">{product.category}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditOpen(product)} className="p-2 text-gray-400 hover:text-black hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                          <Trash2 size={16} />
                        </button>
                        <div className="h-4 w-[1px] bg-gray-200"></div>
                        <Link to={`/products/${product.id}`} target="_blank" className="p-2 text-gray-400 hover:text-blue-500 transition-all">
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

      {/* ════════════════ EDIT MODAL ════════════════ */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setEditProduct(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 flex-shrink-0">
              <div>
                <h3 className="text-lg font-black tracking-tighter uppercase">Edit Product</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">ID #{editProduct.id} • {editProduct.name}</p>
              </div>
              <button onClick={() => setEditProduct(null)} className="p-2 hover:bg-gray-100 transition-all rounded-sm"><X size={20} /></button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 flex-shrink-0">
              {TABS.map((tab, i) => (
                <button key={i} onClick={() => setActiveTab(i)}
                  className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 flex items-center space-x-2
                    ${activeTab === i ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                  {i === 0 && <Tag size={12} />}
                  {i === 1 && <Palette size={12} />}
                  {i === 2 && <Tag size={12} />}
                  {i === 3 && <Ruler size={12} />}
                  <span>{tab}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-8">

              {/* ── TAB 0: Basic Info ── */}
              {activeTab === 0 && (
                <div className="space-y-6">
                  {/* Main Image Upload */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">Main Product Image</label>
                    <div className="flex items-start space-x-6">
                      <div className="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center flex-shrink-0">
                        {editProduct.image
                          ? <img src={editProduct.image} alt="" className="w-full h-full object-contain mix-blend-multiply p-2" />
                          : <ImagePlus size={28} className="text-gray-300" />
                        }
                      </div>
                      <div className="flex-1 space-y-3">
                        <label className={`flex items-center space-x-3 px-6 py-3 border-2 border-dashed border-gray-200 cursor-pointer hover:border-black transition-all w-full justify-center text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black ${imageUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          {imageUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                          <span>{imageUploading ? 'Uploading...' : 'Upload Image to Cloudinary'}</span>
                          <input type="file" accept="image/*" className="hidden" disabled={imageUploading} onChange={handleMainImageUpload} />
                        </label>
                        <p className="text-[10px] text-gray-300 uppercase tracking-widest">Image uploads directly to your Cloudinary account.</p>
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Product Name</label>
                    <input type="text" value={editProduct.name || ''} onChange={e => setEditProduct(p => ({...p, name: e.target.value}))}
                      className="w-full bg-gray-50 px-4 py-3 text-sm font-bold outline-none focus:ring-2 ring-black/10 transition-all border-none" />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Category</label>
                    <select 
                      value={editProduct.category || ''} 
                      onChange={e => setEditProduct(p => ({...p, category: e.target.value}))}
                      className="w-full bg-gray-50 px-4 py-3 text-sm font-bold outline-none focus:ring-2 ring-black/10 transition-all border-none cursor-pointer appearance-none"
                    >
                      <option value="" disabled>Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.type}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Description</label>
                    <textarea rows={3} value={editProduct.description || ''} onChange={e => setEditProduct(p => ({...p, description: e.target.value}))}
                      className="w-full bg-gray-50 px-4 py-3 text-sm font-semibold outline-none focus:ring-2 ring-black/10 transition-all border-none resize-none" />
                  </div>
                </div>
              )}

              {/* ── TAB 1: Colors ── */}
              {activeTab === 1 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Color Variants ({editProduct.colors.length})</p>
                    <button onClick={addColor} className="flex items-center space-x-2 bg-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all">
                      <Plus size={12} /><span>Add Color</span>
                    </button>
                  </div>

                  {editProduct.colors.length === 0 ? (
                    <div className="py-12 text-center">
                      <Palette className="mx-auto text-gray-200 mb-4" size={40} />
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No colors yet. Click "Add Color" to start.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {editProduct.colors.map(color => (
                        <div key={color} className="flex items-center space-x-4 p-4 bg-gray-50 group">
                          {/* Color swatch */}
                          <div className="w-10 h-10 rounded-full border-2 border-white shadow-md flex-shrink-0 overflow-hidden">
                            {editProduct.colorImages?.[color]
                              ? <img src={editProduct.colorImages[color]} alt={color} className="w-full h-full object-cover" />
                              : <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[8px] font-black text-gray-400">?</div>
                            }
                          </div>

                          {/* Color name */}
                          <div className="flex-1">
                            <p className="text-xs font-black uppercase">{color}</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                              {editProduct.colorImages?.[color] ? 'Image uploaded' : 'No image'}
                            </p>
                          </div>

                          {/* Upload image for this color */}
                          <label className={`flex items-center space-x-2 px-4 py-2 border border-gray-200 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:border-black transition-all text-gray-500 hover:text-black ${colorImageUploading === color ? 'opacity-50' : ''}`}>
                            {colorImageUploading === color ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                            <span>{colorImageUploading === color ? 'Uploading...' : 'Upload Image'}</span>
                            <input type="file" accept="image/*" className="hidden" disabled={colorImageUploading !== null}
                              onChange={e => handleColorImageUpload(e, color)} />
                          </label>

                          {/* Remove color */}
                          <button onClick={() => removeColor(color)} className="p-2 text-gray-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB 2: Features ── */}
              {activeTab === 2 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Product Features</p>
                      <button 
                        onClick={toggleFeaturesMode}
                        className="text-[9px] font-black uppercase tracking-[0.2em] text-accent mt-1 hover:underline underline-offset-4"
                      >
                        {isBulkFeaturesMode ? 'Switch to Point-wise Mode' : 'Switch to Bulk Mode (Copy/Paste)'}
                      </button>
                    </div>
                    {!isBulkFeaturesMode && (
                      <button onClick={addFeature} className="flex items-center space-x-2 bg-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all">
                        <Plus size={12} /><span>Add Feature</span>
                      </button>
                    )}
                  </div>

                  {isBulkFeaturesMode ? (
                    <div className="space-y-4">
                      <textarea
                        value={bulkFeaturesText}
                        onChange={(e) => setBulkFeaturesText(e.target.value)}
                        placeholder="Format - Label: Value (e.g. Material: Cotton)"
                        rows={12}
                        className="w-full bg-gray-50 border-2 border-dashed border-gray-100 p-6 text-xs font-bold font-mono outline-none focus:border-black transition-all resize-none leading-relaxed"
                      />
                      <div className="bg-sky-50 p-4 border-l-4 border-sky-400">
                         <p className="text-[10px] text-sky-700 font-bold uppercase tracking-widest leading-relaxed">
                           💡 PASTE YOUR FEATURE LIST HERE. ONE FEATURE PER LINE IN "LABEL: VALUE" FORMAT (E.G. MATERIAL: COTTON). 
                           SWITCH BACK TO STANDARD MODE TO SEE THEM PARSED.
                         </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {editProduct.features.length === 0 ? (
                        <div className="py-12 text-center border-2 border-dashed border-gray-100">
                          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No features added yet</p>
                        </div>
                      ) : (
                        editProduct.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-3 group animate-in fade-in duration-300">
                            <input type="text" placeholder="Label (e.g. Material)" value={feature.label}
                              onChange={e => updateFeature(index, 'label', e.target.value)}
                              className="w-1/3 bg-gray-50 border-none px-4 py-3 text-xs font-black outline-none focus:ring-2 ring-black/10 transition-all" />
                            <input type="text" placeholder="Value (e.g. 100% Polyester)" value={feature.value}
                              onChange={e => updateFeature(index, 'value', e.target.value)}
                              className="flex-1 bg-gray-50 border-none px-4 py-3 text-xs font-semibold outline-none focus:ring-2 ring-black/10 transition-all" />
                            <button onClick={() => removeFeature(index)} className="p-2 text-gray-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                              <X size={16} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB 3: Measurement Chart ── */}
              {activeTab === 3 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Chart — {editProduct.measurementChart.rows.length} rows · {editProduct.measurementChart.columns.length} columns
                    </p>
                    <div className="flex items-center space-x-2">
                      <button onClick={addColumn}
                        className="flex items-center space-x-2 border border-black text-black px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                        <Plus size={12} /><span>Add Column</span>
                      </button>
                      <button onClick={addChartRow}
                        className="flex items-center space-x-2 bg-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all">
                        <Plus size={12} /><span>Add Row</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="text-xs border border-gray-100" style={{minWidth: '100%'}}>
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 text-left min-w-[120px]">Measurement</th>
                          {editProduct.measurementChart.columns.map(col => (
                            <th key={col} className="px-3 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 text-center min-w-[70px]">
                              <div className="flex items-center justify-center space-x-1 group">
                                <span>{col}</span>
                                <button onClick={() => removeColumn(col)}
                                  className="text-gray-200 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                                  <X size={10} />
                                </button>
                              </div>
                            </th>
                          ))}
                          <th className="w-8 border-b border-gray-100"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {editProduct.measurementChart.rows.map((row, index) => (
                          <tr key={index} className="group hover:bg-gray-50">
                            <td className="p-2">
                              <input type="text" value={row.name || ''} placeholder="e.g. Chest"
                                onChange={e => updateChartRow(index, 'name', e.target.value)}
                                className="w-full bg-white border border-gray-100 px-3 py-2 text-xs font-bold outline-none focus:border-black transition-all" />
                            </td>
                            {editProduct.measurementChart.columns.map(col => (
                              <td key={col} className="p-2">
                                <input type="number" value={row.values?.[col] ?? ''}
                                  onChange={e => updateChartRow(index, col, e.target.value)}
                                  className="w-full bg-white border border-gray-100 px-3 py-2 text-xs font-bold outline-none focus:border-black text-center transition-all" />
                              </td>
                            ))}
                            <td className="p-2 text-center">
                              <button onClick={() => removeChartRow(index)}
                                className="p-1 text-gray-200 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                                <X size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-between flex-shrink-0 bg-white">
              <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Changes sync directly to Supabase</p>
              <div className="flex items-center space-x-4">
                <button onClick={() => setEditProduct(null)} className="px-8 py-3 text-[10px] font-black uppercase tracking-widest border border-gray-200 hover:border-black transition-all">
                  Cancel
                </button>
                <button onClick={handleEditSave} disabled={isSaving}
                  className="px-8 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all flex items-center space-x-3 disabled:opacity-50">
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════ ADD PRODUCT MODAL ════════════ */}
      {addModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setAddModal(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 flex-shrink-0">
              <div>
                <h3 className="text-lg font-black tracking-tighter uppercase">Add New Product</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">New product will sync to Supabase</p>
              </div>
              <button onClick={() => setAddModal(false)} className="p-2 hover:bg-gray-100 transition-all"><X size={20} /></button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-8 space-y-5">

              {/* Image Upload */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">Product Image</label>
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {newProduct.image
                      ? <img src={newProduct.image} alt="" className="w-full h-full object-contain mix-blend-multiply p-1" />
                      : <ImagePlus size={24} className="text-gray-300" />}
                  </div>
                  <label className={`flex-1 flex items-center justify-center space-x-2 border-2 border-dashed border-gray-200 cursor-pointer hover:border-black transition-all py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black ${newImageUploading ? 'opacity-50' : ''}`}>
                    {newImageUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    <span>{newImageUploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" className="hidden" disabled={newImageUploading} onChange={handleNewImageUpload} />
                  </label>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Product Name *</label>
                <input type="text" value={newProduct.name}
                  onChange={e => setNewProduct(p => ({...p, name: e.target.value}))}
                  placeholder="e.g. Premium Cotton Round Neck T-shirt"
                  className="w-full bg-gray-50 px-4 py-3 text-sm font-bold outline-none focus:ring-2 ring-black/10 border-none" />
              </div>

              {/* Category */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Category *</label>
                <select 
                  value={newProduct.category}
                  onChange={e => setNewProduct(p => ({...p, category: e.target.value}))}
                  className="w-full bg-gray-50 px-4 py-3 text-sm font-bold outline-none focus:ring-2 ring-black/10 border-none cursor-pointer appearance-none"
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.type}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Description</label>
                <textarea rows={3} value={newProduct.description}
                  onChange={e => setNewProduct(p => ({...p, description: e.target.value}))}
                  placeholder="Short product description..."
                  className="w-full bg-gray-50 px-4 py-3 text-sm font-semibold outline-none focus:ring-2 ring-black/10 border-none resize-none" />
              </div>

              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-4 py-3">
                💡 After creating, open the Edit modal to add colors, features, and measurement chart.
              </p>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-end space-x-4 flex-shrink-0">
              <button onClick={() => setAddModal(false)} className="px-8 py-3 text-[10px] font-black uppercase tracking-widest border border-gray-200 hover:border-black transition-all">
                Cancel
              </button>
              <button onClick={handleAddProduct} disabled={isSaving}
                className="px-8 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all flex items-center space-x-3 disabled:opacity-50">
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                <span>{isSaving ? 'Creating...' : 'Create Product'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductManager
