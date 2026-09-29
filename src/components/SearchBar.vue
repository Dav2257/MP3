<script setup lang="ts">
import { ref } from 'vue'
import { useDownloaderStore } from '@/stores/downloader'

const store = useDownloaderStore()
const localQuery = ref(store.searchQuery)

function handleSearch() {
  if (localQuery.value.trim()) {
    store.search(localQuery.value)
  }
}

function selectSuggestion(s: string) {
  localQuery.value = s
  store.search(s)
}
</script>

<template>
  <div class="w-full space-y-3">
    <form @submit.prevent="handleSearch" class="relative flex items-center group">
      <div class="absolute left-3.5 sm:left-4 pointer-events-none text-[#6B7280] group-focus-within:text-[#8B5CF6] transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <input
        v-model="localQuery"
        type="text"
        placeholder="Search by title, artist, or keyword..."
        :disabled="store.isSearching"
        class="w-full pl-11 pr-28 sm:pr-32 py-3.5 bg-[#12151C] hover:bg-[#181C24]/80 focus:bg-[#12151C] text-[#F5F7FA] placeholder-[#6B7280] rounded-xl border border-[#202530] focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition-all outline-none text-sm sm:text-base font-normal"
      />

      <button
        type="submit"
        :disabled="store.isSearching || !localQuery.trim()"
        class="absolute right-2 sm:right-2.5 px-4 sm:px-5 py-2 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-xs sm:text-sm transition-all shadow-md shadow-[#8B5CF6]/20 flex items-center gap-2 cursor-pointer"
      >
        <svg v-if="store.isSearching" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span>{{ store.isSearching ? 'Searching...' : 'Search' }}</span>
      </button>
    </form>

    <!-- Quick Search Chips -->
    <div class="flex items-center gap-2 flex-wrap pt-1">
      <span class="text-xs text-[#6B7280]">Try searching:</span>
      <button
        v-for="item in store.quickSuggestions"
        :key="item"
        @click="selectSuggestion(item)"
        class="text-xs px-2.5 py-1 rounded-full bg-[#12151C] hover:bg-[#181C24] text-[#A7AFBF] hover:text-[#8B5CF6] border border-[#202530] hover:border-[#8B5CF6]/40 transition-all cursor-pointer"
      >
        {{ item }}
      </button>
    </div>
  </div>
</template>
