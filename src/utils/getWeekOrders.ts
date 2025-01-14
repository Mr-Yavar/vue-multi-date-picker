import { WEEKENDS } from '@/constants/Weekends'
import type { Locale } from 'react-date-object'

export function getWeekOrders(locale: Locale): string[][] {
  const locale_name: keyof typeof WEEKENDS = locale.name.split('_')[0] as keyof typeof WEEKENDS
  const weekendIndices = WEEKENDS[locale_name]
  const weekOrder: string[][] = []

  // Add weekdays in order
  for (let i = 0; i < locale.weekDays.length; i++) {
    if (!weekendIndices.includes(i)) {
      weekOrder.push(locale.weekDays[i])
    }
  }

  // Add weekends to the end of the week
  weekendIndices.forEach((index) => {
    weekOrder.push(locale.weekDays[index])
  })

  return weekOrder
}
