'use client'

import { useState, useEffect } from 'react'
import LandingPage from '@/components/landing-page'

export default function Home() {
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)

  useEffect(() => {
    // Get redirect URL from localStorage if this is a shared link
    const params = new URLSearchParams(window.location.search)
    const url = params.get('redirect')
    if (url) {
      setRedirectUrl(url)
    }
  }, [])

  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <LandingPage redirectUrl={redirectUrl} />
    </main>
  )
}
