import { ref } from 'vue'
import { convertToEnglishNumbers } from '../utils/convertToEnglishNumbers'
import { ICalendarOption } from '../types/ICalendarOption'
import DateObject from 'react-date-object'

export function useEntryPoint(calendarOption: ICalendarOption) {
    const rawDateTime = ref<string>('') // برای اینپوت نمایش دهنده و ویرایش
    const isTyping = ref<boolean>(false) // در حال تایپ  کردن
    let isTypingTimeout: NodeJS.Timeout | null = null

    // بروز کردن محتوای اینپوت اصلی
    const onOutput = (selectedValue: DateObject) => {
        if (isTyping.value) return

        rawDateTime.value = convertToEnglishNumbers(selectedValue.format(calendarOption.format))
    }

    function onInput(rawValue: string) {
        isTyping.value = true
        rawDateTime.value = rawValue

        if (isTypingTimeout) clearTimeout(isTypingTimeout)
        isTypingTimeout = setTimeout(() => (isTyping.value = false), 100)
    }

    return { rawDateTime, isTyping, onInput, onOutput }
}
