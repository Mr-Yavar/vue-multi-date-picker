import { ComponentMapKeys, DateRange, DateStorage } from '@/types'
import { ICalendarOption } from '@/types/ICalendarOption'
import DateObject from 'react-date-object'

import { markRaw, Ref, ref } from 'vue'

export function useStore<T extends ComponentMapKeys>(Map: T, calendarOption: ICalendarOption) {
    const index = ref<number>(0)
    const isStart = ref<boolean>(true)

    const storage = ref<DateStorage<T>>()
    console.log(Map, storage.value)
    // Function to check if a date or range exists in storage based on mode
    function existsInStorage(value: DateObject): boolean {
        switch (Map) {
            case 'ONE_DATE':
                return (
                    storage.value !== null &&
                    value instanceof DateObject &&
                    (value.toDate() as Date).toDateString() === ((storage.value as DateObject)?.toDate() as Date)?.toDateString()
                )

            case 'MULTI_DATE':
                if (storage.value === null) return false
                return (storage.value as DateObject[]).some((day) => (day.toDate() as Date)?.toDateString() === (value.toDate() as Date)?.toDateString())

            case 'RANGE_DATE':
                if (storage.value === null) return false

                const rangeStorage = storage.value as DateRange

                if (rangeStorage.start == null) return false

                const startMatch = rangeStorage.start?.toDate() >= value.toDate()

                if (rangeStorage.end == null) return startMatch
                const endMatch = rangeStorage.end.toDate() <= value.toDate()
                return startMatch && endMatch

            case 'MULTI_RANGE_DATE':
                if (storage.value === null) return false

                const multiRangeStorage = storage.value as Array<DateRange>
                return multiRangeStorage.some((range) => {
                    const rangeStorage = range

                    if (rangeStorage.start == null) return false

                    const startMatch = rangeStorage.start?.toDate() >= value.toDate()

                    if (rangeStorage.end == null) return startMatch
                    const endMatch = rangeStorage.end.toDate() <= value.toDate()
                    return startMatch && endMatch
                })

            default:
                return false // Fallback in case of an unexpected mode
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
                const range = storage.value as DateRange
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
                ;(storage as Ref<DateObject>).value = value // Store a single DateObject
                break

            case 'MULTI_TIME':
            case 'MULTI_DATE':
                if (!Array.isArray(storage.value)) {
                    ;(storage as Ref<DateObject[]>).value = [] // Initialize as an array if it's not already
                }
                ;(storage.value as DateObject[])[index.value] = value // Add the new date object
                break

            case 'RANGE_DATE':
                if (isStart) {
                    ;(storage as Ref<DateRange>).value.start = value
                } else {
                    if ((storage as Ref<DateRange>).value.start != null) (storage as Ref<DateRange>).value.end = value
                    else (storage as Ref<DateRange>).value.start = value
                }

                break

            case 'MULTI_RANGE_DATE':
                if (!(storage as Ref<Array<DateRange>>).value) (storage as Ref<Array<DateRange>>).value = [{ start: null, end: null }]

                if (!(storage as Ref<Array<DateRange>>).value[index.value]) (storage as Ref<Array<DateRange>>).value[index.value] = { start: null, end: null }

                const range = (storage as Ref<Array<DateRange>>).value[index.value]

                if (isStart) range.start = value
                else if (!range.start) range.start = value
                else range.end = value

                break

            default:
        }
    }

    function toString(rangeSeparator: string, dateSeparator: string): string {
        const dateFormat = calendarOption.format

        switch (Map) {
            case 'ONE_DATE':
            case 'TIME':
                console.log(storage.value)
                // For a single DateObject, format it directly
                return (storage.value as DateObject).format(dateFormat)

            case 'MULTI_TIME':
            case 'MULTI_DATE':
                // For an array of DateObjects, format each and join with a comma
                return (storage.value as DateObject[]).map((date) => date.format(dateFormat)).join(dateSeparator)

            case 'RANGE_DATE':
                // For a DateRange, format the start and end dates
                const range = storage.value as DateRange
                return `${range.start?.format(dateFormat)}${dateSeparator}${range.end?.format(dateFormat)}`

            case 'MULTI_RANGE_DATE':
                // For an array of DateRanges, format each range and join with a semicolon
                const ranges = storage.value as Array<DateRange>
                return ranges.map((range) => `${range.start?.format(dateFormat)}${dateSeparator}${range.end?.format(dateFormat)}`).join(rangeSeparator)

            default:
                // Return an empty string for unknown types
                return ''
        }
    }

    function fromString(input: string, rangeSeparator: string, dateSeparator: string): any {
        switch (Map) {
            case 'ONE_DATE':
            case 'TIME':
                // For a single DateObject, parse it directly
                ;(storage as Ref<DateObject>).value = markRaw(
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
                ;(storage as Ref<DateObject[]>).value = input.split(dateSeparator).map((dateStr) =>
                    markRaw(
                        new DateObject({
                            date: dateStr,
                            calendar: calendarOption.calender,
                            locale: calendarOption.locale,
                            format: calendarOption.format as string,
                        }),
                    ),
                )
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

                ;(storage as Ref<DateRange>).value = { start: startDate, end: endDate }
                break

            case 'MULTI_RANGE_DATE':
                // For an array of DateRanges, split by rangeSeparator and then by dateSeparator
                ;(storage as Ref<DateRange[]>).value = input.split(rangeSeparator).map((rangeStr) => {
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
                break

            default:
                // Return null or throw an error for unknown types
                return null
        }
    }

    return { existsInStorage, setIndex, addToStorage, toString, fromString, storage }
}
