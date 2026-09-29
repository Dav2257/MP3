<script setup lang="ts">
import type { AudioFormat } from '@/types/media'

defineProps<{
  modelValue?: AudioFormat
}>()
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between text-xs">
      <label class="font-medium text-[#A7AFBF]">Audio Format</label>
      <span class="text-[11px] text-[#6B7280]">Universal compatibility</span>
    </div>

    <div class="p-1 bg-[#0B0D12] rounded-xl border border-[#202530] flex">
      <div class="w-full py-2 px-3 rounded-lg bg-[#181C24] border border-[#202530] flex items-center justify-between text-xs text-[#F5F7FA]">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-[#8B5CF6]"></div>
          <span class="font-mono font-semibold">MP3 (MPEG-1 Audio Layer III)</span>
        </div>
        <span class="text-[10px] text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]/20">
          ID3v2 Supported
        </span>
      </div>
    </div>
  </div>
</template>
