import { YEARS_OFFSET } from '@/constants/Offsets'

import { generateYears } from '@/utils/generateYears'
import DateObject from 'react-date-object'
import { computed, markRaw, ref } from 'vue'
import type { ICalendarOption } from '@/types/ICalendarOption'
import type { WeekDayObject } from '../types/WeekDayObject'
import { weekDayTemplate } from '../utils/weekDayTemplate'
import { generatePivotDateFromYear } from '@/utils/generatePivotDateFromYear'
import { isActiveDate } from '@/utils/isActiveDate'

export function useCalendar(
  calendarOption: ICalendarOption,
  ucurrentDate: DateObject | undefined,
  numberOfMonth: 1 | 2 | 3 = 3,
  minDate: DateObject | Date | null,
  maxDate: DateObject | Date | null,
  bannedDates: DateObject[] | ((date: DateObject) => boolean) | Date | Date[] | null,
  showOtherDays:boolean
) {
  const showMultipleMonth = numberOfMonth > 1
  const selectedDate = ref<DateObject>(
    markRaw(
      new DateObject({
        calendar: calendarOption.calender,
        locale: calendarOption.locale,
        format: calendarOption.format,
      }),
    ),
  ) // تاریخ انتخاب شده

  function isBanned(date: Date | DateObject) {
    // TODO: implment option to disable or enable dates that are not in month
    if (date instanceof Date)
      return isActiveDate(
        new DateObject({
          locale: calendarOption.locale,
          format: calendarOption.format,
          calendar: calendarOption.calender,
          date,
        }),
        minDate,
        maxDate,
        bannedDates,
      )
    else if (date instanceof DateObject) return isActiveDate(date, minDate, maxDate, bannedDates)
  }

  /// ======================================== YEAR PANEL
  // #region [Year Panel]

  /**
   * This is for storing point view of year panel
   * updates:
   *  Fn=nextYears
   *  Fn=prevYears
   *  by currentDate
   * @summary view of year panel, base on currentDate but not completely.
   */
  const currentYear = ref(
    markRaw(
      new DateObject({
        calendar: calendarOption.calender,
        locale: calendarOption.locale,
        date: new Date(),
      }),
    ),
  )

  /**
   * array of dateobject for years which should be shown on current page of year panel
   * @summary contains item of current page of year panel.
   */
  const yearsOfPeriod = computed(() => generateYears(currentYear.value, calendarOption))

  const prevYears = () => {
    const date = currentYear.value.toDate()

    date.setFullYear(date.getFullYear() - YEARS_OFFSET)
    // console.log('dd')
    updateCurrentYear(
      markRaw(
        new DateObject({
          calendar: calendarOption.calender,
          locale: calendarOption.locale,
          format: calendarOption.format,
          date,
        }),
      ),
    )
  }
  function updateCurrentYear(dateObject: DateObject) {
    currentYear.value = dateObject
  }

  const nextYears = () => {
    const date = currentYear.value.toDate()

    date.setFullYear(date.getFullYear() + YEARS_OFFSET)
    updateCurrentYear(
      markRaw(
        new DateObject({
          calendar: calendarOption.calender,
          locale: calendarOption.locale,
          format: calendarOption.format,
          date,
        }),
      ),
    )
  }

  function setYearCurrentYear(year: number) {
    currentYear.value.setYear(year)
  }

  function setMonthCurrentYear(month: number) {
    currentYear.value.setMonth(month)
  }
  // #endregion

  /// ======================================== WEEKDAY PANEL
  // #region [WeekDay Panel]
  const currentDate = ref<DateObject>(
    markRaw(
      ucurrentDate ??
        new DateObject({
          locale: calendarOption.locale,
          format: calendarOption.format,
          calendar: calendarOption.calender,
        }),
    ),
  ) // نقطه شروع تقویم کجا باشد

  // اول دوره
  const firstDayOfPeriodObject = computed<DateObject>(() =>
    new DateObject({
      calendar: calendarOption.calender,
      locale: calendarOption.locale,
      format: calendarOption.format,
      year: currentDate.value.year,
      month: currentDate.value.month.number,
      day: currentDate.value.day,
    }).toFirstOfMonth(),
  )
  // آخر دوره
  // const lastDayOfPeriodObject = computed<DateObject>(() =>
  //   new DateObject({
  //     calendar: calendarOption.calender,
  //     locale: calendarOption.locale,
  //     format: calendarOption.format,
  //     year: currentDate.value.year,
  //     month: currentDate.value.month.number + numberOfMonth - 1,
  //     day: currentDate.value.day,
  //   }).toLastOfMonth(),
  // )

  const daysOfPeriod = computed<WeekDayObject[][]>(() => {
    const days: WeekDayObject[][] = [[]]

    for (let index = 0; index < numberOfMonth; index++) {
      days[index] = []

      const currentMonth = new DateObject({
        calendar: calendarOption.calender,
        locale: calendarOption.locale,
        format: calendarOption.format,
        date: firstDayOfPeriodObject.value.toDate(),
      })

      currentMonth.setMonth(currentMonth.month.number + index)

      const firstDay = new Date(currentMonth.toFirstOfMonth().toDate())
      const lastDay = new Date(currentMonth.toLastOfMonth().toDate())

      const firstDay_Of_firstWeekOfPeriod = new DateObject({
        calendar: calendarOption.calender,
        locale: calendarOption.locale,
        format: calendarOption.format,
        date: firstDay,
      })
        .toFirstOfWeek()
        .toDate()

      for (
        let forWardStep = new Date(firstDay_Of_firstWeekOfPeriod);
        forWardStep < firstDay;
        forWardStep.setDate(forWardStep.getDate() + 1)
      ) {
        days[index].push(
          weekDayTemplate(forWardStep, calendarOption, showOtherDays, isBanned(forWardStep)),
        )
      }

      for (let i = firstDay; i <= lastDay; i.setDate(i.getDate() + 1)) {
        const temp = new Date(i)
        days[index].push(weekDayTemplate(temp, calendarOption, true, isBanned(temp)))
      }

      const lastDay_Of_lastWeekOfPeriod = new DateObject({
        calendar: calendarOption.calender,
        locale: calendarOption.locale,
        format: calendarOption.format,
        date: lastDay,
      })
        .toLastOfWeek()
        .toDate()

      const oneDay_After_end = new Date(lastDay)
      oneDay_After_end.setDate(oneDay_After_end.getDate() + 1)
      for (
        let forWardStep = new Date(oneDay_After_end);
        forWardStep <= new Date(lastDay_Of_lastWeekOfPeriod);
        forWardStep.setDate(forWardStep.getDate() + 1)
      ) {
        days[index].push(
          weekDayTemplate(forWardStep, calendarOption, showOtherDays, isBanned(forWardStep)),
        )
      }
    }

    return days
  })

  function ChangeCurrentDate(change: number, type: string) {
    if (change > 0) currentDate.value = currentDate.value.add(change, type)
    else currentDate.value = currentDate.value.subtract(change, type)
  }
  const nextMonth = () => {
    const date = currentDate.value.toDate()

    date.setMonth(date.getMonth() + 1) // Go back one month
    updateCurrentDate(
      markRaw(
        new DateObject({
          calendar: calendarOption.calender,
          locale: calendarOption.locale,
          format: calendarOption.format,
          date,
        }),
      ),
    )
  }

  const prevMonth = () => {
    const date = currentDate.value.toDate()

    date.setMonth(date.getMonth() - 1)
    updateCurrentDate(
      markRaw(
        new DateObject({
          calendar: calendarOption.calender,
          locale: calendarOption.locale,
          format: calendarOption.format,
          date,
        }),
      ),
    )
  }

  // #endregion

  //= ========================================= MONTH PANEL
  // #region [MONTH PANEL]
  const prevYear = () => {
    const date = currentDate.value.toDate()

    date.setFullYear(date.getFullYear() - 1)

    updateCurrentDate(
      markRaw(
        new DateObject({
          calendar: calendarOption.calender,
          locale: calendarOption.locale,
          format: calendarOption.format,
          date,
        }),
      ),
    )
  }
  const nextYear = () => {
    const date = currentDate.value.toDate()

    date.setFullYear(date.getFullYear() + 1)

    updateCurrentDate(
      markRaw(
        new DateObject({
          calendar: calendarOption.calender,
          locale: calendarOption.locale,
          format: calendarOption.format,
          date,
        }),
      ),
    )
  }
  function setYearCurrentDate(year: DateObject) {
    currentDate.value = markRaw(
      new DateObject({
        calendar: calendarOption.calender,
        locale: calendarOption.locale,
        format: calendarOption.format,
        year: year.year,
        month: currentDate.value.month.number,
        day: currentDate.value.day,
      }),
    )

    updateCurrentYear(markRaw(generatePivotDateFromYear(year, calendarOption)))
  }

  function setMonthCurrentDate(month: DateObject) {
    currentDate.value = markRaw(
      new DateObject({
        calendar: calendarOption.calender,
        locale: calendarOption.locale,
        format: calendarOption.format,
        year: month.year,
        month: month.month.number,
        day: month.day,
      }),
    )
  }
  // #endregion
  function updateCurrentDate(dateObject: DateObject) {
    if (dateObject instanceof DateObject && dateObject.isValid) currentDate.value = dateObject
    updateCurrentYear(markRaw(generatePivotDateFromYear(dateObject, calendarOption)))
  }

  //= =====================================================

  function updateSelectedDate(dateObject: DateObject) {
    if (dateObject instanceof DateObject && dateObject.isValid) {
      selectedDate.value = dateObject

      if (!showMultipleMonth) updateCurrentDate(dateObject)
    }
  }

  const onSeparatedInput = (year: number, month: number, day: number) => {
    const temp = markRaw(
      new DateObject({
        year,
        month,
        day,
        calendar: calendarOption.calender,
        locale: calendarOption.locale,
        format: calendarOption.format,
      }),
    )
    updateSelectedDate(temp)

    updateCurrentDate(temp)
  }

  return {
    currentDate,
    daysOfPeriod,

    setYearCurrentDate,
    setMonthCurrentDate,
    prevMonth,
    nextMonth,
    ChangeCurrentDate,
    updateCurrentDate,
    //= ==========================
    setYearCurrentYear,
    setMonthCurrentYear,
    yearsOfPeriod,
    currentYear,
    prevYears,
    nextYears,
    nextYear,
    prevYear,
    //= ===================================
    selectedDate,

    onSeparatedInput,
    updateSelectedDate,
  }
}
