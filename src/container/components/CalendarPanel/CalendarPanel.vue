<script setup lang="ts">
import type { ICalendarOption } from '@/types/ICalendarOption'
import type { WeekDayObject } from '@/types/WeekDayObject'
import DateObject from 'react-date-object'
import CalendarHeader from './components/CalendarHeader.vue'
import WeekDaysPanel from './components/WeekDaysPanel.vue'
import YearsPanel from './components/YearsPanel.vue'
import MAP_ITEMS from '@/constants/MapItem'
import SideBarPanel from './components/SideBarPanel.vue'

import { isFinalStep } from '@/utils/isFinalStep'
import TimePicker from './components/TimePicker.vue'
import { type ComputedRef, type DeepReadonly, toRefs } from 'vue'
import MonthPanel from './components/MonthPanel.vue'
import type { ComponentMapKeys, DateStorage, MapItemValues } from '@/types'
import { MAP_KEYS } from '@/constants/ComponentMap'

interface Props {
  type: ComponentMapKeys
  dataSource: ComputedRef<DeepReadonly<DateStorage<Props['type']>>>
  rangeSeparator: string
  dateSeparator: string
  changeMode: (mode: MapItemValues) => void
  mode: string
  daysOfPeriod: WeekDayObject[][]
  handleSelect: (date: DateObject) => void
  existsInStorage: (date: DateObject) => number
  removeFromStorage: (index: number) => void
  storageToString: (rangeSeparator: string, dateSeparator: string) => string
  selectedDate: DateObject | DateObject[] | DateObject[][]
  calendarOption: ICalendarOption
  prevMonth: () => void
  nextMonth: () => void
  currentDate: DateObject
  yearsOfPeriod: DateObject[]
  nextYears: () => void
  prevYears: () => void
  nextYear: () => void
  prevYear: () => void
  AvailableMap: (string | number)[]
  /// ///=====================
  currentYear: DateObject
  ChangeCurrentDate: (change: number, type: string) => void
  setMonthCurrentDate: (date: DateObject) => void
  setMonthCurrentYear: (month: number) => void
  setYearCurrentDate: (date: DateObject) => void
  setYearCurrentYear: (year: number) => void
  //= =============
  selectedTime: DateObject
  hour: number
  minute: number
  second: number
  onTimePickerSeparatedInput: (hour: number, minute: number, second: number) => void
}

const props = defineProps<Props>()

const {
  daysOfPeriod,
  handleSelect,
  existsInStorage,
  selectedDate,
  calendarOption,
  // ----------------
  currentDate,
  prevMonth,
  nextMonth,
  // ---------------
  yearsOfPeriod,
  nextYears,
  prevYears,
  nextYear,
  prevYear,
  AvailableMap,

  //= =============
  setMonthCurrentDate,
  setYearCurrentDate,
  /// ==========
  changeMode,
} = toRefs(props)
// for (const item of daysOfPeriod.value) {
//     for (const day of item) {
//         console.log(day.dateObject.format())
//     }
// }

// const classOfHeader = computed(() => {})
</script>

<template>
  <div class="flex flex-row-reverse justify-center">
    <div
      v-if="
        type === MAP_KEYS.MULTI_DATE ||
        type === MAP_KEYS.MULTI_TIME ||
        type === MAP_KEYS.MULTI_RANGE_DATE
      "
    >
      <SideBarPanel
        :removeFromStorage="removeFromStorage"
        :date-separator="dateSeparator"
        :range-separator="rangeSeparator"
        :storageToString="storageToString"
        :dataSource="dataSource as unknown as ComputedRef<DeepReadonly<DateStorage<typeof type>>>"
        :type="type"
      />
    </div>
    <div
      :class="
        'grid grid-cols-' +
        (mode === MAP_ITEMS.DAY || mode === MAP_ITEMS.DAY_AND_TIME
          ? daysOfPeriod.length
          : 1)
      "
    >
      <template v-if="mode === MAP_ITEMS.DAY || mode === MAP_ITEMS.DAY_AND_TIME">
        <CalendarHeader
          v-for="(days, i) in daysOfPeriod"
          :isFirst="i === 0"
          :isLast="i === daysOfPeriod.length - 1"
          :step="1"
          :key="
            'header' +
            days[9].dateObject.year +
            days[9].dateObject.monthIndex +
            days[9].month
          "
          :currentDate="days[9].dateObject"
          :nextMonth="nextMonth"
          :prevMonth="prevMonth"
          :nextYears="nextYears"
          :prevYears="prevYears"
          :nextYear="nextYear"
          :prevYear="prevYear"
          :changeMode="changeMode"
          :mode="mode"
          :AvailableMap="AvailableMap"
        />
      </template>
      <template v-else>
        <CalendarHeader
          :isFirst="true"
          :isLast="true"
          :step="1"
          :currentDate="currentDate"
          :nextMonth="nextMonth"
          :prevMonth="prevMonth"
          :nextYears="nextYears"
          :prevYears="prevYears"
          :nextYear="nextYear"
          :prevYear="prevYear"
          :changeMode="changeMode"
          :mode="mode"
          :AvailableMap="AvailableMap"
        />
      </template>

      <template v-if="mode === MAP_ITEMS.DAY">
        <WeekDaysPanel
          v-for="days in daysOfPeriod"
          :existsInStorage="existsInStorage"
          :removeFromStorage="removeFromStorage"
          :key="
            'header' +
            days[9].dateObject.year +
            days[9].dateObject.monthIndex +
            days[9].month
          "
          :daysOfPeriod="days"
          :weekDays="calendarOption.locale.weekDays"
          :handleSelect="handleSelect"
          :selectedDate="selectedDate"
          :calendarOption="calendarOption"
          :isFinalStep="isFinalStep(mode, AvailableMap as string[])"
        />
      </template>
      <template
        v-if="
          mode === MAP_ITEMS.DAY_AND_TIME &&
          (selectedDate instanceof DateObject ||
            (Array.isArray(selectedDate) && selectedDate.length === 2))
        "
      >
        <WeekDaysPanel
          v-for="days in daysOfPeriod"
          :key="days[0].month"
          :removeFromStorage="removeFromStorage"
          :existsInStorage="existsInStorage"
          :daysOfPeriod="days"
          :weekDays="calendarOption.locale.weekDays"
          :handleSelect="handleSelect"
          :selectedDate="selectedDate"
          :calendarOption="calendarOption"
          :isFinalStep="isFinalStep(mode, AvailableMap as string[])"
        />
        <TimePicker
          :hour="hour"
          :minute="minute"
          :second="second"
          :selected-time="selectedTime"
          :onTimePickerSeparatedInput="onTimePickerSeparatedInput"
          :handleSelect="handleSelect"
        />
      </template>

      <template v-if="mode === MAP_ITEMS.MONTH">
        <MonthPanel
          :AvailableMap="AvailableMap"
          :currentDate="currentDate"
          :yearsOfPeriod="yearsOfPeriod"
          :calendarOption="calendarOption"
          :exists-in-storage="existsInStorage"
          :removeFromStorage="removeFromStorage"
          :setMonthCurrentDate="setMonthCurrentDate"
          :changeMode="changeMode"
          :handleSelect="handleSelect"
          :isFinalStep="isFinalStep(mode, AvailableMap as string[])"
        />
      </template>

      <template v-if="mode === MAP_ITEMS.YEAR">
        <YearsPanel
          :currentDate="currentDate"
          :yearsOfPeriod="yearsOfPeriod"
          :nextYears="nextYears"
          :prevYears="prevYears"
          :calendarOption="calendarOption"
          :exists-in-storage="existsInStorage"
          :removeFromStorage="removeFromStorage"
          :setYearCurrentDate="setYearCurrentDate"
          :changeMode="changeMode"
          :handleSelect="handleSelect"
          :isFinalStep="isFinalStep(mode, AvailableMap as string[])"
        />
      </template>

      <template v-if="mode === MAP_ITEMS.TIME">
        <TimePicker
          :hour="hour"
          :minute="minute"
          :second="second"
          :selected-time="selectedTime"
          :onTimePickerSeparatedInput="onTimePickerSeparatedInput"
          :handleSelect="handleSelect"
        />

        <div
          class="mx-auto"
          @click="
            () => {
              handleSelect(
                new DateObject({
                  calendar: calendarOption.calender,
                  locale: calendarOption.locale,
                  date: new Date(),
                })
              );
            }
          "
        >
          <button
            type="button"
            class="px-2 py-1 text-white bg-blue-500 rounded-md shadow-xl"
          >
            Apply
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
