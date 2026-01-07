import { useState, useEffect, useRef } from 'react'

function SearchBox({ onGenerate, loading, initialPrompt = '' }) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const inputRef = useRef(null)

  // Update prompt when initialPrompt changes (after redirect from login)
  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt)
    }
  }, [initialPrompt])

  // Auto-focus input when component mounts or when initialPrompt is set
  useEffect(() => {
    if (inputRef.current && initialPrompt) {
      inputRef.current.focus()
    }
  }, [initialPrompt])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (prompt.trim() && !loading) {
      onGenerate(prompt.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-3xl">
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-blue to-primary-blue-light rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
          
          <div className="relative flex items-center bg-gray-800/80 backdrop-blur-sm rounded-2xl px-6 py-5 shadow-2xl border border-gray-700/50 hover:border-primary-blue/30 transition-all">
            {/* Search icon */}
            <svg 
              className="w-6 h-6 text-primary-blue-light mr-4 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            
            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg md:text-xl"
              disabled={loading}
              autoFocus
            />
            
            {prompt && (
              <button
                type="button"
                onClick={() => {
                  setPrompt('')
                  inputRef.current?.focus()
                }}
                disabled={loading}
                className="ml-4 text-gray-400 hover:text-primary-blue-light transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Generate button */}
        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="group relative bg-gradient-to-r from-primary-blue to-primary-blue-light text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-primary-blue/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span className="relative z-10">
              {loading ? 'Generating...' : 'Generate Image'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-blue-light to-primary-blue rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </div>
    </form>
  )
}

export default SearchBox

