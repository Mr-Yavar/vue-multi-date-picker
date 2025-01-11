<script setup lang="ts">
import { ICalendarOption } from '@/types/ICalendarOption'
import { WeekDayObject } from '@/types/WeekDayObject'
import DateObject from 'react-date-object'
import CalendarHeader from './components/CalendarHeader.vue'
import WeekDaysPanel from './components/WeekDaysPanel.vue'
import YearsPanel from './components/YearsPanel.vue'
import MAP_ITEMS from '@/constants/MapItem'
import { isFinalStep } from '@/utils/isFinalStep'
import TimePicker from './components/TimePicker.vue'
import { computed, toRefs } from 'vue'
import MonthPanel from './components/MonthPanel.vue'
import { MapItemValues } from '@/types'

interface Props {
    changeMode: (mode: MapItemValues) => void
    mode: string
    daysOfPeriod: WeekDayObject[][]
    weekDays: string[][]
    handleSelect: (date: DateObject) => void
    existsInStorage: (date: DateObject) => boolean
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
    //////=====================
    currentYear: DateObject
    ChangeCurrentDate: (change: number, type: string) => void
    setMonthCurrentDate: (date: DateObject) => void
    setMonthCurrentYear: (month: number) => void
    setYearCurrentDate: (date: DateObject) => void
    setYearCurrentYear: (year: number) => void
    //==============
    selectedTime: DateObject
    hour: number
    minute: number
    second: number
    onTimePickerSeparatedInput: (hour: number, minute: number, second: number) => void
}

const props = defineProps<Props>()

const {
    daysOfPeriod,
    weekDays,
    handleSelect,
    existsInStorage,
    selectedDate,
    calendarOption,
    //----------------
    currentDate,
    prevMonth,
    nextMonth,
    //---------------
    yearsOfPeriod,
    nextYears,
    prevYears,
    nextYear,
    prevYear,
    AvailableMap,

    //==============
    currentYear,
    ChangeCurrentDate,
    setMonthCurrentDate,
    setMonthCurrentYear,
    setYearCurrentDate,
    setYearCurrentYear,
    ///==========
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
    <div :class="'grid grid-cols-' + (mode == MAP_ITEMS.DAY || mode == MAP_ITEMS.DAY_AND_TIME ? daysOfPeriod.length : 1)">
        <template v-if="mode == MAP_ITEMS.DAY || mode == MAP_ITEMS.DAY_AND_TIME">
            <CalendarHeader
                v-for="(days, i) in daysOfPeriod"
                :isFirst="i == 0"
                :isLast="i == daysOfPeriod.length - 1"
                :step="1"
                :key="'header' + days[9].dateObject.year + days[9].dateObject.monthIndex + days[9].month"
                :currentDate="days[9].dateObject"
                :nextMonth="nextMonth"
                :prevMonth="prevMonth"
                :nextYears="nextYears"
                :prevYears="prevYears"
                :nextYear="nextYear"
                :prevYear="prevYear"
                :changeMode="changeMode"
                :mode="mode"
                :AvailableMap="AvailableMap" />
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
                :AvailableMap="AvailableMap" />
        </template>

        <template v-if="mode == MAP_ITEMS.DAY">
            <WeekDaysPanel
                v-for="days in daysOfPeriod"
                :existsInStorage="existsInStorage"
                :key="'header' + days[9].dateObject.year + days[9].dateObject.monthIndex + days[9].month"
                :daysOfPeriod="days"
                :weekDays="weekDays"
                :handleSelect="handleSelect"
                :selectedDate="selectedDate"
                :calendarOption="calendarOption"
                :isFinalStep="isFinalStep(mode, AvailableMap as string[])" />
        </template>
        <template v-if="mode == MAP_ITEMS.DAY_AND_TIME && (selectedDate instanceof DateObject || (Array.isArray(selectedDate) && selectedDate.length == 2))">
            <WeekDaysPanel
                v-for="days in daysOfPeriod"
                :key="days[0].month"
                :existsInStorage="existsInStorage"
                :daysOfPeriod="days"
                :weekDays="weekDays"
                :handleSelect="handleSelect"
                :selectedDate="selectedDate"
                :calendarOption="calendarOption"
                :isFinalStep="isFinalStep(mode, AvailableMap as string[])" />
            <TimePicker
                :hour="hour"
                :minute="minute"
                :second="second"
                :selected-time="selectedTime"
                :onTimePickerSeparatedInput="onTimePickerSeparatedInput"
                :handleSelect="handleSelect" />
        </template>

        <template v-if="mode == MAP_ITEMS.MONTH">
            <MonthPanel
                :AvailableMap="AvailableMap"
                :currentDate="currentDate"
                :yearsOfPeriod="yearsOfPeriod"
                :calendarOption="calendarOption"
                :setMonthCurrentDate="setMonthCurrentDate"
                :changeMode="changeMode"
                :handleSelect="handleSelect"
                :isFinalStep="isFinalStep(mode, AvailableMap as string[])" />
        </template>

        <template v-if="mode == MAP_ITEMS.YEAR">
            <YearsPanel
                :currentDate="currentDate"
                :yearsOfPeriod="yearsOfPeriod"
                :nextYears="nextYears"
                :prevYears="prevYears"
                :calendarOption="calendarOption"
                :setYearCurrentDate="setYearCurrentDate"
                :changeMode="changeMode"
                :handleSelect="handleSelect"
                :isFinalStep="isFinalStep(mode, AvailableMap as string[])" />
        </template>
    </div>
</template>
