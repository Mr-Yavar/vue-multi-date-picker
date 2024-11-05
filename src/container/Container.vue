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
  type ,
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
  currentDate,
  selectedDate,
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
        {{ selectedDate.toDate() }}
     
        <!--- BODY OF DATEPICKER -->
        <div class="datepicker-body">
          {{  currentDate }}
          {{ selectedDate }}

          <WeekDaysPanel
            :daysOfPeriod="daysOfPeriod"
            :weekDays="weekDays"
            :onCalenderByClick="onCalenderByClick"
            :selectedDate="selectedDate"
            :type="type"
            :range="range"
            :multiple="multiple"
            :calenderOption="calendarOption"
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

</style>
