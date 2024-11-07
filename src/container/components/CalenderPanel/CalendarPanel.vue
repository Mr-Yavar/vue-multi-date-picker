<script setup lang="ts">
import { IcalendarOption } from "@/types/ICalendarOption";
import { WeekDayObject } from "@/types/WeekDayObject";
import DateObject from "react-date-object";
import CalendarHeader from "./components/CalendarHeader.vue";
import WeekDaysPanel from "./components/WeekDaysPanel.vue";
import YearsPanel from "./components/YearsPanel.vue";
import MAP_ITEMS from "@/constants/MapItem";
import { PropType } from "vue";
import MonthPanel from "./components/MonthPanel.vue";

interface Props {
  changeMode: Function;
  mode: string;
  daysOfPeriod: WeekDayObject[];
  weekDays: string[][];
  handleSelect: Function;
  selectedDate: DateObject | any;
  calendarOption: IcalendarOption;
  prevMonth: Function;
  nextMonth: Function;
  currentDate: DateObject;
  yearsOfPeriod: DateObject[];
  nextYears: Function;
  prevYears: Function;
  AvailableMap: (string | number)[];
  //////=====================
  currentYear: DateObject;
  ChangeCurrentDate: Function;
  setMonthCurrentDate: Function;
  setMonthCurrentYear: Function;
  setYearCurrentDate: Function;
  setYearCurrentYear: Function;
  //==============
}

const {
  daysOfPeriod,
  weekDays,
  handleSelect,
  selectedDate,
  calendarOption,
  //----------------
  currentDate,
  prevMonth,
  nextMonth,
  //---------------
  yearsOfPeriod,
  nextYears,
  prevYears,

  AvailableMap,

  //==============
  currentYear,
  ChangeCurrentDate,
  setMonthCurrentDate,
  setMonthCurrentYear,
  setYearCurrentDate,
  setYearCurrentYear,
  ///==========
  changeMode,
} = defineProps<Props>();
</script>

<template>
  <CalendarHeader
    :currentDate="currentDate"
    :nextMonth="nextMonth"
    :prevMonth="prevMonth"
    :yearsOfPeriod="yearsOfPeriod"
    :nextYears="nextYears"
    :prevYears="prevYears"
    :changeMode="changeMode"
    :mode="mode"
    :AvailableMap="AvailableMap"
  />

  <template v-if="mode == MAP_ITEMS.DAY">
    <WeekDaysPanel
      :daysOfPeriod="daysOfPeriod"
      :weekDays="weekDays"
      :handleSelect="handleSelect"
      :selectedDate="selectedDate"
      :calendarOption="calendarOption"
    />
  </template>

  <template v-if="mode == MAP_ITEMS.MONTH">
    
  <MonthPanel
  :currentDate="currentDate"
      :yearsOfPeriod="yearsOfPeriod"
      :nextYears="nextYears"
      :prevYears="prevYears"
      :calendarOption="calendarOption"
      :currentYear="currentYear"
      :ChangeCurrentDate="ChangeCurrentDate"
      :setMonthCurrentDate="setMonthCurrentDate"
      :setMonthCurrentYear="setMonthCurrentYear"
      :setYearCurrentDate="setYearCurrentDate"
      :setYearCurrentYear="setYearCurrentYear"
      :changeMode="changeMode"
  />
  </template>

  <template v-if="mode == MAP_ITEMS.YEAR">
    <YearsPanel
      :currentDate="currentDate"
      :yearsOfPeriod="yearsOfPeriod"
      :nextYears="nextYears"
      :prevYears="prevYears"
      :calendarOption="calendarOption"
      :currentYear="currentYear"
      :ChangeCurrentDate="ChangeCurrentDate"
      :setMonthCurrentDate="setMonthCurrentDate"
      :setMonthCurrentYear="setMonthCurrentYear"
      :setYearCurrentDate="setYearCurrentDate"
      :setYearCurrentYear="setYearCurrentYear"
      :changeMode="changeMode"
    />
  </template>
</template>
