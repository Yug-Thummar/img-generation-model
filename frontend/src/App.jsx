import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Pricing from './pages/Pricing'
import Profile from './pages/Profile'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

