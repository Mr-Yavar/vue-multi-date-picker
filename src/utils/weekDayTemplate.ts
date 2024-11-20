import { DayOfMonth, LongMonthName, MonthIndex, Weekday } from '@/types'
import { ICalendarOption } from '@/types/ICalendarOption'
import { WeekDayObject } from '@/types/WeekDayObject'

import DateObject from 'react-date-object'
import { markRaw } from 'vue'

export function weekDayTemplate(date: Date, calendarOption: ICalendarOption, isActive: Boolean = false): WeekDayObject {
    return {
        weekday: date.toLocaleDateString('en-us', {
            weekday: 'long',
        }) as Weekday,
        date: new Date(date),
        dayOfMonth: date.getDate() as DayOfMonth,
        monthIndex: new DateObject({
            calendar: calendarOption.calender,
            locale: calendarOption.locale,
            format: calendarOption.format,
            date: new Date(date),
        }).monthIndex as MonthIndex,
        month: date.toLocaleDateString('en-us', { month: 'long' }) as LongMonthName,
        dateObject: markRaw(
            new DateObject({
                calendar: calendarOption.calender,
                locale: calendarOption.locale,
                format: calendarOption.format,
                date,
            }),
        ),
        isActive,
    }
}
