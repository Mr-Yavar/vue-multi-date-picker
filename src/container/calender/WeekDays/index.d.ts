import DateObject from "react-date-object";
import { PropType } from "vue";
import { CalenderOption } from "../../../types/CalenderOption";

type Props = {
  daysOfPeriod: any[]; // Consider using a more specific type if possible
  weekDays: any[]; // Consider using a more specific type if possible
  onCalenderByClick: () => void;
  selectedDate: DateObject | DateObject[] | null;
  type: string;
  range: boolean;
  multiple: boolean;
  calenderOption: CalenderOption;
  prevMonth: () => void;
  nextMonth: () => void;
  currentDate: DateObject | null;
};

// Define the props
export type props = {
  daysOfPeriod: {
    type: Array<Da> as PropType<Props["daysOfPeriod"]>,
    default: () => [],
  },
  weekDays: {
    type: Array as PropType<Props["weekDays"]>,
    default: () => [],
  },
  onCalenderByClick: {
    type: Function as PropType<Props["onCalenderByClick"]>,
    default: () => () => {},
  },
  selectedDate: {
    type: [Object, Array] as PropType<Props["selectedDate"]>,
    default: () => null,
  },
  type: {
    type: String,
    default: "",
  },
  range: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  calenderOption: {
    type: Object as PropType<Props["calenderOption"]>,
    default: () => ({}),
  },
  prevMonth: {
    type: Function as PropType<Props["prevMonth"]>,
    default: () => () => {},
  },
  nextMonth: {
    type: Function as PropType<Props["nextMonth"]>,
    default: () => () => {},
  },
  currentDate: {
    type: Object as PropType<Props["currentDate"]>,
    default: () => null,
  },
};
