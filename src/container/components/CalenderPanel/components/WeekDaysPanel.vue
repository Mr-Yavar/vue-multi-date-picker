<script setup lang="ts">
import type { ICalendarOption } from '@/types/ICalendarOption'
import type { WeekDayObject } from '@/types/WeekDayObject'
import { getWeekOrders } from '@/utils/getWeekOrders'
import DateObject from 'react-date-object'
import { computed } from 'vue'

interface Props {
  daysOfPeriod: WeekDayObject[]
  weekDays: string[][]
  handleSelect: Function
  selectedDate: DateObject | any
  calendarOption: ICalendarOption
  isFinalStep: boolean
  removeFromStorage: (index: number) => void
  existsInStorage: (date: DateObject) => number
}

const props = defineProps<Props>()

const { daysOfPeriod, handleSelect, calendarOption } = props

const processed_daysOfPeriod = computed(() => {
  return daysOfPeriod.map((day) => {
    const inStorage = props.existsInStorage(day.dateObject)
    return { ...day, isSelected: inStorage > -1, inStorage }
  })
})

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
        v-for="(day, index) in processed_daysOfPeriod"
        :key="index"
        class="datepicker-day"
        @click="
          () =>
            (day.isActive &&
              !day.isSelected &&
              handleSelect(
                day.dateObject.convert(calendarOption.calender, calendarOption.locale),
              )) ||
            (day.isSelected && removeFromStorage(day.inStorage))
        "
      >
        <span
          :class="{
            semiActive: !day.isActive && day.isSelected,
            active: day.isActive && day.isSelected,
            disabled: !day.isActive && !day.isSelected,
          }"
        >
          {{ day.dateObject.convert(calendarOption.calender, calendarOption.locale).format('D') }}
        </span>
      </div>
    </div>
  </div>
</template>
