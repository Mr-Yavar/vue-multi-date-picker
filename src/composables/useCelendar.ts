import DateObject from "react-date-object";
import { computed, markRaw, ref } from "vue";
import { WeekDayObject } from "../types/WeekDayObject";
import { weekDayTemplate } from "../utils/weekDayTemplate";

export function useCalendar(calendarOption, ucurrentDate) {
  const currentDate = ref(
    markRaw(ucurrentDate ?? new DateObject({ ...calendarOption }))
  ); // نقطه شروع تقویم کجا باشد

  const selectedDate = ref(markRaw(new DateObject({ ...calendarOption }))); // تاریخ انتخاب شده

  // اول دوره
  const firstDayOfPeriodObject = computed(() =>
    new DateObject({
      ...calendarOption,
      date: currentDate.value.toDate(),
    }).toFirstOfMonth()
  );
  // آخر دوره
  const lastDayOfPeriodObject = computed(() =>
    new DateObject({
      ...calendarOption,
      date: currentDate.value.toDate(),
    }).toLastOfMonth()
  );

  const daysOfPeriod = computed(() => {
    const firstDay = firstDayOfPeriodObject.value.toDate();
    const lastDay = lastDayOfPeriodObject.value.toDate();

    const days: WeekDayObject[] = [];

    const firstDay_Of_firstWeekOfPeriod = new DateObject({
      ...calendarOption,
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
      ...calendarOption,
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

  function ChangeCurrentDate(change, type) {
    if (change > 0) currentDate.value = currentDate.value.add(change, type);
    else currentDate.value = currentDate.value.subtract(change, type);
  }

  const prevMonth = () => {
    const date = currentDate.value.toDate();

    date.setMonth(date.getMonth() - 1);
    updateCurrentDate(
      markRaw(new DateObject({ ...calendarOption, date: date }))
    );
  };

  const nextMonth = () => {
    const date = currentDate.value.toDate();

    date.setMonth(date.getMonth() + 1); // Go back one month
    updateCurrentDate(
      markRaw(new DateObject({ ...calendarOption, date: date }))
    );
  };

  function updateSelectedDate(dateObject) {
    if (dateObject instanceof DateObject && dateObject.isValid) {
      selectedDate.value = dateObject;
      updateCurrentDate(dateObject);
    }
  }

  function updateCurrentDate(dateObject) {
    if (dateObject instanceof DateObject && dateObject.isValid)
      currentDate.value = dateObject;
  }

  const onSeparatedInput = (year, month, day) => {
    const temp = markRaw(
      new DateObject({ year, month, day, ...calendarOption })
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
    onSeparatedInput,
    updateSelectedDate,
  };
}
