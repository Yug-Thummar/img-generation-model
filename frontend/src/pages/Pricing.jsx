import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

function Pricing() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const plans = [
    { price: 1, months: 1, description: '1 month of unlimited image generation' },
    { price: 2, months: 2, description: '2 months of unlimited image generation' },
    { price: 3, months: 3, description: '3 months of unlimited image generation' },
  ]

  const handleSubscribe = async (price) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/pricing' } })
      return
    }

    setLoading(true)
    setError('')

    try {
      // Convert price to paisa (1₹ = 100 paisa)
      const amountInPaisa = price * 100

      // Create order on backend
      const orderResponse = await api.post('/payment/create-order', { amount: amountInPaisa })
      
      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || 'Failed to create order')
      }

      const { orderId, keyId } = orderResponse.data.data

      // Initialize Razorpay checkout
      const options = {
        key: keyId,
        amount: amountInPaisa,
        currency: 'INR',
        name: 'Nano Banana',
        description: `${price}₹ - ${price} month${price > 1 ? 's' : ''} subscription`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyResponse = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })

            if (verifyResponse.data.success) {
              alert('Payment successful! Your subscription has been activated.')
              // Optionally refresh user data or redirect
              window.location.reload()
            } else {
              setError(verifyResponse.data.message || 'Payment verification failed')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            setError(error.response?.data?.message || 'Payment verification failed')
          } finally {
            setLoading(false)
          }
        },
        prefill: {
          email: '', // Can be populated from user data if available
        },
        theme: {
          color: '#3B82F6' // Primary blue
        },
        modal: {
          ondismiss: function() {
            setLoading(false)
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
      razorpay.on('payment.failed', function (response) {
        setError('Payment failed. Please try again.')
        setLoading(false)
      })

    } catch (error) {
      console.error('Subscribe error:', error)
      setError(error.response?.data?.message || error.message || 'Failed to initiate payment')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-blue/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-white">
              Simple, transparent
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary-blue via-primary-blue-light to-primary-blue bg-clip-text text-transparent">pricing</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Flexible plans designed to fit creators, growing teams and established brands.
          </p>
        </div>
        
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-center max-w-2xl mx-auto backdrop-blur-sm animate-fade-in">
            {error}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.price}
              className={`relative group ${
                index === 1 ? 'md:-mt-4 md:mb-4' : ''
              } animate-slide-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Glow effect for middle card */}
              {index === 1 && (
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-blue to-primary-blue-light rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              )}
              
              <div className={`relative bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border transition-all ${
                index === 1 
                  ? 'border-primary-blue/50 shadow-2xl shadow-primary-blue/20' 
                  : 'border-gray-700/50 hover:border-primary-blue/30'
              } hover:shadow-2xl`}>
                {index === 1 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-blue to-primary-blue-light text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <div className="mb-4">
                    <span className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-blue to-primary-blue-light bg-clip-text text-transparent">
                      ₹{plan.price}
                    </span>
                    <span className="text-gray-400 text-lg ml-2">/ {plan.months} Month{plan.months > 1 ? 's' : ''}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {plan.price === 1 ? 'Starter' : plan.price === 2 ? 'Growth' : 'Scale'}
                  </h3>
                  
                  <p className="text-gray-400 mb-8 min-h-[3rem]">
                    {plan.description}
                  </p>
                  
                  <ul className="text-left mb-8 space-y-3">
                    <li className="flex items-start text-gray-300">
                      <svg className="w-5 h-5 text-primary-blue-light mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Unlimited image generation
                    </li>
                    <li className="flex items-start text-gray-300">
                      <svg className="w-5 h-5 text-primary-blue-light mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      High-quality Pixel AI images
                    </li>
                    <li className="flex items-start text-gray-300">
                      <svg className="w-5 h-5 text-primary-blue-light mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Cloud storage included
                    </li>
                    <li className="flex items-start text-gray-300">
                      <svg className="w-5 h-5 text-primary-blue-light mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Download & share images
                    </li>
                  </ul>
                  
                  <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/login', { state: { from: '/pricing' } })
                    } else {
                      handleSubscribe(plan.price)
                    }
                  }}
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                      index === 1
                        ? 'bg-primary-blue text-white hover:bg-primary-blue-dark hover:shadow-lg hover:shadow-primary-blue/50 border-2 border-primary-blue-light'
                        : 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600'
                    }`}
                >
                  {loading ? 'Processing...' : 'Subscribe Now'}
                </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Pricing

