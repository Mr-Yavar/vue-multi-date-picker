import { YEARS_OFFSET } from "@/constants/Offsets";
import { ICalenderOption } from "@/types/ICalenderOption";
import DateObject from "react-date-object";



/// if you pass year dateobject to this function , output will be pivot year
/// so if ypu pass its output to generateYears you will have table of years 
export function generatePivotDateFromYear(
  point: DateObject,
  calendarOption: ICalenderOption
): DateObject {
  let now = new DateObject({
    calendar: calendarOption.calender,
    locale: calendarOption.locale,
    format: calendarOption.format,
    date: new Date(),
  });

  let seed = point.year;
  let pivot = now.year;

  if (pivot > seed) {
    let diff = pivot - seed;

    let new_pivot = pivot - (diff - (diff % YEARS_OFFSET));

    console.log(new_pivot,seed,new_pivot - seed >= 5 )

    if (new_pivot > seed && new_pivot - seed >= 5) {
      new_pivot -= YEARS_OFFSET;
    }

    now.setYear(new_pivot)
    return now;
  } else if (pivot < seed) {
    let diff = seed - pivot;

    let new_pivot = pivot + (diff - (diff % YEARS_OFFSET));


    console.log(new_pivot,seed,seed - new_pivot > 7 )

    if(seed > new_pivot && seed - new_pivot > 7  ){
        new_pivot += YEARS_OFFSET;
    }

    now.setYear(new_pivot)
    return now;
  }


  now.setYear(pivot)
    
  return now;
}
