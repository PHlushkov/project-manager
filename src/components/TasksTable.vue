<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import Sortable, { type SortableEvent } from 'sortablejs'
import { useTasksStore } from '@/store/tasks'
import { ASSIGNEES } from '@/constants/assignees'
import type { Task, TaskStatus } from '@/types'
import { TASK_SORT_FIELDS, SORT_DIRECTION } from '@/api/constants'
import { useColumnResize } from '@/composables/useColumnResize'
import { formatDate } from '@/helpers/date'
import SectionHeader from './SectionHeader.vue'
import StatusBadge from './StatusBadge.vue'

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

const columns = [
  { key: TASK_SORT_FIELDS.ID, label: 'ID', sortable: true, resizable: true },
  {
    key: TASK_SORT_FIELDS.TITLE,
    label: 'Назва завдання',
    sortable: true,
    resizable: true,
  },
  {
    key: TASK_SORT_FIELDS.ASSIGNEE,
    label: 'Виконавець',
    sortable: true,
    resizable: true,
  },
  {
    key: TASK_SORT_FIELDS.STATUS,
    label: 'Статус',
    sortable: true,
    resizable: true,
  },
  {
    key: TASK_SORT_FIELDS.DUE_DATE,
    label: 'Термін виконання',
    sortable: true,
    resizable: true,
  },
]

// Initialize filters from store
const assigneeFilter = ref((tasksStore as any).filters?.assignee || '')
const statusFilter = ref<TaskStatus | ''>(
  ((tasksStore as any).filters?.status as TaskStatus) || ''
)
const tableBody = ref<HTMLElement | null>(null)
let sortableInstance: Sortable | null = null

// Get sorted tasks from store (reactive)
const sortedTasks = computed(() => {
  const tasks = (tasksStore as any).sortedTasks
  if (tasks && Array.isArray(tasks)) {
    console.log('Sorted tasks:', tasks)
    return [...(tasks as Task[])]
  }
  console.log('No tasks found in store')
  return []
})

// Watch for projectId changes
watch(
  () => props.projectId,
  async newProjectId => {
    if (newProjectId) {
      console.log('TasksTable: Loading tasks for project:', newProjectId)
      ;(tasksStore as any).setCurrentProjectId(newProjectId)
      try {
        await (tasksStore as any).fetchByProjectId(newProjectId)
        console.log(
          'TasksTable: Tasks loaded, sortedTasks:',
          (tasksStore as any).sortedTasks
        )
      } catch (error) {
        console.error('TasksTable: Error loading tasks:', error)
      }
    }
  },
  { immediate: true }
)

const sortField = computed(() => (tasksStore as any).sortField)
const sortDirection = computed(() => (tasksStore as any).sortDirection)

// Use column resize composable
const defaultColumnWidths: Record<string, number> = {
  id: 80,
  title: 250,
  assignee: 150,
  status: 120,
  dueDate: 180,
}

const { columnWidths, startResize } = useColumnResize({
  defaultWidths: defaultColumnWidths,
  tableType: 'tasks',
})

const handleAssigneeFilter = () => {
  ;(tasksStore as any).setFilters({ assignee: assigneeFilter.value || null })
}

const handleStatusFilter = () => {
  ;(tasksStore as any).setFilters({
    status: statusFilter.value || null,
  })
}

const handleSort = (field: string) => {
  ;(tasksStore as any).setSort(field as any)
}

const handleDragEnd = async (event: SortableEvent) => {
  const { oldIndex, newIndex, item } = event
  if (
    oldIndex === newIndex ||
    oldIndex === undefined ||
    newIndex === undefined ||
    oldIndex === null ||
    newIndex === null
  )
    return

  const taskId = item.getAttribute('data-id') || item.id
  if (!taskId) {
    console.warn('Could not find task ID in drag event')
    return
  }

  const task = sortedTasks.value.find(t => t.id === taskId)
  if (!task) {
    console.warn('Task not found:', taskId)
    return
  }

  const newOrder = newIndex + 1

  try {
    await (tasksStore as any).reorderTasks(task.id, task.status, newOrder)
  } catch (error) {
    console.error('Failed to reorder task:', error)
    // Reload tasks on error
    await (tasksStore as any).fetchByProjectId(props.projectId)
  }
}

// Initialize SortableJS for drag-and-drop
onMounted(async () => {
  ;(tasksStore as any).setCurrentProjectId(props.projectId)
  await (tasksStore as any).fetchByProjectId(props.projectId)

  await nextTick()
  if (tableBody.value) {
    sortableInstance = Sortable.create(tableBody.value, {
      handle: '.drag-handle',
      animation: 150,
      onEnd: handleDragEnd,
    })
  }
})

onUnmounted(() => {
  if (sortableInstance) {
    sortableInstance.destroy()
    sortableInstance = null
  }
})
</script>

<template>
  <div class="tasks-table-container">
    <SectionHeader
      title="Завдання"
      button-text="Додати завдання"
      @button-click="$emit('add-task')"
    />

    <div class="table-filters">
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
      <select
        v-model="statusFilter"
        class="filter-select"
        @change="handleStatusFilter"
      >
        <option value="">Всі статуси</option>
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>

    <div class="table-wrapper">
      <table class="tasks-table">
        <thead>
          <tr>
            <th class="table-header-cell" style="width: 40px">
              <div class="header-content">
                <span></span>
              </div>
            </th>
            <th
              v-for="column in columns"
              :key="column.key"
              :style="{ width: columnWidths[column.key] + 'px' }"
              class="table-header-cell"
            >
              <div class="header-content">
                <span>{{ column.label }}</span>
                <button
                  v-if="column.sortable"
                  class="sort-btn"
                  @click="handleSort(column.key)"
                >
                  <span v-if="sortField === column.key">
                    {{ sortDirection === SORT_DIRECTION.ASC ? '↑' : '↓' }}
                  </span>
                  <span v-else>⇅</span>
                </button>
              </div>
              <div
                v-if="column.resizable"
                class="resize-handle"
                @mousedown="startResize($event, column.key)"
              ></div>
            </th>
          </tr>
        </thead>
        <tbody ref="tableBody">
          <tr
            v-for="task in sortedTasks"
            :key="task.id"
            :data-id="task.id"
            class="table-row"
          >
            <td>
              <span class="drag-handle">☰</span>
            </td>
            <td>{{ task.id }}</td>
            <td>{{ task.title }}</td>
            <td>{{ task.assignee || 'Не призначено' }}</td>
            <td>
              <StatusBadge :status="task.status" type="task" />
            </td>
            <td>{{ formatDate(task.dueDate) }}</td>
          </tr>
          <tr v-if="sortedTasks.length === 0">
            <td :colspan="columns.length + 1" class="empty-state">
              Завдань не знайдено
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;
@use '@/styles/components.scss';

.tasks-table-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tasks-table {
  width: 100%;
  border-collapse: collapse;
  background: $white;
}

.drag-handle {
  cursor: move;
  color: $text-tertiary;
  font-size: 1.2rem;
  user-select: none;

  &:hover {
    color: $text-secondary;
  }
}
</style>
