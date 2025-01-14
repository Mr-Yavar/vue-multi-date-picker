<script setup lang="ts">
import MAP_ITEMS from '@/constants/MapItem'
import type { ICalendarOption } from '@/types/ICalendarOption'
import type { WeekDayObject } from '@/types/WeekDayObject'
import { computePosition } from '@floating-ui/vue'

import DateObject from 'react-date-object'
import { computed, markRaw, watchEffect } from 'vue'

interface Props {
  yearsOfPeriod: DateObject[]
  nextYears: () => void
  prevYears: () => void
  currentDate: DateObject
  calendarOption: ICalendarOption
  existsInStorage: (date: DateObject) => number
  removeFromStorage: (index: number) => void

  //==================
  setYearCurrentDate: (date: DateObject) => void
  //=====================
  changeMode: (mode: string | number) => void
  handleSelect: (date: DateObject) => void
  isFinalStep: boolean
}

const { yearsOfPeriod, nextYears, prevYears, calendarOption, existsInStorage } =
  defineProps<Props>()

const processed_yearsOfPeriod = computed(() => {
  return yearsOfPeriod.map((year) => {
    const inStorage = existsInStorage(year)
    return { dateobject: year, isSelected: inStorage > -1, inStorage }
  })
})
</script>

<template>
  <div class="datepicker-years">
    <div
      v-for="(year, index) in processed_yearsOfPeriod"
      :key="year.dateobject.format('YYYY')"
      class="datepicker-year"
    >
      <div
        :class="{
          active:
            (isFinalStep && year.isSelected) ||
            (!isFinalStep && year.dateobject.year == currentDate.year),
        }"
        @click.prevent="
          () => {
            setYearCurrentDate(year.dateobject)

            if (isFinalStep) {
              if (!year.isSelected) handleSelect(markRaw(year.dateobject))
              else removeFromStorage(year.inStorage)
            } else changeMode(MAP_ITEMS.MONTH)
          }
        "
      >
        {{ year.dateobject.format('YYYY') }}
      </div>
    </div>
  </div>
</template>
