import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (isAuthenticated) {
      // If user is already authenticated, redirect based on location state
      const state = location.state
      if (state?.from) {
        navigate(state.from, { state: { prompt: state.prompt, action: state.action } })
      } else {
        navigate('/')
      }
    }
  }, [isAuthenticated, navigate, location])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      // Redirect based on location state
      const state = location.state
      if (state?.from) {
        navigate(state.from, { state: { prompt: state.prompt, action: state.action } })
      } else if (state?.section) {
        // If coming from a section link, navigate to home and scroll
        navigate('/')
        setTimeout(() => {
          const element = document.getElementById(state.section)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
      } else {
        navigate('/')
      }
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-blue/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-blue to-primary-blue-light rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
          
          <div className="relative bg-gray-800/80 backdrop-blur-sm p-8 md:p-10 rounded-2xl border border-gray-700/50 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                <span className="bg-gradient-to-r from-primary-blue via-primary-blue-light to-primary-blue bg-clip-text text-transparent">
                  Sign in
                </span>
              </h1>
              <p className="text-gray-400">Welcome back to Pixel AI</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-gray-300 mb-2 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-gray-300 mb-2 font-medium">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-blue text-white py-3 px-6 rounded-xl font-semibold hover:bg-primary-blue-dark hover:shadow-lg hover:shadow-primary-blue/50 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-2 border-primary-blue-light"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <p className="mt-6 text-center text-gray-400">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                state={location.state}
                className="text-primary-blue-light hover:text-primary-blue font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

