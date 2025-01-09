import { ComponentMap } from '@/constants/ComponentMap'

export type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'

export type DayOfMonth =
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26
    | 27
    | 28
    | 29
    | 30

type LongMonthName = 'January' | 'February' | 'March' | 'April' | 'May' | 'June' | 'July' | 'August' | 'September' | 'October' | 'November' | 'December'

type MonthIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

export type ComponentMapKeys = keyof typeof ComponentMap
export type SubTypeKeys<T extends ComponentMapKeys> = keyof (typeof ComponentMap)[T]
export type MapItemValues = (typeof MAP_ITEMS)[keyof typeof MAP_ITEMS]
export type dateSeparatorType = ',' | '-' | '|' | '~'
