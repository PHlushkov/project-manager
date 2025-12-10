import { z } from 'zod'

/**
 * Validation schema for Project
 */
export const projectSchema = z.object({
  name: z.string().min(1, 'Назва проекту обовʼязкова'),
  description: z.string().optional(),
  status: z.enum(['active', 'archived', 'planned'] as const),
})

export type ProjectFormData = z.infer<typeof projectSchema>
