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

function updateTimePicker(hour: number, minute: number, second: number) {
    onTimePickerSeparatedInput(hour, minute, second);
}

function hourUp(step: number = 1) {
    const totalHours = hour.value + step;
    const newHour = totalHours % 24;
    const daysToAdd = Math.floor(totalHours / 24);

    if (daysToAdd > 0) {
        const tempDate = new Date(selectedDate.value.toDate());
        tempDate.setDate(tempDate.getDate() + daysToAdd);
        const temp = new DateObject({
            calendar: selectedDate.value.calendar,
            locale: selectedDate.value.locale,
            date: tempDate,
        });
        handleSelectDate(markRaw(temp));
    }

    return newHour;
}

function hourDown(step: number = 1) {
    const totalHours = hour.value - step;
    const newHour = (totalHours + 24) % 24; // Wrap around to get the correct hour
    const daysToGoBack = Math.floor(Math.abs(totalHours) / 24);

    if (daysToGoBack > 0) {
        const tempDate = new Date(selectedDate.value.toDate());
        tempDate.setDate(tempDate.getDate() - daysToGoBack);
        const temp = new DateObject({
            calendar: selectedDate.value.calendar,
            locale: selectedDate.value.locale,
            date: tempDate,
        });
        handleSelectDate(markRaw(temp));
    }

    return newHour;
}

function minuteUp(step: number = 1) {
    const totalMinutes = minute.value + step;
    const newMinute = totalMinutes % 60;
    const hoursToAdd = Math.floor(totalMinutes / 60);

    const newHour = hourUp(hoursToAdd);
    return { newHour, newMinute };
}

function minuteDown(step: number = 1) {
    const totalMinutes = minute.value - step;
    const newMinute = (totalMinutes + 60) % 60; // Wrap around to get the correct minute
    const hoursToGoBack = Math.floor(Math.abs(totalMinutes) / 60);

    const newHour = hourDown(hoursToGoBack);
    return { newHour, newMinute };
}

function secondUp(step: number = 1) {
    const totalSeconds = second.value + step;
    const newSecond = totalSeconds % 60;
    const minutesToAdd = Math.floor(totalSeconds / 60);

    const { newHour, newMinute } = minuteUp(minutesToAdd);
    return { newHour, newMinute, newSecond };
}

function secondDown(step: number = 1) {
    const totalSeconds = second.value - step;
    const newSecond = (totalSeconds + 60) % 60; // Wrap around to get the correct second
    const minutesToGoBack = Math.floor(Math.abs(totalSeconds) / 60);

    const { newHour, newMinute } = minuteDown(minutesToGoBack);
    return { newHour, newMinute, newSecond };
}

// Example usage of the functions:
function updateTime(step: number, type: 'hour' | 'minute' | 'second', direction: 'up' | 'down') {
    let newHour = hour.value;
    let newMinute = minute.value;
    let newSecond = second.value;

    if (type === 'hour') {
        if (direction === 'up') {
            newHour = hourUp(step);
        } else {
            newHour = hourDown(step);
        }
    } else if (type === 'minute') {
        const result = direction === 'up' ? minuteUp(step) : minuteDown(step);
        newHour = result.newHour;
        newMinute = result.newMinute;
    } else if (type === 'second') {
        const result = direction === 'up' ? secondUp(step) : secondDown(step);
        newHour = result.newHour;
        newMinute = result .newMinute;
        newSecond = result.newSecond;
    }

    updateTimePicker(newHour, newMinute, newSecond);
}

function toHourUp(step:number=1){
    updateTime(step,'hour','up')
}
function toHourDown(step:number=1){
    updateTime(step,'hour','down')
}
function toMinuteUp(step:number=1){
    updateTime(step,'minute','up')
}
function toMinuteDown(step:number=1){
    updateTime(step,'minute','down')
}
function toSecondUp(step:number=1){
    updateTime(step,'second','up')
}
function toSecondDown(step:number=1){
    updateTime(step,'second','down')
}
</script>

<template>
    <div class="grid grid-cols-3 gap-4 mt-4">
        <div class="col-span-1 w-[4em]">
            <button
                class="block w-[1.5em] text-center h-[1.5em] text-blue-700 bg-gray-300 rounded-md mx-auto my-1"
                type="button"
                @click="toHourUp()"
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
                @click="toHourDown()"
            >
                <BottomArrow class="block mx-auto" />
            </button>
        </div>
        <div>
            <button
                class="block w-[1.5em] h-[1.5em] text-blue-700 bg-gray-300 rounded-md mx-auto my-1"
                type="button"
                @click="toMinuteUp()"
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
                @click="toMinuteDown()"
            >
                <BottomArrow class="block mx-auto" />
            </button>
        </div>
        <div>
            <button
                class="block w-[1.5em] h-[1.5em] text-blue-700 bg-gray-300 rounded-md mx-auto my-1"
                @click="toSecondUp()"
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
                @click="toSecondDown()"
            >
                <BottomArrow class="block mx-auto" />
            </button>
        </div>
    </div>
</template>
