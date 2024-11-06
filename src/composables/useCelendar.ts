import { YEARS_OFFSET } from "@/constants/Offsets";
import { ComponentType } from "@/types";
import { convertToEnglishNumbers } from "@/utils/convertToEnglishNumbers";
import { generateYears } from "@/utils/generateYears";
import DateObject from "react-date-object";
import { computed, markRaw, ref } from "vue";
import { ICalenderOption } from "../types/ICalenderOption";
import { WeekDayObject } from "../types/WeekDayObject";
import { weekDayTemplate } from "../utils/weekDayTemplate";

export function useCalendar(
  calendarOption: ICalenderOption,
  ucurrentDate: DateObject | undefined,
  type: ComponentType
) {
  /// ======================================== YEAR PANEL
  const currentYear = ref(
    markRaw(
      new DateObject({
        calendar: calendarOption.calender,
        locale: calendarOption.locale,
        date: new Date(),
      })
    )
  );

  const yearsOfPeriod = computed(() =>
    generateYears(currentYear.value, calendarOption)
  );

  const prevYears = () => {
    const date = currentYear.value.toDate();

    date.setFullYear(date.getFullYear() - YEARS_OFFSET);
    console.log("dd")
    updateCurrentYear(
      markRaw(
        new DateObject({
          calendar: calendarOption.calender,
          locale: calendarOption.locale,
          format: calendarOption.format,
          date: date,
        })
      )
    );
  };
  function updateCurrentYear(dateObject: DateObject) {
    currentYear.value = dateObject;
  }

  const nextYears = () => {
    const date = currentYear.value.toDate();

    date.setFullYear(date.getFullYear() + YEARS_OFFSET);
    updateCurrentYear(
      markRaw(
        new DateObject({
          calendar: calendarOption.calender,
          locale: calendarOption.locale,
          format: calendarOption.format,
          date: date,
        })
      )
    );
  };

  /// ======================================== YEAR PANEL

  const currentDate = ref<DateObject>(
    markRaw(
      ucurrentDate ??
        new DateObject({
          locale: calendarOption.locale,
          format: calendarOption.format,
          calendar: calendarOption.calender,
        })
    )
  ); // نقطه شروع تقویم کجا باشد

  const selectedDate = ref<DateObject>(
    markRaw(
      new DateObject({
        calendar: calendarOption.calender,
        locale: calendarOption.locale,
        format: calendarOption.format,
      })
    )
  ); // تاریخ انتخاب شده

  // اول دوره
  const firstDayOfPeriodObject = computed<DateObject>(() =>
    new DateObject({
      calendar: calendarOption.calender,
      locale: calendarOption.locale,
      format: calendarOption.format,
      date: currentDate.value.toDate(),
    }).toFirstOfMonth()
  );
  // آخر دوره
  const lastDayOfPeriodObject = computed<DateObject>(() =>
    new DateObject({
      calendar: calendarOption.calender,
      locale: calendarOption.locale,
      format: calendarOption.format,
      date: currentDate.value.toDate(),
    }).toLastOfMonth()
  );

  const daysOfPeriod = computed<WeekDayObject[]>(() => {
    const firstDay = firstDayOfPeriodObject.value.toDate();
    const lastDay = lastDayOfPeriodObject.value.toDate();

    const days: WeekDayObject[] = [];

    const firstDay_Of_firstWeekOfPeriod = new DateObject({
      calendar: calendarOption.calender,
      locale: calendarOption.locale,
      format: calendarOption.format,
      date: firstDay,
    })
      .toFirstOfWeek()
      .toDate();

    for (
      let forWardStep = new Date(firstDay_Of_firstWeekOfPeriod);
      forWardStep < firstDay;
      forWardStep.setDate(forWardStep.getDate() + 1)
    ) {
      days.push(weekDayTemplate(forWardStep, false));
    }

    for (let i = firstDay; i <= lastDay; i.setDate(i.getDate() + 1)) {
      let temp = new Date(i);
      days.push(weekDayTemplate(temp, calendarOption, true));
    }

    const lastDay_Of_lastWeekOfPeriod = new DateObject({
      calendar: calendarOption.calender,
      locale: calendarOption.locale,
      format: calendarOption.format,
      date: lastDay,
    })
      .toLastOfWeek()
      .toDate();

    for (
      let backWardStep = new Date(lastDay_Of_lastWeekOfPeriod);
      backWardStep > lastDay;
      backWardStep.setDate(backWardStep.getDate() - 1)
    ) {
      days.push(weekDayTemplate(backWardStep, false));
    }

    return days;
  });

  function ChangeCurrentDate(change: number, type: string) {
    if (change > 0) currentDate.value = currentDate.value.add(change, type);
    else currentDate.value = currentDate.value.subtract(change, type);
  }
  const nextMonth = () => {
    const date = currentDate.value.toDate();

    date.setMonth(date.getMonth() + 1); // Go back one month
    updateCurrentDate(
      markRaw(
        new DateObject({
          calendar: calendarOption.calender,
          locale: calendarOption.locale,
          format: calendarOption.format,
          date: date,
        })
      )
    );
  };

  const prevMonth = () => {
    const date = currentDate.value.toDate();

    date.setMonth(date.getMonth() - 1);
    updateCurrentDate(
      markRaw(
        new DateObject({
          calendar: calendarOption.calender,
          locale: calendarOption.locale,
          format: calendarOption.format,
          date: date,
        })
      )
    );
  };

  function updateSelectedDate(dateObject: DateObject) {
    if (dateObject instanceof DateObject && dateObject.isValid) {
      selectedDate.value = dateObject;

      updateCurrentDate(dateObject);
    }
  }

  function updateCurrentDate(dateObject: DateObject) {
    if (dateObject instanceof DateObject && dateObject.isValid)
      currentDate.value = dateObject;
  }

  const onSeparatedInput = (year: number, month: number, day: number) => {
    const temp = markRaw(
      new DateObject({
        year: year,
        month: month,
        day: day,
        calendar: calendarOption.calender,
        locale: calendarOption.locale,
        format: calendarOption.format,
      })
    );
    updateSelectedDate(temp);

    updateCurrentDate(temp);
  };

  return {
    selectedDate,
    currentDate,
    daysOfPeriod,
    prevMonth,
    nextMonth,
    ChangeCurrentDate,
    updateCurrentDate,
    onSeparatedInput,
    updateSelectedDate,
    prevYears,
    nextYears,
    yearsOfPeriod,
  };
}
