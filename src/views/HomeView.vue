<script setup lang="ts">
import { useDownloaderStore } from '@/stores/downloader'
import SearchBar from '@/components/SearchBar.vue'
import UrlInput from '@/components/UrlInput.vue'
import SearchResultCard from '@/components/SearchResultCard.vue'
import MediaPreview from '@/components/MediaPreview.vue'
import DownloadProgress from '@/components/DownloadProgress.vue'
import DownloadComplete from '@/components/DownloadComplete.vue'
import LoadingState from '@/components/LoadingState.vue'
import EmptyState from '@/components/EmptyState.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

const store = useDownloaderStore()
</script>

<template>
  <main class="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
    <!-- Global Error Banner -->
    <ErrorMessage
      v-if="store.errorMessage"
      :message="store.errorMessage"
      retry-text="Try Again"
      @retry="store.errorContext === 'url' ? store.processUrl() : store.search()"
      @dismiss="store.clearError()"
    />

    <!-- SCREEN 01: HOME / INPUT STAGE -->
    <div v-if="store.currentStep === 'input'" class="space-y-10">
      <!-- Hero Headline (Design Brief Section 6) -->
      <div class="text-center space-y-3 pt-4 sm:pt-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181C24] text-[#8B5CF6] text-xs font-mono border border-[#202530]">
          <span class="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"></span>
          Search-First Audio Utility
        </div>
        <h1 class="text-3xl sm:text-5xl font-extrabold text-[#F5F7FA] tracking-tight">
          Download your audio<br />
          <span class="bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#38BDF8] bg-clip-text text-transparent">
            from authorized sources
          </span>
        </h1>
        <p class="text-sm sm:text-base text-[#A7AFBF] max-w-lg mx-auto">
          Extract high-quality MP3 audio with complete ID3 tags from YouTube videos and music links.
        </p>
      </div>

      <!-- Main Input Box with Tab Switcher -->
      <div class="bg-[#12151C] border border-[#202530] rounded-2xl p-5 sm:p-7 shadow-2xl space-y-5">
        <!-- Input Mode Tabs (Search vs Paste URL) -->
        <div class="flex items-center p-1 bg-[#0B0D12] rounded-xl border border-[#202530] max-w-xs mx-auto">
          <button
            type="button"
            @click="store.activeInputTab = 'search'"
            :class="[
              'flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer',
              store.activeInputTab === 'search'
                ? 'bg-[#8B5CF6] text-white shadow-sm font-semibold'
                : 'text-[#A7AFBF] hover:text-[#F5F7FA]'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search</span>
          </button>

          <button
            type="button"
            @click="store.activeInputTab = 'url'"
            :class="[
              'flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer',
              store.activeInputTab === 'url'
                ? 'bg-[#8B5CF6] text-white shadow-sm font-semibold'
                : 'text-[#A7AFBF] hover:text-[#F5F7FA]'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span>Paste URL</span>
          </button>
        </div>

        <!-- Tab Content -->
        <SearchBar v-if="store.activeInputTab === 'search'" />
        <UrlInput v-else />
      </div>

      <!-- Features Pill Highlights -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center pt-2">
        <div class="p-3 bg-[#12151C]/60 rounded-xl border border-[#202530] text-xs text-[#A7AFBF] space-y-1">
          <div class="font-semibold text-[#F5F7FA]">Studio Bitrates</div>
          <div class="text-[11px] text-[#6B7280]">128k, 192k, 256k, 320 kbps</div>
        </div>
        <div class="p-3 bg-[#12151C]/60 rounded-xl border border-[#202530] text-xs text-[#A7AFBF] space-y-1">
          <div class="font-semibold text-[#F5F7FA]">ID3v2 Metadata</div>
          <div class="text-[11px] text-[#6B7280]">Embeds Title, Artist, & Album</div>
        </div>
        <div class="p-3 bg-[#12151C]/60 rounded-xl border border-[#202530] text-xs text-[#A7AFBF] space-y-1">
          <div class="font-semibold text-[#F5F7FA]">No Storage Retention</div>
          <div class="text-[11px] text-[#6B7280]">Zero history & automatic cleanup</div>
        </div>
      </div>
    </div>

    <!-- SCREEN 02: SEARCH RESULTS -->
    <div v-else-if="store.currentStep === 'results'" class="space-y-6">
      <!-- Top Search Bar for instant refinement -->
      <div class="bg-[#12151C] border border-[#202530] rounded-xl p-3.5">
        <SearchBar />
      </div>

      <!-- Results Header -->
      <div class="flex items-center justify-between text-xs text-[#A7AFBF] px-1">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-[#F5F7FA]">Search Results</span>
          <span v-if="store.searchResults.length > 0" class="px-2 py-0.5 rounded-full bg-[#181C24] text-[#8B5CF6] font-mono border border-[#202530]">
            {{ store.searchResults.length }} items
          </span>
        </div>
        <button
          @click="store.resetFlow()"
          class="text-[#6B7280] hover:text-white transition-colors cursor-pointer"
        >
          Clear & back to Home
        </button>
      </div>

      <!-- Results Loading Skeleton -->
      <LoadingState v-if="store.isSearching" :count="4" />

      <!-- Results List -->
      <div v-else-if="store.searchResults.length > 0" class="space-y-3">
        <SearchResultCard
          v-for="item in store.searchResults"
          :key="item.id"
          :item="item"
          @select="store.selectMedia"
        />
      </div>

      <!-- Empty Results -->
      <EmptyState
        v-else
        title="No tracks found"
        :description="`No results found for '${store.searchQuery}'. Try another query.`"
        @reset="store.resetFlow()"
      />
    </div>

    <!-- SCREEN 03: MEDIA PREVIEW & DECISION -->
    <div v-else-if="store.currentStep === 'preview'" class="space-y-6">
      <MediaPreview />
    </div>

    <!-- SCREEN 04: DOWNLOAD PROCESSING -->
    <div v-else-if="store.currentStep === 'processing'" class="space-y-6 py-6 sm:py-12">
      <DownloadProgress />
    </div>

    <!-- SCREEN 05: DOWNLOAD COMPLETED -->
    <div v-else-if="store.currentStep === 'completed'" class="space-y-6 py-6 sm:py-12">
      <DownloadComplete />
    </div>
  </main>
</template>
