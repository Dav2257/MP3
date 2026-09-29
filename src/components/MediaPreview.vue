<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDownloaderStore } from '@/stores/downloader'
import { formatDuration } from '@/utils/formatDuration'
import { calculateEstimatedSize } from '@/utils/formatFileSize'
import BitrateSelector from './BitrateSelector.vue'
import FormatSelector from './FormatSelector.vue'
import AudioPlayerPreview from './AudioPlayerPreview.vue'

const store = useDownloaderStore()
const isEditingMetadata = ref(false)

const media = computed(() => store.selectedMedia!)
const estSize = computed(() => {
  if (!media.value) return { bytes: 0, formatted: '0 MB' }
  return calculateEstimatedSize(media.value.duration, store.selectedBitrate)
})
</script>

<template>
  <div v-if="media" class="w-full max-w-2xl mx-auto space-y-6">
    <!-- Navigation Back Button -->
    <div class="flex items-center justify-between">
      <button
        @click="store.backToResults()"
        class="inline-flex items-center gap-1.5 text-xs text-[#A7AFBF] hover:text-white px-2.5 py-1.5 rounded-lg bg-[#12151C] hover:bg-[#181C24] border border-[#202530] transition-colors cursor-pointer"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Back to results</span>
      </button>

      <span class="text-xs text-[#6B7280]">
        Source: <a :href="media.sourceUrl" target="_blank" rel="noopener noreferrer" class="text-[#8B5CF6] hover:underline font-mono">YouTube</a>
      </span>
    </div>

    <!-- Main Decision Card -->
    <div class="bg-[#12151C] border border-[#202530] rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
      <!-- Media Header Section -->
      <div class="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
        <!-- Artwork with glowing vinyl rim -->
        <div class="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0 bg-[#0B0D12] border border-[#202530] shadow-md shadow-black/40">
          <img
            :src="media.thumbnail"
            :alt="media.title"
            class="w-full h-full object-cover"
          />
          <div class="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
            {{ formatDuration(media.duration) }}
          </div>
        </div>

        <!-- Metadata Overview -->
        <div class="flex-1 min-w-0 space-y-1">
          <div class="inline-flex items-center gap-2 text-[11px] font-mono text-[#8B5CF6] bg-[#8B5CF6]/10 px-2.5 py-0.5 rounded-full border border-[#8B5CF6]/20">
            <span>{{ media.genre || 'Digital Audio' }}</span>
            <span>•</span>
            <span>{{ media.year || '2026' }}</span>
          </div>

          <h2 class="text-lg sm:text-xl font-bold text-[#F5F7FA] tracking-tight line-clamp-2 mt-1">
            {{ store.metadata.title || media.title }}
          </h2>

          <p class="text-sm text-[#A7AFBF] font-medium line-clamp-1">
            {{ store.metadata.artist || media.artist }}
          </p>

          <p class="text-xs text-[#6B7280] line-clamp-1">
            Album: <span class="text-[#A7AFBF]">{{ store.metadata.album || media.album || 'Single' }}</span>
          </p>
        </div>
      </div>

      <!-- Quick Audio Preview Player -->
      <AudioPlayerPreview :media="media" />

      <!-- Format & Bitrate Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#181C24]">
        <FormatSelector />
        <BitrateSelector v-model="store.selectedBitrate" />
      </div>

      <!-- Metadata ID3 Editor Toggle -->
      <div class="border-t border-[#181C24] pt-4">
        <button
          @click="isEditingMetadata = !isEditingMetadata"
          type="button"
          class="flex items-center justify-between w-full text-xs text-[#A7AFBF] hover:text-[#F5F7FA] transition-colors py-1 cursor-pointer"
        >
          <span class="flex items-center gap-1.5 font-medium">
            <svg class="w-3.5 h-3.5 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit ID3 Metadata Tags (Optional)
          </span>
          <span class="text-[11px] text-[#6B7280]">{{ isEditingMetadata ? 'Hide' : 'Customize' }}</span>
        </button>

        <div v-if="isEditingMetadata" class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 p-3 bg-[#0B0D12] rounded-xl border border-[#202530]">
          <div>
            <label class="block text-[11px] text-[#6B7280] mb-1">Song Title</label>
            <input
              v-model="store.metadata.title"
              type="text"
              class="w-full px-2.5 py-1.5 bg-[#12151C] text-xs text-[#F5F7FA] rounded-lg border border-[#202530] focus:border-[#8B5CF6] outline-none"
            />
          </div>
          <div>
            <label class="block text-[11px] text-[#6B7280] mb-1">Artist / Channel</label>
            <input
              v-model="store.metadata.artist"
              type="text"
              class="w-full px-2.5 py-1.5 bg-[#12151C] text-xs text-[#F5F7FA] rounded-lg border border-[#202530] focus:border-[#8B5CF6] outline-none"
            />
          </div>
          <div>
            <label class="block text-[11px] text-[#6B7280] mb-1">Album</label>
            <input
              v-model="store.metadata.album"
              type="text"
              class="w-full px-2.5 py-1.5 bg-[#12151C] text-xs text-[#F5F7FA] rounded-lg border border-[#202530] focus:border-[#8B5CF6] outline-none"
            />
          </div>
          <div>
            <label class="block text-[11px] text-[#6B7280] mb-1">Genre</label>
            <input
              v-model="store.metadata.genre"
              type="text"
              class="w-full px-2.5 py-1.5 bg-[#12151C] text-xs text-[#F5F7FA] rounded-lg border border-[#202530] focus:border-[#8B5CF6] outline-none"
            />
          </div>
        </div>
      </div>

      <!-- Estimated Size & Primary Download Action -->
      <div class="pt-4 border-t border-[#181C24] space-y-3">
        <div class="flex items-center justify-between text-xs text-[#A7AFBF]">
          <span>Estimated File Size</span>
          <span class="font-mono font-semibold text-[#F5F7FA]">~{{ estSize.formatted }}</span>
        </div>

        <button
          @click="store.startDownload()"
          class="w-full py-3.5 px-6 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold text-sm sm:text-base transition-all duration-200 shadow-lg shadow-[#8B5CF6]/25 flex items-center justify-center gap-2 group cursor-pointer"
        >
          <svg class="w-5 h-5 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Download MP3 ({{ store.selectedBitrate }} kbps)</span>
        </button>

        <p class="text-center text-[11px] text-[#6B7280]">
          Processed locally using FFmpeg audio converter with high-fidelity ID3 tagging.
        </p>
      </div>
    </div>
  </div>
</template>
