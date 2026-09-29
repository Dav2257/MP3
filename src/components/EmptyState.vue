<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()

const emit = defineEmits<{
  (e: 'reset'): void
}>()
</script>

<template>
  <div class="bg-[#12151C] border border-[#202530] rounded-2xl p-8 sm:p-12 text-center space-y-4 max-w-lg mx-auto">
    <div class="w-14 h-14 mx-auto rounded-2xl bg-[#181C24] border border-[#202530] flex items-center justify-center text-[#6B7280]">
      <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>

    <div class="space-y-1">
      <h3 class="text-lg font-semibold text-[#F5F7FA]">
        {{ title || 'No results found' }}
      </h3>
      <p class="text-xs text-[#A7AFBF] max-w-xs mx-auto">
        {{ description || 'Try searching for another song title, artist name, or paste a direct YouTube video URL.' }}
      </p>
    </div>

    <div>
      <button
        @click="emit('reset')"
        class="px-4 py-2 rounded-lg bg-[#181C24] hover:bg-[#202530] text-[#8B5CF6] text-xs font-medium border border-[#202530] transition-colors cursor-pointer"
      >
        Try another search
      </button>
    </div>
  </div>
</template>
