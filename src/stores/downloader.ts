import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MediaItem, Bitrate, DownloadJob, MediaMetadata } from '@/types/media'
import { searchYouTube, parseYouTubeUrl, buildDownloadStreamUrl } from '@/services/api'
import { formatFileName } from '@/utils/formatFileName'
import { calculateEstimatedSize } from '@/utils/formatFileSize'
import { audioEngine } from '@/services/audioEngine'

export const useDownloaderStore = defineStore('downloader', () => {
  // Navigation & Flow
  const currentStep = ref<'input' | 'results' | 'preview' | 'processing' | 'completed'>('input')
  const activeInputTab = ref<'search' | 'url'>('search')
  
  // Search & URL state
  const searchQuery = ref('')
  const urlQuery = ref('')
  const searchResults = ref<MediaItem[]>([])
  const isSearching = ref(false)
  const isParsingUrl = ref(false)
  const searchPerformed = ref(false)

  // Media preview & configuration
  const selectedMedia = ref<MediaItem | null>(null)
  const selectedBitrate = ref<Bitrate>(192)
  const metadata = ref<MediaMetadata>({
    title: '',
    artist: '',
    album: '',
    genre: '',
    year: ''
  })

  // Download job state
  const currentJob = ref<DownloadJob | null>(null)
  const isProcessing = computed(() => currentJob.value?.status === 'processing' || currentJob.value?.status === 'converting' || currentJob.value?.status === 'preparing')
  const processingProgress = computed(() => currentJob.value?.progress || 0)
  
  // Error handling
  const errorMessage = ref<string | null>(null)
  const errorContext = ref<string | null>(null)

  // Abort controller for cancelling download
  let abortController: AbortController | null = null

  // Quick suggestions
  const quickSuggestions = [
    'Synthwave Chill',
    'Kyoto Lofi Beats',
    'Acoustic Guitar',
    'Cyberpunk 2026',
    'Piano Ambient'
  ]

  // Actions
  async function search(queryText?: string) {
    const q = queryText !== undefined ? queryText : searchQuery.value
    searchQuery.value = q
    if (!q.trim()) {
      errorMessage.value = 'Please enter a song title, artist, or keyword to search.'
      errorContext.value = 'search'
      return
    }

    errorMessage.value = null
    errorContext.value = null
    isSearching.value = true

    try {
      const results = await searchYouTube(q)
      searchResults.value = results
      searchPerformed.value = true
      currentStep.value = 'results'
    } catch (err: unknown) {
      errorMessage.value = err instanceof Error ? err.message : 'Search failed. Please try again.'
      errorContext.value = 'search'
    } finally {
      isSearching.value = false
    }
  }

  async function processUrl(urlText?: string) {
    const u = urlText !== undefined ? urlText : urlQuery.value
    urlQuery.value = u
    if (!u.trim()) {
      errorMessage.value = 'Please paste a valid YouTube video URL.'
      errorContext.value = 'url'
      return
    }

    errorMessage.value = null
    errorContext.value = null
    isParsingUrl.value = true

    try {
      const item = await parseYouTubeUrl(u)
      selectMedia(item)
    } catch (err: unknown) {
      errorMessage.value = err instanceof Error ? err.message : 'Failed to parse YouTube URL.'
      errorContext.value = 'url'
    } finally {
      isParsingUrl.value = false
    }
  }

  function selectMedia(media: MediaItem) {
    selectedMedia.value = media
    metadata.value = {
      title: media.title,
      artist: media.artist,
      album: media.album || 'YouTube Audio',
      genre: media.genre || 'Digital Audio',
      year: media.year || new Date().getFullYear().toString()
    }
    errorMessage.value = null
    currentStep.value = 'preview'
  }

  function setBitrate(bitrate: Bitrate) {
    selectedBitrate.value = bitrate
  }

  function updateMetadata(field: keyof MediaMetadata, value: string) {
    metadata.value[field] = value
  }

  let progressTimer: number | null = null

  async function startDownload() {
    if (!selectedMedia.value) return

    errorMessage.value = null
    const estSize = calculateEstimatedSize(selectedMedia.value.duration, selectedBitrate.value)
    const finalFileName = formatFileName(
      metadata.value.title || selectedMedia.value.title,
      metadata.value.artist || selectedMedia.value.artist,
      'mp3'
    )

    const downloadStreamUrl = buildDownloadStreamUrl(
      selectedMedia.value.sourceUrl,
      selectedBitrate.value,
      metadata.value
    )

    const job: DownloadJob = {
      jobId: `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      media: { ...selectedMedia.value },
      metadata: { ...metadata.value },
      format: 'mp3',
      bitrate: selectedBitrate.value,
      status: 'preparing',
      progress: 10,
      stageText: 'Connecting to YouTube audio source...',
      fileName: finalFileName,
      fileSizeBytes: estSize.bytes,
      fileSizeFormatted: estSize.formatted,
      createdAt: Date.now()
    }

    currentJob.value = job
    currentStep.value = 'processing'

    // Smooth UI progress simulation while background download & FFmpeg runs
    if (progressTimer) clearInterval(progressTimer)
    let fakeProgress = 10

    progressTimer = window.setInterval(() => {
      if (!currentJob.value || currentJob.value.status === 'completed') {
        if (progressTimer) clearInterval(progressTimer)
        return
      }

      if (fakeProgress < 40) {
        fakeProgress += Math.floor(Math.random() * 6) + 3
        currentJob.value.stageText = 'Downloading YouTube audio stream...'
      } else if (fakeProgress < 85) {
        fakeProgress += Math.floor(Math.random() * 4) + 2
        currentJob.value.status = 'converting'
        currentJob.value.stageText = `Encoding with FFmpeg (${currentJob.value.bitrate} kbps MP3)...`
      } else if (fakeProgress < 95) {
        fakeProgress += 1
        currentJob.value.status = 'processing'
        currentJob.value.stageText = 'Writing ID3v2 metadata & finalizing...'
      }
      currentJob.value.progress = Math.min(fakeProgress, 95)
    }, 350)

    // Execute real backend download & conversion
    abortController = new AbortController()

    try {
      const response = await fetch(downloadStreamUrl, {
        signal: abortController.signal
      })

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}))
        throw new Error(errorJson.error || `Download failed with status ${response.status}`)
      }

      // Convert response stream to client Blob
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)

      if (progressTimer) clearInterval(progressTimer)

      if (currentJob.value) {
        currentJob.value.progress = 100
        currentJob.value.status = 'completed'
        currentJob.value.stageText = 'Audio ready for download!'
        currentJob.value.downloadUrl = blobUrl
        currentJob.value.fileSizeBytes = blob.size
        currentJob.value.fileSizeFormatted = `${(blob.size / (1024 * 1024)).toFixed(1)} MB`
        currentJob.value.completedAt = Date.now()
      }

      currentStep.value = 'completed'
    } catch (err: unknown) {
      if (progressTimer) clearInterval(progressTimer)
      
      if (err instanceof DOMException && err.name === 'AbortError') {
        // User cancelled, ignore
        return
      }

      console.error('Download conversion error:', err)
      errorMessage.value = err instanceof Error ? err.message : 'Audio download failed. Please try again.'
      errorContext.value = 'download'
      currentStep.value = 'preview'
    }
  }

  function cancelProcessing() {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
    if (progressTimer) clearInterval(progressTimer)
    currentJob.value = null
    currentStep.value = 'preview'
  }

  function triggerDownloadFile() {
    if (!currentJob.value || !currentJob.value.downloadUrl) return

    const a = document.createElement('a')
    a.href = currentJob.value.downloadUrl
    a.download = currentJob.value.fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  function backToResults() {
    audioEngine.stopPreview()
    if (searchResults.value.length > 0) {
      currentStep.value = 'results'
    } else {
      currentStep.value = 'input'
    }
  }

  function resetFlow() {
    audioEngine.stopPreview()
    if (abortController) {
      abortController.abort()
      abortController = null
    }
    if (progressTimer) clearInterval(progressTimer)
    currentJob.value = null
    selectedMedia.value = null
    errorMessage.value = null
    currentStep.value = 'input'
  }

  function clearError() {
    errorMessage.value = null
  }

  return {
    currentStep,
    activeInputTab,
    searchQuery,
    urlQuery,
    searchResults,
    isSearching,
    isParsingUrl,
    searchPerformed,
    selectedMedia,
    selectedBitrate,
    metadata,
    currentJob,
    isProcessing,
    processingProgress,
    errorMessage,
    errorContext,
    quickSuggestions,
    search,
    processUrl,
    selectMedia,
    setBitrate,
    updateMetadata,
    startDownload,
    cancelProcessing,
    triggerDownloadFile,
    backToResults,
    resetFlow,
    clearError
  }
})
