<script setup lang="ts">
import { autoPlacement, hide } from '@floating-ui/vue'
import DateObject, { type Calendar, type Locale } from 'react-date-object'
import { type ComputedRef, type DeepReadonly, type Ref, ref, watch } from 'vue'
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
import { useFloating, offset } from '@floating-ui/vue'

const reference = ref(null)
const floating = ref(null)
const { floatingStyles } = useFloating(reference, floating, {
  middleware: [offset(4)],
})

const isOpen = ref(false)

const dismiss = () => {
  isOpen.value = false
}
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
  store.addToStorage(obj, selectedTime.value)
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
</script>

<template>
  <div class="container">
    <slot name="entryPoint" :updateValue="onRawEntryPointUpdate" :value="rawDateTime">
      <input
        :value="rawDateTime"
        @input="onRawEntryPointUpdate"
        ref="reference"
        @click="isOpen = !isOpen"
      />
    </slot>

    <Teleport to="body">
      <Transition>
        <div v-if="isOpen">
          <div class="backdrop" @click="() => dismiss()">dddddd</div>
          <hr />
          <hr />
          <hr />
          <hr />

          <div class="popup" ref="floating" :style="floatingStyles">
            <div class="item">My Account</div>

            <hr />

            <div>
              <div class="datepicker-container">
                <!--- HEADER OF DATEPICKER -->
                <div class="datepicker-body">
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
    </Teleport>
  </div>
</template>
