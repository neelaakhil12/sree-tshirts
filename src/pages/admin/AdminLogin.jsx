import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react'

const AdminLogin = ({ setIsAdminLoggedIn }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate API call
    setTimeout(() => {
      if (email === 'admin@wearmingle.com' && password === 'Admin@123') {
        setIsAdminLoggedIn(true)
        localStorage.setItem('admin_token', 'mingle_secret_token_123')
        navigate('/admin')
      } else {
        setError('Invalid email or password. Please try again.')
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-24">
       <div className="max-w-md w-full bg-white shadow-2xl p-10 md:p-14 space-y-10" data-aos="fade-up">
          <div className="text-center space-y-4">
             <span className="text-4xl font-black tracking-tighter text-black">
                WEAR <span className="text-accent">MINGLE</span>
             </span>
             <h2 className="text-xl font-black text-gray-400 uppercase tracking-widest">Admin Portal</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
             {error && (
               <div className="bg-red-50 text-red-600 p-4 font-bold text-xs uppercase tracking-widest border-l-4 border-red-500">
                  {error}
               </div>
             )}
             
             <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase">EMAIL ADDRESS</label>
                <div className="relative group">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent transition-colors" size={18} />
                   <input 
                     type="email" 
                     className="w-full bg-gray-50 border-none p-5 pl-12 text-sm font-bold placeholder-gray-300 focus:ring-2 focus:ring-accent transition-all" 
                     placeholder="admin@wearmingle.com"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                   />
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase">PASSWORD</label>
                <div className="relative group">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent transition-colors" size={18} />
                   <input 
                     type={showPassword ? 'text' : 'password'}
                     className="w-full bg-gray-50 border-none p-5 pl-12 text-sm font-bold placeholder-gray-300 focus:ring-2 focus:ring-accent transition-all" 
                     placeholder="••••••••"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                   />
                   <button 
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                   >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                   </button>
                </div>
             </div>

             <button 
               type="submit" 
               disabled={isLoading}
               className="w-full bg-black text-white h-16 rounded-none font-black uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-accent transition-all shadow-xl disabled:bg-gray-400"
             >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>SECURE LOGIN</span>
                    <ArrowRight size={18} />
                  </>
                )}
             </button>
          </form>

          <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-tight">
             Authorized Personnel Only <br />
             Contact Srikanth for access
          </p>
       </div>
    </div>
  )
}

export default AdminLogin
