import { reactive } from 'vue'
import type { ZodSchema } from 'zod'

/**
 * Composable for form validation using Zod
 */
export function useFormValidation<T extends Record<string, unknown>>(
  schema: ZodSchema<T>
) {
  const errors = reactive<Partial<Record<keyof T, string>>>({})

  const validate = (data: T): boolean => {
    const result = schema.safeParse(data)

    if (!result.success) {
      // Clear previous errors
      Object.keys(errors).forEach(key => {
        delete errors[key as keyof typeof errors]
      })

      // Set new errors
      result.error.issues.forEach(error => {
        const field = error.path[0] as keyof T
        ;(errors as any)[field] = error.message
      })

      return false
    }

    // Clear errors on success
    Object.keys(errors).forEach(key => {
      delete errors[key as keyof typeof errors]
    })

    return true
  }

  const clearErrors = () => {
    Object.keys(errors).forEach(key => {
      delete errors[key as keyof typeof errors]
    })
  }

  return {
    errors,
    validate,
    clearErrors,
  }
}
