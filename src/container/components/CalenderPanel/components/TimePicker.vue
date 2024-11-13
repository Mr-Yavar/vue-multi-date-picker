<script setup lang="ts">
import DateObject from 'react-date-object'
import TopArrow from '@/icons/TopArrow.vue'
import BottomArrow from '@/icons/BottomArrow.vue'
import { markRaw, ref, toRefs, VNodeRef } from 'vue'

interface Props {
    selectedTime: DateObject
    hour: number
    minute: number
    second: number
    onTimePickerSeparatedInput: (hour: number, minute: number, second: number) => void
    selectedDate: DateObject
    handleSelect: (dateObject: DateObject) => void
}

const props = defineProps<Props>()
const { onTimePickerSeparatedInput, handleSelect: handleSelectDate } = props
const { selectedTime, selectedDate, hour, minute, second } = toRefs(props)
function hourUp(step: number = 1) {
    const totalHours = hour.value + step
    if (totalHours >= 24) {
        const daysToAdd = Math.floor(totalHours / 24) // Calculate full days to add
        const newHour = totalHours % 24 // Get the remaining hour

        const tempDate = new Date(selectedDate.value.toDate())
        tempDate.setDate(tempDate.getDate() + daysToAdd)
        const temp = new DateObject({
            calendar: selectedDate.value.calendar,
            locale: selectedDate.value.locale,
            date: tempDate,
        })
        handleSelectDate(markRaw(temp))
    }

    onTimePickerSeparatedInput(totalHours % 24, minute.value, second.value)
    return totalHours % 24
}
function hourDown(step: number = 1) {
    const totalHours = hour.value - step

    if (totalHours < 0) {
        const daysToGoBack = Math.ceil(Math.abs(totalHours) / 24)
        const tempDate = new Date(selectedDate.value.toDate())
        tempDate.setDate(tempDate.getDate() - daysToGoBack)

        // Adjust the hour to the equivalent hour of the previous day(s)
        const newHour = (24 + totalHours) % 24 // Wrap around to get the correct hour

        const temp = new DateObject({
            calendar: selectedDate.value.calendar,
            locale: selectedDate.value.locale,
            date: tempDate,
        })

        handleSelectDate(markRaw(temp))
        onTimePickerSeparatedInput(newHour, minute.value, second.value)
        return newHour
    } else {
        onTimePickerSeparatedInput(totalHours, minute.value, second.value)
        return totalHours
    }
}

function minuteUp(step: number = 1) {
    const totalMinutes = minute.value + step

    if (totalMinutes >= 60) {
        const newhour = hourUp(Math.ceil(Math.abs(totalMinutes) / 60))
        const newMin = (totalMinutes + 60) % 60
        onTimePickerSeparatedInput(newhour, (totalMinutes + 60) % 60, second.value)

        return newMin
    }
    onTimePickerSeparatedInput(hour.value, totalMinutes, second.value)
    return totalMinutes
}
function minuteDown(step: number = 1) {
    const totalMinutes = minute.value - step
    if (totalMinutes < 0) {
        const newHour = hourDown(Math.ceil(Math.abs(totalMinutes) / 60))
        const newMin = (totalMinutes + 60) % 60
        onTimePickerSeparatedInput(newHour, newMin, second.value)

        return newMin
    } else onTimePickerSeparatedInput(hour.value, totalMinutes, second.value)
    return totalMinutes
}

function secondUp(step: number = 1) {
    const totalSeconds = second.value + step
    if (totalSeconds >= 60) {
        const newMin = minuteUp(Math.floor(totalSeconds / 60))
        onTimePickerSeparatedInput(hour.value, newMin, totalSeconds % 60)
    } else onTimePickerSeparatedInput(hour.value, minute.value, second.value + step)
}
function secondDown(step: number = 1) {
    const totalSeconds = second.value - step

    if (totalSeconds < 0) {
        const newMin = minuteDown(Math.ceil(Math.abs(totalSeconds) / 60))
        onTimePickerSeparatedInput(hour.value, newMin, (totalSeconds + 60) % 60)
    } else onTimePickerSeparatedInput(hour.value, minute.value, second.value - step)
}
</script>

<template>
    <div class="grid grid-cols-3 gap-4 mt-4">
        <div class="col-span-1 w-[4em]">
            <button
                class="block w-[1.5em] text-center h-[1.5em] text-blue-700 bg-gray-300 rounded-md mx-auto my-1"
                type="button"
                @click="hourUp()"
            >
                <TopArrow class="block mx-auto" />
            </button>
            <input
                type="number"
                class="block mx-auto p-2 border rounded-md w-[4em] text-center !appearance-none"
                :value="hour"
                min="0"
                max="23"
                @input="($event) => onTimePickerSeparatedInput(Number($event?.target?.value) as number, minute, second)"
            />
            <button
                class="block w-[1.5em] h-[1.5em] text-blue-700 bg-gray-300 rounded-md mx-auto my-1"
                type="button"
                @click="hourDown()"
            >
                <BottomArrow class="block mx-auto" />
            </button>
        </div>
        <div>
            <button
                class="block w-[1.5em] h-[1.5em] text-blue-700 bg-gray-300 rounded-md mx-auto my-1"
                type="button"
                @click="minuteUp()"
            >
                <TopArrow class="block mx-auto" />
            </button>
            <input
                type="number"
                :value="minute"
                class="block p-2 mx-auto border rounded-md w-[4em] text-center !appearance-none"
                @input="($event) => onTimePickerSeparatedInput(hour, Number($event?.target?.value) as number, second)"
            />
            <button
                class="block w-[1.5em] h-[1.5em] text-blue-700 bg-gray-300 rounded-md mx-auto my-1"
                @click="minuteDown()"
            >
                <BottomArrow class="block mx-auto" />
            </button>
        </div>
        <div>
            <button
                class="block w-[1.5em] h-[1.5em] text-blue-700 bg-gray-300 rounded-md mx-auto my-1"
                @click="secondUp()"
            >
                <TopArrow class="block mx-auto" />
            </button>
            <input
                type="number"
                :value="second"
                class="block p-2 mx-auto border rounded-md w-[4em] text-center !appearance-none"
                @input="($event) => onTimePickerSeparatedInput(hour, minute, Number($event?.target?.value) as number)"
            />
            <button
                class="block w-[1.5em] h-[1.5em] text-blue-700 bg-gray-300 rounded-md mx-auto my-1"
                @click="secondDown()"
            >
                <BottomArrow class="block mx-auto" />
            </button>
        </div>
    </div>
</template>
