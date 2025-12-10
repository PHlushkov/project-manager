<script setup lang="ts">
import { computed } from 'vue'
import type { ProjectStatus, TaskStatus } from '@/types'
import { getProjectStatusLabel, getTaskStatusLabel } from '@/helpers/status'

interface Props {
  status: ProjectStatus | TaskStatus
  type?: 'project' | 'task'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'project',
})

const label = computed(() => {
  if (props.type === 'project') {
    return getProjectStatusLabel(props.status as ProjectStatus)
  }
  return getTaskStatusLabel(props.status as TaskStatus)
})

const statusClass = computed(() => {
  if (props.type === 'project') {
    return `status-${props.status}`
  }
  return `status-${props.status}`
})
</script>

<template>
  <span :class="['status-badge', statusClass]">
    {{ label }}
  </span>
</template>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: $radius-xl;
  font-size: 0.75rem;
  font-weight: 500;

  // Project statuses
  &.status-active {
    background-color: $status-active-bg;
    color: $status-active-text;
  }

  &.status-archived {
    background-color: $status-archived-bg;
    color: $status-archived-text;
  }

  &.status-planned {
    background-color: $status-planned-bg;
    color: $status-planned-text;
  }

  // Task statuses
  &.status-todo {
    background-color: $status-todo-bg;
    color: $status-todo-text;
  }

  &.status-in_progress {
    background-color: $status-in-progress-bg;
    color: $status-in-progress-text;
  }

  &.status-done {
    background-color: $status-done-bg;
    color: $status-done-text;
  }
}
</style>
