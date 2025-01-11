import { ComponentMap } from '@/constants/ComponentMap'
import DateObject from 'react-date-object'

export type ComponentMapKeys = keyof typeof ComponentMap
export type SubTypeKeys<T extends ComponentMapKeys> = keyof (typeof ComponentMap)[T]
export type MapItemValues = (typeof MAP_ITEMS)[keyof typeof MAP_ITEMS]

export interface DateRange {
    start: DateObject | null
    end: DateObject | null
}

export type DateStorage<T extends ComponentMapKeys> = T extends 'ONE_DATE'
    ? DateObject
    : T extends 'TIME'
      ? DateObject
      : T extends 'MULTI_DATE'
        ? DateObject[]
        : T extends 'MULTI_TIME'
          ? DateObject[]
          : T extends 'RANGE_DATE'
            ? DateRange
            : T extends 'MULTI_RANGE_DATE'
              ? Array<DateRange>
              : never // Fallback to never if no match is found



export type dateSeparatorType = ',' | '-' | '|' | '~'
