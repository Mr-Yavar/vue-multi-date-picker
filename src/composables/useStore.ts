import { ComponentMapKeys, DateRange, DateStorage } from '@/types'
import { ICalendarOption } from '@/types/ICalendarOption'
import { compareDate } from '@/utils/compareDate'
import DateObject from 'react-date-object'

import { computed, markRaw, reactive, readonly, Ref, ref, toRaw } from 'vue'
interface Data<T extends ComponentMapKeys> {
    data: DateStorage<T> | null
}
export function useStore<T extends ComponentMapKeys>(Map: T, calendarOption: ICalendarOption) {
    const index = ref<number>(0)
    const isStart = ref<boolean>(true)

    function applyStart(is: boolean) {
        isStart.value = is
    }

    const storage = reactive<Data<T>>({ data: null })
    console.log(Map, storage)
    // Function to check if a date or range exists in storage based on mode
    function existsInStorage(value: DateObject): number {
        switch (Map) {
            case 'ONE_DATE':
                return storage.data !== null && value instanceof DateObject && compareDate((storage.data as DateObject).toDate(), '===', value.toDate())
                    ? 1
                    : -1

            case 'MULTI_DATE':
                if (storage.data === null) return -1
                return (storage.data as DateObject[])?.findIndex((day) => compareDate(day.toDate(), '===', value.toDate())) ?? -1

            case 'RANGE_DATE':
                if (storage.data === null) return -1

                const rangeStorage = storage.data as DateRange

                if (rangeStorage?.start == null || rangeStorage?.end == null) return -1

                const startMatch = compareDate(rangeStorage.start?.toDate(), '<=', value.toDate())

                const endMatch = compareDate(rangeStorage.end?.toDate(), '>=', value.toDate())

                return startMatch && endMatch ? 1 : -1

            case 'MULTI_RANGE_DATE':
                if (storage === null) return -1

                const multiRangeStorage = storage.data as Array<DateRange>
                return (
                    multiRangeStorage?.findLastIndex((range) => {
                        const rangeStorage = range

                        if (rangeStorage?.start == null || rangeStorage?.end == null) return false

                        const startMatch = compareDate(rangeStorage.start?.toDate(), '<=', value.toDate())

                        const endMatch = compareDate(rangeStorage.end?.toDate(), '>=', value.toDate())
                        return startMatch && endMatch
                    }) ?? -1
                )

            default:
                return -1 // Fallback in case of an unexpected mode
        }
    }

    function setIndex(newIndex: number) {
        index.value = newIndex
    }

    function setLoc(newLoc: boolean) {
        switch (Map) {
            case 'ONE_DATE':
            case 'TIME':
            case 'MULTI_TIME':
            case 'MULTI_DATE':
                return
            case 'RANGE_DATE':
                const range = storage.data as DateRange
                if (newLoc) isStart.value = true

            case 'MULTI_RANGE_DATE':

            default:
        }
    }

    function addToStorage(selectedDate: DateObject, selectedTime: DateObject) {
        console.log(selectedTime.format(calendarOption.format))
        console.log(selectedDate.format(calendarOption.format))

        const value = markRaw(
            new DateObject({
                calendar: calendarOption.calender,
                locale: calendarOption.locale,
                format: calendarOption.format as string,
                date: selectedDate.toDate(),
            }),
        )
        value.setHour(selectedTime.hour)
        value.setMinute(selectedTime.minute)
        value.setSecond(selectedTime.second)
        switch (Map) {
            case 'ONE_DATE':
            case 'TIME':
                ;(storage.data as DateObject) = value // Store a single DateObject
                break

            case 'MULTI_TIME':
            case 'MULTI_DATE':
                if (!storage.data) {
                    ;(storage.data as unknown) = [] // Initialize as an array if it's not already
                }
                ;(storage.data as DateObject[])[index.value] = value // Add the new date object
                index.value = (storage.data as DateObject[]).length
                break

            case 'RANGE_DATE':
                if (!(storage.data as DateRange)) (storage.data as DateRange) = { start: null, end: null }

                const dateRange = storage.data as DateRange

                if (isStart.value) {
                    dateRange.start = value
                    applyStart(false)
                } else {
                    if (dateRange.start != null && dateRange.start?.toDate() <= value.toDate()) {
                        dateRange.end = value
                    } else {
                        dateRange.start = value
                        dateRange.end = null
                    }
                }

                break

            case 'MULTI_RANGE_DATE':
                {
                    if (!(storage.data as Array<DateRange>)) (storage.data as Array<DateRange>) = [{ start: null, end: null }]

                    if (!(storage.data as Array<DateRange>)[index.value]) (storage.data as Array<DateRange>)[index.value] = { start: null, end: null }

                    const dateRange = (storage.data as Array<DateRange>)[index.value] as DateRange

                    if (isStart.value) {
                        dateRange.start = value
                        applyStart(false)
                    } else {
                        if (dateRange.start != null && dateRange.start?.toDate() <= value.toDate()) {
                            dateRange.end = value
                            index.value++
                        } else {
                            dateRange.start = value
                            dateRange.end = null
                        }
                    }
                }
                break

            default:
        }
    }

    function toString(rangeSeparator: string, dateSeparator: string): string {
        const dateFormat = calendarOption.format
        switch (Map) {
            case 'ONE_DATE':
            case 'TIME':
                console.log(storage)
                // For a single DateObject, format it directly
                return (storage.data as DateObject).format(dateFormat)

            case 'MULTI_TIME':
            case 'MULTI_DATE':
                console.log(Map)

                // For an array of DateObjects, format each and join with a comma
                return (storage.data as DateObject[])?.map((date) => date.format(dateFormat)).join(dateSeparator)

            case 'RANGE_DATE':
                // For a DateRange, format the start and end dates
                const range = storage.data as DateRange
                return `${range.start?.format(dateFormat)}${dateSeparator}${!!range.end ? range.end?.format(dateFormat) : ''}`

            case 'MULTI_RANGE_DATE':
                // For an array of DateRanges, format each range and join with a semicolon
                const ranges = storage.data as Array<DateRange>
                return ranges?.map((range) => `${range.start?.format(dateFormat)}${dateSeparator}${range.end?.format(dateFormat)}`).join(rangeSeparator)

            default:
                // Return an empty string for unknown types
                return ''
        }
    }

    function fromString(input: string, rangeSeparator: string, dateSeparator: string): any {
        let empty = false
        if (input.replaceAll(rangeSeparator, '').replaceAll(dateSeparator, '').trim().length == 0) empty = true

        switch (Map) {
            case 'ONE_DATE':
            case 'TIME':
                // For a single DateObject, parse it directly
                ;(storage.data as DateObject) = markRaw(
                    new DateObject({
                        date: input,
                        calendar: calendarOption.calender,
                        locale: calendarOption.locale,
                        format: calendarOption.format as string,
                    }),
                )
                break
            case 'MULTI_TIME':
            case 'MULTI_DATE':
                // For an array of DateObjects, split by dateSeparator and parse each
                ;(storage.data as DateObject[]) = !empty
                    ? input.split(dateSeparator).map((dateStr) =>
                          markRaw(
                              new DateObject({
                                  date: dateStr,
                                  calendar: calendarOption.calender,
                                  locale: calendarOption.locale,
                                  format: calendarOption.format as string,
                              }),
                          ),
                      )
                    : []

                index.value = (storage.data as DateObject[]).length
                break

            case 'RANGE_DATE':
                // For a DateRange, split by dateSeparator to get start and end dates
                const [startStr, endStr] = input.split(dateSeparator)
                const startDate = markRaw(
                    new DateObject({
                        date: startStr,
                        calendar: calendarOption.calender,
                        locale: calendarOption.locale,
                        format: calendarOption.format as string,
                    }),
                )
                const endDate = markRaw(
                    new DateObject({
                        date: endStr,
                        calendar: calendarOption.calender,
                        locale: calendarOption.locale,
                        format: calendarOption.format as string,
                    }),
                )

                ;(storage.data as DateRange) = { start: startDate, end: endDate }
                break

            case 'MULTI_RANGE_DATE':
                // For an array of DateRanges, split by rangeSeparator and then by dateSeparator
                ;(storage.data as DateRange[]) = !empty
                    ? input.split(rangeSeparator).map((rangeStr) => {
                          const [startStr, endStr] = rangeStr.split(dateSeparator)

                          const startDate = markRaw(
                              new DateObject({
                                  date: startStr,
                                  calendar: calendarOption.calender,
                                  locale: calendarOption.locale,
                                  format: calendarOption.format as string,
                              }),
                          )
                          const endDate = markRaw(
                              new DateObject({
                                  date: endStr,
                                  calendar: calendarOption.calender,
                                  locale: calendarOption.locale,
                                  format: calendarOption.format as string,
                              }),
                          )

                          return { start: startDate, end: endDate } as DateRange
                      })
                    : []

                index.value = (storage.data as DateRange[]).length

                break

            default:
                // Return null or throw an error for unknown types
                return null
        }
    }

    function removeFromStorage(dIndex: number) {
        switch (Map) {
            case 'MULTI_DATE':
            case 'MULTI_TIME':
                ;(storage.data as DateObject[]).splice(dIndex, 1)
                index.value = (storage.data as DateObject[]).length
        }
    }

    const dataSource = computed(() => readonly(storage))

    return { existsInStorage, setIndex, addToStorage, toString, fromString, removeFromStorage, dataSource }
}
