import { defineStore } from 'pinia'
import axios from '@/api'
import type { Project, ProjectStatus } from '@/types'
import { showToast } from '@/helpers/toast'
import {
  PROJECT_SORT_FIELDS,
  PROJECT_SORT_FIELDS_ARRAY,
  SORT_DIRECTION,
  SORT_DIRECTION_ARRAY,
} from '@/api/constants'
import {
  isSupabaseMode,
  extractSupabaseResponse,
  extractSupabaseArray,
} from '@/api/supabaseHelpers'

interface ProjectsFilters {
  name?: string
  status?: ProjectStatus | null
}

type SortField = (typeof PROJECT_SORT_FIELDS_ARRAY)[number]
type SortDirection = (typeof SORT_DIRECTION_ARRAY)[number]

interface ProjectsState {
  projects: Project[]
  filters: ProjectsFilters
  sortField: SortField | null
  sortDirection: SortDirection
  taskCounts: Record<string, number>
}

export const useProjectsStore = defineStore('projects', {
  state: (): ProjectsState => ({
    projects: [],
    filters: {},
    sortField: null,
    sortDirection: SORT_DIRECTION.ASC,
    taskCounts: {},
  }),

  getters: {
    /**
     * Get project by ID
     */
    getProjectById: state => {
      return (id: string) => state.projects.find(p => p.id === id)
    },

    /**
     * Get task count for project
     */
    getTaskCount: state => {
      return (projectId: string) => state.taskCounts[projectId] || 0
    },

    /**
     * Filtered and sorted projects
     */
    filteredProjects: state => {
      let filtered = [...state.projects]

      // Apply filters
      if (state.filters.name) {
        const nameFilter = state.filters.name.toLowerCase()
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(nameFilter)
        )
      }

      if (state.filters.status) {
        filtered = filtered.filter(p => p.status === state.filters.status)
      }

      // Apply sorting
      if (state.sortField) {
        filtered.sort((a, b) => {
          let aValue: string | number
          let bValue: string | number

          switch (state.sortField) {
            case PROJECT_SORT_FIELDS.ID:
              aValue = a.id
              bValue = b.id
              break
            case PROJECT_SORT_FIELDS.NAME:
              aValue = a.name.toLowerCase()
              bValue = b.name.toLowerCase()
              break
            case PROJECT_SORT_FIELDS.TASK_COUNT:
              aValue = state.taskCounts[a.id] || 0
              bValue = state.taskCounts[b.id] || 0
              break
            case PROJECT_SORT_FIELDS.STATUS:
              aValue = a.status
              bValue = b.status
              break
            case PROJECT_SORT_FIELDS.CREATED_AT:
              aValue = new Date(a.createdAt).getTime()
              bValue = new Date(b.createdAt).getTime()
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
      }

      return filtered
    },
  },

  actions: {
    /**
     * Fetch all projects
     */
    async fetchAll() {
      try {
        if (isSupabaseMode()) {
          const res = await axios.get<Project[]>('/projects', {
            params: {
              select: '*',
              order: 'createdAt.desc',
            },
          })
          this.projects = extractSupabaseArray(res.data)
        } else {
          const res = await axios.get<Project[]>('/projects')
          this.projects = res.data
        }
        // Fetch task counts for each project
        await this.fetchTaskCounts()
      } catch (error) {
        console.error('Failed to fetch projects:', error)
        throw error
      }
    },

    /**
     * Fetch task counts for all projects
     */
    async fetchTaskCounts() {
      try {
        if (isSupabaseMode()) {
          const res = await axios.get<Array<{ projectId: string }>>('/tasks', {
            params: {
              select: 'projectId',
            },
          })
          const tasks = extractSupabaseArray(res.data)
          const counts: Record<string, number> = {}
          tasks.forEach(task => {
            counts[task.projectId] = (counts[task.projectId] || 0) + 1
          })
          this.taskCounts = counts
        } else {
          const res = await axios.get<Array<{ projectId: string }>>('/tasks')
          const counts: Record<string, number> = {}
          res.data.forEach(task => {
            counts[task.projectId] = (counts[task.projectId] || 0) + 1
          })
          this.taskCounts = counts
        }
      } catch (error) {
        console.error('Failed to fetch task counts:', error)
      }
    },

    /**
     * Add new project
     */
    async addProject(data: Omit<Project, 'id' | 'createdAt'>) {
      try {
        let project: Project
        if (isSupabaseMode()) {
          const projectData = {
            ...data,
            createdAt: new Date().toISOString(),
          }
          const res = await axios.post<Project | Project[]>(
            '/projects',
            projectData
          )
          project = extractSupabaseResponse(res.data)
        } else {
          project = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          }
          await axios.post('/projects', project)
        }
        this.projects.push(project)
        this.taskCounts[project.id] = 0
        showToast.success('Проект успішно створено')
        return project
      } catch (error) {
        console.error('Failed to add project:', error)
        showToast.error('Помилка при створенні проекту')
        throw error
      }
    },

    /**
     * Update project
     */
    async updateProject(
      id: string,
      data: Partial<Omit<Project, 'id' | 'createdAt'>>
    ) {
      try {
        let updatedProject: Project
        if (isSupabaseMode()) {
          const res = await axios.patch<Project | Project[]>(
            `/projects?id=eq.${id}`,
            data
          )
          updatedProject = extractSupabaseResponse(res.data)
        } else {
          const project = this.projects.find(p => p.id === id)
          if (!project) {
            throw new Error('Project not found')
          }
          updatedProject = {
            ...project,
            ...data,
          }
          await axios.put(`/projects/${id}`, updatedProject)
        }

        const index = this.projects.findIndex(p => p.id === id)
        if (index !== -1) {
          this.projects[index] = updatedProject
        }

        showToast.success('Проект успішно оновлено')
        return updatedProject
      } catch (error) {
        console.error('Failed to update project:', error)
        showToast.error('Помилка при оновленні проекту')
        throw error
      }
    },

    /**
     * Delete project
     */
    async deleteProject(id: string) {
      try {
        if (isSupabaseMode()) {
          await axios.delete(`/projects?id=eq.${id}`)
        } else {
          await axios.delete(`/projects/${id}`)
        }
        this.projects = this.projects.filter(p => p.id !== id)
        delete this.taskCounts[id]
        showToast.success('Проект успішно видалено')
      } catch (error) {
        console.error('Failed to delete project:', error)
        showToast.error('Помилка при видаленні проекту')
        throw error
      }
    },

    /**
     * Set filters
     */
    setFilters(filters: ProjectsFilters) {
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

    /**
     * Update task count for a project (called when tasks are added/deleted)
     */
    updateTaskCount(projectId: string, delta: number) {
      this.taskCounts[projectId] = (this.taskCounts[projectId] || 0) + delta
      if (this.taskCounts[projectId] < 0) {
        this.taskCounts[projectId] = 0
      }
    },
  },

  persist: true,
})
