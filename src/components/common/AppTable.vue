<template>
  <div class="app-table-wrapper overflow-x-auto rounded-xl border border-blue-500/20">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="flex flex-col items-center gap-3">
        <svg
          class="h-6 w-6 animate-spin text-blue-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span class="text-sm text-blue-300/70">載入中...</span>
      </div>
    </div>

    <!-- Table -->
    <table v-else class="w-full border-collapse text-sm">
      <!-- Header -->
      <thead>
        <tr class="bg-gradient-to-r from-blue-700 to-blue-600">
          <th
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-3 font-semibold tracking-wide text-blue-100 whitespace-nowrap"
            :style="col.width ? { width: col.width } : {}"
            :class="{
              'text-left': !col.align || col.align === 'left',
              'text-center': col.align === 'center',
              'text-right': col.align === 'right',
            }"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>

      <!-- Body: Data Rows -->
      <tbody v-if="data && data.length > 0">
        <tr
          v-for="(row, rowIndex) in data"
          :key="rowIndex"
          class="border-t border-blue-500/20 transition-colors hover:bg-blue-800/30"
          :class="rowIndex % 2 === 0 ? 'bg-blue-900/40' : 'bg-blue-900/20'"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-3 text-blue-100"
            :class="{
              'text-left': !col.align || col.align === 'left',
              'text-center': col.align === 'center',
              'text-right': col.align === 'right',
            }"
          >
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]" :index="rowIndex">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>

      <!-- Body: Empty State -->
      <tbody v-else>
        <tr>
          <td :colspan="columns.length" class="px-4 py-12 text-center text-blue-400/70">
            <slot>
              <div class="flex flex-col items-center gap-2">
                <svg
                  class="h-10 w-10 text-blue-500/30"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                  />
                </svg>
                <span>暫無資料</span>
              </div>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    required: true,
    // Each item: { key: string, label: string, width?: string, align?: 'left'|'center'|'right' }
  },
  data: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>
