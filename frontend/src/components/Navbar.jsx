import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  const handleNavClick = (e, targetId) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    
    // If we're not on home page, navigate there first
    if (location.pathname !== '/') {
      navigate('/')
      // Wait for navigation then scroll
      setTimeout(() => {
        const element = document.getElementById(targetId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } else {
      // Already on home page, just scroll
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="text-2xl md:text-3xl font-bold text-white hover:text-primary-blue-light transition-colors">
            Pixel AI
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <a
                  href="#features"
                  onClick={(e) => handleNavClick(e, 'features')}
                  className="text-gray-300 hover:text-primary-blue-light transition-colors font-medium cursor-pointer"
                >
                  Features
                </a>
                <Link
                  to="/profile"
                  className="text-gray-300 hover:text-primary-blue-light transition-colors font-medium"
                >
                  Gallery
                </Link>
                <a
                  href="#pricing"
                  onClick={(e) => handleNavClick(e, 'pricing')}
                  className="text-gray-300 hover:text-primary-blue-light transition-colors font-medium cursor-pointer"
                >
                  Pricing
                </a>
                <a
                  href="#faq"
                  onClick={(e) => handleNavClick(e, 'faq')}
                  className="text-gray-300 hover:text-primary-blue-light transition-colors font-medium cursor-pointer"
                >
                  FAQ
                </a>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-primary-blue-light transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="#features"
                  onClick={(e) => handleNavClick(e, 'features')}
                  className="text-gray-300 hover:text-primary-blue-light transition-colors font-medium cursor-pointer"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  onClick={(e) => handleNavClick(e, 'pricing')}
                  className="text-gray-300 hover:text-primary-blue-light transition-colors font-medium cursor-pointer"
                >
                  Pricing
                </a>
                <a
                  href="#faq"
                  onClick={(e) => handleNavClick(e, 'faq')}
                  className="text-gray-300 hover:text-primary-blue-light transition-colors font-medium cursor-pointer"
                >
                  FAQ
                </a>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-primary-blue-light transition-colors font-medium"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary-blue text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-blue-dark hover:shadow-lg hover:shadow-primary-blue/50 transition-all transform hover:scale-105 border-2 border-primary-blue-light"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-primary-blue-light transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 animate-slide-up">
            {isAuthenticated ? (
              <>
                <a
                  href="#features"
                  onClick={(e) => handleNavClick(e, 'features')}
                  className="block text-gray-300 hover:text-primary-blue-light transition-colors font-medium py-2 cursor-pointer"
                >
                  Features
                </a>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-300 hover:text-primary-blue-light transition-colors font-medium py-2"
                >
                  Gallery
                </Link>
                <a
                  href="#pricing"
                  onClick={(e) => handleNavClick(e, 'pricing')}
                  className="block text-gray-300 hover:text-primary-blue-light transition-colors font-medium py-2 cursor-pointer"
                >
                  Pricing
                </a>
                <a
                  href="#faq"
                  onClick={(e) => handleNavClick(e, 'faq')}
                  className="block text-gray-300 hover:text-primary-blue-light transition-colors font-medium py-2 cursor-pointer"
                >
                  FAQ
                </a>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-gray-300 hover:text-primary-blue-light transition-colors font-medium py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="#features"
                  onClick={(e) => handleNavClick(e, 'features')}
                  className="block text-gray-300 hover:text-primary-blue-light transition-colors font-medium py-2 cursor-pointer"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  onClick={(e) => handleNavClick(e, 'pricing')}
                  className="block text-gray-300 hover:text-primary-blue-light transition-colors font-medium py-2 cursor-pointer"
                >
                  Pricing
                </a>
                <a
                  href="#faq"
                  onClick={(e) => handleNavClick(e, 'faq')}
                  className="block text-gray-300 hover:text-primary-blue-light transition-colors font-medium py-2 cursor-pointer"
                >
                  FAQ
                </a>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-300 hover:text-primary-blue-light transition-colors font-medium py-2"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block bg-primary-blue text-white px-6 py-2.5 rounded-lg font-semibold text-center border-2 border-primary-blue-light"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar


