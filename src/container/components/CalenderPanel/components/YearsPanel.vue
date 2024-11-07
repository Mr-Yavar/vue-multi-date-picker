<script setup lang="ts">
import MAP_ITEMS from "@/constants/MapItem";
import { ICalenderOption } from "@/types/ICalenderOption";
import { WeekDayObject } from "@/types/WeekDayObject";

import DateObject from "react-date-object";

interface Props {
  yearsOfPeriod: DateObject[];
  nextYears: Function;
  prevYears: Function;
  currentDate: DateObject;
  calenderOption: ICalenderOption;
  //==================
  currentYear: DateObject;
  ChangeCurrentDate: Function;
  setMonthCurrentDate: Function;
  setMonthCurrentYear: Function;
  setYearCurrentDate: Function;
  setYearCurrentYear: Function;

  //=====================
  changeMode : Function
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
      <div
        :class="{
          active: isSelected(year, currentDate),
        }"
        @click.prevent="(()=>{setYearCurrentDate(year); changeMode(MAP_ITEMS.DAY);})"
      >
        {{ year.format("YYYY") }}
      </div>
    </div>
  </div>
</template>
