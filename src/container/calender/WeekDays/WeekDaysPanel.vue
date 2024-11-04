<script setup lang="ts">
import { ICalenderOption } from "@/types/ICalenderOption";
import DateObject from "react-date-object";
import { ComponentType } from "../../../types";
import { WeekDayObject } from "../../../types/WeekDayObject";
import WeekDaysHeader from "./components/WeekDaysHeader.vue";

interface Props {
  daysOfPeriod: WeekDayObject[];
  weekDays: string[][];
  onCalenderByClick: Function;
  selectedDate: DateObject;
  type: ComponentType;
  range: Boolean;
  multiple: Boolean;
  calenderOption: ICalenderOption;
  prevMonth: Function;
  nextMonth: Function;
  currentDate: DateObject;
}

const {
  type = "",
  multiple = false,
  range = false,
  daysOfPeriod,
  weekDays,
  onCalenderByClick,
  selectedDate,
  calenderOption,
  //----------------
  currentDate,
  prevMonth,
  nextMonth,
  //---------------
} = defineProps<Props>();

function IsSelected(day: WeekDayObject): boolean {
  return day.date.toDateString() === selectedDate?.toDate().toDateString();
}
</script>

<template>
  <slot
    name="header"
    :prev-month="prevMonth"
    :next-month="nextMonth"
    :current-date="currentDate"
  >
    <WeekDaysHeader />
  </slot>

  <slot
    :days-of-period="daysOfPeriod"
    :week-days="weekDays"
    :on-calender-by-click="onCalenderByClick"
    :selected-date="selectedDate"
    :type="type"
    :range="range"
    :multiple="multiple"
    :calender-option="calenderOption"
  >
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
        @click="() => day.isActive && onCalenderByClick(day.dateObject)"
      >
        <span
          :class="{
            semiActive: !day.isActive && IsSelected(day),
            active: day.isActive && IsSelected(day),
            disabled: !day.isActive && IsSelected(day),
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
  </slot>
</template>
