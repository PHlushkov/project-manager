<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTasksStore } from '@/store/tasks'
import { ASSIGNEES } from '@/constants/assignees'
import KanbanColumn from './KanbanColumn.vue'
import SectionHeader from './SectionHeader.vue'
import type { TaskStatus } from '@/types'

interface Props {
  projectId: string
}

interface Emits {
  (e: 'add-task'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const tasksStore = useTasksStore()

const assignees = ASSIGNEES

const statuses = [
  { key: 'todo' as TaskStatus, label: 'To Do' },
  { key: 'in_progress' as TaskStatus, label: 'In Progress' },
  { key: 'done' as TaskStatus, label: 'Done' },
]

const assigneeFilter = ref('')

const tasksByStatus = computed(() => {
  const grouped = (tasksStore as any).tasksByStatus
  console.log('KanbanBoard tasksByStatus:', grouped)
  const result = grouped || { todo: [], in_progress: [], done: [] }
  console.log('KanbanBoard result:', result)
  // Ensure all status keys exist
  return {
    todo: result.todo || [],
    in_progress: result.in_progress || [],
    done: result.done || [],
  }
})

const handleAssigneeFilter = () => {
  ;(tasksStore as any).setFilters({ assignee: assigneeFilter.value || null })
}

const handleTaskMoved = async (
  taskId: string,
  newStatus: TaskStatus,
  newOrder: number
) => {
  try {
    await (tasksStore as any).reorderTasks(taskId, newStatus, newOrder)
  } catch (error) {
    console.error('Failed to move task:', error)
    await (tasksStore as any).fetchByProjectId(props.projectId)
  }
}

// Watch for projectId changes
watch(
  () => props.projectId,
  async newProjectId => {
    if (newProjectId) {
      console.log('Kanban: Loading tasks for project:', newProjectId)
      ;(tasksStore as any).setCurrentProjectId(newProjectId)
      try {
        await (tasksStore as any).fetchByProjectId(newProjectId)
        console.log('Kanban: Tasks loaded:', (tasksStore as any).tasksByStatus)
      } catch (error) {
        console.error('Kanban: Error loading tasks:', error)
      }
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="kanban-board">
    <SectionHeader
      title="Завдання"
      button-text="Додати завдання"
      @button-click="$emit('add-task')"
    />

    <div class="kanban-filters">
      <select
        v-model="assigneeFilter"
        class="filter-select"
        @change="handleAssigneeFilter"
      >
        <option value="">Всі виконавці</option>
        <option v-for="assignee in assignees" :key="assignee" :value="assignee">
          {{ assignee }}
        </option>
      </select>
    </div>

    <div class="kanban-columns">
      <KanbanColumn
        v-for="status in statuses"
        :key="status.key"
        :status="status"
        :tasks="tasksByStatus[status.key]"
        @task-moved="handleTaskMoved"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.kanban-board {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.kanban-filters {
  display: flex;
  gap: 12px;
}

.kanban-columns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  min-height: 500px;
}
</style>
