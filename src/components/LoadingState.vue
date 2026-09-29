<script setup lang="ts">
defineProps<{
  count?: number
}>()
</script>

<template>
  <div class="space-y-3 w-full">
    <div
      v-for="n in (count || 3)"
      :key="n"
      class="bg-[#12151C] border border-[#202530] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-pulse"
    >
      <div class="w-full sm:w-36 h-28 sm:h-24 bg-[#181C24] rounded-lg shrink-0"></div>
      <div class="flex-1 space-y-2.5 w-full">
        <div class="h-4 bg-[#181C24] rounded-md w-3/4"></div>
        <div class="h-3 bg-[#181C24] rounded-md w-1/2"></div>
        <div class="h-3 bg-[#181C24] rounded-md w-1/4"></div>
      </div>
      <div class="w-20 h-9 bg-[#181C24] rounded-lg shrink-0 hidden sm:block"></div>
    </div>
  </div>
</template>
