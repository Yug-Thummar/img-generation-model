import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SearchBox from '../components/SearchBox'
import api from '../utils/api'
import { initScrollAnimations } from '../utils/scrollAnimation'

function Home() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [generatedImage, setGeneratedImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [subscriptionLoading, setSubscriptionLoading] = useState(false)
  const [initialPrompt, setInitialPrompt] = useState('')
  const [error, setError] = useState('')
  const [subscriptionError, setSubscriptionError] = useState('')

  const handleGenerate = useCallback(async (prompt) => {
    if (!isAuthenticated) {
      // Save prompt to state and redirect to login
      navigate('/login', { state: { prompt, from: '/', action: 'generate' } })
      return
    }

    // User is authenticated, proceed with generation
    setLoading(true)
    setError('')
    setGeneratedImage(null)
    
    try {
      const response = await api.post('/generate', { prompt })
      
      if (response.data.success && response.data.data?.imageUrl) {
        setGeneratedImage(response.data.data.imageUrl)
      } else {
        setError(response.data.message || 'Failed to generate image')
      }
    } catch (error) {
      console.error('Generation error:', error)
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to generate image. Please try again.'
      setError(errorMessage)
      
      // If subscription issue, provide helpful message
      if (error.response?.status === 403) {
        setError('Your subscription has expired. Please purchase a plan to continue generating images.')
      } else if (error.response?.status === 401) {
        setError('Please log in to generate images.')
      }
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, navigate])

  // Check if user returned from login with a prompt
  useEffect(() => {
    if (location.state?.prompt && isAuthenticated) {
      const savedPrompt = location.state.prompt
      setInitialPrompt(savedPrompt)
      // Auto-trigger generation if action is 'generate'
      if (location.state.action === 'generate') {
        // Clear the state first to avoid re-triggering
        navigate(location.pathname, { replace: true, state: {} })
        // Then trigger generation
        handleGenerate(savedPrompt)
      } else {
        // Clear the state to avoid re-triggering
        navigate(location.pathname, { replace: true, state: {} })
      }
    }
  }, [location.state, isAuthenticated, navigate, handleGenerate])

  // Initialize scroll animations
  useEffect(() => {
    initScrollAnimations()
  }, [])

  // Handle subscription from home page
  const handleSubscribe = async (price) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/', section: 'pricing' } })
      return
    }

    setSubscriptionLoading(true)
    setSubscriptionError('')

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
        name: 'Pixel AI',
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
              window.location.reload()
            } else {
              setSubscriptionError(verifyResponse.data.message || 'Payment verification failed')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            setSubscriptionError(error.response?.data?.message || 'Payment verification failed')
          } finally {
            setSubscriptionLoading(false)
          }
        },
        prefill: {
          email: '',
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function() {
            setSubscriptionLoading(false)
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
      razorpay.on('payment.failed', function (response) {
        setSubscriptionError('Payment failed. Please try again.')
        setSubscriptionLoading(false)
      })

    } catch (error) {
      console.error('Subscribe error:', error)
      setSubscriptionError(error.response?.data?.message || error.message || 'Failed to initiate payment')
      setSubscriptionLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-blue/10 via-transparent to-primary-blue/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-blue/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
              <span className="text-white">
                We design & build
              </span>
              <br />
              <span className="text-white">
                high-impact AI images
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mt-6">
              A creative AI image generator helping creators and businesses bring their ideas to life through powerful AI technology.
            </p>
          </div>

          <div className="max-w-4xl mx-auto animate-slide-up">
            <SearchBox onGenerate={handleGenerate} loading={loading} initialPrompt={initialPrompt} />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {error && (
          <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-center backdrop-blur-sm animate-fade-in">
            {error}
          </div>
        )}
        
        {loading && (
          <div className="mt-12 flex flex-col items-center justify-center animate-fade-in">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700 border-t-primary-blue"></div>
              <div className="absolute inset-0 animate-pulse-slow rounded-full bg-primary-blue/20 blur-xl"></div>
            </div>
            <p className="mt-6 text-gray-400 text-lg">Generating your image...</p>
          </div>
        )}
        
        {generatedImage && !loading && (
          <div className="mt-12 flex flex-col items-center animate-fade-in">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-blue to-primary-blue-light rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <img 
                src={generatedImage} 
                alt="Generated" 
                className="relative max-w-full rounded-2xl shadow-2xl border-2 border-gray-700/50 transform group-hover:scale-[1.02] transition duration-300"
              />
            </div>
            <p className="mt-6 text-gray-400 text-sm">Your AI-generated image is ready!</p>
          </div>
        )}

        {/* Features Section */}
        <section id="features" className="mt-32 scroll-mt-20">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Everything your brand needs to</span>
              <br />
              <span className="bg-gradient-to-r from-primary-blue via-primary-blue-light to-primary-blue bg-clip-text text-transparent">
                grow
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From strategy to execution, we help businesses build strong digital products and meaningful customer experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-primary-blue/50 transition-all animate-fade-in-up hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-blue to-primary-blue-light rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-400">Generate stunning AI images in seconds with our powerful technology.</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-primary-blue/50 transition-all animate-fade-in-up hover:scale-105" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 bg-gradient-to-br from-primary-blue to-primary-blue-light rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">High Quality</h3>
              <p className="text-gray-400">Powered by Pixel AI for the highest quality image generation.</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-primary-blue/50 transition-all animate-fade-in-up hover:scale-105" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 bg-gradient-to-br from-primary-blue to-primary-blue-light rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure & Private</h3>
              <p className="text-gray-400">Your images are securely stored and only accessible by you.</p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="mt-32 scroll-mt-20">
          {subscriptionError && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-center max-w-2xl mx-auto backdrop-blur-sm animate-fade-in">
              {subscriptionError}
            </div>
          )}
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Simple, transparent</span>
              <br />
              <span className="bg-gradient-to-r from-primary-blue via-primary-blue-light to-primary-blue bg-clip-text text-transparent">
                pricing
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Flexible plans designed to fit creators, growing teams and established brands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { price: 1, months: 1, name: 'Starter', description: '1 month of unlimited image generation' },
              { price: 2, months: 2, name: 'Growth', description: '2 months of unlimited image generation', popular: true },
              { price: 3, months: 3, name: 'Scale', description: '3 months of unlimited image generation' }
            ].map((plan, index) => (
              <div
                key={plan.price}
                className={`relative group ${plan.popular ? 'md:-mt-4 md:mb-4' : ''} animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {plan.popular && (
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-blue to-primary-blue-light rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                )}
                
                <div className={`relative bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border transition-all hover:shadow-2xl ${
                  plan.popular 
                    ? 'border-primary-blue/50 shadow-2xl shadow-primary-blue/20' 
                    : 'border-gray-700/50 hover:border-primary-blue/30'
                }`}>
                  {plan.popular && (
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
                    
                    <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 mb-8 min-h-[3rem]">{plan.description}</p>
                    
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
                      onClick={() => handleSubscribe(plan.price)}
                      disabled={subscriptionLoading}
                      className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                        plan.popular
                          ? 'bg-primary-blue text-white hover:bg-primary-blue-dark hover:shadow-lg hover:shadow-primary-blue/50 border-2 border-primary-blue-light'
                          : 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600'
                      }`}
                    >
                      {subscriptionLoading ? 'Processing...' : (isAuthenticated ? 'Subscribe Now' : 'Get Started')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mt-32 scroll-mt-20 pb-20">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Frequently asked</span>
              <br />
              <span className="bg-gradient-to-r from-primary-blue via-primary-blue-light to-primary-blue bg-clip-text text-transparent">
                questions
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to know about Pixel AI. If you have more questions, feel free to reach out.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: 'What services does Pixel AI provide?',
                answer: 'We offer end-to-end AI image generation services including high-quality image creation, cloud storage, and download capabilities. Generate stunning images with just a text prompt.'
              },
              {
                question: 'Do you work with individuals or only businesses?',
                answer: 'We work with individuals, creators, growing businesses and established brands. Our process is flexible and tailored to match your goals and scale.'
              },
              {
                question: 'How long does it take to generate an image?',
                answer: 'Image generation typically takes between 10-30 seconds depending on the complexity of your prompt. Our lightning-fast technology ensures quick results.'
              },
              {
                question: 'Do you offer ongoing support after subscription?',
                answer: 'Yes. We offer continuous support, optimization and updates to ensure your experience continues to improve and evolve with the latest AI technology.'
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-primary-blue/30 transition-all animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-xl font-semibold text-white mb-3">{faq.question}</h3>
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home

