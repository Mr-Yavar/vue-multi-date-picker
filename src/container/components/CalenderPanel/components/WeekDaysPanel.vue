<script setup lang="ts">
import { ICalendarOption } from "@/types/ICalendarOption";
import { WeekDayObject } from "@/types/WeekDayObject";
import { getWeekOrders } from "@/utils/getWeekOrders";
import DateObject from "react-date-object";
import { toRefs } from "vue";

interface Props {
  daysOfPeriod: WeekDayObject[];
  weekDays: string[][];
  handleSelect: Function;
  selectedDate: DateObject | any;
  calendarOption: ICalendarOption;
  isFinalStep : boolean;
}

const props =
  defineProps<Props>();

  const { daysOfPeriod, handleSelect, calendarOption } = props;
  const { selectedDate } = toRefs(props);
function isSelected(day: WeekDayObject): boolean {
  return day.date.toDateString() === selectedDate.value?.toDate().toDateString();
}

</script>

<template>
  <div class="datepicker-weekdays">
    <span
      v-for="(day, index) in getWeekOrders(calendarOption.locale)"
      :key="index"
    >
      {{ day[1] }}
    </span>
  </div>
  <div class="datepicker-days">
    <div
      v-for="(day, index) in daysOfPeriod"
      :key="index"
      class="datepicker-day"
      @click="() => day.isActive && handleSelect(day.dateObject)"
    >
      <span
        :class="{
          semiActive: !day.isActive && isSelected(day),
          active: day.isActive && isSelected(day),
          disabled: !day.isActive && !isSelected(day),
        }"
      >
        {{
          day.dateObject
            .convert(calendarOption.calender, calendarOption.locale)
            .format("D")
        }}
      </span>
    </div>
  </div>
</template>
