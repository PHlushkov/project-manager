import { ref, watch } from 'vue'
import { useUIStore } from '@/store/ui'

interface UseColumnResizeOptions {
  defaultWidths: Record<string, number>
  tableType: 'projects' | 'tasks'
}

/**
 * Composable for handling table column resizing
 */
export function useColumnResize(options: UseColumnResizeOptions) {
  const { defaultWidths, tableType } = options
  const uiStore = useUIStore()

  const columnWidths = ref<Record<string, number>>(
    (tableType === 'projects'
      ? uiStore.projectsTableSettings.columnWidths
      : uiStore.tasksTableSettings.columnWidths) || defaultWidths
  )

  let resizeStartX = 0
  let resizeColumn = ''
  let resizeStartWidth = 0

  const startResize = (e: MouseEvent, columnKey: string) => {
    e.preventDefault()
    resizeStartX = e.clientX
    resizeColumn = columnKey
    resizeStartWidth = columnWidths.value[columnKey] || 100

    document.addEventListener('mousemove', handleResize)
    document.addEventListener('mouseup', stopResize)
  }

  const handleResize = (e: MouseEvent) => {
    const diff = e.clientX - resizeStartX
    const newWidth = Math.max(50, resizeStartWidth + diff)
    columnWidths.value[resizeColumn] = newWidth
  }

  const stopResize = () => {
    // Save column widths to UI store
    if (tableType === 'projects') {
      uiStore.updateProjectsTableSettings({
        columnWidths: { ...columnWidths.value },
      })
    } else {
      uiStore.updateTasksTableSettings({
        columnWidths: { ...columnWidths.value },
      })
    }
    document.removeEventListener('mousemove', handleResize)
    document.removeEventListener('mouseup', stopResize)
  }

  // Watch for column widths changes and save to store
  watch(
    columnWidths,
    newWidths => {
      if (tableType === 'projects') {
        uiStore.updateProjectsTableSettings({
          columnWidths: { ...newWidths },
        })
      } else {
        uiStore.updateTasksTableSettings({
          columnWidths: { ...newWidths },
        })
      }
    },
    { deep: true }
  )

  return {
    columnWidths,
    startResize,
  }
}
