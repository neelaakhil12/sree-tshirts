import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, PlusCircle, LogOut, Search, User, Menu, X } from 'lucide-react'

const AdminLayout = ({ isLoggedIn }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Double check login status
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token && !isLoggedIn) {
      navigate('/admin/login')
    }
  }, [isLoggedIn, navigate])

  const menuItems = [
    { name: 'DASHBOARD', icon: LayoutDashboard, path: '/admin' },
    { name: 'PRODUCTS LIST', icon: ShoppingBag, path: '/admin/products' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    window.location.href = '/'
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`bg-black text-white h-full fixed md:relative z-50 transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-0 md:w-20'
        } overflow-hidden flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between">
           {isSidebarOpen ? (
             <span className="text-xl font-black tracking-tighter">
                WEAR <span className="text-accent underline decoration-white">MINGLE</span>
             </span>
           ) : (
             <span className="text-xl font-black text-accent text-center w-full">W</span>
           )}
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden text-white">
              <X size={20} />
           </button>
        </div>

        <div className="flex-1 mt-10 space-y-4">
           {menuItems.map((item) => (
             <Link 
               key={item.name} 
               to={item.path}
               className={`flex items-center space-x-4 px-6 py-4 transition-all hover:bg-gray-900 group ${
                 location.pathname === item.path ? 'bg-accent text-white' : 'text-gray-400'
               }`}
             >
               <item.icon size={20} className={location.pathname === item.path ? 'text-white' : 'group-hover:text-white'} />
               {isSidebarOpen && <span className="text-[11px] font-black tracking-widest uppercase">{item.name}</span>}
             </Link>
           ))}
        </div>

        <div className="p-6 border-t border-gray-900">
           <button 
             onClick={handleLogout}
             className="flex items-center space-x-4 px-2 py-4 w-full text-gray-500 hover:text-red-500 transition-colors"
           >
              <LogOut size={20} />
              {isSidebarOpen && <span className="text-[11px] font-black uppercase tracking-widest">LOGOUT</span>}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
         {/* Top Header */}
         <header className="h-20 bg-white shadow-sm flex items-center justify-between px-8 z-10 shrink-0">
            <div className="flex items-center space-x-4">
               <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-500 hover:text-black">
                  <Menu size={24} />
               </button>
               <h2 className="text-lg font-black tracking-widest uppercase">
                  {location.pathname === '/admin' ? 'Dashboard Overview' : 'Product Management'}
               </h2>
            </div>
            
            <div className="flex items-center space-x-6">
               <div className="hidden sm:flex bg-gray-100 p-2 pl-4 rounded-full min-w-[250px] items-center border border-transparent focus-within:border-accent group transition-all">
                  <Search size={16} className="text-gray-400 group-focus-within:text-accent" />
                  <input type="text" placeholder="Search orders, products..." className="bg-transparent border-none outline-none text-xs ml-3 w-full font-bold" />
               </div>
               <div className="flex items-center space-x-3 cursor-pointer">
                  <div className="text-right hidden sm:block">
                     <p className="text-xs font-black">Srikanth</p>
                     <p className="text-[10px] font-bold text-gray-400 uppercase">Owner / Admin</p>
                  </div>
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-black">
                     S
                  </div>
               </div>
            </div>
         </header>

         {/* Content Area */}
         <main className="flex-1 overflow-y-auto p-8">
            <div className="container mx-auto">
               <Outlet />
            </div>
         </main>
      </div>
    </div>
  )
}

export default AdminLayout
