<script setup lang="ts">
import { ICalendarOption } from '@/types/ICalendarOption'
import { WeekDayObject } from '@/types/WeekDayObject'
import DateObject from 'react-date-object'
import CalendarHeader from './components/CalendarHeader.vue'
import WeekDaysPanel from './components/WeekDaysPanel.vue'
import YearsPanel from './components/YearsPanel.vue'
import MAP_ITEMS from '@/constants/MapItem'
import MonthPanel from './components/MonthPanel.vue'
import { isFinalStep } from '@/utils/isFinalStep'

interface Props {
    changeMode: (mode :string) =>void
    mode: string
    daysOfPeriod: WeekDayObject[]
    weekDays: string[][]
    handleSelect: (date:DateObject)=>void
    selectedDate: DateObject | DateObject[] | DateObject[][]
    calendarOption: ICalendarOption
    prevMonth: ()=>void
    nextMonth:  ()=>void
    currentDate: DateObject
    yearsOfPeriod: DateObject[]
    nextYears:  ()=>void
    prevYears:  ()=>void
    nextYear:  ()=>void
    prevYear:  ()=>void
    AvailableMap: (string | number)[]
    //////=====================
    currentYear: DateObject
    ChangeCurrentDate:  (date:DateObject)=>void
    setMonthCurrentDate:  (date:DateObject)=>void
    setMonthCurrentYear:  (date:DateObject)=>void
    setYearCurrentDate:  (date:DateObject)=>void
    setYearCurrentYear:  (date:DateObject)=>void
    //==============
}

const {
    daysOfPeriod,
    weekDays,
    handleSelect,
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
} = defineProps<Props>()
</script>

<template>
    {{ mode }}
    <CalendarHeader
        :currentDate="currentDate"
        :nextMonth="nextMonth"
        :prevMonth="prevMonth"
        :yearsOfPeriod="yearsOfPeriod"
        :nextYears="nextYears"
        :prevYears="prevYears"
        :nextYear="nextYear"
        :prevYear="prevYear"
        :changeMode="changeMode"
        :mode="mode"
        :AvailableMap="AvailableMap"
    />

    <template v-if="mode == MAP_ITEMS.DAY">
        <WeekDaysPanel
            :daysOfPeriod="daysOfPeriod"
            :weekDays="weekDays"
            :handleSelect="handleSelect"
            :selectedDate="selectedDate"
            :calendarOption="calendarOption"
            :isFinalStep="isFinalStep(mode, AvailableMap as string[])"
        />
    </template>

    <template v-if="mode == MAP_ITEMS.MONTH">
        <MonthPanel
            :currentDate="currentDate"
            :yearsOfPeriod="yearsOfPeriod"
            :calendarOption="calendarOption"
            :setMonthCurrentDate="setMonthCurrentDate"
            :changeMode="changeMode"
            :handleSelect="handleSelect"
            :isFinalStep="isFinalStep(mode, AvailableMap as string[])"
        />
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
            :isFinalStep="isFinalStep(mode, AvailableMap as string[])"
        />
    </template>
</template>
