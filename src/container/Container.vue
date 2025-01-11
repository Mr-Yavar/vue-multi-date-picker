<script setup lang="ts">
import { autoPlacement, hide, useFloating } from '@floating-ui/vue'
import DateObject, { Calendar, Locale, Month } from 'react-date-object'

import { Ref, ref, toRefs, watch } from 'vue'

import { configure } from '@/utils/configure'
import { useCalendar } from '../composables/useCalendar'
import { useEntryPoint } from '../composables/useEntryPoint'
import { useTimePicker } from '../composables/useTimePicker'
import { ComponentMapKeys, dateSeparatorType, MapItemValues, SubTypeKeys } from '@/types'
import { ICalendarOption } from '@/types/ICalendarOption'
import { isValidDate } from '../utils/isValidDate'

import CalendarPanel from './components/CalenderPanel/CalendarPanel.vue'

import gregorian from 'react-date-object/calendars/gregorian'

import gregorian_en from 'react-date-object/locales/gregorian_en'
import { useStore } from '@/composables/useStore'

interface Props {
    calendar: Calendar
    locale: Locale
    currentDate?: DateObject // تاریخ شروع نمایش
    format: string | 'YYYY-MM-DD HH:mm:ss'
    type: ComponentMapKeys
    subType: SubTypeKeys<Props['type']>
    dateSeparator: dateSeparatorType,
    rangeSeparator:string
}

const datepickerReference = ref(null)
const datepickerFloating = ref(null)
const { floatingStyles: datepickerFloatingStyles, middlewareData: datepickerMiddlewareData } = useFloating(datepickerReference, datepickerFloating, {
    middleware: [hide(), autoPlacement()],
})

const {
    calendar: ucalendar,
    locale: ulocale,
    currentDate: ucurrentDate, // تاریخ شروع نمایش
    format = 'YYYY-MM-DD HH:mm:ss',
    type,
    subType,
    dateSeparator = ',',
    rangeSeparator = " ~ "
} = defineProps<Props>()

const calendar = ucalendar ?? gregorian
const locale = ulocale ?? gregorian_en
const calendarOption = {
    calender: calendar,
    format: format,
    locale: locale,
} as ICalendarOption
const weekDays = locale.weekDays
const months = locale.months

const {
    currentDate,
    selectedDate,
    daysOfPeriod,
    prevMonth,
    nextMonth,
    updateCurrentDate,
    onSeparatedInput: onCalenderSeparatedInput,
    // updateSelectedDate: handleSelect,
    prevYears,
    nextYears,
    yearsOfPeriod,
    prevYear,
    nextYear,
    //================
    currentYear,
    ChangeCurrentDate,
    setMonthCurrentDate,
    setMonthCurrentYear,
    setYearCurrentDate,
    setYearCurrentYear,
} = useCalendar(calendarOption, ucurrentDate)

const { hour, minute, second, selectedTime, onRawInput: onTimePickerInput, onSeparatedInput: onTimePickerSeparatedInput } = useTimePicker(calendarOption)

const { rawDateTime, onInput, onOutput, isTyping } = useEntryPoint(calendarOption)

const store = useStore(type,calendarOption);

const mapOfCalendar = configure(type, subType)
console.log(mapOfCalendar)
const mode = ref<Ref<MapItemValues>>(mapOfCalendar[0])

function changeMode(value: MapItemValues) {
    mode.value = value
}

function handleSelect(obj: DateObject){
    store.addToStorage(obj,selectedTime.value)
}



// const showDatepicker = () => {
//   if (datepickerFloating.value) {
//     datepickerFloating.value.style.visibility = "visible";
//   }
// };

// const hideDatepicker = () => {
//   if (datepickerFloating.value) {
//     datepickerFloating.value.style.visibility = "hidden";
//     datepickerFloating.value.style.visibility = "hidden";
//   }
// };

////////================= EntryPoint Mid
// بروزرسانی محتوای
watch([store.storage], () => {
    const [year, month, day]: [number, Month, number] = [selectedDate.value.year, selectedDate.value.month, selectedDate.value.day]
    const [hour, minute, second]: [number, number, number] = [selectedTime.value.hour, selectedTime.value.minute, selectedTime.value.second]

    onOutput(
      store.toString(rangeSeparator,dateSeparator)
    )
})

function onRawEntryPointUpdate(event: any) {
    const updatedRawValue: string = event.target.value
    onInput(updatedRawValue)


    store.fromString(updatedRawValue,rangeSeparator,dateSeparator);
    // const dateObject: DateObject = new DateObject({
    //     date: updatedRawValue,
    //     calendar: calendarOption.calender,
    //     locale: calendarOption.locale,
    //     format: calendarOption.format as string,
    // })

    // // Update selected date and time only if the input is valid
    // if (isValidDate(dateObject)) {
    //     onTimePickerSeparatedInput(dateObject.hour, dateObject.minute, dateObject.second)
    //     onCalenderSeparatedInput(dateObject.year, dateObject.month.number, dateObject.day)
    // }
}
const AvailableMap: (string | number)[] = mapOfCalendar
///////================== EntryPoint Mid End
</script>

<template>
    {{ AvailableMap }}
    <div class="bg-gray-400 h-[700px]">
        <slot name="entryPoint" :updateValue="onRawEntryPointUpdate" :value="rawDateTime">
            <input :value="rawDateTime" @input="onRawEntryPointUpdate" />
        </slot>

        <!-- <div
    ref="datepickerReference"
    @click="showDatepicker"
    class="bg-red-600 focus:bg-orange-50"
    style="display: inline-block; cursor: pointer; margin-left: 20px"
    tabindex="100"
    @focus="showDatepicker"
    @blur="hideDatepicker"
  >
    <input type="text" readonly :value="selectedDate"  />
  </div>
  
      ref="datepickerFloating"
    :style="{
      ...datepickerFloatingStyles,
      visibility:
        (!datepickerMiddlewareData.hide?.referenceHidden && 'hidden') ||
        datepickerMiddlewareData.hide?.referenceHidden
          ? 'hidden'
          : 'visible',
        
    }"
     tabindex="10"
     @focus="showDatepicker"
    @blur="hideDatepicker"
  -->

        <div>
            <div class="datepicker-container">
                <!--- HEADER OF DATEPICKER -->
                <div class="datepicker-body">
                    <!--- BODY OF DATEPICKER -->

                    <CalendarPanel
                        :changeMode="changeMode"
                        :mode="mode as string"
                        :daysOfPeriod="daysOfPeriod"
                        :weekDays="weekDays"
                        :handleSelect="handleSelect"
                        :existsInStorage="store.existsInStorage"
                        :selectedDate="selectedDate"
                        :calendarOption="calendarOption"
                        :prevMonth="prevMonth"
                        :nextMonth="nextMonth"
                        :currentDate="currentDate"
                        :yearsOfPeriod="yearsOfPeriod"
                        :nextYears="nextYears"
                        :prevYears="prevYears"
                        :nextYear="nextYear"
                        :prevYear="prevYear"
                        :AvailableMap="AvailableMap"
                        :currentYear="currentYear"
                        :ChangeCurrentDate="ChangeCurrentDate"
                        :setMonthCurrentDate="setMonthCurrentDate"
                        :setMonthCurrentYear="setMonthCurrentYear"
                        :setYearCurrentDate="setYearCurrentDate"
                        :setYearCurrentYear="setYearCurrentYear"
                        :hour="hour as number"
                        :minute="minute as number"
                        :second="second as number"
                        :selected-time="selectedTime"
                        :onTimePickerSeparatedInput="onTimePickerSeparatedInput"
                    />
                </div>
            </div>
        </div>
    </div>
    <div>{{ selectedDate }}</div>

    <div>{{ selectedTime.hour + ':' + selectedTime.minute }}</div>
    <div>
        {{ JSON.stringify(store.storage.value) }}
        </div>
</template>

<style></style>
