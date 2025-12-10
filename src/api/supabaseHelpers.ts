/**
 * Check if Supabase mode is enabled (production or VITE_SUPABASE_URL is set)
 */
export const isSupabaseMode = (): boolean => {
  return import.meta.env.PROD || !!import.meta.env.VITE_SUPABASE_URL
}

/**
 * Extract single item from Supabase response (which returns arrays)
 * @param data - Response data (can be object or array)
 * @returns Single item
 */
export const extractSupabaseResponse = <T>(data: T | T[]): T => {
  if (Array.isArray(data)) {
    if (data.length === 0) {
      throw new Error('Supabase response array is empty')
    }
    return data[0] as T
  }
  return data
}

/**
 * Extract array from Supabase response
 * @param data - Response data (can be object or array)
 * @returns Array of items
 */
export const extractSupabaseArray = <T>(data: T | T[]): T[] => {
  return Array.isArray(data) ? data : [data]
}
