export type Bitrate = 128 | 192 | 256 | 320

export type AudioFormat = 'mp3'

export type JobStatus = 'idle' | 'preparing' | 'processing' | 'converting' | 'completed' | 'failed'

export interface MediaMetadata {
  title: string
  artist: string
  album?: string
  albumArtist?: string
  genre?: string
  year?: string
}

export interface MediaItem {
  id: string
  title: string
  artist: string
  channel: string
  album: string
  genre: string
  year: string
  duration: number // in seconds
  thumbnail: string
  sourceUrl: string
  views?: string
  publishDate?: string
  sampleAudioTone?: number // frequency for synthetic preview
}

export interface DownloadJob {
  jobId: string
  media: MediaItem
  metadata: MediaMetadata
  format: AudioFormat
  bitrate: Bitrate
  status: JobStatus
  progress: number
  stageText: string
  fileName: string
  fileSizeBytes: number
  fileSizeFormatted: string
  downloadUrl?: string
  error?: string
  createdAt: number
  completedAt?: number
}
