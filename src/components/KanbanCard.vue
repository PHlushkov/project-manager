<script setup lang="ts">
import type { Task } from '@/types'
import { formatDate } from '@/helpers/date'

interface Props {
  task: Task
}

defineProps<Props>()
</script>

<template>
  <div class="kanban-card" :data-id="task.id" :id="task.id">
    <div class="card-header">
      <h4 class="card-title">{{ task.title }}</h4>
    </div>
    <div class="card-body">
      <div v-if="task.assignee" class="card-assignee">
        <span class="assignee-label">Виконавець:</span>
        <span class="assignee-name">{{ task.assignee }}</span>
      </div>
      <div class="card-due-date">
        <span class="due-date-label">Термін:</span>
        <span class="due-date-value">{{ formatDate(task.dueDate) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.kanban-card {
  background: $white;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  box-shadow: $shadow-sm;
  cursor: move;
  transition: box-shadow $transition-base;

  &:hover {
    box-shadow: $shadow-md;
  }
}

.card-header {
  margin-bottom: 12px;
}

.card-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: $text-primary;
  line-height: 1.4;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.875rem;
}

.card-assignee,
.card-due-date {
  display: flex;
  gap: 8px;
  color: $text-tertiary;
}

.assignee-label,
.due-date-label {
  font-weight: 500;
}

.assignee-name,
.due-date-value {
  color: $text-secondary;
}
</style>
