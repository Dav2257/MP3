<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import DocsModal from '@/components/DocsModal.vue'
import { useDownloaderStore } from '@/stores/downloader'

const store = useDownloaderStore()
const isDocsOpen = ref(false)

function handleReset() {
  store.resetFlow()
}
</script>

<template>
  <div class="min-h-screen bg-[#0B0D12] text-[#F5F7FA] flex flex-col font-sans selection:bg-[#8B5CF6] selection:text-white">
    <!-- Studio Header -->
    <Header
      @open-docs="isDocsOpen = true"
      @reset-home="handleReset"
    />

    <!-- Main View (Home with Search -> Results -> Preview -> Processing -> Complete) -->
    <div class="flex-1 w-full flex flex-col">
      <RouterView />
    </div>

    <!-- Design Brief & Plan Modal Documentation Viewer -->
    <DocsModal
      :is-open="isDocsOpen"
      @close="isDocsOpen = false"
    />

    <!-- Studio Minimal Footer -->
    <footer class="border-t border-[#181C24] py-6 px-4 text-center text-xs text-[#6B7280] space-y-1 mt-auto">
      <div class="flex items-center justify-center gap-3 text-[#A7AFBF]">
        <span>AudioDrop MVP</span>
        <span>•</span>
        <span>FFmpeg Audio Pipeline</span>
        <span>•</span>
        <button
          @click="isDocsOpen = true"
          class="text-[#8B5CF6] hover:underline cursor-pointer font-medium"
        >
          View Specification
        </button>
      </div>
      <p class="text-[11px] text-[#6B7280]">
        Built for personal use with authorized sources. No history or user data stored.
      </p>
    </footer>
  </div>
</template>
