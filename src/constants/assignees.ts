/**
 * List of available assignees for tasks
 */
export const ASSIGNEES = [
  'John Doe',
  'Jane Smith',
  'Alice Johnson',
  'Bob Williams',
  'Charlie Brown',
  'Diana Prince',
] as const

export type Assignee = (typeof ASSIGNEES)[number]
