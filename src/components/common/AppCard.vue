<template>
  <div class="bg-blue-900/60 border border-blue-500/30 backdrop-blur rounded-xl p-4">
    <!-- Optional Title -->
    <div v-if="title" class="mb-3 pb-3 border-b border-blue-500/20">
      <h3 class="text-blue-200 text-lg font-bold">{{ title }}</h3>
    </div>

    <!-- Content -->
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
})
</script>
