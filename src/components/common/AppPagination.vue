<template>
  <div class="flex items-center justify-between flex-wrap gap-3 text-sm text-blue-300">
    <!-- Total Count -->
    <span class="whitespace-nowrap">
      共 <span class="text-blue-100 font-medium">{{ total }}</span> 條
    </span>

    <!-- Page Buttons -->
    <div class="flex items-center gap-1">
      <!-- Previous -->
      <button
        :disabled="modelValue <= 1"
        class="px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap"
        :class="
          modelValue <= 1
            ? 'border-blue-700/30 text-blue-600 cursor-not-allowed'
            : 'border-blue-500/30 text-blue-300 hover:bg-blue-700/50 hover:text-white'
        "
        @click="goTo(modelValue - 1)"
      >
        上一頁
      </button>

      <!-- Page Numbers -->
      <template v-for="page in visiblePages" :key="page">
        <span
          v-if="page === '...'"
          class="px-2 py-1.5 text-blue-500"
        >
          ...
        </span>
        <button
          v-else
          class="min-w-[36px] px-2 py-1.5 rounded-lg border transition-colors"
          :class="
            page === modelValue
              ? 'bg-blue-600 border-blue-500 text-white font-medium'
              : 'border-blue-500/30 text-blue-300 hover:bg-blue-700/50 hover:text-white'
          "
          @click="goTo(page)"
        >
          {{ page }}
        </button>
      </template>

      <!-- Next -->
      <button
        :disabled="modelValue >= totalPages"
        class="px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap"
        :class="
          modelValue >= totalPages
            ? 'border-blue-700/30 text-blue-600 cursor-not-allowed'
            : 'border-blue-500/30 text-blue-300 hover:bg-blue-700/50 hover:text-white'
        "
        @click="goTo(modelValue + 1)"
      >
        下一頁
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  total: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  modelValue: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(props.total / props.pageSize))
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = props.modelValue
  const pages = []

  if (total <= 7) {
    // Show all pages
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    if (current > 3) {
      pages.push('...')
    }

    // Pages around current
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (current < total - 2) {
      pages.push('...')
    }

    // Always show last page
    pages.push(total)
  }

  return pages
})

function goTo(page) {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:modelValue', page)
  }
}
</script>
