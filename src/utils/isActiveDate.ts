import DateObject from 'react-date-object'

export function isActiveDate(
  dateForChecking: DateObject,
  minDate: DateObject | Date | null,
  maxDate: DateObject | Date | null,
  bannedDates: DateObject[] | ((date: DateObject) => boolean) | Date | Date[] | null,
): boolean {
  if (minDate instanceof DateObject) {
    return dateForChecking.toDate() >= minDate.toDate();
  } else if (minDate instanceof Date) {
    return dateForChecking.toDate() >= minDate;
  }

  if (maxDate instanceof DateObject) {
    return dateForChecking.toDate() <= maxDate.toDate();
  } else if (maxDate instanceof Date) {
    return dateForChecking.toDate() <= maxDate;
  }

  if (Array.isArray(bannedDates) && bannedDates.every((item) => item instanceof DateObject)) {
    return bannedDates.every((ban) => ban.toDate() != dateForChecking.toDate());
  } else if (Array.isArray(bannedDates) && bannedDates.every((item) => item instanceof Date)) {
    return bannedDates.every((ban) => ban != dateForChecking.toDate());
  } else if (bannedDates instanceof Function) {
    return bannedDates(dateForChecking);
  }

  return true;
}
