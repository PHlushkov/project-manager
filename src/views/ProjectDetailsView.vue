<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectsStore } from '@/store/projects'
import { useUIStore } from '@/store/ui'
import { useTasksStore } from '@/store/tasks'
import TasksTable from '@/components/TasksTable.vue'
import KanbanBoard from '@/components/KanbanBoard.vue'
import ViewModeToggle from '@/components/ViewModeToggle.vue'
import Modal from '@/components/Modal.vue'
import TaskForm from '@/components/TaskForm.vue'
import Button from '@/components/Button.vue'
import { CONFIG_INNER } from '@/config/config'
import type { TaskStatus } from '@/types'
import { TASK_SORT_FIELDS, TASK_SORT_FIELDS_ARRAY } from '@/api/constants'
import { useUrlSync } from '@/composables/useUrlSync'
import { useFormHandler } from '@/composables/useFormHandler'

const route = useRoute()
const router = useRouter()
const projectsStore = useProjectsStore()
const uiStore = useUIStore()
const tasksStore = useTasksStore()

const projectId = computed(() => route.params.id as string)
const project = computed(() => projectsStore.getProjectById(projectId.value))
const viewMode = computed(() => uiStore.viewMode)

const loading = ref(true)
const showAddTaskModal = ref(false)

// @ts-expect-error - taskFormRef is used in template via ref="taskFormRef"
const { formRef: taskFormRef, handleSubmit: handleAddTaskSubmit } =
  useFormHandler<InstanceType<typeof TaskForm>>()

// Sync URL query params with tasks store - same as in ProjectsView
useUrlSync({
  store: tasksStore as any,
  sortFieldArray: TASK_SORT_FIELDS_ARRAY,
  defaultSortField: TASK_SORT_FIELDS.ORDER,
  urlPrefix: 'task',
  onSyncFromUrl: () => {
    const query = route.query
    const filters: {
      assignee?: string | null
      status?: TaskStatus | null
    } = {}
    if (query.taskAssignee && typeof query.taskAssignee === 'string') {
      filters.assignee = query.taskAssignee
    } else {
      filters.assignee = null
    }

    if (query.taskStatus && typeof query.taskStatus === 'string') {
      if (['todo', 'in_progress', 'done'].includes(query.taskStatus)) {
        filters.status = query.taskStatus as TaskStatus
      }
    } else {
      filters.status = null
    }

    ;(tasksStore as any).setFilters(filters)
  },
})

onMounted(async () => {
  try {
    await projectsStore.fetchAll()
  } catch (error) {
    console.error('Failed to fetch projects:', error)
  } finally {
    loading.value = false
  }
})

const handleAddTask = async () => {
  const success = await handleAddTaskSubmit(async formData => {
    await (tasksStore as any).createTask({
      ...formData,
      projectId: projectId.value,
    })

    showAddTaskModal.value = false
  })
  if (!success) {
    console.error('Failed to add task')
  }
}
</script>

<template>
  <div class="project-details-view">
    <div v-if="loading" class="loading">Завантаження...</div>
    <div v-else-if="!project" class="error">Проект не знайдено</div>
    <div v-else>
      <div class="view-header">
        <div>
          <Button
            variant="secondary"
            class="btn-back"
            @click="router.push(CONFIG_INNER.LINKS.HOME)"
          >
            ← Назад
          </Button>
          <h1>{{ project.name }}</h1>
          <p v-if="project.description" class="project-description">
            {{ project.description }}
          </p>
        </div>
        <ViewModeToggle />
      </div>

      <TasksTable
        v-if="viewMode === 'table'"
        :project-id="projectId"
        @add-task="showAddTaskModal = true"
      />

      <KanbanBoard
        v-else
        :project-id="projectId"
        @add-task="showAddTaskModal = true"
      />

      <Modal
        v-if="showAddTaskModal"
        :is-open="showAddTaskModal"
        title="Додати завдання"
        @close="showAddTaskModal = false"
        @submit="handleAddTask"
      >
        <TaskForm ref="taskFormRef" />
        <template #footer>
          <Button variant="secondary" @click="showAddTaskModal = false">
            Скасувати
          </Button>
          <Button variant="primary" @click="handleAddTask"> Зберегти </Button>
        </template>
      </Modal>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.project-details-view {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
  font-size: 1.125rem;
  color: $text-tertiary;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 20px;

  h1 {
    margin: 12px 0 8px 0;
    font-size: 2rem;
    font-weight: 600;
    color: #111827;
  }

  .project-description {
    margin: 0;
    color: #6b7280;
    font-size: 1rem;
  }
}

.btn-back {
  margin-bottom: 12px;
}
</style>
