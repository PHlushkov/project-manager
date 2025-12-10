<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProjectsStore } from '@/store/projects'
import type { ProjectStatus } from '@/types'
import { PROJECT_SORT_FIELDS, SORT_DIRECTION } from '@/api/constants'
import { useColumnResize } from '@/composables/useColumnResize'
import { formatDate } from '@/helpers/date'
import SectionHeader from './SectionHeader.vue'
import StatusBadge from './StatusBadge.vue'
import Button from './Button.vue'

interface Emits {
  (e: 'add-project'): void
  (e: 'row-click', projectId: string): void
  (e: 'edit-project', projectId: string): void
}

const emit = defineEmits<Emits>()

const projectsStore = useProjectsStore()

const columns = [
  { key: PROJECT_SORT_FIELDS.ID, label: 'ID', sortable: true, resizable: true },
  {
    key: PROJECT_SORT_FIELDS.NAME,
    label: 'Назва проекту',
    sortable: true,
    resizable: true,
  },
  {
    key: PROJECT_SORT_FIELDS.TASK_COUNT,
    label: 'Кількість завдань',
    sortable: true,
    resizable: true,
  },
  {
    key: PROJECT_SORT_FIELDS.STATUS,
    label: 'Статус',
    sortable: true,
    resizable: true,
  },
  {
    key: PROJECT_SORT_FIELDS.CREATED_AT,
    label: 'Дата створення',
    sortable: true,
    resizable: true,
  },
  { key: 'actions', label: 'Дії', sortable: false, resizable: false },
]

// Initialize filters from store
const nameFilter = ref(projectsStore.filters.name || '')
const statusFilter = ref<ProjectStatus | ''>(
  (projectsStore.filters.status as ProjectStatus) || ''
)

const filteredProjects = computed(() => projectsStore.filteredProjects)
const sortField = computed(() => projectsStore.sortField)
const sortDirection = computed(() => projectsStore.sortDirection)

// Use column resize composable
const defaultColumnWidths: Record<string, number> = {
  id: 80,
  name: 200,
  taskCount: 150,
  status: 120,
  createdAt: 180,
  actions: 120,
}

const { columnWidths, startResize } = useColumnResize({
  defaultWidths: defaultColumnWidths,
  tableType: 'projects',
})

const getTaskCount = (projectId: string) => {
  return projectsStore.getTaskCount(projectId)
}

const handleNameFilter = () => {
  projectsStore.setFilters({ name: nameFilter.value })
}

const handleStatusFilter = () => {
  projectsStore.setFilters({
    status: statusFilter.value || null,
  })
}

const handleSort = (field: string) => {
  projectsStore.setSort(field as any)
}

onMounted(() => {
  projectsStore.fetchAll()
})
</script>

<template>
  <div class="projects-table-container">
    <SectionHeader
      title="Проекти"
      button-text="Додати проект"
      @button-click="$emit('add-project')"
    />

    <div class="table-filters">
      <input
        v-model="nameFilter"
        type="text"
        placeholder="Пошук за назвою..."
        class="filter-input"
        @input="handleNameFilter"
      />
      <select
        v-model="statusFilter"
        class="filter-select"
        @change="handleStatusFilter"
      >
        <option value="">Всі статуси</option>
        <option value="active">Активний</option>
        <option value="archived">Архівований</option>
        <option value="planned">Запланований</option>
      </select>
    </div>

    <div class="table-wrapper">
      <table class="projects-table">
        <thead>
          <tr>
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
        <tbody>
          <tr
            v-for="project in filteredProjects"
            :key="project.id"
            class="table-row"
            @click="$emit('row-click', project.id)"
          >
            <td>{{ project.id }}</td>
            <td>{{ project.name }}</td>
            <td>{{ getTaskCount(project.id) }}</td>
            <td>
              <StatusBadge :status="project.status" type="project" />
            </td>
            <td>{{ formatDate(project.createdAt) }}</td>
            <td @click.stop>
              <Button
                variant="edit"
                @click.stop="emit('edit-project', project.id)"
              >
                Редагувати
              </Button>
            </td>
          </tr>
          <tr v-if="filteredProjects.length === 0">
            <td :colspan="columns.length" class="empty-state">
              Проектів не знайдено
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

.projects-table-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.projects-table {
  width: 100%;
  border-collapse: collapse;
  background: $white;
}
</style>
