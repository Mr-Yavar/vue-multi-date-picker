<script setup lang="ts">
import MAP_ITEMS from '@/constants/MapItem'
import DateObject from 'react-date-object'

interface Props {
    prevMonth: Function
    nextMonth: Function
    currentDate: DateObject
    mode: string
    changeMode: Function
    yearsOfPeriod: any
    nextYears: Function
    prevYears: Function
    nextYear: Function
    prevYear: Function
    AvailableMap: (string | number)[]
}

const {
    prevMonth,
    nextMonth,
    currentDate,
    changeMode,
    yearsOfPeriod,
    nextYears,
    prevYears,
    mode,
    AvailableMap,
    nextYear,
    prevYear,
} = defineProps<Props>()
</script>

<template>
    <template v-if="AvailableMap[0] == mode && MAP_ITEMS.DAY == mode">
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
                    <button @click="() => changeMode(MAP_ITEMS.MONTH)">
                        {{ currentDate.month }}
                    </button>
                    <button @click="() => changeMode(MAP_ITEMS.YEAR)">
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
    <template v-else-if="AvailableMap[1] == mode && MAP_ITEMS.MONTH == mode">
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
    <template v-else-if="AvailableMap[2] == mode && MAP_ITEMS.YEAR == mode">
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
