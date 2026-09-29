<script setup lang="ts">
import { computed } from 'vue'
import { audioEngine } from '@/services/audioEngine'
import type { MediaItem } from '@/types/media'

const props = defineProps<{
  media: MediaItem
}>()

const isPlaying = computed(() => audioEngine.isTrackPlaying(props.media.id))

function togglePlay() {
  if (isPlaying.value) {
    audioEngine.stopPreview()
  } else {
    audioEngine.playPreview(props.media.id, props.media.sampleAudioTone || 440)
  }
}
</script>

<template>
  <div class="flex items-center gap-3 p-3 bg-[#0B0D12] rounded-xl border border-[#202530]">
    <button
      @click="togglePlay"
      class="w-10 h-10 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#8B5CF6]/20 transition-transform active:scale-95 cursor-pointer"
      :title="isPlaying ? 'Pause' : 'Play audio preview'"
    >
      <svg v-if="!isPlaying" class="w-5 h-5 ml-0.5 fill-current" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
      <svg v-else class="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
      </svg>
    </button>

    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between text-xs mb-1">
        <span class="font-medium text-[#F5F7FA]">
          {{ isPlaying ? 'Playing Audio Preview' : 'Preview Audio Sample' }}
        </span>
        <span class="text-[10px] text-[#8B5CF6] font-mono">
          {{ isPlaying ? 'Active' : 'Click to test' }}
        </span>
      </div>

      <!-- Animated equalizer waveform -->
      <div class="h-4 flex items-center gap-1 bg-[#12151C] px-2 rounded-md">
        <div
          v-for="n in 20"
          :key="n"
          :class="[
            'w-1 rounded-full transition-all duration-150',
            isPlaying
              ? 'bg-[#8B5CF6]'
              : 'bg-[#202530] h-1.5'
          ]"
          :style="isPlaying ? { height: `${Math.max(4, Math.sin(n * 0.8) * 14 + 4)}px`, animationDelay: `${(n % 5) * 0.15}s` } : {}"
        ></div>
      </div>
    </div>
  </div>
</template>
