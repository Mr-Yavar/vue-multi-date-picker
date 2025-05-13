<script setup lang="ts">
import DateObject, { type Calendar, type Locale } from 'react-date-object'
import {
  computed,
  type ComputedRef,
  type DeepReadonly,
  type ModelRef,
  onMounted,
  type Ref,
  ref,
  type StyleValue,
  useCssModule,
  type VNodeRef,
  watch,
  watchEffect,
} from 'vue'
import { configure } from '@/utils/configure'
import { useCalendar } from '../composables/useCalendar'
import { useEntryPoint } from '../composables/useEntryPoint'
import { useTimePicker } from '../composables/useTimePicker'
import type {
  ComponentMapKeys,
  dateSeparatorType,
  DateStorage,
  MapItemValues,
  SubTypeKeys,
} from '@/types'
import type { ICalendarOption } from '@/types/ICalendarOption'
import CalendarPanel from './components/CalenderPanel/CalendarPanel.vue'
import gregorian from 'react-date-object/calendars/gregorian'
import gregorian_en from 'react-date-object/locales/gregorian_en'
import { useStore } from '@/composables/useStore'
import useDetectOutsideClick from '@/composables/useDetectOutsideClick'
import { useFloating, offset, arrow, flip, shift } from '@floating-ui/vue'

//====================== Props Area
//#region [Props Area]
export interface Props {
  plainDate: boolean
  calendar: Calendar
  locale: Locale
  currentDate?: DateObject // تاریخ شروع نمایش
  format: string | 'YYYY-MM-DD HH:mm:ss'
  type: ComponentMapKeys
  subType: SubTypeKeys<Props['type']>
  dateSeparator: dateSeparatorType
  rangeSeparator: string
  enableTeleport: boolean
  handleChange: (v: any) => void
  defaultValue: DateStorage<Props['type']> | PlainDateStorage<Props['type']>
  value : DateStorage<Props['type']> | PlainDateStorage<Props['type']>
}

const {
  plainJsDate = false,
  calendar: userCalendar,
  locale: userLocale,
  currentDate: userCurrentDate, // تاریخ شروع نمایش
  format = 'YYYY-MM-DD HH:mm:ss',
  type,
  subType,
  dateSeparator = ' , ',
  rangeSeparator = ' ~ ',
  enableTeleport = true,
  handleChange,
  defaultValue,
  value
} = defineProps<Props>()

const calendar = userCalendar ?? gregorian
const locale = userLocale ?? gregorian_en
const calendarOption = {
  calender: calendar,
  format: format,
  locale: locale,
} as ICalendarOption

const mapOfCalendar = configure(type, subType);



//#endregion
//=======================================================

const store = useStore(handleChange, defaultValue, type, calendarOption,plainJsDate)
  watchEffect(()=>{
    store.setStorage(value);
  });
const {
  currentDate,
  selectedDate,
  daysOfPeriod,
  prevMonth,
  nextMonth,
  onSeparatedInput: onCalenderSeparatedInput,
  prevYears,
  nextYears,
  yearsOfPeriod,
  prevYear,
  nextYear,
  currentYear,
  ChangeCurrentDate,
  setMonthCurrentDate,
  setMonthCurrentYear,
  setYearCurrentDate,
  setYearCurrentYear,
} = useCalendar(calendarOption, userCurrentDate, 1)

const {
  hour,
  minute,
  second,
  selectedTime,
  onRawInput: onRawTimePickerInput,
  onSeparatedInput: onTimePickerSeparatedInput,
} = useTimePicker(calendarOption)

const { rawDateTime, onRawInput, onOutput, isTyping } = useEntryPoint(calendarOption)

//================ Floating UI Area
//#region [Floating UI Area]

const reference = ref<VNodeRef | null>(null)
const floating = ref(null)
const floatingArrow = ref(null)
const isOpen = ref(false)

/**
 * set point for floating ui
 * @param node html element to point floating panel
 */
function setReference(node: VNodeRef | Element | null | undefined) {
  if (!node) return

  reference.value = node
}

/**
 * close floating panel
 */
const dismiss = () => {
  isOpen.value = false
}

/**
 * toggle of floating panel
 */
function toggle() {
  isOpen.value = !isOpen.value
}

const { floatingStyles, middlewareData, placement, update } = useFloating(reference, floating, {
  // placement: 'top-end', // Initial placement (will be overridden by autoPlacement)
  middleware: [
    offset(8), // Add some spacing between the reference and floating element
    arrow({ element: floatingArrow }), // Configure the arrow

    flip({}),
    shift({ padding: 8 }), // Prevent the floating element from going off-screen
  ],
})

const arrowStyles = computed(() => {
  if (!middlewareData.value.arrow) return {}

  const { x, y } = middlewareData.value.arrow

  return {
    position: 'absolute',
    left: x != null ? `${x}px` : '',
    top: y != null ? `${y}px` : '',
    [(placement.value.startsWith('top')
      ? 'bottom'
      : placement.value.startsWith('bottom')
        ? 'top'
        : placement.value.startsWith('left')
          ? 'right'
          : 'left') as string]: '-5px', // Adjust as needed
  }
})

const defaultCss = useCssModule('arrowType')

const arrowClassType = computed(
  () =>
    defaultCss[
      Object.keys(defaultCss).find((x) => x.includes(placement.value.split('-')[0])) as string
    ] as string,
)
//#endregion
//======================================

//#region [Detect Outside Click]
const datePickerInstanceId = ref('dp-' + btoa(`${Math.random()}`))
const datePickerInstanceRef = ref<HTMLElement | null>(null)
useDetectOutsideClick([datePickerInstanceRef, floating], dismiss)
//#endregion
//===================================================

//#region [View of Panel Area]

//should start from first step
const mode = ref<Ref<MapItemValues>>(mapOfCalendar[0])

function changeMode(value: MapItemValues) {
  mode.value = value
}

/**
 *
 *  انتخاب تاریخ
 */
function handleSelect(obj: DateObject) {
  store.addToStorage(obj, selectedTime.value, dismiss)
}

//#endregion
//======================================================

////////================= EntryPoint Mid
//#region [EntryPoint Control Area]
// بروزرسانی محتوای
watchEffect(() => {
  onOutput(store.toString(rangeSeparator, dateSeparator))
})

function onInput(event: any) {
  const updatedRawValue: string = event.target.value

  onRawTimePickerInput(updatedRawValue)

  onRawInput(updatedRawValue)
  store.fromString(updatedRawValue, rangeSeparator, dateSeparator)
}
const AvailableMap: (string | number)[] = mapOfCalendar
///////================== EntryPoint Mid End
onMounted(() => {
  window.onresize = () => {
    update()
  }
})

//#endregion
</script>

<template>
  <div :id="datePickerInstanceId" ref="datePickerInstanceRef">
    <slot
      name="entryPoint"
      :onInput="onInput"
      :onRawInput="onRawInput"
      :value="rawDateTime"
      :toggle="toggle"
      :dismiss="dismiss"
      :setReference="setReference"
      :isTyping="isTyping"
    >
      <input
        :value="rawDateTime"
        @input="onInput"
        ref="reference"
        class="border-2 border-black rounded-md"
        @click="toggle"
      />
    </slot>
    <div class="!relative w-full h-full">
      <Teleport to="body" :disabled="!enableTeleport">
        <Transition>
          <div v-if="isOpen">
            <div ref="floating" :style="floatingStyles">
              <div class="relative top-0 z-1 datepicker-container popup">
                <div
                  :style="
                    {
                      zIndex: -1,
                      ...{ ...arrowStyles },
                    } as StyleValue
                  "
                  :class="'arrow ' + arrowClassType"
                ></div>

                <div
                  ref="floatingArrow"
                  :style="arrowStyles as StyleValue"
                  :class="'arrow ' + arrowClassType"
                ></div>
                <!--- HEADER OF DATEPICKER -->
                <div class="!z-1 datepicker-body">
                  <!--- BODY OF DATEPICKER -->

                  <CalendarPanel
                    :type="type"
                    :dataSource="
                      store.dataSource as unknown as ComputedRef<
                        DeepReadonly<DateStorage<typeof type>>
                      >
                    "
                    :rangeSeparator="rangeSeparator"
                    :dateSeparator="dateSeparator"
                    :changeMode="changeMode"
                    :mode="mode"
                    :daysOfPeriod="daysOfPeriod"
                    :handleSelect="handleSelect"
                    :existsInStorage="store.existsInStorage"
                    :removeFromStorage="store.removeFromStorage"
                    :storageToString="store.toString"
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
                    :hour="hour"
                    :minute="minute"
                    :second="second"
                    :selected-time="selectedTime"
                    :onTimePickerSeparatedInput="onTimePickerSeparatedInput"
                  />
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </div>
</template>
<style scoped>
.arrow {
  position: absolute;
  width: 0;
  height: 0;
  z-index: 0; /* Place behind the popup */
}
</style>
<style module="arrowType">
.arrow-top {
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid var(--bg-color);
}

.arrow-bottom {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;

  border-bottom: 8px solid var(--bg-color);
}

.arrow-right {
  width: 0;
  height: 0;

  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;

  border-right: 8px solid var(--bg-color);
}

.arrow-left {
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;

  border-left: 8px solid var(--bg-color);
}
</style>
