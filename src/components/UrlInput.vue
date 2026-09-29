<script setup lang="ts">
import { ref } from 'vue'
import { useDownloaderStore } from '@/stores/downloader'

const store = useDownloaderStore()
const localUrl = ref(store.urlQuery)

function handleProcessUrl() {
  if (localUrl.value.trim()) {
    store.processUrl(localUrl.value)
  }
}

function pasteExample() {
  localUrl.value = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  store.processUrl(localUrl.value)
}
</script>

<template>
  <div class="w-full space-y-3">
    <form @submit.prevent="handleProcessUrl" class="relative flex items-center group">
      <div class="absolute left-3.5 sm:left-4 pointer-events-none text-[#6B7280] group-focus-within:text-[#8B5CF6] transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </div>

      <input
        v-model="localUrl"
        type="url"
        placeholder="Paste YouTube URL (e.g. https://www.youtube.com/watch?v=...)"
        :disabled="store.isParsingUrl"
        class="w-full pl-11 pr-32 sm:pr-36 py-3.5 bg-[#12151C] hover:bg-[#181C24]/80 focus:bg-[#12151C] text-[#F5F7FA] placeholder-[#6B7280] rounded-xl border border-[#202530] focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition-all outline-none text-sm sm:text-base font-mono"
      />

      <button
        type="submit"
        :disabled="store.isParsingUrl || !localUrl.trim()"
        class="absolute right-2 sm:right-2.5 px-4 sm:px-5 py-2 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-xs sm:text-sm transition-all shadow-md shadow-[#8B5CF6]/20 flex items-center gap-2 cursor-pointer"
      >
        <svg v-if="store.isParsingUrl" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span>{{ store.isParsingUrl ? 'Processing...' : 'Process URL' }}</span>
      </button>
    </form>

    <div class="flex items-center justify-between text-xs text-[#6B7280]">
      <span>Direct link extraction from authorized YouTube sources</span>
      <button
        type="button"
        @click="pasteExample"
        class="text-[#8B5CF6] hover:underline cursor-pointer"
      >
        Paste sample URL
      </button>
    </div>
  </div>
</template>
