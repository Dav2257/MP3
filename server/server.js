import Fastify from 'fastify'
import cors from '@fastify/cors'
import yts from 'yt-search'
import path from 'node:path'
import fs from 'node:fs'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectRoot = path.resolve(__dirname, '..')
const tempDir = path.join(projectRoot, 'server', 'temp')
const ytDlpPath = path.join(projectRoot, 'server', 'bin', 'yt-dlp.exe')
const ffmpegPath = ffmpegInstaller?.path || 'ffmpeg'

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true })
}

const fastify = Fastify({
  logger: true,
  bodyLimit: 10 * 1024 * 1024
})

await fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS']
})

function sanitizeFilename(name) {
  return (name || 'Audio')
    .replace(/[/\\?%*:|"<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// 1. Health Check
fastify.get('/api/health', async () => {
  return {
    status: 'ok',
    ytdlp: fs.existsSync(ytDlpPath) ? 'ready' : 'missing',
    ffmpeg: ffmpegPath,
    timestamp: Date.now()
  }
})

// 2. YouTube Search API
fastify.get('/api/search', async (request, reply) => {
  const query = request.query.q
  if (!query || !query.trim()) {
    return reply.status(400).send({ error: 'Search query parameter "q" is required.' })
  }

  try {
    const searchResults = await yts(query.trim())
    const videos = (searchResults.videos || []).slice(0, 15).map((v) => ({
      id: v.videoId,
      title: v.title,
      artist: v.author ? v.author.name : 'Unknown Artist',
      channel: v.author ? v.author.name : 'Unknown Channel',
      album: 'YouTube Audio',
      genre: 'Digital Audio',
      year: new Date().getFullYear().toString(),
      duration: v.seconds || 0,
      thumbnail: v.thumbnail || v.image || '',
      sourceUrl: v.url || `https://www.youtube.com/watch?v=${v.videoId}`,
      views: v.views ? `${Number(v.views).toLocaleString()} views` : undefined,
      publishDate: v.ago || undefined
    }))

    return { results: videos }
  } catch (error) {
    fastify.log.error(error)
    return reply.status(500).send({ error: 'Failed to search YouTube.' })
  }
})

// 3. YouTube Media Info API
fastify.post('/api/media', async (request, reply) => {
  const { url } = request.body || {}
  if (!url || !url.trim()) {
    return reply.status(400).send({ error: 'URL is required.' })
  }

  const trimmedUrl = url.trim()

  try {
    const searchResults = await yts(trimmedUrl)
    let video = searchResults.videos && searchResults.videos.length > 0 ? searchResults.videos[0] : null
    
    if (!video && (trimmedUrl.includes('v=') || trimmedUrl.includes('youtu.be/'))) {
      const match = trimmedUrl.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)
      if (match) {
        const info = await yts({ videoId: match[1] })
        if (info) video = info
      }
    }

    if (!video) {
      return reply.status(404).send({ error: 'Video not found on YouTube.' })
    }

    const media = {
      id: video.videoId,
      title: video.title,
      artist: video.author ? video.author.name : 'YouTube Artist',
      channel: video.author ? video.author.name : 'YouTube Channel',
      album: 'YouTube Audio',
      genre: 'Digital Audio',
      year: new Date().getFullYear().toString(),
      duration: video.seconds || 0,
      thumbnail: video.thumbnail || video.image || '',
      sourceUrl: video.url || `https://www.youtube.com/watch?v=${video.videoId}`,
      views: video.views ? `${Number(video.views).toLocaleString()} views` : undefined,
      publishDate: video.ago || undefined
    }

    return { media }
  } catch (error) {
    fastify.log.error(error)
    return reply.status(400).send({ error: 'Failed to parse YouTube URL.' })
  }
})

// 4. Real High-Speed MP3 Download & FFmpeg Conversion
fastify.get('/api/download', async (request, reply) => {
  const {
    url,
    bitrate = '192',
    title = 'Audio',
    artist = '',
    album = 'AudioDrop',
    genre = 'Music',
    year = ''
  } = request.query

  if (!url || !url.trim()) {
    return reply.status(400).send({ error: 'Parameter "url" is required.' })
  }

  const validBitrates = ['128', '192', '256', '320']
  const selectedBitrate = validBitrates.includes(bitrate) ? bitrate : '192'

  const safeTitle = sanitizeFilename(title)
  const safeArtist = sanitizeFilename(artist)
  const finalFilename = safeArtist && safeArtist !== safeTitle
    ? `${safeArtist} - ${safeTitle}.mp3`
    : `${safeTitle}.mp3`

  const jobId = `audio_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
  const outputFilePath = path.join(tempDir, `${jobId}.mp3`)

  fastify.log.info(`Processing download for: ${finalFilename} (${selectedBitrate} kbps)`)

  return new Promise((resolve, reject) => {
    // Highly optimized arguments for maximum speed audio extraction & encoding
    const args = [
      '--ffmpeg-location', ffmpegPath,
      '-f', 'ba[ext=m4a]/ba/b',
      '--extract-audio',
      '--audio-format', 'mp3',
      '--audio-quality', `${selectedBitrate}K`,
      '--embed-metadata',
      '--parse-metadata', `title:${safeTitle}`,
      '--parse-metadata', `artist:${safeArtist || 'YouTube'}`,
      '--parse-metadata', `album:${sanitizeFilename(album)}`,
      '--output', path.join(tempDir, `${jobId}.%(ext)s`),
      '--no-playlist',
      '--no-warnings',
      '--no-check-certificates',
      '--force-overwrites',
      url.trim()
    ]

    const proc = spawn(ytDlpPath, args)

    let stderr = ''
    proc.stderr.on('data', (d) => {
      stderr += d.toString()
    })

    proc.on('close', (code) => {
      if (code !== 0 || !fs.existsSync(outputFilePath)) {
        fastify.log.error(`yt-dlp failed with exit code ${code}: ${stderr}`)
        reply.status(500).send({ error: 'Failed to extract and convert audio from YouTube.' })
        return resolve()
      }

      const stat = fs.statSync(outputFilePath)
      const stream = fs.createReadStream(outputFilePath)
      const asciiFilename = finalFilename.replace(/[^\x20-\x7E]/g, '_')

      reply.raw.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${asciiFilename}"; filename*=UTF-8''${encodeURIComponent(finalFilename)}`,
        'Content-Length': stat.size,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'Content-Disposition, Content-Length'
      })

      stream.pipe(reply.raw)

      stream.on('end', () => {
        // Automatic cleanup of temporary file as required by Implementation Plan Phase 17
        try {
          if (fs.existsSync(outputFilePath)) {
            fs.unlinkSync(outputFilePath)
          }
        } catch (e) {
          fastify.log.warn('Cleanup warning:', e)
        }
        resolve()
      })

      stream.on('error', (err) => {
        fastify.log.error('Stream read error:', err)
        try {
          if (fs.existsSync(outputFilePath)) fs.unlinkSync(outputFilePath)
        } catch {}
        reject(err)
      })
    })

    proc.on('error', (err) => {
      fastify.log.error('Process spawn error:', err)
      reply.status(500).send({ error: 'Could not spawn downloader process.' })
      resolve()
    })
  })
})

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 3000
    await fastify.listen({ port: Number(port), host: '0.0.0.0' })
    console.log(`\n🚀 AudioDrop Backend Server running at http://localhost:${port}`)
    console.log(`📁 Binary loaded: yt-dlp & FFmpeg (${ffmpegPath})\n`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
