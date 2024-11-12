<script setup lang="ts">
import DateObject from 'react-date-object'
import TopArrow from '@/icons/TopArrow.vue'
import BottomArrow from '@/icons/BottomArrow.vue'
import { ref, VNodeRef } from 'vue';

interface Props {
    selectedTime: DateObject
    hour: number
    minute: number
    second: number
    onTimePickerSeparatedInput: (hour: number, minute: number, second: number) => void
}

const { selectedTime, hour, minute, second } = defineProps<Props>();

const hourInput = ref(null);
const minuteInput = ref(null);
const secondInput = ref(null);
</script>

<template>
    <div class="grid grid-cols-3 gap-4 mt-4">
        <div class="col-span-1 w-[4em]">
            <button class="block w-[1.5em] text-center h-[1.5em] text-blue-700 bg-gray-300 rounded-md mx-auto my-1" type="button" @click.prevent="()=>console.log(hourInput)">
                <TopArrow class="block mx-auto" />
            </button>
            <input
                ref="houtInput"
                type="number"
                class="block mx-auto p-2 border rounded-md w-[4em] text-center !appearance-none"
                :value="hour"
                min="0"
                max="23"
                @input="($event) => onTimePickerSeparatedInput(Number($event?.target?.value) as number, minute, second)"
            />
            <button class="block w-[1.5em] h-[1.5em] text-blue-700 bg-gray-300 rounded-md mx-auto my-1">
                <BottomArrow class="block mx-auto" />
            </button>
        </div>
        <div>
            <button class="block w-[1.5em] h-[1.5em] text-blue-700 bg-gray-300 rounded-md mx-auto my-1">
                <TopArrow class="block mx-auto" />
            </button>
            <input
               :ref="minuteInput"
                type="number"
                :value="minute"
                class="block p-2 mx-auto border rounded-md w-[4em] text-center !appearance-none"
                @input="($event) => onTimePickerSeparatedInput(hour, Number($event?.target?.value) as number, second)"
            />
            <button class="block w-[1.5em] h-[1.5em] text-blue-700 bg-gray-300 rounded-md mx-auto my-1">
                <BottomArrow class="block mx-auto" />
            </button>
        </div>
        <div>
            <button class="block w-[1.5em] h-[1.5em] text-blue-700 bg-gray-300 rounded-md mx-auto my-1" >
                <TopArrow class="block mx-auto" />
            </button>
            <input
            :ref="secondInput"
                type="number"
                :value="second"
                class="block p-2 mx-auto border rounded-md w-[4em] text-center !appearance-none"
                @input="($event) => onTimePickerSeparatedInput(hour, minute, Number($event?.target?.value) as number)"
            />
            <button class="block w-[1.5em] h-[1.5em] text-blue-700 bg-gray-300 rounded-md mx-auto my-1">
                <BottomArrow class="block mx-auto" />
            </button>
        </div>
    </div>
</template>
