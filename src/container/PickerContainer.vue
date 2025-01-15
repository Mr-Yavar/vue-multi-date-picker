<script setup lang="ts">
import { autoPlacement, hide } from '@floating-ui/vue'
import DateObject, { type Calendar, type Locale } from 'react-date-object'
import {
  computed,
  type ComputedRef,
  type DeepReadonly,
  onMounted,
  type Ref,
  ref,
  type StyleValue,
  useCssModule,
  watch,
} from 'vue'
import { configure } from '@/utils/configure'
import { useCalendar } from '../composables/useCalendar'
import { useEntryPoint } from '../composables/useEntryPoint'
import { useTimePicker } from '../composables/useTimePicker'
import type {
  ComponentMapKeys,
  dateSeparatorType,
  DateStorage,
  MapItemValues,
  SubTypeKeys,
} from '@/types'
import type { ICalendarOption } from '@/types/ICalendarOption'
import CalendarPanel from './components/CalenderPanel/CalendarPanel.vue'
import gregorian from 'react-date-object/calendars/gregorian'
import gregorian_en from 'react-date-object/locales/gregorian_en'
import { useStore } from '@/composables/useStore'

//================
import { useFloating, offset, arrow, flip, shift } from '@floating-ui/vue'

const reference = ref(null)
const floating = ref(null)
const floatingArrow = ref(null)

const isOpen = ref(false)

const dismiss = () => {
  isOpen.value = false
}


const { floatingStyles, middlewareData, placement } = useFloating(reference, floating, {
  placement: 'top-end', // Initial placement (will be overridden by autoPlacement)
  middleware: [
    offset(8), // Add some spacing between the reference and floating element
    arrow({ element: floatingArrow, padding: 4 }), // Configure the arrow
    // autoPlacement({
    //   allowedPlacements: [
    //     'top-start',
    //     'top-end',
    //     'bottom-start',
    //     'bottom-end',
    //     'right-start',
    //     'right-end',
    //     'left-start',
    //     'left-end',
    //     'bottom',
    //     'right',
    //     'top',
    //   ], // Define allowed placements
    // }),
    flip({
      // fallbackPlacements: ['top', 'bottom', 'right', 'left'], // Fallback if autoPlacement fails
    }),
    shift({ padding: 8 }), // Prevent the floating element from going off-screen
  ],
})

const arrowStyles = computed(() => {
  if (!middlewareData.value.arrow) return {}

  const { x, y } = middlewareData.value.arrow

  return {
    position: 'absolute',
    left: x != null ? `${x}px` : '',
    top: y != null ? `${y}px` : '',
    [(placement.value.startsWith('top')
      ? 'bottom'
      : placement.value.startsWith('bottom')
        ? 'top'
        : placement.value.startsWith('left')
          ? 'right'
          : 'left') as string]: '-4px', // Adjust as needed
  }
})
//======================================

interface Props {
  calendar: Calendar
  locale: Locale
  currentDate?: DateObject // تاریخ شروع نمایش
  format: string | 'YYYY-MM-DD HH:mm:ss'
  type: ComponentMapKeys
  subType: SubTypeKeys<Props['type']>
  dateSeparator: dateSeparatorType
  rangeSeparator: string
}

const {
  calendar: ucalendar,
  locale: ulocale,
  currentDate: ucurrentDate, // تاریخ شروع نمایش
  format = 'YYYY-MM-DD HH:mm:ss',
  type,
  subType,
  dateSeparator = ' , ',
  rangeSeparator = ' ~ ',
} = defineProps<Props>()

const calendar = ucalendar ?? gregorian
const locale = ulocale ?? gregorian_en
const calendarOption = {
  calender: calendar,
  format: format,
  locale: locale,
} as ICalendarOption
const weekDays = locale.weekDays
const months = locale.months

const {
  currentDate,
  selectedDate,
  daysOfPeriod,
  prevMonth,
  nextMonth,
  updateCurrentDate,
  onSeparatedInput: onCalenderSeparatedInput,
  // updateSelectedDate: handleSelect,
  prevYears,
  nextYears,
  yearsOfPeriod,
  prevYear,
  nextYear,
  //================
  currentYear,
  ChangeCurrentDate,
  setMonthCurrentDate,
  setMonthCurrentYear,
  setYearCurrentDate,
  setYearCurrentYear,
} = useCalendar(calendarOption, ucurrentDate, 1)

const {
  hour,
  minute,
  second,
  selectedTime,
  onRawInput: onTimePickerInput,
  onSeparatedInput: onTimePickerSeparatedInput,
} = useTimePicker(calendarOption)

const { rawDateTime, onInput, onOutput, isTyping } = useEntryPoint(calendarOption)

const store = useStore(type, calendarOption)

const mapOfCalendar = configure(type, subType)
console.log(mapOfCalendar)
const mode = ref<Ref<MapItemValues>>(mapOfCalendar[0])

function changeMode(value: MapItemValues) {
  mode.value = value
}

function handleSelect(obj: DateObject) {
  store.addToStorage(obj, selectedTime.value, dismiss)
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
watch([store.dataSource.value], () => {
  onOutput(store.toString(rangeSeparator, dateSeparator))
})

function onRawEntryPointUpdate(event: any) {
  const updatedRawValue: string = event.target.value
  onInput(updatedRawValue)

  store.fromString(updatedRawValue, rangeSeparator, dateSeparator)
  // const dateObject: DateObject = new DateObject({
  //     date: updatedRawValue,
  //     calendar: calendarOption.calender,
  //     locale: calendarOption.locale,
  //     format: calendarOption.format as string,
  // })

  // // Update selected date and time only if the input is valid
  // if (isValidDate(dateObject)) {
  //     onTimePickerSeparatedInput(dateObject.hour, dateObject.minute, dateObject.second)
  //     onCalenderSeparatedInput(dateObject.year, dateObject.month.number, dateObject.day)
  // }
}
const AvailableMap: (string | number)[] = mapOfCalendar
///////================== EntryPoint Mid End
const dpId = ref('dp-' + btoa(`${Math.random()}`))
onMounted(() => {
  document.onclick = (e) => {
    e.stopImmediatePropagation()
    const el = e.target as HTMLElement
    // console.log(el)
    // console.log(el.closest(`div[id="` + dpId.value + `"]`), el.id == dpId.value)
    if (el.closest(`*[id="` + dpId.value + `"]`) != null || el.id == dpId.value) return
    dismiss()
  }
})
</script>

<template>
  <div :id="dpId">
    <slot name="entryPoint" :updateValue="onRawEntryPointUpdate" :value="rawDateTime">
      <input
        :value="rawDateTime"
        @input="onRawEntryPointUpdate"
        ref="reference"
        class="border-2 border-black rounded-md"
        @click="isOpen = !isOpen"
      />
    </slot>
    <div class="!relative w-full h-full">
      <Transition>
        <div v-if="isOpen" class="">
          <!-- <div class="backdrop">dddddd</div> -->

          <div class="" ref="floating" :style="floatingStyles">
            <div>
              <div class="relative top-0 z-1 datepicker-container popup">
                <span ref="floatingArrow" :style="arrowStyles as StyleValue" class="arrow"></span>
                <!--- HEADER OF DATEPICKER -->
                <div class="!z-1 datepicker-body">
                  <!--- BODY OF DATEPICKER -->

                  <CalendarPanel
                    :type="type"
                    :dataSource="
                      store.dataSource as unknown as ComputedRef<
                        DeepReadonly<DateStorage<typeof type>>
                      >
                    "
                    :rangeSeparator="rangeSeparator"
                    :dateSeparator="dateSeparator"
                    :changeMode="changeMode"
                    :mode="mode as string"
                    :daysOfPeriod="daysOfPeriod"
                    :weekDays="weekDays"
                    :handleSelect="handleSelect"
                    :existsInStorage="store.existsInStorage"
                    :removeFromStorage="store.removeFromStorage"
                    :storageToString="store.toString"
                    :selectedDate="selectedDate"
                    :calendarOption="calendarOption"
                    :prevMonth="prevMonth"
                    :nextMonth="nextMonth"
                    :currentDate="currentDate"
                    :yearsOfPeriod="yearsOfPeriod"
                    :nextYears="nextYears"
                    :prevYears="prevYears"
                    :nextYear="nextYear"
                    :prevYear="prevYear"
                    :AvailableMap="AvailableMap"
                    :currentYear="currentYear"
                    :ChangeCurrentDate="ChangeCurrentDate"
                    :setMonthCurrentDate="setMonthCurrentDate"
                    :setMonthCurrentYear="setMonthCurrentYear"
                    :setYearCurrentDate="setYearCurrentDate"
                    :setYearCurrentYear="setYearCurrentYear"
                    :hour="hour as number"
                    :minute="minute as number"
                    :second="second as number"
                    :selected-time="selectedTime"
                    :onTimePickerSeparatedInput="onTimePickerSeparatedInput"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style>
.popup {
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.2));
  min-width: 150px; /* Ensure a minimum width */
}

.arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: white;
  transform: rotate(45deg);
  border-left: 1px solid #ccc;
  border-top: 1px solid #ccc;
  z-index: -10; /* Place behind the popup */
}
</style>

<style module="dyn">
.red {
  color: red;
}
</style>
