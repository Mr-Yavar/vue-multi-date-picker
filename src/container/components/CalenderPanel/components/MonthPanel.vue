<script setup lang="ts">
import MAP_ITEMS from '@/constants/MapItem'
import { IcalendarOption } from '@/types/ICalendarOption'
import { WeekDayObject } from '@/types/WeekDayObject'

import DateObject from 'react-date-object'

interface Props {
    yearsOfPeriod: DateObject[]
    nextYears: Function
    prevYears: Function
    nextYear: Function
    prevYear: Function
    currentDate: DateObject
    calendarOption: IcalendarOption
    //==================
    currentYear: DateObject
    ChangeCurrentDate: Function
    setMonthCurrentDate: Function
    setMonthCurrentYear: Function
    setYearCurrentDate: Function
    setYearCurrentYear: Function

    //=====================
    changeMode: Function
}

const { yearsOfPeriod, nextYears, prevYears, calendarOption } = defineProps<Props>()
</script>

<template>
    <div class="datepicker-months">
        <div
            v-for="(month, index) in calendarOption.locale.months"
            :key="month[1]"
            class="datepicker-month"
            @click="
                () => {
                    setMonthCurrentDate(
                        new DateObject({
                            calendar: calendarOption.calender,
                            locale: calendarOption.locale,
                            year: currentDate.year,
                            month: index + 1,
                            day: 1,
                        }),
                    )

                    changeMode(MAP_ITEMS.DAY)
                }
            "
        >
            <div
                :class="{
                    active: currentDate.month.index == index,
                }"
            >
                {{ month[0] }}
            </div>
        </div>
    </div>
</template>
