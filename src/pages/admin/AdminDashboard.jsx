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
import AdminSidebar from '../../components/admin/AdminSidebar'

const AdminDashboard = () => {
  const { products, categories } = useData()
  const [isSyncing, setSyncing] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('admin_auth')
    navigate('/admin/login')
  }



  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'bg-blue-500' },
    { label: 'Categories', value: categories.length, icon: Layers, color: 'bg-purple-500' },
    { label: 'Total Invoices', value: '12', icon: FileText, color: 'bg-emerald-500' },
    { label: 'Site Visits', value: '1.2k', icon: TrendingUp, color: 'bg-orange-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-black tracking-tighter uppercase">Control Center</h2>
            <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mt-1">Manage your catalog and operations</p>
          </div>

          <div className="flex items-center space-x-4">

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
