<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import Sortable, { type SortableEvent } from 'sortablejs'
import KanbanCard from '@/components/KanbanCard.vue'
import type { Task, TaskStatus } from '@/types'

interface Props {
  status: { key: TaskStatus; label: string }
  tasks: Task[]
}

interface Emits {
  (
    e: 'task-moved',
    taskId: string,
    newStatus: TaskStatus,
    newOrder: number
  ): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Local copy of tasks for v-model
const localTasks = ref<Task[]>([...props.tasks])
const cardsContainer = ref<HTMLElement | null>(null)
let sortableInstance: Sortable | null = null

// Watch for changes in props.tasks
watch(
  () => props.tasks,
  newTasks => {
    console.log(
      'KanbanColumn tasks changed for',
      props.status.key,
      ':',
      newTasks
    )
    if (newTasks && Array.isArray(newTasks)) {
      localTasks.value = [...newTasks]
      console.log(
        'KanbanColumn localTasks updated for',
        props.status.key,
        ':',
        localTasks.value
      )
    } else {
      localTasks.value = []
    }
  },
  { immediate: true, deep: true }
)

// Initialize SortableJS for drag-and-drop
onMounted(async () => {
  await nextTick()
  if (cardsContainer.value) {
    sortableInstance = Sortable.create(cardsContainer.value, {
      group: {
        name: 'tasks',
        pull: true,
        put: true,
      },
      animation: 150,
      emptyInsertThreshold: 5, // Allow dropping into empty container
      forceFallback: false,
      onEnd: (event: SortableEvent) => {
        const { item, newIndex, to, from } = event
        const taskId = item.getAttribute('data-id') || item.id

        if (!taskId) {
          console.warn('Could not find task ID in drag event')
          return
        }

        // Find task - check if it's from another column or this one
        let task = localTasks.value.find(t => t.id === taskId)
        if (!task) {
          // Task might be from another column, try to get from props
          task = props.tasks.find(t => t.id === taskId)
        }
        if (!task) {
          console.warn('Task not found:', taskId)
          return
        }

        // Determine new status based on the target column
        const targetColumn = to.closest('.kanban-column')
        const statusKey =
          targetColumn?.getAttribute('data-status') || props.status.key
        const newStatus = statusKey as TaskStatus
        const newOrder =
          newIndex !== undefined && newIndex !== null && newIndex >= 0
            ? newIndex + 1
            : 1

        console.log('Task moved:', { taskId, newStatus, newOrder, from, to })

        emit('task-moved', taskId, newStatus, newOrder)
      },
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
  <div class="kanban-column" :data-status="status.key">
    <div class="column-header">
      <h3>{{ status.label }}</h3>
      <span class="task-count">{{ props.tasks.length }}</span>
    </div>
    <div ref="cardsContainer" class="kanban-cards">
      <KanbanCard v-for="task in localTasks" :key="task.id" :task="task" />
      <div v-if="localTasks.length === 0" class="empty-column">
        Немає завдань
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.kanban-column {
  display: flex;
  flex-direction: column;
  background-color: $bg-secondary;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  min-height: 400px;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
  padding-bottom: $spacing-md;
  border-bottom: 2px solid $border-light;

  h3 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: $text-secondary;
  }

  .task-count {
    background-color: $border-light;
    color: $text-secondary;
    padding: 4px 12px;
    border-radius: $radius-xl;
    font-size: 0.875rem;
    font-weight: 500;
  }
}

.kanban-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-height: 200px;
  padding: 8px;
}

.empty-column {
  text-align: center;
  padding: 40px 20px;
  color: $text-tertiary;
  font-size: 0.875rem;
  pointer-events: none;
  user-select: none;
}
</style>
