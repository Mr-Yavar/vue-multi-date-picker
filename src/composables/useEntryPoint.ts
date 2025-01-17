import { ref } from 'vue'
import type { ICalendarOption } from '../types/ICalendarOption'

export function useEntryPoint(calendarOption: ICalendarOption) {
  const rawDateTime = ref<string>('') // برای اینپوت نمایش دهنده و ویرایش
  const isTyping = ref<boolean>(false) // در حال تایپ  کردن
  let isTypingTimeout: number | undefined

  // بروز کردن محتوای اینپوت اصلی
  const onOutput = (rawToShow: string) => {
    if (isTyping.value) return

    rawDateTime.value = rawToShow //convertToEnglishNumbers(rawToShow)
  }

  function onRawInput(rawValue: string) {
    isTyping.value = true
    rawDateTime.value = rawValue

    if (isTypingTimeout) clearTimeout(isTypingTimeout)
      isTypingTimeout = setTimeout(() => (isTyping.value = false), 100)
  }

  return { rawDateTime, isTyping, onRawInput, onOutput }
}
