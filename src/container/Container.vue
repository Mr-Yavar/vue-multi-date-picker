<script setup lang="ts">
import { autoPlacement, hide, useFloating } from "@floating-ui/vue";
import DateObject, { Calendar, Locale, Month } from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { ref, watch } from "vue";

import { useCalendar } from "../composables/useCelendar";
import { useEntryPoint } from "../composables/useEntryPoint";
import { useTimePicker } from "../composables/useTimePicker";
import { ComponentType, dateSeparatorType } from "../types";
import { ICalenderOption } from "../types/ICalenderOption";
import { isValidDate } from "../utils/isValidDate";

import WeekDaysPanel from "./calender/WeekDays/WeekDaysPanel.vue";

interface Props {
  calendar: Calendar;
  locale: Locale;
  currentDate?: DateObject; // تاریخ شروع نمایش
  format: string | "YYYY-MM-DD HH:mm:ss";
  type: ComponentType;
  multiple: boolean;
  range: boolean;
  dateSeparator: dateSeparatorType;
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
  type = "DATE",
  multiple = false,
  range = false,
  dateSeparator = ",",
} = defineProps<Props>();

const calendar = ucalendar ?? persian;
const locale = ulocale ?? persian_fa;
const calendarOption = {
  calender: calendar,
  format: format,
  locale: locale,
} as ICalenderOption;
const weekDays = locale.weekDays;
const months = locale.months;

const {
  selectedDate,
  currentDate,
  daysOfPeriod,
  prevMonth,
  nextMonth,
  onSeparatedInput: onCalenderSeparatedInput,
  updateSelectedDate: onCalenderByClick,
} = useCalendar(calendarOption, ucurrentDate);

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

const mode = ref(0);

const modes = {
  0: "جدول روز",
  1: "جدول ماه ها",
  3: "جدول سال ها",
};

function changeMode() {
  mode.value++;
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
      year,
      month: month.index,
      day,
      hour,
      minute,
      second,
      calendar: calendarOption.calender,
      locale: calendarOption.locale,
      format: calendarOption.format as string,
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
    onCalenderSeparatedInput(dateObject.year, dateObject.month, dateObject.day);
  }
}

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

        <slot
          name="header"
          :prevMonth="prevMonth"
          :nextMonth="nextMonth"
          :currentDate="currentDate"
        >
          <div class="datepicker-header">
            <div class="datepicker-header-prev">
              <button
                @click="prevMonth"
                class="block w-[30px] h-[30px] mx-auto !rounded-full bg-gray-50"
              >
                {{ "<" }}
              </button>
            </div>
            <div class="datepicker-header-control">
              <div class="mx-auto w-fit">
                <button>{{ currentDate.month }}</button>
                <button>{{ currentDate.year }}</button>
              </div>
            </div>
            <div class="col-span-1 col-start-5 datepicker-header-next">
              <button
                @click="nextMonth"
                class="block w-[30px] h-[30px] mx-auto !rounded-full bg-gray-50"
              >
                {{ ">" }}
              </button>
            </div>
          </div>
        </slot>
        <!--- BODY OF DATEPICKER -->

        <div class="datepicker-body">
          <WeekDaysPanel
            :daysOfPeriod="daysOfPeriod"
            :weekDays="weekDays"
            :onCalenderByClick="onCalenderByClick"
            :selectedDate="selectedDate"
            :type="type"
            :range="range"
            :multiple="multiple"
            :calenderOption="ICalendarOption"
            :prevMonth="prevMonth"
            :nextMonth="nextMonth"
            :currentDate="currentDate"
          />
          <slot
            name="timePicker"
            :onRawUpdate="onTimePickerInput"
            :onSeparatedInputUpdate="onTimePickerSeparatedInput"
            :hour="hour"
            :minute="minute"
            :second="second"
          >
          </slot>
        </div>
      </div>
    </div>
  </div>
  <div>{{ selectedDate }}</div>
  <div>{{ selectedTime.hour + ":" + selectedTime.minute }}</div>
</template>

<style>
.datepicker-container {
  @apply mx-auto bg-slate-100;
  width: fit-content;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.datepicker-header {
  @apply grid grid-cols-5;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.datepicker-header button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
}

.datepicker-header button:hover {
  background-color: #ccc;
}

.datepicker-header-prev {
  @apply col-span-1;
}

.datepicker-header-next {
  @apply col-span-1 col-start-5;
}

.datepicker-header-control {
  @apply col-span-3;
}

.datepicker-body {
  padding: 10px;
  @apply grid grid-cols-1;
}

.datepicker-weekdays {
  @apply grid grid-cols-7 gap-2 w-full;

  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.datepicker-weekdays span {
  text-align: center;
}

.datepicker-days {
  align-items: center;
  padding: 10px;
  @apply grid grid-cols-7 gap-2 w-full;
  border-bottom: 1px solid #ccc;
}

.datepicker-days div {
  text-align: center;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
}

.datepicker-days div:hover {
  background-color: #ccc;
}

.datepicker-days div.active {
  background-color: #007bff;
  color: #fff;
}

.datepicker-day {
  @apply !rounded-full !w-[35px] !h-[35px];
}

.datepicker-day:has(.active) {
  @apply !block !rounded-full !w-[35px] !h-[35px] bg-blue-400;
}

.datepicker-day:has(.semiActive) {
  @apply !block !rounded-full !w-[35px] !h-[35px] bg-blue-200 text-gray-200;
}
.datepicker-day:has(.disabled) {
  @apply !block !rounded-full !w-[35px] !h-[35px] text-gray-200;
}

/**** */
.timepicker-container {
  @apply grid grid-cols-3 gap-2 w-fit mx-auto p-3;
}

.timepicker-container input {
  @apply rounded-md w-10 p-2 !appearance-none mx-auto block text-center shadow-sm !outline-none border border-gray-500;
}

.timepicker-container button {
  @apply rounded-md w-8 my-2 text-blue-800 bg-gray-50 bg-neutral-400  !appearance-none mx-auto block text-center shadow-md !outline-none;
}
</style>
