<script setup>
import { ref, computed, markRaw, reactive, isReactive } from "vue";
import { useFloating } from "@floating-ui/vue";
import { hide, arrow, autoPlacement } from "@floating-ui/vue";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { dateItem } from "../utils/dateItem";

const {
  calendar: ucalendar,
  locale: ulocale,
  currentDate: ucurrentDate,
} = defineProps(["calendar", "locale", "currentDate"]);

const model = defineModel();

const calendar = ucalendar ?? persian;
const locale = ulocale ?? persian_fa;
const dateOption = { calendar: calendar, locale: locale };
const currentDate = reactive({
  currentDate: markRaw(ucurrentDate ?? new DateObject({ ...dateOption })),
});

const mode = ref(0);

const modes = {
  0: "جدول روز",
  1: "جدول ماه ها",
  3: "جدول سال ها",
};

function changeMode() {
  mode.value++;
}
const datepickerReference = ref(null);
const datepickerFloating = ref(null);
const {
  floatingStyles: datepickerFloatingStyles,
  middlewareData: datepickerMiddlewareData,
} = useFloating(datepickerReference, datepickerFloating, {
  middleware: [hide(), arrow(), autoPlacement()],
});

const selectedDate = ref(null);

const firstDayOfMonthDateObject = computed(() =>
  new DateObject({
    ...dateOption,
    date: currentDate.currentDate.toDate(),
  }).toFirstOfMonth()
);
const lastDayOfMonthDateObject = computed(() =>
  new DateObject({
    ...dateOption,
    date: currentDate.currentDate.toDate(),
  }).toLastOfMonth()
);

const orderOfDays = locale.weekDays;

const days = computed(() => {

  const firstDay = firstDayOfMonthDateObject.value.toDate();
  const lastDay = lastDayOfMonthDateObject.value.toDate();

  const days = [];

  const firstOffirstWeekOfMonth = new DateObject({
    ...dateOption,
    date: firstDay,
  })
    .toFirstOfWeek()
    .toDate();

  for (
    let forWardStep = new Date(firstOffirstWeekOfMonth);
    forWardStep < firstDay;
    forWardStep.setDate(forWardStep.getDate() + 1)
  ) {
    days.push(dateItem(forWardStep, false));
  }

  for (let i = firstDay; i <= lastDay; i.setDate(i.getDate() + 1)) {
    let temp = new Date(i);
    days.push(dateItem(temp, true));
  }

  const lastOfflastWeekOfMonth = new DateObject({
    ...dateOption,
    date: lastDay,
  })
    .toLastOfWeek()
    .toDate();

  for (
    let backWardStep = new Date(lastOfflastWeekOfMonth);
    backWardStep > lastDay;
    backWardStep.setDate(backWardStep.getDate() - 1)
  ) {
    days.push(dateItem(backWardStep, false));
  }

  return days;
});

const showDatepicker = () => {
  if (datepickerFloating.value) {
    datepickerFloating.value.style.visibility = "visible";
  }
};

const hideDatepicker = () => {
  if (datepickerFloating.value) {
    datepickerFloating.value.style.visibility = "hidden";
    datepickerFloating.value.style.visibility = "hidden";
  }
};

const prevMonth = () => {
  const date = currentDate.currentDate.toDate();

  date.setMonth(date.getMonth() - 1); 
  currentDate.currentDate = markRaw(
    new DateObject({ ...dateOption, date: date })
  );
};

const nextMonth = () => {
  const date = currentDate.currentDate.toDate();

  date.setMonth(date.getMonth() + 1); // Go back one month
  currentDate.currentDate = markRaw(
    new DateObject({ ...dateOption, date: date })
  );
};

const selectDate = (day) => {
  selectedDate.value = day;
  hideDatepicker();
};
</script>

<template>
  <div class="bg-gray-400 h-[700px]">
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
          :currentDate="currentDate.currentDate"
        >
          <div class="datepicker-header">
            <div class="datepicker-header-prev">
              <button @click="prevMonth" class="block w-[30px] h-[30px] mx-auto !rounded-full bg-gray-50">{{ "<" }}</button>
            </div>
            <div class="datepicker-header-control">
              <div class="mx-auto w-fit">
                <button>{{ currentDate.currentDate.month }}</button>
                <button>{{ currentDate.currentDate.year }}</button>
              </div>
            </div>
            <div class="col-span-1 col-start-5 datepicker-header-next">
              <button @click="nextMonth" class="block w-[30px] h-[30px] mx-auto !rounded-full bg-gray-50">{{ ">" }}</button>
            </div>
          </div>
        </slot>
        <!--- BODY OF DATEPICKER -->
        <div class="datepicker-body">
          <div class="datepicker-weekdays">
            <span v-for="(day, index) in orderOfDays" :key="index">
              {{ day[0] }}
            </span>
          </div>
          <div class="datepicker-days">
            <div
              class="datepicker-day"
              v-for="(day, index) in days"
              :key="index"
              @click="() => day.isActive && selectDate(day.dateObject)"
            >
              <slot name="dayItem">
                <span
                  :class="{
                    semiActive:
                      !day.isActive &&
                      day.date.toDateString() ===
                        selectedDate?.toDate().toDateString(),
                    active:
                      day.isActive &&
                      day.date.toDateString() ===
                        selectedDate?.toDate().toDateString(),
                    disabled:
                      !day.isActive &&
                      day.date.toDateString() !==
                        selectedDate?.toDate().toDateString(),
                  }"
                >
                  {{ day.dateObject.convert(calendar, locale).format("D") }}
                </span>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div>{{ selectedDate }}</div>
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
  @apply grid grid-cols-7 gap-2;
  width: fit-content;
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
</style>
