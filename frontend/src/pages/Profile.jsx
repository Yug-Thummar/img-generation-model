import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import ImageCard from '../components/ImageCard'

function Profile() {
  const { user, isAuthenticated } = useAuth()
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserImages()
    }
  }, [isAuthenticated])

  const fetchUserImages = async () => {
    try {
      const response = await api.get('/images')
      if (response.data.success && response.data.data) {
        setImages(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Please login to view your gallery</p>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-primary-blue to-primary-blue-light text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-blue/50 transition-all"
          >
            Sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-blue/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary-blue via-primary-blue-light to-primary-blue bg-clip-text text-transparent">
              My Gallery
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            {images.length > 0 
              ? `${images.length} ${images.length === 1 ? 'image' : 'images'} generated`
              : 'Your AI-generated images will appear here'
            }
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700 border-t-primary-blue"></div>
              <div className="absolute inset-0 animate-pulse-slow rounded-full bg-primary-blue/20 blur-xl"></div>
            </div>
            <p className="mt-6 text-gray-400 text-lg">Loading your gallery...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="inline-block p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50 mb-6">
              <svg className="w-16 h-16 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">No images yet</h3>
            <p className="text-gray-400 mb-6">Start creating amazing AI-generated images!</p>
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-primary-blue to-primary-blue-light text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-blue/50 transition-all transform hover:scale-105"
            >
              Generate Your First Image
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {images.map((image, index) => (
              <div
                key={image._id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ImageCard image={image} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile

