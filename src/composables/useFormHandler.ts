import { ref } from 'vue'

interface FormRef {
  validate?: () => boolean
  getFormData?: () => Record<string, unknown>
  formData?: Record<string, unknown>
}

/**
 * Composable for handling form submission
 */
export function useFormHandler<T extends FormRef>() {
  const formRef = ref<T | null>(null)

  const handleSubmit = async (
    onSubmit: (formData: Record<string, unknown>) => Promise<void>
  ): Promise<boolean> => {
    if (!formRef.value) return false

    const form = formRef.value
    if (form.validate && !form.validate()) {
      return false
    }

    try {
      const formData = form.getFormData
        ? form.getFormData()
        : (form as any).formData

      if (!formData) {
        console.error('Form data is invalid')
        return false
      }

      await onSubmit(formData)
      return true
    } catch (error) {
      console.error('Failed to submit form:', error)
      return false
    }
  }

  return {
    formRef,
    handleSubmit,
  }
}
