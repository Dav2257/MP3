<script setup lang="ts">
import { computed } from 'vue'
import { useDownloaderStore } from '@/stores/downloader'

const store = useDownloaderStore()
const job = computed(() => store.currentJob)

const stages = [
  { id: 'preparing', label: 'Preparing', step: 1 },
  { id: 'converting', label: 'Converting', step: 2 },
  { id: 'finalizing', label: 'Finalizing', step: 3 }
]

const currentStageIndex = computed(() => {
  const p = job.value?.progress || 0
  if (p < 30) return 0
  if (p < 85) return 1
  return 2
})
</script>

<template>
  <div v-if="job" class="w-full max-w-lg mx-auto bg-[#12151C] border border-[#202530] rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
    <!-- Header icon / pulsing animation -->
    <div class="relative w-16 h-16 mx-auto rounded-2xl bg-[#2E1A55] border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/20">
      <svg class="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      <div class="absolute inset-0 rounded-2xl animate-ping opacity-20 bg-[#8B5CF6]"></div>
    </div>

    <!-- Title & Status Description -->
    <div class="space-y-1.5">
      <h3 class="text-xl font-bold text-[#F5F7FA] tracking-tight">
        {{ job.stageText || 'Preparing your audio...' }}
      </h3>
      <p class="text-xs text-[#A7AFBF] line-clamp-1">
        {{ job.metadata.title }} ({{ job.bitrate }} kbps)
      </p>
    </div>

    <!-- Stepper Indicator -->
    <div class="grid grid-cols-3 gap-2 max-w-xs mx-auto text-[11px] font-medium">
      <div
        v-for="(st, idx) in stages"
        :key="st.id"
        :class="[
          'py-1.5 px-2 rounded-lg border transition-all text-center',
          idx === currentStageIndex
            ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#F5F7FA] font-semibold'
            : idx < currentStageIndex
            ? 'bg-[#181C24] border-[#202530] text-[#22C55E]'
            : 'bg-[#0B0D12] border-[#202530] text-[#6B7280]'
        ]"
      >
        <span v-if="idx < currentStageIndex">✓ </span>
        <span>{{ st.label }}</span>
      </div>
    </div>

    <!-- Progress Bar & Percentage -->
    <div class="space-y-2">
      <div class="w-full h-3 bg-[#0B0D12] rounded-full overflow-hidden border border-[#202530] p-0.5">
        <div
          class="h-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] rounded-full transition-all duration-300 shadow-sm"
          :style="{ width: `${job.progress}%` }"
        ></div>
      </div>

      <div class="flex items-center justify-between text-xs font-mono text-[#A7AFBF]">
        <span>Encoding MP3 Stream</span>
        <span class="text-[#8B5CF6] font-bold text-sm">{{ job.progress }}%</span>
      </div>
    </div>

    <!-- Cancel button -->
    <div class="pt-2 border-t border-[#181C24]">
      <button
        @click="store.cancelProcessing()"
        class="text-xs text-[#6B7280] hover:text-[#EF4444] transition-colors py-1.5 px-3 rounded-lg hover:bg-[#181C24] cursor-pointer"
      >
        Cancel Processing
      </button>
    </div>
  </div>
</template>
