<script setup lang="ts">
import { IcalendarOption } from "@/types/ICalendarOption";
import { WeekDayObject } from "@/types/WeekDayObject";
import { getWeekOrders } from "@/utils/getWeekOrders";
import DateObject from "react-date-object";

interface Props {
  daysOfPeriod: WeekDayObject[];
  weekDays: string[][];
  handleSelect: Function;
  selectedDate: DateObject | any;

  calendarOption: IcalendarOption;
}
function isSelected(day: WeekDayObject, selectedDate: DateObject): boolean {
  return day.date.toDateString() === selectedDate?.toDate().toDateString();
}
const { daysOfPeriod, weekDays, handleSelect, selectedDate, calendarOption } =
  defineProps<Props>();
</script>

<template>
{{ calendarOption.locale.weekDays }}
  <div class="datepicker-weekdays">
    <span v-for="(day, index) in getWeekOrders(calendarOption.locale)" :key="index">
      {{ day[1] }}
    </span>
  </div>
  <div class="datepicker-days">
    <div
      v-for="(day, index) in daysOfPeriod"
      :key="index"
      class="datepicker-day"
      @click="() => day.isActive && handleSelect(day.dateObject)"
    >
      <span
        :class="{
          semiActive: !day.isActive && isSelected(day, selectedDate),
          active: day.isActive && isSelected(day, selectedDate),
          disabled: !day.isActive && !isSelected(day, selectedDate),
        }"
      >
        {{
          day.dateObject
            .convert(calendarOption.calender, calendarOption.locale)
            .format("D")
        }}
      </span>
    </div>
  </div>
</template>
