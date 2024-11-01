import DateObject from "react-date-object";
import { markRaw } from "vue";

export function dateItem(date,isActive=false) {
  return {
    weekday: date.toLocaleDateString("en-us", { weekday: "long" }),
    date: new Date(date),
    dayOfMonth: date.getDate(),
    month: date.toLocaleDateString("en-us", { month: "long" }),
    dateObject: markRaw(new DateObject(date)),
    isActive 
  };
}
