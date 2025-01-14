import type { ICalendarOption } from '@/types/ICalendarOption'
import DateObject from 'react-date-object'

export function generateYears(point: DateObject, calendarOption: ICalendarOption): DateObject[] {
  const pointDate = point.toDate()

  const result: DateObject[] = []

  for (let i = -4; i < 8; i++) {
    const temp = new Date(pointDate)

    temp.setFullYear(temp.getFullYear() + i)

    result.push(
      new DateObject({
        calendar: calendarOption.calender,
        locale: calendarOption.locale,
        format: calendarOption.format,
        date: temp,
      }),
    )
  }

  return result
}
