import type { ICalendarOption } from '@/types/ICalendarOption'
import type { WeekDayObject } from '@/types/WeekDayObject'

import DateObject from 'react-date-object'
import { markRaw } from 'vue'

export function weekDayTemplate(
  date: Date,
  calendarOption: ICalendarOption,
  isActive: boolean = false,
  isBanned: boolean = false,
): WeekDayObject {
  return {
    weekday: date.toLocaleDateString('en-us', {
      weekday: 'long',
    }),
    date: new Date(date),
    dayOfMonth: date.getDate(),
    monthIndex: new DateObject({
      calendar: calendarOption.calender,
      locale: calendarOption.locale,
      format: calendarOption.format,
      date: new Date(date),
    }).monthIndex,
    month: date.toLocaleDateString('en-us', { month: 'long' }),
    dateObject: markRaw(
      new DateObject({
        calendar: calendarOption.calender,
        locale: calendarOption.locale,
        format: calendarOption.format,
        date,
      }),
    ),
    isActive,
    isBanned,
  }
}
