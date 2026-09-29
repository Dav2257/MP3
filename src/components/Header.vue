<script setup lang="ts">
defineEmits<{
  (e: 'openDocs'): void
  (e: 'resetHome'): void
}>()
</script>

<template>
  <header class="border-b border-[#181C24] bg-[#0B0D12]/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5 transition-all">
    <div class="max-w-5xl mx-auto flex items-center justify-between">
      <!-- Brand Logo -->
      <button
        @click="$emit('resetHome')"
        class="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
      >
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center text-white shadow-lg shadow-[#8B5CF6]/25 group-hover:scale-105 transition-transform">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="font-bold text-lg text-[#F5F7FA] tracking-tight group-hover:text-white transition-colors">
              AudioDrop
            </span>
            <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#181C24] text-[#8B5CF6] border border-[#202530]">
              Personal Utility
            </span>
          </div>
          <p class="text-[11px] text-[#6B7280] leading-none mt-0.5">
            YouTube Audio & Metadata Extractor
          </p>
        </div>
      </button>

      <!-- Actions -->
      <div class="flex items-center gap-2 sm:gap-3">
        <button
          @click="$emit('openDocs')"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#12151C] hover:bg-[#181C24] text-[#A7AFBF] hover:text-[#F5F7FA] text-xs font-medium border border-[#202530] transition-colors cursor-pointer"
          title="View Design Brief & Implementation Plan"
        >
          <svg class="w-4 h-4 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="hidden sm:inline">Design & Plan Docs</span>
          <span class="sm:hidden">Docs</span>
        </button>

        <div class="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#181C24] text-[#22C55E] text-[11px] font-mono border border-[#202530]">
          <span class="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span>
          FFmpeg Engine Ready
        </div>
      </div>
    </div>
  </header>
</template>
