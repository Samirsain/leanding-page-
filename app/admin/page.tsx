'use client'

import { useState, useEffect } from 'react'
import { Copy, Trash2, Plus, LogOut, Lock } from 'lucide-react'

interface StoredLink {
  id: string
  url: string
  slug: string
  createdAt: string
}

export default function AdminPanel() {
  const [links, setLinks] = useState<StoredLink[]>([])
  const [urlInput, setUrlInput] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [origin, setOrigin] = useState('')

  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // Load links and auth status from sessionStorage/localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('paisawin_links')
      if (stored) {
        setLinks(JSON.parse(stored))
      }
    } catch (err) {
      console.error('Error loading links:', err)
    }

    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin)
      const isAuth = sessionStorage.getItem('paisawin_authenticated') === 'true'
      if (isAuth) {
        setIsLoggedIn(true)
      }
    }
  }, [])

  // Handle Login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'admin' && password === 'admin123') {
      sessionStorage.setItem('paisawin_authenticated', 'true')
      setIsLoggedIn(true)
      setLoginError('')
    } else {
      setLoginError('Invalid username or password')
    }
  }

  // Handle Logout
  const handleLogout = () => {
    sessionStorage.removeItem('paisawin_authenticated')
    setIsLoggedIn(false)
    setUsername('')
    setPassword('')
  }

  // Generate unique slug
  const generateSlug = () => {
    return Math.random().toString(36).substring(2, 10)
  }

  // Add new link
  const handleAddLink = () => {
    setError('')

    if (!urlInput.trim()) {
      setError('Please enter a URL')
      return
    }

    // Validate URL
    try {
      new URL(urlInput)
    } catch {
      setError('Please enter a valid URL')
      return
    }

    setLoading(true)

    setTimeout(() => {
      const newLink: StoredLink = {
        id: Date.now().toString(),
        url: urlInput,
        slug: generateSlug(),
        createdAt: new Date().toISOString(),
      }

      const updated = [...links, newLink]
      setLinks(updated)
      localStorage.setItem('paisawin_links', JSON.stringify(updated))
      setUrlInput('')
      setLoading(false)
    }, 300)
  }

  // Delete link
  const handleDeleteLink = (id: string) => {
    const updated = links.filter((link) => link.id !== id)
    setLinks(updated)
    localStorage.setItem('paisawin_links', JSON.stringify(updated))
  }

  // Copy to clipboard — encode redirect URL directly so it works in FB browser too
  const handleCopyLink = (slug: string) => {
    const linkObj = links.find((l) => l.slug === slug)
    let shareableLink = `${origin || window.location.origin}/link/${slug}`
    if (linkObj?.url) {
      // Encode redirect URL as query param so FB browser / any browser can read it
      shareableLink += `?r=${encodeURIComponent(linkObj.url)}`
    }
    navigator.clipboard.writeText(shareableLink)
    setCopied(slug)
    setTimeout(() => setCopied(null), 2000)
  }

  // Render Login screen if not authenticated
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-blue-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle glowing elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex p-3 bg-yellow-400/10 rounded-full border border-yellow-400/20 text-yellow-300 mb-4 animate-pulse">
              <Lock size={28} />
            </div>
            <h1 className="text-3xl font-black text-yellow-300 drop-shadow-lg mb-2 tracking-wider">
              PAISAWIN
            </h1>
            <p className="text-gray-200 text-sm font-medium">Admin Control Panel Authentication</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 relative z-10">
            {loginError && (
              <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-lg text-sm text-center">
                {loginError}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-200 block">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300 focus:ring-1 focus:ring-yellow-300 transition"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-200 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300 focus:ring-1 focus:ring-yellow-300 transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-bold py-3 rounded-lg transition transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-yellow-500/20"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Render Admin Panel if authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-blue-800 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div>
            <h1 className="text-4xl font-black text-yellow-300 drop-shadow-lg mb-2">
              PAISAWIN Admin
            </h1>
            <p className="text-gray-200">Create and manage your promotional links</p>
          </div>
          <button
            onClick={handleLogout}
            className="self-start sm:self-center bg-red-500/20 hover:bg-red-500/40 text-red-200 font-semibold py-2.5 px-4 rounded-lg border border-red-500/30 transition text-sm flex items-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* Add new link form */}
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Create New Link</h2>

          {error && (
            <div className="bg-red-500/20 border border-red-400 text-red-200 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/redirect"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300 transition"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddLink()
                }
              }}
            />

            <button
              onClick={handleAddLink}
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 disabled:opacity-50 text-gray-900 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition transform hover:scale-105 active:scale-95"
            >
              <Plus size={20} />
              {loading ? 'Creating...' : 'Create Link'}
            </button>
          </div>

          <p className="text-xs text-gray-300 mt-3">
            Paste any external URL you want users to be redirected to. A unique link will be generated automatically.
          </p>
        </div>

        {/* Links list */}
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Your Links ({links.length})</h2>

          {links.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-300">No links created yet.</p>
              <p className="text-sm text-gray-400">Create your first link above to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {links.map((link) => (
                <div
                  key={link.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 truncate mb-1">
                      <span className="text-yellow-300 font-mono">
                        {origin}/link/{link.slug}?r=...
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      Redirects to: {link.url}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Created: {new Date(link.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopyLink(link.slug)}
                      className="flex-1 md:flex-none bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <Copy size={16} />
                      {copied === link.slug ? 'Copied!' : 'Copy'}
                    </button>

                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="flex-1 md:flex-none bg-red-500/30 hover:bg-red-600/40 text-red-200 font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info section */}
        <div className="mt-8 bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-3">How it works:</h3>
          <ol className="space-y-2 text-sm text-gray-300">
            <li className="flex gap-3">
              <span className="text-yellow-300 font-bold">1.</span>
              <span>Paste any URL you want users to be redirected to</span>
            </li>
            <li className="flex gap-3">
              <span className="text-yellow-300 font-bold">2.</span>
              <span>A unique promotional link is generated with the PAISAWIN landing page</span>
            </li>
            <li className="flex gap-3">
              <span className="text-yellow-300 font-bold">3.</span>
              <span>Share the link with your users - they see the landing page and click Register to go to your URL</span>
            </li>
            <li className="flex gap-3">
              <span className="text-yellow-300 font-bold">4.</span>
              <span>Manage all your links here and delete them anytime</span>
            </li>
          </ol>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>All links are stored in your browser. Clear your browser data to lose access to your links.</p>
        </div>
      </div>
    </div>
  )
}
