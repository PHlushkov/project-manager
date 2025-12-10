/**
 * Default table column configurations
 */

export const PROJECTS_TABLE_COLUMNS = {
  id: { label: 'ID', defaultWidth: 80, sortable: true },
  name: { label: 'Назва проекту', defaultWidth: 200, sortable: true },
  taskCount: { label: 'Кількість завдань', defaultWidth: 150, sortable: true },
  status: { label: 'Статус', defaultWidth: 120, sortable: true },
  createdAt: { label: 'Дата створення', defaultWidth: 180, sortable: true },
} as const

export const TASKS_TABLE_COLUMNS = {
  id: { label: 'ID', defaultWidth: 80, sortable: false },
  title: { label: 'Назва завдання', defaultWidth: 250, sortable: false },
  assignee: { label: 'Виконавець', defaultWidth: 150, sortable: false },
  status: { label: 'Статус', defaultWidth: 120, sortable: true },
  dueDate: { label: 'Термін виконання', defaultWidth: 180, sortable: true },
} as const
