<script setup lang="ts">
import MAP_ITEMS from '@/constants/MapItem'
import DateObject from 'react-date-object'
import { ComputedRef, PropType } from 'vue';

interface Props {
    prevMonth: ()=>void
    nextMonth: Function
    currentDate: DateObject
    mode: string
    changeMode: (mode :string) =>void
    nextYears: ()=>void
    prevYears: ()=>void
    nextYear: ()=>void
    prevYear: ()=>void
    AvailableMap: (string | number)[]
}

const {
    prevMonth,
    nextMonth,
    currentDate,
    changeMode,
    nextYears,
    prevYears,
    mode,
    AvailableMap,
    nextYear,
    prevYear,
} = defineProps<Props>()
</script>

<template>
    <template v-if="MAP_ITEMS.DAY == mode">
        <div class="datepicker-header">
            <div class="datepicker-header-prev">
                <button
                    @click="() => prevMonth()"
                    type="button"
                    class="block w-[30px] h-[30px] mx-auto !rounded-full bg-gray-50"
                >
                    {{ '<' }}
                </button>
            </div>
            <div class="datepicker-header-control">
                <div class="mx-auto w-fit">
                    <button @click="() => changeMode(MAP_ITEMS.MONTH as string)">
                        {{ currentDate.month }}
                    </button>
                    <button @click="() => changeMode(MAP_ITEMS.YEAR as string)">
                        {{ currentDate.year }}
                    </button>
                </div>
            </div>
            <div class="col-span-1 col-start-5 datepicker-header-next">
                <button
                    type="button"
                    @click="() => nextMonth()"
                    class="block w-[30px] h-[30px] mx-auto !rounded-full bg-gray-50"
                >
                    {{ '>' }}
                </button>
            </div>
        </div>
    </template>
    <template v-else-if="MAP_ITEMS.MONTH == mode">
        <div class="datepicker-header">
            <div class="datepicker-header-prev">
                <button
                    @click="() => prevYear()"
                    type="button"
                    class="block w-[30px] h-[30px] mx-auto !rounded-full bg-gray-50"
                >
                    {{ '<' }}
                </button>
            </div>
            <div class="datepicker-header-control">
                <div class="mx-auto w-fit">
                    <!-- <button>{{ currentDate.month }}</button> -->
                    <!-- <button>{{ currentDate.year }}</button> -->
                    <button @click="() => changeMode('YEAR')">
                        {{ currentDate.year }}
                    </button>
                </div>
            </div>
            <div class="col-span-1 col-start-5 datepicker-header-next">
                <button
                    type="button"
                    @click="() => nextYear()"
                    class="block w-[30px] h-[30px] mx-auto !rounded-full bg-gray-50"
                >
                    {{ '>' }}
                </button>
            </div>
        </div></template
    >
    <template v-else-if="MAP_ITEMS.YEAR == mode">
        <div class="datepicker-header">
            <div class="datepicker-header-prev">
                <button
                    @click="() => prevYears()"
                    type="button"
                    class="block w-[30px] h-[30px] mx-auto !rounded-full bg-gray-50"
                >
                    {{ '<' }}
                </button>
            </div>
            <div class="datepicker-header-control">
                <div class="mx-auto w-fit">
                    <!-- <button>{{ currentDate.month }}</button> -->
                    <!-- <button>{{ currentDate.year }}</button> -->
                </div>
            </div>
            <div class="col-span-1 col-start-5 datepicker-header-next">
                <button
                    type="button"
                    @click="() => nextYears()"
                    class="block w-[30px] h-[30px] mx-auto !rounded-full bg-gray-50"
                >
                    {{ '>' }}
                </button>
            </div>
        </div></template
    >
</template>
