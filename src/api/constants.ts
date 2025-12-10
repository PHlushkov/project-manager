/**
 * Default headers for API requests
 */
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
} as const

/**
 * Pagination configuration with search parameters
 */
export const PAGINATION_CONFIG = {
  searchParams: {
    page: 'page',
    limit: 'limit',
    offset: 'offset',
    sort: 'sort',
    order: 'order',
  },
  defaults: {
    page: 1,
    limit: 10,
    offset: 0,
  },
  limits: {
    min: 1,
    max: 100,
    default: 10,
  },
} as const

/**
 * Project sortable fields
 */
export const PROJECT_SORT_FIELDS = {
  ID: 'id',
  NAME: 'name',
  TASK_COUNT: 'taskCount',
  STATUS: 'status',
  CREATED_AT: 'createdAt',
} as const

/**
 * Array of all project sortable fields (for validation)
 */
export const PROJECT_SORT_FIELDS_ARRAY = [
  PROJECT_SORT_FIELDS.ID,
  PROJECT_SORT_FIELDS.NAME,
  PROJECT_SORT_FIELDS.TASK_COUNT,
  PROJECT_SORT_FIELDS.STATUS,
  PROJECT_SORT_FIELDS.CREATED_AT,
] as const

/**
 * Task sortable fields
 */
export const TASK_SORT_FIELDS = {
  ID: 'id',
  TITLE: 'title',
  ASSIGNEE: 'assignee',
  STATUS: 'status',
  DUE_DATE: 'dueDate',
  ORDER: 'order',
} as const

/**
 * Array of all task sortable fields (for validation)
 */
export const TASK_SORT_FIELDS_ARRAY = [
  TASK_SORT_FIELDS.ID,
  TASK_SORT_FIELDS.TITLE,
  TASK_SORT_FIELDS.ASSIGNEE,
  TASK_SORT_FIELDS.STATUS,
  TASK_SORT_FIELDS.DUE_DATE,
  TASK_SORT_FIELDS.ORDER,
] as const

/**
 * Sort direction constants
 */
export const SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc',
} as const

/**
 * Array of all sort directions (for validation)
 */
export const SORT_DIRECTION_ARRAY = [
  SORT_DIRECTION.ASC,
  SORT_DIRECTION.DESC,
] as const
