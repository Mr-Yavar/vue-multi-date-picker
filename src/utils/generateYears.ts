import { ICalenderOption } from "@/types/ICalenderOption";
import DateObject from "react-date-object";

export function generateYears(
  point: DateObject,
  calendarOption: ICalenderOption
): DateObject[] {
  let pointDate = point.toDate();

  const result: DateObject[] = [];

  for (let i = -4; i < 8; i++) {
    let temp = new Date(pointDate);

    temp.setFullYear(temp.getFullYear() + i);

    result.push(
      new DateObject({
        calendar: calendarOption.calender,
        locale: calendarOption.locale,
        format: calendarOption.format,
        date: temp,
      })
    );
  }

  return result;
}
