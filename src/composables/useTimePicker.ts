import DateObject from 'react-date-object'
import { markRaw, type Raw, ref } from 'vue'
import type { ICalendarOption } from '../types/ICalendarOption'

export function useTimePicker(
  calendarOption: ICalendarOption,
  currentDate: DateObject = new DateObject(),
) {
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

  function setSelectedTime(userHour: number, userMinute: number, userSecond: number) {
    selectedTime.value = markRaw(
      new DateObject({
        calendar: calendarOption.calender,
        locale: calendarOption.locale,
        format: calendarOption.format,
        date: new Date(
          selectedTime.value.toDate().getFullYear(),
          selectedTime.value.toDate().getMonth(),
          selectedTime.value.toDate().getDate(),
          userHour,
          userMinute,
          userSecond,
        ),
      }),
    )
  }

  function onSeparatedInput(userHour: number, userMinute: number, userSecond: number) {
    hour.value = userHour
    minute.value = userMinute
    second.value = userSecond
  
    setSelectedTime(userHour, userMinute, userSecond)
  }

  function onRawInput(rawTime: string) {
    const txtTime = rawTime
    const dateObject = new DateObject({
      calendar: calendarOption.calender,
      locale: calendarOption.locale,
      format: calendarOption.format,
      date: txtTime,
    })
    if (dateObject.toDate().toString() == 'Invalid Date') {
      dateObject.setYear(selectedTime.value.year)
      dateObject.setMonth(selectedTime.value.month.number)
      dateObject.setDay(selectedTime.value.day)
    }

    onSeparatedInput(
      !isNaN(dateObject.hour) ? dateObject.hour : 0,
      !isNaN(dateObject.minute) ? dateObject.minute : 0,
      !isNaN(dateObject.second) ? dateObject.second : 0,
    )
  }

  return { hour, minute, second, selectedTime, onSeparatedInput, onRawInput }
}
