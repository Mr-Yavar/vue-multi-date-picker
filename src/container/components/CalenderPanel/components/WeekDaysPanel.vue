<script setup lang="ts">
import { ICalenderOption } from "@/types/ICalenderOption";
import { WeekDayObject } from "@/types/WeekDayObject";
import DateObject from "react-date-object";

interface Props {
  daysOfPeriod: WeekDayObject[];
  weekDays: string[][];
  handleSelect: Function;
  selectedDate: DateObject | any;

  calenderOption: ICalenderOption;
}
function isSelected(day: WeekDayObject, selectedDate: DateObject): boolean {
  return day.date.toDateString() === selectedDate?.toDate().toDateString();
}
const { daysOfPeriod, weekDays, handleSelect, selectedDate, calenderOption } =
  defineProps<Props>();
</script>

<template>
  <div class="datepicker-weekdays">
    <span v-for="(day, index) in weekDays" :key="index">
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
            .convert(calenderOption.calender, calenderOption.locale)
            .format("D")
        }}
      </span>
    </div>
  </div>
</template>
