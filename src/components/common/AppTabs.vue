<template>
  <div class="border-b border-blue-500/30">
    <nav class="flex gap-1 -mb-px" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        role="tab"
        :aria-selected="modelValue === tab.key"
        class="px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 rounded-t-lg whitespace-nowrap"
        :class="
          modelValue === tab.key
            ? 'border-blue-400 text-blue-200 bg-blue-800/40'
            : 'border-transparent text-blue-400/70 hover:text-blue-300 hover:border-blue-500/40 hover:bg-blue-900/30'
        "
        @click="emit('update:modelValue', tab.key)"
      >
        {{ tab.label }}
      </button>
    </nav>
  </div>
</template>

<script setup>
defineProps({
  tabs: {
    type: Array,
    required: true,
    // Each item: { key: string, label: string }
  },
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])
</script>
