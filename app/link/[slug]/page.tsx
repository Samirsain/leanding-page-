'use client'

import { Suspense, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import LandingPage from '@/components/landing-page'

interface StoredLink {
  id: string
  url: string
  slug: string
  createdAt: string
}

// Inner component that uses useSearchParams (must be inside Suspense)
function LinkPageInner() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params.slug as string

  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ✅ Priority 1: Read redirect URL from ?r= query param
    // Works in ALL browsers — Facebook IAB, Instagram, Chrome, Safari, etc.
    // No localStorage needed, so sharing works cross-device and cross-session.
    const encodedUrl = searchParams.get('r')
    if (encodedUrl) {
      try {
        const decoded = decodeURIComponent(encodedUrl)
        setRedirectUrl(decoded)
        setLoading(false)
        return
      } catch {
        // decoding failed, fall through
      }
    }

    // ✅ Priority 2: Fallback to localStorage (backward compat for old links)
    try {
      const stored = localStorage.getItem('paisawin_links')
      if (stored) {
        const links: StoredLink[] = JSON.parse(stored)
        const foundLink = links.find((l) => l.slug === slug)
        if (foundLink) {
          setRedirectUrl(foundLink.url)
          setLoading(false)
          return
        }
      }
    } catch (err) {
      console.error('Error loading link from localStorage:', err)
    }

    // Nothing found
    setError(true)
    setLoading(false)
  }, [slug, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-blue-800 flex items-center justify-center">
        <div className="text-yellow-300 text-2xl font-bold animate-pulse">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-blue-800 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-8 max-w-sm text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Link Not Found</h1>
          <p className="text-gray-300 mb-6">This promotional link has expired or does not exist.</p>
          <a
            href="/"
            className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-lg transition"
          >
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  return <LandingPage redirectUrl={redirectUrl} />
}

// Suspense wrapper required by Next.js for useSearchParams
export default function LinkPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-blue-800 flex items-center justify-center">
          <div className="text-yellow-300 text-2xl font-bold animate-pulse">Loading...</div>
        </div>
      }
    >
      <LinkPageInner />
    </Suspense>
  )
}
