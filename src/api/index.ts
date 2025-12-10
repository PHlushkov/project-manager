import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { API_CONFIG } from '@/config/config'
import { DEFAULT_HEADERS } from './constants'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const isProduction = import.meta.env.PROD || !!supabaseUrl

// Create axios instance with configuration
const httpClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    ...DEFAULT_HEADERS,
    // Add Supabase headers only for production
    ...(isProduction &&
      supabaseKey && {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: 'return=representation',
      }),
  },
})

// Request interceptor
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor
httpClient.interceptors.response.use(
  response => {
    return response
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const status = error.response.status
      switch (status) {
        case 401:
          console.error('Unauthorized access')
          break
        case 403:
          console.error('Forbidden access')
          break
        case 404:
          console.error('Resource not found')
          break
        case 500:
          console.error('Server error')
          break
        default:
          console.error(`Request failed with status ${status}`)
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error - no response received')
    } else {
      // Something else happened
      console.error('Request error:', error.message)
    }
    return Promise.reject(error)
  }
)

// Always export httpClient (axios) as default for backward compatibility
export default httpClient
export { httpClient }
