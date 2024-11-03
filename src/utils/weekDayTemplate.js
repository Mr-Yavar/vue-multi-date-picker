import DateObject from "react-date-object";
import { markRaw } from "vue";

export function weekDayTemplate(date,calendarOption,isActive=false) {
  return {
    weekday: date.toLocaleDateString("en-us", { weekday: "long" }),
    date: new Date(date),
    dayOfMonth: date.getDate(),
    month: date.toLocaleDateString("en-us", { month: "long" }),
    dateObject: markRaw(new DateObject({...calendarOption,date})),
    isActive 
  };
}
