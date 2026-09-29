<script setup lang="ts">
defineProps<{
  message: string
  retryText?: string
}>()

const emit = defineEmits<{
  (e: 'retry'): void
  (e: 'dismiss'): void
}>()
</script>

<template>
  <div class="bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl p-4 flex items-start justify-between gap-3 text-left">
    <div class="flex items-start gap-3">
      <div class="w-5 h-5 rounded-full bg-[#EF4444]/20 text-[#EF4444] flex items-center justify-center shrink-0 mt-0.5">
        <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      </div>

      <div>
        <p class="text-xs sm:text-sm font-medium text-[#F5F7FA]">
          {{ message }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2 shrink-0">
      <button
        v-if="retryText"
        @click="emit('retry')"
        class="text-xs px-2.5 py-1 rounded bg-[#EF4444] hover:bg-[#dc2626] text-white font-medium transition-colors cursor-pointer"
      >
        {{ retryText }}
      </button>
      <button
        @click="emit('dismiss')"
        class="text-[#A7AFBF] hover:text-white p-1 cursor-pointer"
        title="Dismiss"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>
