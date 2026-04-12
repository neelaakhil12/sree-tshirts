import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, ChevronRight, Loader2 } from 'lucide-react'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // MOCK LOGIN FOR INITIAL SETUP
    // In production, this will use Supabase Auth
    setTimeout(() => {
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
      const adminPass = import.meta.env.VITE_ADMIN_PASSWORD

      if (email === adminEmail && password === adminPass) {
        localStorage.setItem('admin_auth', 'true')
        navigate('/admin/dashboard')
      } else {
        setError('Invalid credentials. Please check your email and password.')
      }
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Background Design */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full -mr-64 -mt-64 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>

      <div className="w-full max-w-md relative">
        {/* Branding */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tighter text-black mb-2 uppercase">Wear Mingle</h1>
          <p className="text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase">Admin Control Center</p>
        </div>

        <div className="bg-white border border-gray-100 shadow-2xl p-10 space-y-8 relative group">
          <div className="absolute top-0 left-0 w-1 h-0 bg-black transition-all duration-700 group-hover:h-full"></div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tighter">Sign In</h2>
            <p className="text-xs text-gray-400 font-medium">Please enter your administrative credentials.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block transition-colors group-focus-within:text-black">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border-transparent border-b-2 border-b-gray-100 px-12 py-4 text-sm font-semibold focus:bg-white focus:border-b-black outline-none transition-all placeholder:text-gray-300"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block transition-colors group-focus-within:text-black">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border-transparent border-b-2 border-b-gray-100 px-12 py-4 text-sm font-semibold focus:bg-white focus:border-b-black outline-none transition-all placeholder:text-gray-300"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 animate-shake">
                <p className="text-[11px] font-black text-red-600 uppercase tracking-widest">{error}</p>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white h-14 font-black tracking-[0.2em] uppercase text-xs flex items-center justify-center space-x-3 hover:bg-accent transition-all group disabled:opacity-50 disabled:cursor-not-allowed shadow-xl active:scale-95"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <span>Unlock Dashboard</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-4">
             <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">Authorized Personal Only • Logged IP Security Active</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
