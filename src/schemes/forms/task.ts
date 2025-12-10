import { z } from 'zod'
import { ASSIGNEES } from '@/constants/assignees'

/**
 * Validation schema for Task
 */
export const taskSchema = z.object({
  title: z
    .string()
    .min(3, 'Назва завдання має містити мінімум 3 символи')
    .max(120, 'Назва завдання має містити максимум 120 символів'),
  assignee: z
    .enum([...ASSIGNEES] as [string, ...string[]])
    .optional()
    .or(z.literal('')),
  status: z.enum(['todo', 'in_progress', 'done'] as const),
  dueDate: z.string().refine(
    date => {
      const selectedDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selectedDate >= today
    },
    {
      message: 'Дата має бути не раніше сьогодні',
    }
  ),
})

export type TaskFormData = z.infer<typeof taskSchema>
