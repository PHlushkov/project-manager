import { defineStore } from 'pinia'
import { SORT_DIRECTION_ARRAY } from '@/api/constants'

export type ViewMode = 'table' | 'kanban'

interface TableSettings {
  columnWidths?: Record<string, number>
  sortField?: string | null
  sortDirection?: (typeof SORT_DIRECTION_ARRAY)[number]
  filters?: Record<string, unknown>
}

interface UIState {
  viewMode: ViewMode
  projectsTableSettings: TableSettings
  tasksTableSettings: TableSettings
}

export const useUIStore = defineStore('ui', {
  state: (): UIState => ({
    viewMode: 'table',
    projectsTableSettings: {},
    tasksTableSettings: {},
  }),

  actions: {
    /**
     * Set view mode (table or kanban)
     */
    setViewMode(mode: ViewMode) {
      this.viewMode = mode
    },

    /**
     * Toggle view mode
     */
    toggleViewMode() {
      this.viewMode = this.viewMode === 'table' ? 'kanban' : 'table'
    },

    /**
     * Update projects table settings
     */
    updateProjectsTableSettings(settings: Partial<TableSettings>) {
      this.projectsTableSettings = {
        ...this.projectsTableSettings,
        ...settings,
      }
    },

    /**
     * Update tasks table settings
     */
    updateTasksTableSettings(settings: Partial<TableSettings>) {
      this.tasksTableSettings = {
        ...this.tasksTableSettings,
        ...settings,
      }
    },

    /**
     * Reset projects table settings
     */
    resetProjectsTableSettings() {
      this.projectsTableSettings = {}
    },

    /**
     * Reset tasks table settings
     */
    resetTasksTableSettings() {
      this.tasksTableSettings = {}
    },
  },

  persist: true,
})
