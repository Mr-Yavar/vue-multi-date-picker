<script setup>
import WeekDaysHeader from './components/WeekDaysHeader.vue';

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
  nextMonth
  //---------------
} = defineProps([
  "daysOfPeriod",
  "weekDays",
  "onCalenderByClick",
  "selectedDate",
  "type",
  "range",
  "multiple",
  "calenderOption",
  "prevMonth",
  "nextMonth",
  "currentDate"
]);
</script>

<template>
  <WeekDaysHeader>
    <slot name="header"
    
    :prevMonth="prevMonth"
          :nextMonth="nextMonth"
          :currentDate="currentDate">
      
    </slot>
  </WeekDaysHeader>
  <slot
    :daysOfPeriod="daysOfPeriod"
    :weekDays="weekDays"
    :onCalenderByClick="onCalenderByClick"
    :selectedDate="selectedDate"
    :type="type"
    :range="range"
    :multiple="multiple"
    :calenderOption="calenderOption"
  >
    <div class="datepicker-weekdays">
      <span v-for="(day, index) in weekDays" :key="index">
        {{ day[1] }}
      </span>
    </div>
    <div class="datepicker-days">
      <div
        class="datepicker-day"
        v-for="(day, index) in daysOfPeriod"
        :key="index"
        @click="() => day.isActive && onCalenderByClick(day.dateObject)"
      >
        <span
          :class="{
            semiActive:
              !day.isActive &&
              day.date.toDateString() === selectedDate?.toDate().toDateString(),
            active:
              day.isActive &&
              day.date.toDateString() === selectedDate?.toDate().toDateString(),
            disabled:
              !day.isActive &&
              day.date.toDateString() !== selectedDate?.toDate().toDateString(),
          }"
        >
          {{
            day.dateObject
              .convert(calenderOption.calendar, calenderOption.locale)
              .format("D")
          }}
        </span>
      </div>
    </div>
  </slot>
</template>
