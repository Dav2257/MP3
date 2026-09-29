<script setup lang="ts">
import { ref, computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

import designBriefRaw from '@/docs/DESIGN_BRIEF.md?raw'
import implementationPlanRaw from '@/docs/IMPLEMENTATION_PLAN.md?raw'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

interface DocItem {
  id: string
  title: string
  subtitle: string
  icon: string
  content: string
}

const docs: DocItem[] = [
  {
    id: 'design_brief',
    title: 'Design Brief',
    subtitle: 'Arsitektur, UI/UX & spesifikasi',
    icon: '🎨',
    content: designBriefRaw
  },
  {
    id: 'implementation_plan',
    title: 'Implementation Plan',
    subtitle: 'Rencana pengerjaan & tahapan',
    icon: '📋',
    content: implementationPlanRaw
  }
]

const activeDocId = ref<string>('design_brief')

const activeDoc = computed<DocItem>(() => {
  return docs.find((d) => d.id === activeDocId.value) ?? (docs[0] as DocItem)
})

marked.setOptions({
  gfm: true,
  breaks: true
})

const renderedHtml = computed(() => {
  const content = activeDoc.value.content
  const rawHtml = marked.parse(content) as string
  return DOMPurify.sanitize(rawHtml)
})
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md transition-all"
    @click.self="emit('close')"
  >
    <div class="bg-[#12151C] border border-[#202530] rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <!-- Modal Header -->
      <div class="px-5 py-4 border-b border-[#181C24] flex items-center justify-between bg-[#0B0D12]">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-[#8B5CF6]/20 text-[#8B5CF6] flex items-center justify-center font-bold">
            📄
          </div>
          <div>
            <h3 class="font-bold text-base text-[#F5F7FA]">
              Documentation Viewer
            </h3>
            <p class="text-xs text-[#6B7280]">
              Design Brief & Implementation Plan Specification
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Document Switcher -->
          <div class="flex bg-[#181C24] p-1 rounded-xl border border-[#202530]">
            <button
              v-for="d in docs"
              :key="d.id"
              @click="activeDocId = d.id"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer',
                activeDocId === d.id
                  ? 'bg-[#8B5CF6] text-white'
                  : 'text-[#A7AFBF] hover:text-white'
              ]"
            >
              {{ d.icon }} {{ d.title }}
            </button>
          </div>

          <!-- Close button -->
          <button
            @click="emit('close')"
            class="p-2 text-[#A7AFBF] hover:text-white hover:bg-[#181C24] rounded-lg transition-colors cursor-pointer"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Document Content Body -->
      <div class="flex-1 overflow-y-auto p-6 sm:p-8 text-[#F5F7FA] bg-[#12151C]/90">
        <article
          class="prose prose-invert prose-purple max-w-none prose-headings:font-bold prose-headings:text-[#F5F7FA] prose-p:text-[#A7AFBF] prose-pre:bg-[#0B0D12] prose-pre:border prose-pre:border-[#202530]"
          v-html="renderedHtml"
        ></article>
      </div>
    </div>
  </div>
</template>
