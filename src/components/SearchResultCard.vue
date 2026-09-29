<script setup lang="ts">
import { computed } from 'vue'
import type { MediaItem } from '@/types/media'
import { formatDuration } from '@/utils/formatDuration'
import { audioEngine } from '@/services/audioEngine'
import { useDownloaderStore } from '@/stores/downloader'

const props = defineProps<{
  item: MediaItem
}>()

const emit = defineEmits<{
  (e: 'select', item: MediaItem): void
}>()

const store = useDownloaderStore()

const isPlaying = computed(() => audioEngine.isTrackPlaying(props.item.id))

function togglePlay(event: Event) {
  event.stopPropagation()
  if (isPlaying.value) {
    audioEngine.stopPreview()
  } else {
    audioEngine.playPreview(props.item.id, props.item.sampleAudioTone || 440)
  }
}
</script>

<template>
  <div
    class="group bg-[#12151C] hover:bg-[#181C24] border border-[#202530] hover:border-[#8B5CF6]/40 rounded-xl p-3 sm:p-4 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 shadow-sm"
  >
    <!-- Thumbnail + Duration & Play Overlay -->
    <div class="relative w-full sm:w-36 h-28 sm:h-24 rounded-lg overflow-hidden shrink-0 bg-[#0B0D12] border border-[#202530]/50">
      <img
        :src="item.thumbnail"
        :alt="item.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      
      <!-- Duration Badge -->
      <div class="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-xs text-[11px] font-mono font-medium text-white">
        {{ formatDuration(item.duration) }}
      </div>

      <!-- Quick Play Overlay Button -->
      <button
        @click="togglePlay"
        class="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center transition-all opacity-90 sm:opacity-0 group-hover:opacity-100 cursor-pointer"
        :title="isPlaying ? 'Pause Audio Preview' : 'Play Audio Preview'"
      >
        <div class="w-9 h-9 rounded-full bg-[#8B5CF6]/90 hover:bg-[#8B5CF6] text-white flex items-center justify-center shadow-lg transform active:scale-95 transition-transform">
          <svg v-if="!isPlaying" class="w-4 h-4 ml-0.5 fill-current" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <svg v-else class="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        </div>
      </button>

      <!-- Waveform indicator if playing -->
      <div v-if="isPlaying" class="absolute top-1.5 left-1.5 flex items-end gap-0.5 h-3.5 bg-black/60 px-1 py-0.5 rounded">
        <span class="w-0.5 bg-[#8B5CF6] animate-eq-1"></span>
        <span class="w-0.5 bg-[#8B5CF6] animate-eq-2"></span>
        <span class="w-0.5 bg-[#8B5CF6] animate-eq-3"></span>
      </div>
    </div>

    <!-- Metadata info -->
    <div class="flex-1 min-w-0 w-full">
      <h3 class="font-semibold text-sm sm:text-base text-[#F5F7FA] group-hover:text-white line-clamp-1 transition-colors">
        {{ item.title }}
      </h3>
      <p class="text-xs text-[#A7AFBF] mt-0.5 line-clamp-1">
        {{ item.channel }} • {{ item.album || 'Single' }}
      </p>
      
      <div class="flex items-center gap-2 mt-2 text-[11px] text-[#6B7280]">
        <span class="px-2 py-0.5 rounded bg-[#181C24] text-[#A7AFBF] border border-[#202530]">
          {{ item.genre }}
        </span>
        <span v-if="item.views">{{ item.views }}</span>
        <span v-if="item.publishDate">• {{ item.publishDate }}</span>
      </div>
    </div>

    <!-- Action Button -->
    <div class="w-full sm:w-auto flex items-center justify-end pt-1 sm:pt-0 shrink-0">
      <button
        @click="$emit('select', item)"
        class="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#181C24] hover:bg-[#8B5CF6] text-[#F5F7FA] hover:text-white font-medium text-xs sm:text-sm border border-[#202530] hover:border-[#8B5CF6] transition-all duration-200 flex items-center justify-center gap-1.5 group-hover:shadow-md cursor-pointer"
      >
        <span>Select</span>
        <svg class="w-3.5 h-3.5 text-[#8B5CF6] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>
