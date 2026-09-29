/**
 * Audio Engine for browser preview playback and real audio file generation.
 */

class AudioEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private oscs: OscillatorNode[] = []
  private isPlaying: boolean = false
  private currentTrackId: string | null = null

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime)
      this.masterGain.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public playPreview(trackId: string, baseFreq: number = 440) {
    this.initContext()
    if (!this.ctx || !this.masterGain) return

    if (this.isPlaying) {
      this.stopPreview()
    }

    this.isPlaying = true
    this.currentTrackId = trackId

    // Create a rich harmonic chord (Root, Major/Minor Third, Fifth, Octave)
    const now = this.ctx.currentTime
    const chordIntervals = [1, 1.25, 1.5, 2] // Major triad with octave

    chordIntervals.forEach((interval, index) => {
      if (!this.ctx || !this.masterGain) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      // Waveform type varies by layer
      osc.type = index % 2 === 0 ? 'sine' : 'triangle'
      osc.frequency.setValueAtTime(baseFreq * interval, now)

      // Add gentle LFO vibrato
      const lfo = this.ctx.createOscillator()
      const lfoGain = this.ctx.createGain()
      lfo.frequency.setValueAtTime(4 + index * 0.5, now)
      lfoGain.gain.setValueAtTime(1.5, now)
      lfo.connect(osc.frequency)
      lfo.start(now)

      // Envelope: gentle fade in
      gain.gain.setValueAtTime(0.001, now)
      gain.gain.exponentialRampToValueAtTime(0.12 / (index + 1), now + 0.3)

      osc.connect(gain)
      gain.connect(this.masterGain)

      osc.start(now)
      this.oscs.push(osc, lfo)
    })
  }

  public stopPreview() {
    if (this.oscs.length > 0) {
      this.oscs.forEach((osc) => {
        try {
          osc.stop()
          osc.disconnect()
        } catch {
          // Ignore if already stopped
        }
      })
      this.oscs = []
    }
    this.isPlaying = false
    this.currentTrackId = null
  }

  public isTrackPlaying(trackId: string): boolean {
    return this.isPlaying && this.currentTrackId === trackId
  }

  /**
   * Generates a real playable MP3/WAV binary blob formatted with genuine headers
   * and synthesized tone so downloading saves a real, working audio file.
   */
  public generateDownloadableAudioFile(title: string, artist: string, durationSec: number = 30): Blob {
    const sampleRate = 44100
    const numChannels = 2
    const totalSamples = Math.min(sampleRate * Math.min(durationSec, 30), sampleRate * 30) // 30 seconds of audio data
    const bytesPerSample = 2 // 16-bit
    const blockAlign = numChannels * bytesPerSample
    const byteRate = sampleRate * blockAlign
    const dataSize = totalSamples * blockAlign
    const buffer = new ArrayBuffer(44 + dataSize)
    const view = new DataView(buffer)

    // RIFF chunk descriptor
    this.writeString(view, 0, 'RIFF')
    view.setUint32(4, 36 + dataSize, true)
    this.writeString(view, 8, 'WAVE')

    // FMT sub-chunk
    this.writeString(view, 12, 'fmt ')
    view.setUint32(16, 16, true) // Subchunk1Size (16 for PCM)
    view.setUint16(20, 1, true) // AudioFormat (1 for PCM)
    view.setUint16(22, numChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, byteRate, true)
    view.setUint16(32, blockAlign, true)
    view.setUint16(34, 16, true) // BitsPerSample (16 bits)

    // DATA sub-chunk
    this.writeString(view, 36, 'data')
    view.setUint32(40, dataSize, true)

    // Synthesize pleasing musical chord into PCM buffer
    let offset = 44
    const freq = 440 // A4
    for (let i = 0; i < totalSamples; i++) {
      const t = i / sampleRate
      // Gentle chord synthesis
      const sampleL = Math.sin(2 * Math.PI * freq * t) * 0.3 + Math.sin(2 * Math.PI * freq * 1.25 * t) * 0.2
      const sampleR = Math.sin(2 * Math.PI * freq * 1.5 * t) * 0.3 + Math.sin(2 * Math.PI * freq * 0.75 * t) * 0.2

      // Apply fade in & fade out
      let envelope = 1.0
      if (t < 0.5) envelope = t / 0.5
      else if (t > 29.5) envelope = (30 - t) / 0.5

      const intSampleL = Math.max(-32768, Math.min(32767, Math.floor(sampleL * envelope * 32767)))
      const intSampleR = Math.max(-32768, Math.min(32767, Math.floor(sampleR * envelope * 32767)))

      view.setInt16(offset, intSampleL, true)
      view.setInt16(offset + 2, intSampleR, true)
      offset += 4
    }

    return new Blob([buffer], { type: 'audio/mpeg' })
  }

  private writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }
}

export const audioEngine = new AudioEngine()
