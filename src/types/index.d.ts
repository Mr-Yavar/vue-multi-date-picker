import { ComponentMap, MAP_KEYS } from '@/constants/ComponentMap'
import type DateObject from 'react-date-object'

export type ComponentMapKeys = keyof typeof ComponentMap
export type SubTypeKeys<T extends ComponentMapKeys> = keyof (typeof ComponentMap)[T]
export type MapItemValues = (typeof MAP_ITEMS)[keyof typeof MAP_ITEMS]

export interface DateRange {
  start: DateObject | null
  end: DateObject | null
}

export type DateStorage<T extends ComponentMapKeys> = T extends MAP_KEYS.ONE_DATE
  ? DateObject
  : T extends MAP_KEYS.TIME
    ? DateObject
    : T extends MAP_KEYS.MULTI_DATE
      ? DateObject[]
      : T extends MAP_KEYS.MULTI_TIME
        ? DateObject[]
        : T extends MAP_KEYS.RANGE_DATE
          ? DateRange
          : T extends MAP_KEYS.MULTI_RANGE_DATE
            ? Array<DateRange>
            : never // Fallback to never if no match is found

export type PlainDateStorage<T extends ComponentMapKeys> = T extends MAP_KEYS.ONE_DATE
  ? Date
  : T extends MAP_KEYS.TIME
    ? Date
    : T extends MAP_KEYS.MULTI_DATE
      ? Date[]
      : T extends MAP_KEYS.MULTI_TIME
        ? Date[]
        : T extends MAP_KEYS.RANGE_DATE
          ? { start: Date; end: Date | null }
          : T extends MAP_KEYS.MULTI_RANGE_DATE
            ? Array<{ start: Date; end: Date | null }>
            : never

export type dateSeparatorType = ',' | '-' | '|' | '~'
