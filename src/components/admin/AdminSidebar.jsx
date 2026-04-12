import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { TrendingUp, Package, Layers, FileText, LogOut } from 'lucide-react'

const NAV_ITEMS = [
  { path: '/admin/dashboard',  label: 'Dashboard',   Icon: TrendingUp },
  { path: '/admin/products',   label: 'Products',    Icon: Package    },
  { path: '/admin/categories', label: 'Categories',  Icon: Layers     },
  { path: '/admin/invoices',   label: 'Invoice Gen', Icon: FileText   },
]

const AdminSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('admin_auth')
    navigate('/admin/login')
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-20">
      <div className="p-8 border-b border-gray-50">
        <h1 className="text-xl font-black tracking-tighter uppercase">Mingle Admin</h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map(({ path, label, Icon }) => {
          const active = location.pathname === path
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center space-x-3 p-3 font-black text-xs tracking-widest uppercase transition-all ${
                active
                  ? 'bg-black text-white shadow-lg'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-black'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 p-3 text-red-500 hover:bg-red-50 w-full transition-all font-black text-xs tracking-widest uppercase"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar
