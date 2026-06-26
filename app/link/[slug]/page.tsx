'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import LandingPage from '@/components/landing-page'

interface StoredLink {
  id: string
  url: string
  slug: string
  createdAt: string
}

export default function LinkPage() {
  const params = useParams()
  const slug = params.slug as string
  const [link, setLink] = useState<StoredLink | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    // Find the link in localStorage
    try {
      const stored = localStorage.getItem('paisawin_links')
      if (stored) {
        const links: StoredLink[] = JSON.parse(stored)
        const foundLink = links.find((l) => l.slug === slug)
        if (foundLink) {
          setLink(foundLink)
        } else {
          setError(true)
        }
      } else {
        setError(true)
      }
    } catch (err) {
      console.error('Error loading link:', err)
      setError(true)
    }
  }, [slug])

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

  return <LandingPage redirectUrl={link?.url} />
}
