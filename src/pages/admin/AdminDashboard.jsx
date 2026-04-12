import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, TrendingUp, Users, DollarSign, ArrowUpRight, Activity, Plus, Database, AlertCircle, CheckCircle2, CloudLightning } from 'lucide-react'
import { useData } from '../../context/DataContext'

const AdminDashboard = () => {
  const { products, isCloudSync, seedDatabase, fetchData } = useData()
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedResult, setSeedResult] = useState(null)

  const handleSeed = async () => {
    if (!window.confirm('This will sync your entire catalog to the Supabase Cloud. It will replace any existing cloud data to ensure consistency. Proceed?')) return;
    
    setIsSeeding(true)
    setSeedResult(null)
    
    const result = await seedDatabase()
    
    setIsSeeding(false)
    setSeedResult(result)
    
    if (result.success) {
      setTimeout(() => setSeedResult(null), 5000)
    }
  }

  const stats = [
    { id: 1, title: 'TOTAL PRODUCTS', value: products.length, icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50', change: '+2 new' },
    { id: 2, title: 'TODAY\'S SALES', value: '₹12,450', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50', change: '+15.2% vs yesterday' },
    { id: 3, title: 'NEW CUSTOMERS', value: '48', icon: Users, color: 'text-orange-500', bg: 'bg-orange-50', change: '+5 since morning' },
    { id: 4, title: 'TOTAL REVENUE', value: '₹4,82,900', icon: DollarSign, color: 'text-purple-500', bg: 'bg-purple-50', change: '84% target reached' },
  ];

  return (
    <div className="space-y-12 pb-24">
      {/* Cloud Status Banner */}
      {!isCloudSync ? (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-8 space-y-4 shadow-sm">
           <div className="flex items-center space-x-3 text-orange-800">
              <CloudLightning size={24} className="animate-pulse" />
              <h2 className="font-black uppercase tracking-tight text-xl italic">Database Sync Required</h2>
           </div>
           <p className="text-sm font-bold text-orange-700 uppercase tracking-widest max-w-2xl">
              You are currently viewing local data. To enable cloud editing, you must sync your products and categories to your new Supabase database.
           </p>
           <div className="pt-4 flex items-center gap-6">
              <button 
                onClick={handleSeed}
                disabled={isSeeding}
                className="bg-orange-600 text-white px-8 py-4 font-black text-xs uppercase tracking-[0.2em] flex items-center space-x-3 hover:bg-black transition-all disabled:opacity-50 shadow-xl"
              >
                 <Database size={16} />
                 <span>{isSeeding ? 'SYNCING CATALOG...' : 'SYNC ALL TO CLOUD'}</span>
              </button>
              {seedResult && (
                <div className={`flex items-center space-x-2 font-black text-xs uppercase ${seedResult.success ? 'text-green-600' : 'text-red-600'}`}>
                   {seedResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                   <span>{seedResult.success ? 'SYNC COMPLETE!' : 'ERROR: ' + seedResult.error}</span>
                </div>
              )}
           </div>
        </div>
      ) : (
        <div className="bg-teal-50 border-l-4 border-teal-500 p-6 flex items-center justify-between">
           <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-black text-teal-800 uppercase tracking-widest">Connected to Cloud Database (Active)</span>
           </div>
           <button onClick={fetchData} className="text-teal-600 text-[10px] font-black uppercase tracking-widest border-b border-teal-200">Refetch Live Data</button>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-black text-white rounded-none shadow-2xl relative overflow-hidden">
         <div className="relative z-10 space-y-2">
            <h1 className="text-3xl font-black tracking-tight tracking-tighter uppercase italic">WELCOME BACK, SRIKANTH! 👋</h1>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Wear Mingle Operational Hub: 100% Operational</p>
         </div>
         <div className="mt-6 md:mt-0 relative z-10 flex space-x-4">
            <Link to="/admin/products" className="bg-accent text-white px-8 py-3 font-black text-xs uppercase tracking-widest flex items-center space-x-2 shadow-xl hover:scale-105 transition-all">
               <Plus size={16} />
               <span>NEW MINGLE</span>
            </Link>
            <button className="bg-white text-black px-8 py-3 font-black text-xs uppercase tracking-widest flex items-center space-x-2 border-l-4 border-accent hover:bg-gray-100 transition-all">
               <span>ANALYTICS</span>
            </button>
         </div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -z-0 transform translate-x-20 -translate-y-20"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
         {stats.map((item) => (
           <div key={item.id} className="bg-white p-8 border border-gray-100 hover:border-accent hover:-translate-y-2 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                 <div className={`p-3 ${item.bg} ${item.color} rounded-none`}>
                    <item.icon size={28} />
                 </div>
                 <div className="flex items-center space-x-1 text-green-500 group cursor-pointer hover:text-black transition-colors">
                    <span className="text-[10px] font-black uppercase tracking-widest">VIEW</span>
                    <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                 </div>
              </div>
              <div className="space-y-1">
                 <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">{item.title}</h4>
                 <p className="text-3xl font-black tracking-tighter text-black">{item.value}</p>
                 <p className="text-[10px] font-bold text-gray-500 mt-2 flex items-center space-x-1 uppercase tracking-tight">
                    <Activity size={12} className="text-accent" />
                    <span>{item.change}</span>
                 </p>
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white border border-gray-100 p-10">
            <div className="flex items-center justify-between mb-10">
               <h3 className="text-xl font-black uppercase tracking-widest underline decoration-accent decoration-4 underline-offset-8">RECENT ORDERS</h3>
               <button className="text-accent font-black text-xs uppercase tracking-widest border-b border-accent pb-1">VIEW ALL</button>
            </div>
            <div className="space-y-6 text-gray-300 italic uppercase font-black text-xs text-center py-20 bg-gray-50 border-2 border-dashed border-gray-100">
               Incoming Order Stream Offline
            </div>
         </div>

         <div className="bg-white border border-gray-100 p-10">
            <h3 className="text-xl font-black uppercase tracking-widest mb-10 border-b-4 border-black pb-4 inline-block italic font-serif">Low Stock Alert</h3>
            <div className="space-y-8">
               {products.length > 0 ? products.slice(0, 4).map((p, i) => (
                 <div key={i} className="flex items-center space-x-4 group">
                    <div className="w-16 h-16 bg-gray-100 relative overflow-hidden flex-shrink-0">
                       <img src={p.image} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                       <h5 className="text-xs font-black text-black uppercase mb-1">{p.name}</h5>
                       <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Only {i+2} Left</span>
                    </div>
                 </div>
               )) : (
                 <p className="text-xs font-black text-gray-300 uppercase italic">No products loaded</p>
               )}
            </div>
         </div>
      </div>
    </div>
  )
}

export default AdminDashboard
