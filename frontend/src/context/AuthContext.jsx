import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  // Set up axios default header with token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // Optionally fetch user data here
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      const { token: newToken, user: userData } = response.data.data
      
      setToken(newToken)
      setUser(userData)
      localStorage.setItem('token', newToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  const signup = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/signup', { email, password })
      const { token: newToken, user: userData } = response.data.data
      
      setToken(newToken)
      setUser(userData)
      localStorage.setItem('token', newToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Signup failed' 
      }
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  const value = {
    user,
    token,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!token
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

