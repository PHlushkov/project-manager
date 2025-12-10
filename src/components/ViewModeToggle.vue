<script setup lang="ts">
import { computed } from 'vue'
import { useUIStore, type ViewMode } from '@/store/ui'

const uiStore = useUIStore()

const viewMode = computed(() => uiStore.viewMode)

const setViewMode = (mode: ViewMode) => {
  uiStore.setViewMode(mode)
}
</script>

<template>
  <div class="view-mode-toggle">
    <button
      class="toggle-btn"
      :class="{ active: viewMode === 'table' }"
      @click="setViewMode('table')"
    >
      Таблиця
    </button>
    <button
      class="toggle-btn"
      :class="{ active: viewMode === 'kanban' }"
      @click="setViewMode('kanban')"
    >
      Канбан
    </button>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.view-mode-toggle {
  display: flex;
  gap: $spacing-sm;
  background-color: $bg-tertiary;
  padding: 4px;
  border-radius: $radius-lg;
}

.toggle-btn {
  padding: $spacing-sm $spacing-lg;
  border: none;
  background: transparent;
  border-radius: $radius-md;
  font-size: 0.875rem;
  font-weight: 500;
  color: $text-tertiary;
  cursor: pointer;
  transition: all $transition-base;

  &:hover {
    color: $text-secondary;
  }

  &.active {
    background-color: $white;
    color: $primary;
    box-shadow: $shadow-sm;
  }
}
</style>
