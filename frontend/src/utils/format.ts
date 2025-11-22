import { format, formatDistanceToNowStrict, parseISO } from 'date-fns'

export const formatCurrency = (value: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value)

export const formatPercent = (value: number) => `${value.toFixed(1)}%`

export const formatDateLabel = (isoDate: string) => format(parseISO(isoDate), 'MMM d')

export const formatFullDate = (isoDate: string) => format(parseISO(isoDate), 'MMM d, yyyy')

export const formatRelativeTime = (isoDate: string) =>
  formatDistanceToNowStrict(parseISO(isoDate), { addSuffix: true })
