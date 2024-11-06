<script setup lang="ts">
import { ICalenderOption } from "@/types/ICalenderOption";
import { WeekDayObject } from "@/types/WeekDayObject";
import DateObject from "react-date-object";

interface Props {
  yearsOfPeriod: any;
  nextYears: Function;
  prevYears: Function;

  calenderOption: ICalenderOption;
}
function isSelected(day: WeekDayObject, selectedDate: DateObject): boolean {
  return day.date.toDateString() === selectedDate?.toDate().toDateString();
}
const { yearsOfPeriod, nextYears, prevYears, calenderOption } =
  defineProps<Props>();
</script>

<template>
  <div class="datepicker-years">
    <div
      v-for="(day, index) in yearsOfPeriod"
      :key="index"
      class="datepicker-year"
      @click="() => day.isActive"
    >
      <div>
        {{ day }}
      </div>
    </div>
  </div>
</template>
