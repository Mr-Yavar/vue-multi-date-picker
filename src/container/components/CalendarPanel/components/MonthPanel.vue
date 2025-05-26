<script setup lang="ts">
import MAP_ITEMS from '@/constants/MapItem'
import type { MapItemValues } from '@/types'
import type { ICalendarOption } from '@/types/ICalendarOption'
import type { WeekDayObject } from '@/types/WeekDayObject'

import DateObject from 'react-date-object'
import { computed, markRaw } from 'vue'

interface Props {
  currentDate: DateObject
  calendarOption: ICalendarOption
  existsInStorage: (date: DateObject) => number
  removeFromStorage: (index: number) => void
  //= =================
  setMonthCurrentDate: (date: DateObject) => void
  AvailableMap: (string | number)[]
  //= ====================
  changeMode: (mode: MapItemValues) => void
  handleSelect: (date: DateObject) => void
  isFinalStep: boolean
}

const { calendarOption, currentDate, existsInStorage } = defineProps<Props>()

const months = computed(() => {
  return calendarOption.locale.months.map((month, index) => {
    const monthDate = new DateObject({
      calendar: calendarOption.calender,
      locale: calendarOption.locale,
      year: currentDate.year,
      month: index + 1,
      day: 1,
    })
    const inStorage = existsInStorage(monthDate)
    return { name: month[0], dateobject: monthDate, isSelected: inStorage > -1, inStorage }
  })
})
</script>

<template>
  <div class="datepicker-months">
    <div
      v-for="(month, index) in months"
      :key="month.name"
      class="datepicker-month"
      @click="
        () => {
          setMonthCurrentDate(month.dateobject)

          if (isFinalStep) {
            if (!month.isSelected) {
              handleSelect(month.dateobject)
            } else {
              removeFromStorage(month.inStorage)
            }
          } else changeMode(AvailableMap[0])
        }
      "
    >
      <div
        :class="{
          active:
            (isFinalStep && month.isSelected) || (!isFinalStep && currentDate.month.index === index),
        }"
      >
        {{ month.name }}
      </div>
    </div>
  </div>
</template>
