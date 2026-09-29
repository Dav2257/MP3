<script setup lang="ts">
import type { Bitrate } from '@/types/media'

const props = defineProps<{
  modelValue: Bitrate
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Bitrate): void
}>()

const bitrates: { value: Bitrate; label: string; desc: string }[] = [
  { value: 128, label: '128k', desc: 'Standard' },
  { value: 192, label: '192k', desc: 'Recommended' },
  { value: 256, label: '256k', desc: 'High Quality' },
  { value: 320, label: '320k', desc: 'Studio HQ' }
]
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between text-xs">
      <label class="font-medium text-[#A7AFBF]">Audio Quality (Bitrate)</label>
      <span class="text-[#8B5CF6] font-mono text-[11px]">
        {{ modelValue }} kbps MP3
      </span>
    </div>

    <!-- Segmented Control -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-[#0B0D12] rounded-xl border border-[#202530]">
      <button
        v-for="b in bitrates"
        :key="b.value"
        type="button"
        @click="emit('update:modelValue', b.value)"
        :class="[
          'py-2 px-3 rounded-lg text-xs font-medium transition-all duration-150 flex flex-col items-center justify-center cursor-pointer',
          modelValue === b.value
            ? 'bg-[#8B5CF6] text-white shadow-sm font-semibold'
            : 'text-[#A7AFBF] hover:text-[#F5F7FA] hover:bg-[#181C24]'
        ]"
      >
        <span class="text-xs font-mono">{{ b.label }}</span>
        <span :class="['text-[10px] mt-0.5', modelValue === b.value ? 'text-white/80' : 'text-[#6B7280]']">
          {{ b.desc }}
        </span>
      </button>
    </div>
  </div>
</template>
