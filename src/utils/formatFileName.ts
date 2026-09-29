/**
 * Sanitizes and generates clean audio filename
 * Pattern: "Artist - Title.mp3" or "Title.mp3"
 */
export function formatFileName(title: string, artist?: string, ext: string = 'mp3'): string {
  const cleanTitle = (title || 'Audio')
    .replace(/[/\\?%*:|"<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  const cleanArtist = (artist || '')
    .replace(/[/\\?%*:|"<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (cleanArtist && cleanArtist !== cleanTitle) {
    return `${cleanArtist} - ${cleanTitle}.${ext}`
  }

  return `${cleanTitle}.${ext}`
}
