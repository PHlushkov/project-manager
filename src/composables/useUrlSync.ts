import { watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SORT_DIRECTION, SORT_DIRECTION_ARRAY } from '@/api/constants'

interface UrlSyncOptions<T> {
  store: {
    sortField: T | null
    sortDirection: (typeof SORT_DIRECTION_ARRAY)[number]
    filters: Record<string, unknown>
    setFilters: (filters: Record<string, unknown>) => void
  }
  sortFieldArray: readonly string[]
  defaultSortField: T | null
  urlPrefix?: string // Prefix for URL params (e.g., 'task' for taskSort, taskOrder)
  onSyncFromUrl?: () => void | Promise<void>
}

/**
 * Composable for syncing store state with URL query parameters
 */
export function useUrlSync<T extends string>(options: UrlSyncOptions<T>) {
  const {
    store,
    sortFieldArray,
    defaultSortField,
    urlPrefix = '',
    onSyncFromUrl,
  } = options
  const route = useRoute()
  const router = useRouter()

  let isUpdatingFromURL = false
  let stopWatchers: (() => void)[] = []

  const sortParam = urlPrefix ? `${urlPrefix}Sort` : 'sort'
  const orderParam = urlPrefix ? `${urlPrefix}Order` : 'order'

  const syncFromURL = () => {
    // Check if route is available
    if (!route || !route.query) {
      return
    }

    isUpdatingFromURL = true
    const query = route.query

    // Sync sort
    if (query[sortParam]) {
      const sortField = query[sortParam] as string
      const sortDirection = ((query[orderParam] as
        | typeof SORT_DIRECTION.ASC
        | typeof SORT_DIRECTION.DESC) || SORT_DIRECTION.ASC) as
        | typeof SORT_DIRECTION.ASC
        | typeof SORT_DIRECTION.DESC

      if (sortField && sortFieldArray.includes(sortField)) {
        // Directly set sort without using setSort (which has toggle logic)
        ;(store as any).sortField = sortField
        ;(store as any).sortDirection = sortDirection
      }
    } else {
      // Clear sort if not in URL (reset to default)
      if ((store as any).sortField !== defaultSortField) {
        ;(store as any).sortField = defaultSortField
        ;(store as any).sortDirection = SORT_DIRECTION.ASC
      }
    }

    // Sync filters - this is handled by specific implementations
    if (onSyncFromUrl) {
      onSyncFromUrl()
    }

    // Reset flag after Vue's reactivity system completes updates
    // This prevents circular updates: URL -> Store -> URL
    nextTick(() => {
      isUpdatingFromURL = false
    })
  }

  // Update URL when store changes
  // Watch store properties directly to ensure reactivity
  const stopSortFieldWatch = watch(
    () => store.sortField,
    () => {
      if (isUpdatingFromURL) return
      updateURL()
    }
  )
  stopWatchers.push(stopSortFieldWatch)

  const stopSortDirectionWatch = watch(
    () => store.sortDirection,
    () => {
      if (isUpdatingFromURL) return
      updateURL()
    }
  )
  stopWatchers.push(stopSortDirectionWatch)

  const stopFiltersWatch = watch(
    () => store.filters,
    () => {
      if (isUpdatingFromURL) return
      updateURL()
    },
    { deep: true }
  )
  stopWatchers.push(stopFiltersWatch)

  const updateURL = () => {
    // Check if route is available
    if (!route || !route.query) {
      return
    }

    const query: Record<string, string> = {}

    // Copy existing query params (excluding prefixed ones)
    Object.keys(route.query).forEach(key => {
      if (urlPrefix && key.startsWith(urlPrefix)) {
        // Skip prefixed params
        return
      }
      if (!urlPrefix && (key === 'sort' || key === 'order')) {
        // Skip non-prefixed sort params
        return
      }
      const value = route.query[key]
      if (typeof value === 'string') {
        query[key] = value
      } else if (
        Array.isArray(value) &&
        value.length > 0 &&
        typeof value[0] === 'string'
      ) {
        query[key] = value[0]
      }
    })

    // Update sort params
    if (store.sortField && store.sortField !== defaultSortField) {
      query[sortParam] = store.sortField as string
      query[orderParam] = store.sortDirection
    } else {
      // Remove sort params if using default
      delete query[sortParam]
      delete query[orderParam]
    }

    // Update filter params
    Object.keys(store.filters).forEach(filterKey => {
      const filterValue = store.filters[filterKey]
      const urlKey = urlPrefix
        ? `${urlPrefix}${filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}`
        : filterKey

      if (
        filterValue !== null &&
        filterValue !== undefined &&
        filterValue !== ''
      ) {
        query[urlKey] = String(filterValue)
      } else {
        // Remove filter param if empty
        delete query[urlKey]
      }
    })

    // Only update if query params actually changed
    const currentQuery = route.query

    // Compare all query keys
    const allKeys = new Set([
      ...Object.keys(query),
      ...Object.keys(currentQuery),
    ])

    const queryChanged = Array.from(allKeys).some(key => {
      const currentValue = currentQuery[key]
      const newValue = query[key]
      return String(newValue || '') !== String(currentValue || '')
    })

    if (queryChanged) {
      router.replace({ query })
    }
  }

  // Watch for URL changes (e.g., browser back/forward)
  const stopQueryWatch = watch(
    () => route?.query,
    () => {
      if (route && route.query) {
        syncFromURL()
      }
    },
    { deep: true }
  )
  stopWatchers.push(stopQueryWatch)

  onMounted(() => {
    // Only sync from URL if route is available
    if (route && route.query) {
      syncFromURL()
    }
  })

  onUnmounted(() => {
    // Cleanup all watchers
    stopWatchers.forEach(stop => stop())
    stopWatchers = []
  })

  return {
    syncFromURL,
  }
}
