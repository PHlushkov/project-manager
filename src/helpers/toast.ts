import { useToast } from 'vue-toast-notification'

export const showToast = {
  success: (message: string) => {
    const toast = useToast()
    toast.success(message)
  },
  error: (message: string) => {
    const toast = useToast()
    toast.error(message)
  },
  info: (message: string) => {
    const toast = useToast()
    toast.info(message)
  },
  warning: (message: string) => {
    const toast = useToast()
    toast.warning(message)
  },
}
