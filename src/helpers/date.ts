/**
 * Format date to Ukrainian locale string
 * @param dateString - ISO date string
 * @returns Formatted date string in format DD.MM.YYYY
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}
