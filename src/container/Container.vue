<script setup lang="ts">
import { autoPlacement, hide, useFloating } from "@floating-ui/vue";
import DateObject, { Calendar, Locale, Month } from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { ref, watch } from "vue";

import { configure } from "@/utils/configure";
import { useCalendar } from "../composables/useCalendar";
import { useEntryPoint } from "../composables/useEntryPoint";
import { useTimePicker } from "../composables/useTimePicker";
import { ComponentType, dateSeparatorType } from "../types";
import { IcalendarOption } from "@/types/ICalendarOption";
import { isValidDate } from "../utils/isValidDate";

import { ComponentMap } from "@/constants/ComponentMap";
import CalendarPanel from "./components/CalenderPanel/CalendarPanel.vue";
import persian_en from "react-date-object/locales/persian_en";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_fa from "react-date-object/locales/gregorian_fa";
import gregorian_en from "react-date-object/locales/gregorian_en";

interface Props {
  calendar: Calendar;
  locale: Locale;
  currentDate?: DateObject; // تاریخ شروع نمایش
  format: string | "YYYY-MM-DD HH:mm:ss";
  type: ComponentType;
  multiple: boolean;
  range: boolean;
  dateSeparator: dateSeparatorType;
  onlyMonth: boolean;
  onlyYear: boolean;
}

const datepickerReference = ref(null);
const datepickerFloating = ref(null);
const {
  floatingStyles: datepickerFloatingStyles,
  middlewareData: datepickerMiddlewareData,
} = useFloating(datepickerReference, datepickerFloating, {
  middleware: [hide(), autoPlacement()],
});

const {
  calendar: ucalendar,
  locale: ulocale,
  currentDate: ucurrentDate, // تاریخ شروع نمایش
  format = "YYYY-MM-DD HH:mm:ss",
  type,
  multiple = false,
  range = false,
  dateSeparator = ",",
  onlyMonth = false,
  onlyYear = false,
} = defineProps<Props>();

const calendar = ucalendar ?? gregorian;
const locale = ulocale ?? gregorian_en;
const calendarOption = {
  calender: calendar,
  format: format,
  locale: locale,
} as IcalendarOption;
const weekDays = locale.weekDays;
const months = locale.months;

const {
  currentDate,
  selectedDate,
  daysOfPeriod,
  prevMonth,
  nextMonth,
  updateCurrentDate,
  onSeparatedInput: onCalenderSeparatedInput,
  updateSelectedDate: handleSelect,
  prevYears,
  nextYears,
  yearsOfPeriod,

  //================
  currentYear,
  ChangeCurrentDate,
  setMonthCurrentDate,
  setMonthCurrentYear,
  setYearCurrentDate,
  setYearCurrentYear,
} = useCalendar(calendarOption, ucurrentDate, type);

const {
  hour,
  minute,
  second,
  selectedTime,
  onRawInput: onTimePickerInput,
  onSeparatedInput: onTimePickerSeparatedInput,
} = useTimePicker(calendarOption);

const { rawDateTime, onInput, onOutput, isTyping } =
  useEntryPoint(calendarOption);

const mapOfCalendar = configure(type);

const mode = ref(mapOfCalendar[0]);

function changeMode(value: string) {
  mode.value = value;
}

// const showDatepicker = () => {
//   if (datepickerFloating.value) {
//     datepickerFloating.value.style.visibility = "visible";
//   }
// };

// const hideDatepicker = () => {
//   if (datepickerFloating.value) {
//     datepickerFloating.value.style.visibility = "hidden";
//     datepickerFloating.value.style.visibility = "hidden";
//   }
// };

////////================= EntryPoint Mid
// بروزرسانی محتوای
watch([selectedDate, selectedTime], () => {
  const [year, month, day]: [number, Month, number] = [
    selectedDate.value.year,
    selectedDate.value.month,
    selectedDate.value.day,
  ];
  const [hour, minute, second]: [number, number, number] = [
    selectedTime.value.hour,
    selectedTime.value.minute,
    selectedTime.value.second,
  ];

  onOutput(
    new DateObject({
      year: year,
      month: month.number,
      day: day,
      hour: hour,
      minute: minute,
      second: second,
      calendar: calendarOption.calender,
      locale: calendarOption.locale,
      format: calendarOption.format,
    })
  );
});

function onRawEntryPointUpdate(event: any) {
  const updatedRawValue: string = event.target.value;
  onInput(updatedRawValue);

  const dateObject: DateObject = new DateObject({
    date: updatedRawValue,
    calendar: calendarOption.calender,
    locale: calendarOption.locale,
    format: calendarOption.format as string,
  });

  // Update selected date and time only if the input is valid
  if (isValidDate(dateObject)) {
    onTimePickerSeparatedInput(
      dateObject.hour,
      dateObject.minute,
      dateObject.second
    );
    onCalenderSeparatedInput(
      dateObject.year,
      dateObject.month.number,
      dateObject.day
    );
  }
}
const AvailableMap: (string | number)[] = ComponentMap["DATE"]["DAY"];
///////================== EntryPoint Mid End
</script>

<template>
  <div class="bg-gray-400 h-[700px]">
    <slot
      name="entryPoint"
      :updateValue="onRawEntryPointUpdate"
      :value="rawDateTime"
    >
      <input v-model="rawDateTime" @input="onRawEntryPointUpdate" />
    </slot>

    <!-- <div
    ref="datepickerReference"
    @click="showDatepicker"
    class="bg-red-600 focus:bg-orange-50"
    style="display: inline-block; cursor: pointer; margin-left: 20px"
    tabindex="100"
    @focus="showDatepicker"
    @blur="hideDatepicker"
  >
    <input type="text" readonly :value="selectedDate"  />
  </div>
  
      ref="datepickerFloating"
    :style="{
      ...datepickerFloatingStyles,
      visibility:
        (!datepickerMiddlewareData.hide?.referenceHidden && 'hidden') ||
        datepickerMiddlewareData.hide?.referenceHidden
          ? 'hidden'
          : 'visible',
        
    }"
     tabindex="10"
     @focus="showDatepicker"
    @blur="hideDatepicker"
  -->

    <div>
      <div class="datepicker-container">
        <!--- HEADER OF DATEPICKER -->
        <div class="datepicker-body">
          <!--- BODY OF DATEPICKER -->

          <CalendarPanel
            :changeMode="changeMode"
            :mode="mode"
            :daysOfPeriod="daysOfPeriod"
            :weekDays="weekDays"
            :handleSelect="handleSelect"
            :selectedDate="selectedDate"
            :calendarOption="calendarOption"
            :prevMonth="prevMonth"
            :nextMonth="nextMonth"
            :currentDate="currentDate"
            :yearsOfPeriod="yearsOfPeriod"
            :nextYears="nextYears"
            :prevYears="prevYears"
            :AvailableMap="AvailableMap"
            :currentYear="currentYear"
            :ChangeCurrentDate="ChangeCurrentDate"
            :setMonthCurrentDate="setMonthCurrentDate"
            :setMonthCurrentYear="setMonthCurrentYear"
            :setYearCurrentDate="setYearCurrentDate"
            :setYearCurrentYear="setYearCurrentYear"
          />
        </div>
      </div>
    </div>
  </div>
  <div>{{ selectedDate }}</div>
  <div>{{ selectedTime.hour + ":" + selectedTime.minute }}</div>
</template>

<style></style>
