<script setup lang="ts">
import MAP_ITEMS from '@/constants/MapItem'
import { ICalendarOption } from '@/types/ICalendarOption'
import { WeekDayObject } from '@/types/WeekDayObject'

import DateObject from 'react-date-object'
import { markRaw } from 'vue';

interface Props {
    currentDate: DateObject
    calendarOption: ICalendarOption
    //==================
    setMonthCurrentDate: Function

    //=====================
    changeMode: Function,
    handleSelect : Function,
    isFinalStep : boolean;

}

const {  calendarOption } = defineProps<Props>()
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

                    if(isFinalStep)
                        handleSelect( markRaw(  new DateObject({
                            calendar: calendarOption.calender,
                            locale: calendarOption.locale,
                            year: currentDate.year,
                            month: index + 1,
                            day: 1,
                        })))  
                    else
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
