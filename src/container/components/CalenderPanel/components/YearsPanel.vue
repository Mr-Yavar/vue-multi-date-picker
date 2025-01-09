<script setup lang="ts">
import MAP_ITEMS from '@/constants/MapItem'
import { ICalendarOption } from '@/types/ICalendarOption'
import { WeekDayObject } from '@/types/WeekDayObject'

import DateObject from 'react-date-object'
import { markRaw } from 'vue'

interface Props {
    yearsOfPeriod: DateObject[]
    nextYears: Function
    prevYears: Function
    currentDate: DateObject
    calendarOption: ICalendarOption
    //==================
    setYearCurrentDate: Function
    //=====================
    changeMode: Function
    handleSelect: Function
    isFinalStep: boolean
}
function isSelected(year: DateObject, currentDate: DateObject): boolean {
    return year.year === currentDate.year
}
const { yearsOfPeriod, nextYears, prevYears, calendarOption } = defineProps<Props>()
</script>

<template>
    <div class="datepicker-years">
        <div v-for="(year, index) in yearsOfPeriod" :key="year.format('YYYY')" class="datepicker-year">
            <div
                :class="{
                    active: isSelected(year, currentDate),
                }"
                @click.prevent="
                    () => {
                        setYearCurrentDate(year)
                        if (isFinalStep) handleSelect(markRaw(year))
                        else changeMode(MAP_ITEMS.MONTH)
                    }
                "
            >
                {{ year.format('YYYY') }}
            </div>
        </div>
    </div>
</template>
