import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  Package, 
  Layers, 
  FileText, 
  LogOut, 
  ArrowUpRight, 
  TrendingUp, 
  Users, 
  ShoppingBag,
  RefreshCw,
  Plus
} from 'lucide-react'
import { useData } from '../../context/DataContext'
import { supabase } from '../../lib/supabase'

const AdminDashboard = () => {
  const { products, categories } = useData()
  const [isSyncing, setSyncing] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('admin_auth')
    navigate('/admin/login')
  }

  const handleSyncToCloud = async () => {
    if (!window.confirm('Do you want to sync all local products to your Supabase Cloud? This will not delete anything, only update or add products.')) return
    
    setSyncing(true)
    try {
      const { products: localProducts } = await import('../../data/products')
      
      // Map local data EXPLICITLY to database snake_case columns
      const dbReadyProducts = localProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        original_price: p.originalPrice || p.price,
        discount: p.discount || '',
        rating: p.rating || 4.5,
        reviews: p.reviews || 0,
        category: p.category,
        image: p.image,
        description: p.description || '',
        sizes: p.sizes || [],
        colors: p.colors || [],
        color_images: p.colorImages || {}
      }))
      
      // UPSERT products in batches
      const { error } = await supabase
        .from('products')
        .upsert(dbReadyProducts, { onConflict: 'id' })

      if (error) throw error
      alert('Cloud Sync Complete! All products are now in your Supabase database.')
    } catch (err) {
      alert('Sync Failed: ' + err.message + '. Please make sure you have created the tables in Supabase first.')
    } finally {
      setSyncing(false)
    }
  }

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'bg-blue-500' },
    { label: 'Categories', value: categories.length, icon: Layers, color: 'bg-purple-500' },
    { label: 'Total Invoices', value: '12', icon: FileText, color: 'bg-emerald-500' },
    { label: 'Site Visits', value: '1.2k', icon: TrendingUp, color: 'bg-orange-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-20">
        <div className="p-8 border-b border-gray-50">
          <h1 className="text-xl font-black tracking-tighter uppercase">Mingle Admin</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin/dashboard" className="flex items-center space-x-3 p-3 bg-black text-white rounded-none font-black text-xs tracking-widest uppercase">
            <TrendingUp size={16} />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/products" className="flex items-center space-x-3 p-3 text-gray-500 hover:bg-gray-50 transition-all font-black text-xs tracking-widest uppercase">
            <Package size={16} />
            <span>Products</span>
          </Link>
          <Link to="/admin/categories" className="flex items-center space-x-3 p-3 text-gray-500 hover:bg-gray-50 transition-all font-black text-xs tracking-widest uppercase">
            <Layers size={16} />
            <span>Categories</span>
          </Link>
          <Link to="/admin/invoices" className="flex items-center space-x-3 p-3 text-gray-500 hover:bg-gray-50 transition-all font-black text-xs tracking-widest uppercase">
            <FileText size={16} />
            <span>Invoice Gen</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-50">
           <button 
             onClick={handleLogout}
             className="flex items-center space-x-3 p-3 text-red-500 hover:bg-red-50 w-full transition-all font-black text-xs tracking-widest uppercase"
           >
             <LogOut size={16} />
             <span>Logout</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-black tracking-tighter uppercase">Control Center</h2>
            <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mt-1">Manage your catalog and operations</p>
          </div>

          <div className="flex items-center space-x-4">
             <button 
               onClick={handleSyncToCloud}
               className="bg-white border border-gray-200 px-6 h-12 flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest hover:border-black transition-all shadow-sm"
             >
                <RefreshCw size={14} className="text-blue-500" />
                <span>Sync to Cloud</span>
             </button>
             <Link 
               to="/admin/products/new"
               className="bg-black text-white px-6 h-12 flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all shadow-xl"
             >
                <Plus size={14} />
                <span>Add Product</span>
             </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-8 border border-gray-100 shadow-sm relative group overflow-hidden">
               <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-5 rounded-full -mr-8 -mt-8`}></div>
               <stat.icon className="text-gray-400 mb-4" size={24} />
               <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</h3>
               <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity / Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white p-8 border border-gray-100 shadow-sm">
             <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Live Catalog Status</h3>
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[11px] font-black tracking-widest text-gray-500 uppercase">Supabase Sync</span>
                   </div>
                   <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 font-black uppercase">Online</span>
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-[11px] font-black tracking-widest text-gray-500 uppercase">Cloudinary Storage</span>
                   </div>
                   <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 font-black uppercase">Connected</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                   <span className="text-[11px] font-black tracking-widest text-gray-500 uppercase">Last Database Update</span>
                   <span className="text-[10px] font-black text-gray-400 uppercase">2 minutes ago</span>
                </div>
             </div>
           </div>

           <div className="bg-black p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
              <h3 className="text-white text-sm font-black uppercase tracking-widest mb-2">Invoice Generator</h3>
              <p className="text-white/60 text-[11px] font-medium leading-relaxed mb-8 max-w-[280px]">Generate professional branded invoices for your WhatsApp orders in seconds.</p>
              <Link 
                to="/admin/invoices"
                className="inline-flex items-center space-x-3 bg-white text-black px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-accent hover:text-white transition-all"
              >
                 <span>Start Billing</span>
                 <ArrowUpRight size={14} />
              </Link>
           </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
