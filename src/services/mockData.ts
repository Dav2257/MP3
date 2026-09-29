import type { MediaItem } from '@/types/media'

export const SAMPLE_TRACKS: MediaItem[] = [
  {
    id: 'yt_midnight_drive',
    title: 'Midnight City Lights - Synthwave Drive',
    artist: 'Neon Mirage',
    channel: 'Neon Mirage Official',
    album: 'Retrograde Dreams',
    genre: 'Synthwave / Retrowave',
    year: '2025',
    duration: 254, // 04:14
    thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    sourceUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    views: '1.4M views',
    publishDate: '3 months ago',
    sampleAudioTone: 440
  },
  {
    id: 'yt_lofi_rain',
    title: 'Rainy Cafe in Kyoto - Lo-Fi Chill Study Beats',
    artist: 'Coffee & Vinyl',
    channel: 'Chillhop Beats Daily',
    album: 'Autumn Reverie',
    genre: 'Lo-Fi Hip Hop',
    year: '2026',
    duration: 198, // 03:18
    thumbnail: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=80',
    sourceUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
    views: '4.8M views',
    publishDate: '1 month ago',
    sampleAudioTone: 330
  },
  {
    id: 'yt_acoustic_sunset',
    title: 'Golden Hour Reflections (Acoustic Fingerstyle Guitar)',
    artist: 'Marcus Vance',
    channel: 'Marcus Vance Guitar',
    album: 'Solitary Woods',
    genre: 'Acoustic / Folk',
    year: '2025',
    duration: 272, // 04:32
    thumbnail: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&auto=format&fit=crop&q=80',
    sourceUrl: 'https://www.youtube.com/watch?v=kXYiU_JCYtU',
    views: '890K views',
    publishDate: '5 months ago',
    sampleAudioTone: 523.25
  },
  {
    id: 'yt_cyberpunk_overdrive',
    title: 'Neon Ronin - Dark Electro & Industrial Cyberpunk',
    artist: 'Kroma Zero',
    channel: 'Cyber Underground',
    album: 'Neural Hijack',
    genre: 'Cyberpunk / Midtempo',
    year: '2026',
    duration: 215, // 03:35
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    sourceUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    views: '2.1M views',
    publishDate: '2 weeks ago',
    sampleAudioTone: 220
  },
  {
    id: 'yt_piano_serenity',
    title: 'Echoes of Starlight (Minimalist Ambient Piano)',
    artist: 'Evelyn Gray',
    channel: 'Modern Classical Haven',
    album: 'Silent Orbit',
    genre: 'Neo-Classical / Ambient',
    year: '2024',
    duration: 310, // 05:10
    thumbnail: 'https://images.unsplash.com/photo-1520523839898-50712140e69b?w=600&auto=format&fit=crop&q=80',
    sourceUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
    views: '3.3M views',
    publishDate: '8 months ago',
    sampleAudioTone: 392
  },
  {
    id: 'yt_jazz_lounge',
    title: 'Velvet Midnight - Smooth Jazz Trio & Double Bass',
    artist: 'The Miles Quintet',
    channel: 'Blue Note Archives',
    album: 'After Midnight Sessions',
    genre: 'Smooth Jazz',
    year: '2025',
    duration: 285, // 04:45
    thumbnail: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop&q=80',
    sourceUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    views: '670K views',
    publishDate: '4 months ago',
    sampleAudioTone: 293.66
  }
]

export function searchMockTracks(query: string): Promise<MediaItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const q = query.trim().toLowerCase()
      if (!q) {
        resolve(SAMPLE_TRACKS.slice(0, 4))
        return
      }

      const filtered = SAMPLE_TRACKS.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.artist.toLowerCase().includes(q) ||
          t.channel.toLowerCase().includes(q) ||
          t.genre.toLowerCase().includes(q)
      )

      if (filtered.length > 0) {
        resolve(filtered)
      } else {
        // If query is custom, generate a realistic media item matching their search!
        resolve([
          {
            id: `custom_${Date.now()}`,
            title: `${query.charAt(0).toUpperCase() + query.slice(1)} (Original Audio Mix)`,
            artist: 'YouTube Audio Creator',
            channel: 'Official Verified Audio',
            album: 'Single Releases 2026',
            genre: 'Digital Audio',
            year: '2026',
            duration: 214,
            thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
            sourceUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
            views: '520K views',
            publishDate: 'Recent',
            sampleAudioTone: 440
          },
          ...SAMPLE_TRACKS.slice(0, 2)
        ])
      }
    }, 600)
  })
}

export function parseMockUrl(url: string): Promise<MediaItem> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const trimmed = url.trim()
      const isYoutube =
        trimmed.includes('youtube.com') ||
        trimmed.includes('youtu.be') ||
        trimmed.startsWith('http://') ||
        trimmed.startsWith('https://')

      if (!isYoutube) {
        reject(new Error('Invalid URL. Please enter a valid YouTube video link (e.g. https://www.youtube.com/watch?v=...)'))
        return
      }

      // Match an existing item or create an extracted item
      const fallback = SAMPLE_TRACKS[0] as MediaItem
      const found = SAMPLE_TRACKS.find((t) => trimmed.includes(t.id)) || fallback
      resolve({
        id: `url_${Date.now()}`,
        title: found.title,
        artist: found.artist,
        channel: found.channel,
        album: found.album,
        genre: found.genre,
        year: found.year,
        duration: found.duration,
        thumbnail: found.thumbnail,
        sourceUrl: trimmed,
        views: found.views,
        publishDate: found.publishDate,
        sampleAudioTone: found.sampleAudioTone
      })
    }, 700)
  })
}
