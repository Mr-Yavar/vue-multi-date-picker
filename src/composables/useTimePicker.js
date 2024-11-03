

import DateObject from "react-date-object";
import { markRaw, ref } from "vue";

export function useTimePicker(calendarOption) {
  const selectedTime = ref(markRaw(new DateObject({ ...calendarOption }))); // ساعت انتخاب شده
  const hour = ref(null); // تایپ ساعت پایین تقویم
  const minute = ref(null); // تایپ دقیقه پایین تقویم
  const second = ref(null); // تایپ ثانیه پایین تقویم

  function setSelectedTime(uhour, uminute, usecond) {
    selectedTime.value = markRaw(
      new DateObject({
        date: new Date(
          selectedTime.value.toDate().getFullYear(),
          selectedTime.value.toDate().getMonth(),
          selectedTime.value.toDate().getDate(),
          uhour,
          uminute,
          usecond
        ),
      })
    );
  }

  function onSeparatedInput(uhour, uminute, usecond) {
    hour.value = uhour;
    minute.value = uminute;
    second.value = usecond;
    setSelectedTime(uhour, uminute, usecond);
  }

  function onRawInput(rawTime, format) {
    txtTime = new Date().toISOString().split("T")[0] + " " + rawTime;
    const dateObject = new DateObject({
      ...calendarOption,
      format: "YYYY-MM-DD " + format,
      date: txtTime,
    });

    setSelectedTime(dateObject.hour, dateObject.minute, dateObject.second);
  }

  return { hour, minute, second, selectedTime, onSeparatedInput, onRawInput };
}
