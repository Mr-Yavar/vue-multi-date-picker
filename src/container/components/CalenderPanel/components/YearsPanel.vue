<script setup lang="ts">
import { ICalenderOption } from "@/types/ICalenderOption";
import { WeekDayObject } from "@/types/WeekDayObject";

import DateObject from "react-date-object";

interface Props {
  yearsOfPeriod: DateObject[];
  nextYears: Function;
  prevYears: Function;
  currentDate:DateObject;
  calenderOption: ICalenderOption;
}
function isSelected(year: DateObject, currentDate: DateObject): boolean {
  return year.year === currentDate.year;
}
const { yearsOfPeriod, nextYears, prevYears, calenderOption } =
  defineProps<Props>();
</script>

<template>
  
  <div class="datepicker-years">
    <div
      v-for="(year, index) in yearsOfPeriod"
      :key="year.format('YYYY')"
      class="datepicker-year"
      @click="() => year"
    >
      <div :class="{
        active : isSelected(year,currentDate)
      }">
        {{ year.format("YYYY") }}
      </div>
    </div>
  </div>
</template>
