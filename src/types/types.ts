/**
 * Project status
 * @typedef {'active' | 'archived' | 'planned'} ProjectStatus
 * - 'active' - active project
 * - 'archived' - archived project
 * - 'planned' - planned project
 */
export type ProjectStatus = 'active' | 'archived' | 'planned'

/**
 * Project entity
 * @interface Project
 */
export interface Project {
  /** Unique project identifier */
  id: string
  /** Project name */
  name: string
  /** Project description (optional) */
  description?: string
  /** Project status */
  status: ProjectStatus
  /** Project creation date (ISO 8601 format) */
  createdAt: string
}

/**
 * Task status
 * @typedef {'todo' | 'in_progress' | 'done'} TaskStatus
 * - 'todo' - task to be done
 * - 'in_progress' - task in progress
 * - 'done' - completed task
 */
export type TaskStatus = 'todo' | 'in_progress' | 'done'

/**
 * Task entity
 * @interface Task
 */
export interface Task {
  /** Unique task identifier */
  id: string
  /** Project identifier that the task belongs to */
  projectId: string
  /** Task title */
  title: string
  /** Task assignee (optional) */
  assignee?: string
  /** Task status */
  status: TaskStatus
  /** Task due date (ISO 8601 format) */
  dueDate: string
  /** Task order number for sorting */
  order: number
}
