import DateObject from 'react-date-object'
import { markRaw, Raw, ref } from 'vue'
import { ICalendarOption } from '../types/ICalendarOption'

export function useTimePicker(calendarOption: ICalendarOption, currentDate: DateObject = new DateObject()) {
    const selectedTime = ref<Raw<DateObject>>(
        markRaw(
            new DateObject({
                calendar: calendarOption.calender,
                locale: calendarOption.locale,
                format: calendarOption.format,
            }),
        ),
    ) // ساعت انتخاب شده
    const hour = ref<number>(currentDate.hour) // تایپ ساعت پایین تقویم
    const minute = ref<number>(currentDate.minute) // تایپ دقیقه پایین تقویم
    const second = ref<number>(currentDate.second) // تایپ ثانیه پایین تقویم

    function setSelectedTime(uhour: number, uminute: number, usecond: number) {
        selectedTime.value = markRaw(
            new DateObject({
                calendar: calendarOption.calender,
                locale: calendarOption.locale,
                format: calendarOption.format,
                date: new Date(
                    selectedTime.value.toDate().getFullYear(),
                    selectedTime.value.toDate().getMonth(),
                    selectedTime.value.toDate().getDate(),
                    uhour,
                    uminute,
                    usecond,
                ),
            }),
        )
    }

    function onSeparatedInput(uhour: number, uminute: number, usecond: number) {
        hour.value = uhour
        minute.value = uminute
        second.value = usecond
        setSelectedTime(uhour, uminute, usecond)
    }

    function onRawInput(rawTime: string, format: string) {
        const txtTime = new Date().toISOString().split('T')[0] + ' ' + rawTime
        const dateObject = new DateObject({
            calendar: calendarOption.calender,
            locale: calendarOption.locale,
            format: 'YYYY-MM-DD ' + format,
            date: txtTime,
        })

        setSelectedTime(dateObject.hour, dateObject.minute, dateObject.second)
    }

    return { hour, minute, second, selectedTime, onSeparatedInput, onRawInput }
}
