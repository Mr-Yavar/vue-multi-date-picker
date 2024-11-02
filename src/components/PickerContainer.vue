<script setup>
import { ref, computed, markRaw, reactive, isReactive, watch } from "vue";
import { useFloating } from "@floating-ui/vue";
import { hide, arrow, autoPlacement } from "@floating-ui/vue";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { dateItem } from "../utils/dateItem";
import { isValidDate } from "../utils/isInValidDate";
import { dateTimeFormat } from "../utils/dateTimeFormat";
import persian_en from "react-date-object/locales/persian_en";
import { convertToEnglishNumbers } from "../utils/convertToEnglishNumbers";

const {
  calendar: ucalendar,
  locale: ulocale,
  currentDate: ucurrentDate, // تاریخ شروع نمایش
  updateViewByChange = true,
  format = "YYYY-MM-DD HH:mm:ss",
} = defineProps(["calendar", "locale", "currentDate"]);

const model = defineModel();

const calendar = ucalendar ?? persian;
const locale = ulocale ?? persian_fa;
const dateOption = { calendar: calendar, locale: locale };
const currentDate = ref(
  markRaw(ucurrentDate ?? new DateObject({ ...dateOption }))
); // نقطه شروع تقویم کجا باشد

const rawDateTimeInput = ref(""); // برای اینپوت نمایش دهنده و ویرایش

const selectedDate = ref(markRaw(new DateObject({ ...dateOption }))); // تاریخ انتخاب شده
const selectedTime = ref(markRaw(new DateObject({ ...dateOption }))); // ساعت انتخاب شده
const hour = ref(null); // تایپ ساعت پایین تقویم
const minute = ref(null); // تایپ دقیقه پایین تقویم
const second = ref(null); // تایپ ثانیه پایین تقویم

const isTyping = ref(false); // در حال تایپ  کردن

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

// اول دوره
const firstDayOfMonthDateObject = computed(() =>
  new DateObject({
    ...dateOption,
    date: currentDate.value.toDate(),
  }).toFirstOfMonth()
);
// آخر دوره
const lastDayOfMonthDateObject = computed(() =>
  new DateObject({
    ...dateOption,
    date: currentDate.value.toDate(),
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
  const date = currentDate.value.toDate();

  date.setMonth(date.getMonth() - 1);
  currentDate.value = markRaw(new DateObject({ ...dateOption, date: date }));
};

const nextMonth = () => {
  const date = currentDate.value.toDate();

  date.setMonth(date.getMonth() + 1); // Go back one month
  currentDate.value = markRaw(new DateObject({ ...dateOption, date: date }));
};

// انتخاب با کلیک روی روز
const selectDateByClickOnDay = (day) => {
  selectedDate.value = day;
  hideDatepicker();
};

// انتخاب ساعت با تایپ در پایین تقویم
const selectTimeBySeparatedValue = (hour, minute, second) => {
  const date = selectedDate.value.toDate();
  selectedTime.value = markRaw(
    new DateObject({
      date: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        hour,
        minute,
        second
      ),
    })
  );
};

const selectDateBySeparatedValue = (year, month, day) => {
  selectedDate.value = markRaw(
    new DateObject({ year, month, day, ...dateOption })
  );

  if (updateViewByChange && isValidDate(selectedDate.value))
    currentDate.value = markRaw(
      new DateObject({ year, month, day, ...dateOption })
    );
};

watch([hour, minute, second], () => {
  selectTimeBySeparatedValue(hour.value, minute.value, second.value);
});

// watch([dateTime], () => {
//   // console.log(dateTime.value);
//   // const str = dateTimeFormat(dateTime.value, "datetime");
//   // console.log(str);
//   // const DT = str.split(" ");
//   // const date = DT[0] ?? "";
//   // const time = DT[1] ?? "";

//   // const [year, month, day] = date.split("/");
//   // const [hour = 0, minute = 0, second = 0] = time.split(":");

//   const date = new DateObject({ ...dateOption, format, date: dateTime.value });

//   selectDateBySeparatedValue(date.year, date.month, date.day);
//   selectTimeBySeparatedValue(date.hour, date.minute, date.second);
// });

// Function to update the raw input value based on selected date and time
const updateInputValue = () => {
  if (isTyping.value) return;

  const [year, month, day] = [
    selectedDate.value.year,
    selectedDate.value.month,
    selectedDate.value.day,
  ];
  const [hour, minute, second] = [
    selectedTime.value.hour,
    selectedTime.value.minute,
    selectedTime.value.second,
  ];

  rawDateTimeInput.value = convertToEnglishNumbers(
    new DateObject({
      ...dateOption,
      year,
      month,
      day,
      hour,
      minute,
      second,
    }).format(format)
  );
};

// Watch for changes in selectedDate and update the input value accordingly
watch([selectedDate, selectedTime], () => {
  updateInputValue();
});

// Function to handle input confirmation (e.g., pressing Enter)
const confirmInput = () => {
  // Here you can add validation if needed
  const dateObject = new DateObject({
    ...dateOption,
    format,
    date: rawDateTimeInput.value,
  });

  // Update selected date and time only if the input is valid
  if (isValidDate(dateObject)) {
    selectDateBySeparatedValue(
      dateObject.year,
      dateObject.month,
      dateObject.day
    );
    selectTimeBySeparatedValue(
      dateObject.hour,
      dateObject.minute,
      dateObject.second
    );
  }
};

// Optional: Watch for changes in the raw input to update selectedDate and selectedTime
watch(rawDateTimeInput, (newValue) => {
  // You could also validate here if needed
});
function inTypingMode() {
  const dateObject = new DateObject({
    ...dateOption,
    format,
    date: rawDateTimeInput.value,
  });

  isTyping.value = true;
  // Update selected date and time only if the input is valid
  if (isValidDate(dateObject)) {
    selectDateBySeparatedValue(
      dateObject.year,
      dateObject.month,
      dateObject.day
    );
    selectTimeBySeparatedValue(
      dateObject.hour,
      dateObject.minute,
      dateObject.second
    );
  }
}
// Call this function when the user confirms their inp
</script>

<template>
  <div class="bg-gray-400 h-[700px]">
    <input
      v-model="rawDateTimeInput"
      @blur="confirmInput"
      @keyup.enter="confirmInput"
      @keyup="inTypingMode"
      @keydown="inTypingMode"
    />
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
              @click="
                () => day.isActive && selectDateByClickOnDay(day.dateObject)
              "
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

          <div class="datepicker-time">
            <div class="timepicker-container">
              <div class="timepicker-hours">
                <button>-</button>
                <input type="text" v-model="hour" />
                <button>+</button>
              </div>
              <div class="timepicker-minutes">
                <button>-</button>
                <input type="text" v-model="minute" />
                <button>+</button>
              </div>
              <div class="timepicker-seconds">
                <button>-</button>
                <input type="text" v-model="second" />
                <button>+</button>
              </div>
            </div>
          </div>
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
