import DateObject from "react-date-object";
import { DayOfMonth, LongMonthName, MonthIndex, Weekday } from ".";

export interface WeekDayObject {
  weekday: Weekday;
  date: Date;
  dayOfMonth: DayOfMonth;
  monthIndex: MonthIndex;
  month: LongMonthName;
  dateObject: DateObject;
  isActive: boolean;
}
