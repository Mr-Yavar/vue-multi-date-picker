<script setup lang="ts">
import { ICalendarOption } from '@/types/ICalendarOption'
import { WeekDayObject } from '@/types/WeekDayObject'
import { getWeekOrders } from '@/utils/getWeekOrders'
import DateObject from 'react-date-object'


interface Props {
    daysOfPeriod: WeekDayObject[]
    weekDays: string[][]
    handleSelect: Function
    selectedDate: DateObject | any
    calendarOption: ICalendarOption
    isFinalStep: boolean
    existsInStorage: (date: DateObject) => boolean
}

const props = defineProps<Props>()

const { daysOfPeriod, handleSelect, calendarOption } = props

//TODO: deselect date
</script>

<template>
    <div class="mx-3">
        <div class="datepicker-weekdays">
            <span v-for="(day, index) in getWeekOrders(calendarOption.locale)" :key="index">
                {{ day[1] }}
            </span>
        </div>
        <div class="datepicker-days">
            <div
                v-for="(day, index) in daysOfPeriod"
                :key="index"
                class="datepicker-day"
                @click="() => day.isActive && handleSelect(day.dateObject.convert(calendarOption.calender, calendarOption.locale))">
                <span
                    :class="{
                        semiActive: !day.isActive && existsInStorage(day.dateObject),
                        active: day.isActive && existsInStorage(day.dateObject),
                        disabled: !day.isActive && !existsInStorage(day.dateObject),
                    }">
                    {{ day.dateObject.convert(calendarOption.calender, calendarOption.locale).format('D') }}
                </span>
            </div>
        </div>
    </div>
</template>
