import { defineStore } from 'pinia'
import axios from '@/api'
import type { Task, TaskStatus } from '@/types'
import { useProjectsStore } from './projects'
import { showToast } from '@/helpers/toast'
import {
  TASK_SORT_FIELDS,
  TASK_SORT_FIELDS_ARRAY,
  SORT_DIRECTION,
  SORT_DIRECTION_ARRAY,
} from '@/api/constants'
import {
  isSupabaseMode,
  extractSupabaseResponse,
  extractSupabaseArray,
} from '@/api/supabaseHelpers'

interface TasksFilters {
  assignee?: string
  status?: TaskStatus | null
}

type SortField = (typeof TASK_SORT_FIELDS_ARRAY)[number]
type SortDirection = (typeof SORT_DIRECTION_ARRAY)[number]

interface TasksState {
  tasks: Task[]
  currentProjectId: string | null
  filters: TasksFilters
  sortField: SortField | null
  sortDirection: SortDirection
}

export const useTasksStore = defineStore('tasks', {
  state: (): TasksState => ({
    tasks: [],
    currentProjectId: null,
    filters: {},
    sortField: TASK_SORT_FIELDS.ORDER,
    sortDirection: SORT_DIRECTION.ASC,
  }),

  getters: {
    /**
     * Get task by ID
     */
    getTaskById: (state: TasksState) => {
      return (id: string) => state.tasks.find(t => t.id === id)
    },

    /**
     * Get tasks for current project
     */
    projectTasks: (state: TasksState) => {
      if (!state.currentProjectId) return []
      return state.tasks.filter(t => t.projectId === state.currentProjectId)
    },

    /**
     * Filtered tasks
     */
    filteredTasks(state: TasksState): Task[] {
      let filtered = state.currentProjectId
        ? state.tasks.filter(t => t.projectId === state.currentProjectId)
        : []

      // Apply filters
      if (state.filters.assignee) {
        filtered = filtered.filter(t => t.assignee === state.filters.assignee)
      }

      if (state.filters.status) {
        filtered = filtered.filter(t => t.status === state.filters.status)
      }

      return filtered
    },

    /**
     * Sorted tasks
     */
    sortedTasks(state: TasksState): Task[] {
      // Get filtered tasks first
      let filtered = state.currentProjectId
        ? state.tasks.filter(t => t.projectId === state.currentProjectId)
        : []

      // Apply filters
      if (state.filters.assignee) {
        filtered = filtered.filter(t => t.assignee === state.filters.assignee)
      }

      if (state.filters.status) {
        filtered = filtered.filter(t => t.status === state.filters.status)
      }

      // Sort filtered tasks
      let sorted = [...filtered]

      // Use sortField or default to ORDER
      const sortField = state.sortField || TASK_SORT_FIELDS.ORDER

      sorted.sort((a, b) => {
        let aValue: string | number
        let bValue: string | number

        switch (sortField) {
          case TASK_SORT_FIELDS.ID:
            aValue = a.id
            bValue = b.id
            break
          case TASK_SORT_FIELDS.TITLE:
            aValue = a.title.toLowerCase()
            bValue = b.title.toLowerCase()
            break
          case TASK_SORT_FIELDS.ASSIGNEE:
            aValue = (a.assignee || '').toLowerCase()
            bValue = (b.assignee || '').toLowerCase()
            break
          case TASK_SORT_FIELDS.DUE_DATE:
            aValue = new Date(a.dueDate).getTime()
            bValue = new Date(b.dueDate).getTime()
            break
          case TASK_SORT_FIELDS.STATUS:
            aValue = a.status
            bValue = b.status
            break
          case TASK_SORT_FIELDS.ORDER:
            aValue = a.order
            bValue = b.order
            break
          default:
            return 0
        }

        if (aValue < bValue) {
          return state.sortDirection === SORT_DIRECTION.ASC ? -1 : 1
        }
        if (aValue > bValue) {
          return state.sortDirection === SORT_DIRECTION.ASC ? 1 : -1
        }
        return 0
      })

      return sorted
    },

    /**
     * Tasks grouped by status for Kanban
     */
    tasksByStatus(_state: TasksState): Record<TaskStatus, Task[]> {
      const sorted = this.sortedTasks
      const grouped: Record<TaskStatus, Task[]> = {
        todo: [],
        in_progress: [],
        done: [],
      }

      sorted.forEach(task => {
        grouped[task.status].push(task)
      })

      return grouped
    },
  },

  actions: {
    /**
     * Set current project ID
     */
    setCurrentProjectId(projectId: string | null) {
      this.currentProjectId = projectId
    },

    /**
     * Fetch tasks by project ID
     */
    async fetchByProjectId(projectId: string) {
      try {
        this.currentProjectId = projectId
        if (isSupabaseMode()) {
          const res = await axios.get<Task[]>('/tasks', {
            params: {
              projectId: `eq.${projectId}`,
              select: '*',
              order: 'order.asc',
            },
          })
          this.tasks = extractSupabaseArray(res.data)
        } else {
          const res = await axios.get<Task[]>('/tasks', {
            params: { projectId },
          })
          this.tasks = res.data || []
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error)
        this.tasks = []
        throw error
      }
    },

    /**
     * Create new task
     */
    async createTask(data: Omit<Task, 'id' | 'order'>) {
      try {
        // Get max order for the project
        const projectTasks = this.tasks.filter(
          t => t.projectId === data.projectId
        )
        const maxOrder =
          projectTasks.length > 0
            ? Math.max(...projectTasks.map(t => t.order))
            : 0

        let task: Task
        if (isSupabaseMode()) {
          const taskData = {
            ...data,
            order: maxOrder + 1,
          }
          const res = await axios.post<Task | Task[]>('/tasks', taskData)
          task = extractSupabaseResponse(res.data)
        } else {
          task = {
            ...data,
            id: crypto.randomUUID(),
            order: maxOrder + 1,
          }
          await axios.post('/tasks', task)
        }

        this.tasks.push(task)

        // Update task count in projects store
        const projectsStore = useProjectsStore()
        projectsStore.updateTaskCount(data.projectId, 1)

        showToast.success('Завдання успішно створено')
        return task
      } catch (error) {
        console.error('Failed to create task:', error)
        showToast.error('Помилка при створенні завдання')
        throw error
      }
    },

    /**
     * Update task
     */
    async updateTask(id: string, data: Partial<Omit<Task, 'id'>>) {
      try {
        const task = this.tasks.find(t => t.id === id)
        if (!task) {
          throw new Error('Task not found')
        }

        let updatedTask: Task
        if (isSupabaseMode()) {
          const res = await axios.patch<Task | Task[]>(
            `/tasks?id=eq.${id}`,
            data
          )
          updatedTask = extractSupabaseResponse(res.data)
        } else {
          updatedTask = {
            ...task,
            ...data,
          }
          await axios.put(`/tasks/${id}`, updatedTask)
        }

        const index = this.tasks.findIndex(t => t.id === id)
        if (index !== -1) {
          this.tasks[index] = updatedTask
        }

        // Show toast if status changed
        if (data.status && data.status !== task.status) {
          const statusLabels: Record<TaskStatus, string> = {
            todo: 'To Do',
            in_progress: 'In Progress',
            done: 'Done',
          }
          showToast.info(`Статус змінено на "${statusLabels[data.status]}"`)
        } else {
          showToast.success('Завдання успішно оновлено')
        }

        return updatedTask
      } catch (error) {
        console.error('Failed to update task:', error)
        showToast.error('Помилка при оновленні завдання')
        throw error
      }
    },

    /**
     * Delete task
     */
    async deleteTask(id: string) {
      try {
        const task = this.tasks.find(t => t.id === id)
        if (!task) {
          throw new Error('Task not found')
        }

        if (isSupabaseMode()) {
          await axios.delete(`/tasks?id=eq.${id}`)
        } else {
          await axios.delete(`/tasks/${id}`)
        }
        this.tasks = this.tasks.filter(t => t.id !== id)

        // Update task count in projects store
        const projectsStore = useProjectsStore()
        projectsStore.updateTaskCount(task.projectId, -1)

        showToast.success('Завдання успішно видалено')
      } catch (error) {
        console.error('Failed to delete task:', error)
        showToast.error('Помилка при видаленні завдання')
        throw error
      }
    },

    /**
     * Reorder tasks (for drag-and-drop)
     */
    async reorderTasks(
      taskId: string,
      newStatus: TaskStatus,
      newOrder: number
    ) {
      try {
        const task = this.tasks.find(t => t.id === taskId)
        if (!task) {
          throw new Error('Task not found')
        }

        const oldStatus = task.status
        const oldOrder = task.order

        // Update order for other tasks in the same status
        if (oldStatus === newStatus) {
          // Moving within the same column
          if (newOrder < oldOrder) {
            // Moving up
            this.tasks
              .filter(
                t =>
                  t.projectId === task.projectId &&
                  t.status === oldStatus &&
                  t.order >= newOrder &&
                  t.order < oldOrder
              )
              .forEach(t => {
                t.order += 1
              })
          } else {
            // Moving down
            this.tasks
              .filter(
                t =>
                  t.projectId === task.projectId &&
                  t.status === oldStatus &&
                  t.order > oldOrder &&
                  t.order <= newOrder
              )
              .forEach(t => {
                t.order -= 1
              })
          }
        } else {
          // Moving to different column
          // Update old column
          this.tasks
            .filter(
              t =>
                t.projectId === task.projectId &&
                t.status === oldStatus &&
                t.order > oldOrder
            )
            .forEach(t => {
              t.order -= 1
            })

          // Update new column
          this.tasks
            .filter(
              t =>
                t.projectId === task.projectId &&
                t.status === newStatus &&
                t.order >= newOrder
            )
            .forEach(t => {
              t.order += 1
            })
        }

        // Update the moved task
        task.status = newStatus
        task.order = newOrder

        // Save all changes to API
        if (isSupabaseMode()) {
          await axios.patch(`/tasks?id=eq.${taskId}`, {
            status: newStatus,
            order: newOrder,
          })
        } else {
          await axios.put(`/tasks/${taskId}`, task)
        }

        // Update other affected tasks
        const tasksToUpdate = this.tasks.filter(
          t =>
            t.projectId === task.projectId &&
            ((t.status === oldStatus && t.order !== oldOrder) ||
              (t.status === newStatus && t.id !== taskId))
        )

        if (isSupabaseMode()) {
          // For Supabase, update each task individually with PATCH
          await Promise.all(
            tasksToUpdate.map(t =>
              axios.patch(`/tasks?id=eq.${t.id}`, {
                order: t.order,
                status: t.status,
              })
            )
          )
        } else {
          await Promise.all(
            tasksToUpdate.map(t => axios.put(`/tasks/${t.id}`, t))
          )
        }

        // Show toast if status changed
        if (oldStatus !== newStatus) {
          const statusLabels: Record<TaskStatus, string> = {
            todo: 'To Do',
            in_progress: 'In Progress',
            done: 'Done',
          }
          showToast.info(`Завдання переміщено в "${statusLabels[newStatus]}"`)
        } else {
          showToast.success('Порядок завдань оновлено')
        }
      } catch (error) {
        console.error('Failed to reorder tasks:', error)
        showToast.error('Помилка при зміні порядку завдань')
        throw error
      }
    },

    /**
     * Set filters
     */
    setFilters(filters: TasksFilters) {
      this.filters = { ...this.filters, ...filters }
    },

    /**
     * Clear filters
     */
    clearFilters() {
      this.filters = {}
    },

    /**
     * Set sort field and direction
     */
    setSort(
      field: SortField | null,
      direction: SortDirection = SORT_DIRECTION.ASC
    ) {
      // Toggle direction if sorting by the same field
      if (
        this.sortField === field &&
        this.sortDirection === SORT_DIRECTION.ASC
      ) {
        this.sortDirection = SORT_DIRECTION.DESC
      } else if (
        this.sortField === field &&
        this.sortDirection === SORT_DIRECTION.DESC
      ) {
        this.sortField = null
        this.sortDirection = SORT_DIRECTION.ASC
      } else {
        this.sortField = field
        this.sortDirection = direction
      }
    },
  },

  persist: true,
})
