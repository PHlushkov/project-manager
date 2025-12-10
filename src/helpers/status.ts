import type { ProjectStatus, TaskStatus } from '@/types'

/**
 * Get label for project status
 * @param status - Project status
 * @returns Localized status label
 */
export const getProjectStatusLabel = (status: ProjectStatus): string => {
  const labels: Record<ProjectStatus, string> = {
    active: 'Активний',
    archived: 'Архівований',
    planned: 'Запланований',
  }
  return labels[status]
}

/**
 * Get label for task status
 * @param status - Task status
 * @returns Localized status label
 */
export const getTaskStatusLabel = (status: TaskStatus): string => {
  const labels: Record<TaskStatus, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    done: 'Done',
  }
  return labels[status]
}
