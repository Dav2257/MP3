import type { Bitrate } from '@/types/media'

/**
 * Calculates estimated or actual file size in MB/KB
 */
export function calculateEstimatedSize(durationSeconds: number, bitrateKbps: Bitrate): { bytes: number; formatted: string } {
  // bitrate in kbps -> bits per second -> bytes per second + ~150KB ID3 metadata overhead
  const bytes = Math.round((bitrateKbps * 1000 / 8) * durationSeconds + 150 * 1024)
  const mb = bytes / (1024 * 1024)
  
  return {
    bytes,
    formatted: `${mb.toFixed(1)} MB`
  }
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}
