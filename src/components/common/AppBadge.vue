<template>
  <span
    class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap"
    :class="colorClasses"
  >
    {{ text }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  color: {
    type: String,
    default: 'blue',
    validator: (v) =>
      ['green', 'red', 'yellow', 'blue', 'gray'].includes(v),
  },
  text: {
    type: String,
    required: true,
  },
})

const colorMap = {
  green: 'bg-green-500/20 text-green-300 border-green-500/30',
  red: 'bg-red-500/20 text-red-300 border-red-500/30',
  yellow: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  gray: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
}

const colorClasses = computed(() => colorMap[props.color] || colorMap.blue)
</script>
