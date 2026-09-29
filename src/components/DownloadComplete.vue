<script setup lang="ts">
import { computed } from 'vue'
import { useDownloaderStore } from '@/stores/downloader'

const store = useDownloaderStore()
const job = computed(() => store.currentJob)
</script>

<template>
  <div v-if="job" class="w-full max-w-lg mx-auto bg-[#12151C] border border-[#202530] rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
    <!-- Success Badge -->
    <div class="w-16 h-16 mx-auto rounded-2xl bg-[#22C55E]/15 border border-[#22C55E]/40 flex items-center justify-center text-[#22C55E] shadow-lg shadow-[#22C55E]/20 animate-bounce">
      <svg class="w-8 h-8 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>

    <!-- Title and Metadata -->
    <div class="space-y-2">
      <h3 class="text-2xl font-bold text-[#F5F7FA] tracking-tight">
        Your audio is ready!
      </h3>
      <p class="text-xs text-[#22C55E] font-medium">
        FFmpeg conversion and ID3 tagging finished successfully.
      </p>
    </div>

    <!-- File Information Box -->
    <div class="p-4 bg-[#0B0D12] rounded-xl border border-[#202530] text-left space-y-2">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-[#181C24] border border-[#202530] flex items-center justify-center text-[#8B5CF6] shrink-0 font-bold font-mono text-xs">
          MP3
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-medium text-sm text-[#F5F7FA] truncate font-mono">
            {{ job.fileName }}
          </div>
          <div class="text-xs text-[#6B7280] flex items-center gap-2 mt-0.5">
            <span>{{ job.bitrate }} kbps</span>
            <span>•</span>
            <span>{{ job.fileSizeFormatted }}</span>
            <span>•</span>
            <span class="text-[#8B5CF6]">ID3 Tagged</span>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Buttons -->
    <div class="space-y-3 pt-2">
      <button
        @click="store.triggerDownloadFile()"
        class="w-full py-3.5 px-6 rounded-xl bg-[#22C55E] hover:bg-[#16a34a] text-white font-semibold text-sm sm:text-base transition-all duration-200 shadow-lg shadow-[#22C55E]/25 flex items-center justify-center gap-2 group cursor-pointer"
      >
        <svg class="w-5 h-5 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span>Download File (.mp3)</span>
      </button>

      <button
        @click="store.resetFlow()"
        class="w-full py-2.5 px-4 rounded-xl bg-[#181C24] hover:bg-[#202530] text-[#A7AFBF] hover:text-[#F5F7FA] font-medium text-xs sm:text-sm border border-[#202530] transition-colors cursor-pointer"
      >
        Process another audio
      </button>
    </div>
  </div>
</template>
