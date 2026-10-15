import type { MediaItem, Bitrate, MediaMetadata } from '@/types/media'
import { searchMockTracks, parseMockUrl } from '@/services/mockData'

export function getApiBase(): string {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    const apiParam = urlParams.get('api')
    if (apiParam) {
      localStorage.setItem('audiodrop_api_url', apiParam.replace(/\/$/, ''))
      return apiParam.replace(/\/$/, '')
    }
    const saved = localStorage.getItem('audiodrop_api_url')
    if (saved) return saved.replace(/\/$/, '')
  }
  return (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '') || '/api'
}

export async function searchYouTube(query: string): Promise<MediaItem[]> {
  const apiBase = getApiBase()
  try {
    const res = await fetch(`${apiBase}/search?q=${encodeURIComponent(query)}`, {
      headers: { 'Accept': 'application/json' }
    })
    
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || `Server responded with status ${res.status}`)
    }

    const data = await res.json()
    if (data.results && Array.isArray(data.results) && data.results.length > 0) {
      return data.results
    }
    
    // Fallback if empty
    return await searchMockTracks(query)
  } catch (err) {
    console.warn('Backend search unreachable or failed, using local engine fallback:', err)
    return await searchMockTracks(query)
  }
}

export async function parseYouTubeUrl(url: string): Promise<MediaItem> {
  const apiBase = getApiBase()
  try {
    const res = await fetch(`${apiBase}/media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ url })
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || `Server responded with status ${res.status}`)
    }

    const data = await res.json()
    if (data.media) {
      return data.media
    }
    
    return await parseMockUrl(url)
  } catch (err) {
    console.warn('Backend URL parse unreachable, using local fallback:', err)
    return await parseMockUrl(url)
  }
}

export function buildDownloadStreamUrl(
  sourceUrl: string,
  bitrate: Bitrate,
  meta: MediaMetadata
): string {
  const params = new URLSearchParams({
    url: sourceUrl,
    bitrate: bitrate.toString(),
    title: meta.title || '',
    artist: meta.artist || '',
    album: meta.album || '',
    genre: meta.genre || '',
    year: meta.year || ''
  })

  return `${getApiBase()}/download?${params.toString()}`
}
