const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const isProduction = import.meta.env.PROD || !!supabaseUrl

const baseURL =
  isProduction && supabaseUrl
    ? `${supabaseUrl}/rest/v1`
    : import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

export const CONFIG_INNER = {
  LINKS: {
    HOME: '/',
    PROJECT_DETAILS_BASE: '/project/:id',
    PROJECT_DETAILS: (id: string) => `/project/${id}`,
  },
  API: {
    baseURL,
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  },
} as const

// Export API config for backward compatibility
export const API_CONFIG = CONFIG_INNER.API
