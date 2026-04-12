import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, TrendingUp, Users, DollarSign, ArrowUpRight, Activity, Plus, Database, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { products as initialProducts } from '../../data/products'

const AdminDashboard = () => {
  const { products, categories, seedDatabase, fetchData } = useData()
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedResult, setSeedResult] = useState(null)

  const handleSeed = async () => {
    if (!window.confirm('This will push the current local data to your Supabase cloud database. Ensure you have run the SQL script in your Supabase dashboard first. Proceed?')) return;
    
    setIsSeeding(true)
    setSeedResult(null)
    
    // We get initial categories from the data context or fallback
    const result = await seedDatabase(categories, initialProducts)
    
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
      {/* DB Setup Warning (Only show if DB is empty) */}
      {products.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-8 space-y-4">
           <div className="flex items-center space-x-3 text-yellow-800">
              <AlertCircle size={24} />
              <h2 className="font-black uppercase tracking-tight text-xl">Cloud Database Connected</h2>
           </div>
           <p className="text-sm font-bold text-yellow-700 uppercase tracking-widest max-w-2xl">
              Your Supabase cloud database is connected but appears to be empty. Would you like to seed it with the default product catalog?
           </p>
           <div className="pt-4 flex items-center gap-6">
              <button 
                onClick={handleSeed}
                disabled={isSeeding}
                className="bg-black text-white px-8 py-4 font-black text-xs uppercase tracking-[0.2em] flex items-center space-x-3 hover:bg-yellow-600 transition-all disabled:opacity-50"
              >
                 <Database size={16} />
                 <span>{isSeeding ? 'SEEDING DATABASE...' : 'SEED CLOUD DATABASE'}</span>
              </button>
              {seedResult && (
                <div className={`flex items-center space-x-2 font-black text-xs uppercase ${seedResult.success ? 'text-green-600' : 'text-red-600'}`}>
                   {seedResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                   <span>{seedResult.success ? 'DATABASE INITIALIZED!' : 'ERROR: ' + seedResult.error}</span>
                </div>
              )}
           </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-black text-white rounded-none shadow-2xl relative overflow-hidden">
         <div className="relative z-10 space-y-2">
            <h1 className="text-3xl font-black tracking-tight">WELCOME BACK, SRIKANTH! 👋</h1>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Wear Mingle E-Commerce Operations are stable today.</p>
         </div>
         <div className="mt-6 md:mt-0 relative z-10 flex space-x-4">
            <Link to="/admin/products" className="bg-accent text-white px-8 py-3 font-black text-xs uppercase tracking-widest flex items-center space-x-2 shadow-xl hover:scale-105 transition-all">
               <Plus size={16} />
               <span>ADD NEW PRODUCT</span>
            </Link>
            <button onClick={fetchData} className="bg-white text-black px-8 py-3 font-black text-xs uppercase tracking-widest flex items-center space-x-2 border-l-4 border-accent hover:bg-gray-100 transition-all">
               <span>REFRESH CLOUD DATA</span>
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
                    <span className="text-[10px] font-black uppercase tracking-widest">STATS</span>
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
            <div className="space-y-6">
               {[
                 { id: '#WM-2024-001', customer: 'Ashok Kumar', item: 'Classic White Polo T-Shirt', amount: '₹1,198', status: 'Shipped', date: '2 mins ago' },
                 { id: '#WM-2024-002', customer: 'Deepika R.', item: 'Oversized Graphic Tee', amount: '₹799', status: 'Processing', date: '15 mins ago' },
                 { id: '#WM-2024-003', customer: 'Rahul Sharma', item: 'Striped Crew Neck', amount: '₹499', status: 'Delivered', date: '1h ago' },
                 { id: '#WM-2024-004', customer: 'Sneha L.', item: 'Kids Sporty Jersey', amount: '₹798', status: 'Pending', date: '3h ago' },
               ].map((order, i) => (
                 <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-gray-50 border-l-4 border-black hover:bg-gray-100 transition-all group">
                    <div className="space-y-1">
                       <p className="text-xs font-black text-gray-400 group-hover:text-black transition-colors">{order.id} • {order.customer}</p>
                       <p className="text-sm font-black text-black">{order.item}</p>
                    </div>
                    <div className="mt-4 sm:mt-0 text-right flex flex-col sm:items-end">
                       <span className="text-xs font-black bg-accent text-white px-3 py-1 mb-2 inline-block">STATUS: {order.status.toUpperCase()}</span>
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{order.date}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-white border border-gray-100 p-10">
            <h3 className="text-xl font-black uppercase tracking-widest mb-10 border-b-4 border-black pb-4 inline-block">LOW STOCK</h3>
            <div className="space-y-8">
               {products.length > 0 ? products.slice(0, 4).map((p, i) => (
                 <div key={i} className="flex items-center space-x-4 group">
                    <div className="w-16 h-16 bg-gray-100 relative overflow-hidden flex-shrink-0">
                       <img src={p.image} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                       <h5 className="text-xs font-black text-black uppercase mb-1">{p.name}</h5>
                       <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Only {i+2} Left</span>
                          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                       </div>
                    </div>
                 </div>
               )) : (
                 <p className="text-xs font-black text-gray-300 uppercase italic">No products in cloud database</p>
               )}
               <button className="w-full mt-10 border-2 border-black py-4 font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                  ALERTS CENTER
               </button>
            </div>
         </div>
      </div>
    </div>
  )
}

export default AdminDashboard
