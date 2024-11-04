import { DayOfMonth, LongMonthName, MonthIndex, Weekday } from "@/types";
import { CalenderOption } from "@/types/calenderOption";
import { WeekDayObject } from "@/types/WeekDayObject";

import DateObject from "react-date-object";
import { markRaw } from "vue";

export function weekDayTemplate(
  date: Date,
  calendarOption: CalenderOption,
  isActive: Boolean = false
): WeekDayObject {
  return {
    weekday: date.toLocaleDateString("en-us", {
      weekday: "long",
    }) as Weekday,
    date: new Date(date),
    dayOfMonth: date.getDate() as DayOfMonth,
    monthIndex: new DateObject({ ...calendarOption, date })
      .monthIndex as MonthIndex,
    month: date.toLocaleDateString("en-us", { month: "long" }) as LongMonthName,
    dateObject: markRaw(new DateObject({ ...calendarOption, date })),
    isActive,
  };
}
