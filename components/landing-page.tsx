'use client'

import { useEffect, useRef } from 'react'

interface LandingPageProps {
  redirectUrl?: string | null
}

export default function LandingPage({ redirectUrl }: LandingPageProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate floating elements positions
  const floatingElements = [
    { type: 'dice', left: '5%', top: '10%', delay: 0 },
    { type: 'coin', left: '85%', top: '15%', delay: 1 },
    { type: 'coin', left: '10%', top: '50%', delay: 2 },
    { type: 'card', left: '80%', top: '45%', delay: 1.5 },
    { type: 'trophy', left: '15%', top: '70%', delay: 0.5 },
    { type: 'dice', left: '75%', top: '60%', delay: 2 },
    { type: 'puzzle', left: '85%', top: '75%', delay: 1 },
    { type: 'coin', left: '12%', top: '25%', delay: 1.5 },
  ]

  const handleRegisterClick = () => {
    if (redirectUrl) {
      window.location.href = redirectUrl
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full bg-gradient-to-b from-blue-900 via-purple-800 to-blue-800 overflow-hidden flex flex-col items-center justify-center px-4 py-8"
    >
      {/* Animated background elements */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
      `}</style>

      {/* Floating gaming elements background */}
      {floatingElements.map((elem, idx) => (
        <div
          key={idx}
          className="absolute opacity-40 animate-float pointer-events-none"
          style={{
            left: elem.left,
            top: elem.top,
            animationDelay: `${elem.delay}s`,
            fontSize: '2.5rem',
          }}
        >
          {elem.type === 'dice' && '🎲'}
          {elem.type === 'coin' && '🪙'}
          {elem.type === 'card' && '🎴'}
          {elem.type === 'trophy' && '🏆'}
          {elem.type === 'puzzle' && '🧩'}
        </div>
      ))}

      {/* Sparkle effects */}
      <div className="absolute top-20 left-10 text-2xl opacity-60 animate-pulse">✨</div>
      <div className="absolute top-32 right-12 text-2xl opacity-60 animate-pulse" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute bottom-40 left-1/4 text-2xl opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }}>✨</div>
      <div className="absolute bottom-32 right-1/4 text-2xl opacity-60 animate-pulse" style={{ animationDelay: '1.5s' }}>✨</div>

      {/* Main content container */}
      <div className="relative z-10 max-w-sm w-full text-center space-y-6">
        {/* Title with crown */}
        <div className="space-y-2">
          <div className="text-6xl font-black text-yellow-300 drop-shadow-lg">
            PAISAWIN
          </div>
          <div className="text-3xl font-bold text-white drop-shadow-lg">
            INSTANT
          </div>
          <div className="text-5xl font-black text-yellow-300 drop-shadow-lg flex items-center justify-center gap-2">
            <span>₹225</span>
          </div>
        </div>

        {/* Bonus text */}
        <p className="text-white text-sm font-semibold">WELCOME BONUS</p>

        {/* Phone mockup with content */}
        <div className="relative mx-auto my-6">
          {/* Phone frame */}
          <div className="bg-gray-900 rounded-3xl border-8 border-gray-800 shadow-2xl w-56 mx-auto overflow-hidden">
            {/* Phone notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-20"></div>

            {/* Phone screen with app image */}
            <div className="p-0 rounded-2xl overflow-hidden bg-black">
              <img 
                src="/paisawin-app.jpeg" 
                alt="PAISAWIN app screenshot" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Celebrating characters */}
          <div className="absolute -left-4 -bottom-2 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>
            🎉
          </div>
          <div className="absolute -right-4 -bottom-2 text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>
            🎊
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-3xl">
            👑
          </div>
        </div>

        {/* Register button */}
        <button
          onClick={handleRegisterClick}
          className="w-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-black text-xl py-4 rounded-full shadow-lg transform transition hover:scale-105 active:scale-95 drop-shadow-xl border-2 border-orange-700"
        >
          REGISTER NOW!
        </button>

        {/* Trust badges */}
        <div className="space-y-3 mt-8">
          <div className="text-white text-sm font-bold">
            100+ Games | Safe & Secure
          </div>
          <div className="text-gray-200 text-xs">
            18+ Only
          </div>
        </div>

        {/* Additional trust info */}
        <div className="mt-6 pt-4 border-t border-white/20">
          <p className="text-xs text-gray-200">
            ✓ Instant Withdrawal • ✓ Licensed • ✓ Fair Gaming
          </p>
        </div>
      </div>
    </div>
  )
}
