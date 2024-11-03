import { ref } from "vue";
import { convertToEnglishNumbers } from "../utils/convertToEnglishNumbers";

export function useEntryPoint(calendarOption) {
  const rawDateTime = ref(""); // برای اینپوت نمایش دهنده و ویرایش
  const isTyping = ref(false); // در حال تایپ  کردن
  let isTypingTimeout = null;

  // بروز کردن محتوای اینپوت اصلی
  const onOutput = (selectedValue) => {
    if(isTyping.value)
        return;
    
    rawDateTime.value = convertToEnglishNumbers(
        selectedValue.format(calendarOption.format)
    );
  };

  function onInput(rawValue) {
    isTyping.value = true;
    rawDateTime.value = rawValue;

    if (isTypingTimeout) clearTimeout(isTypingTimeout);
    isTypingTimeout = setTimeout(() => (isTyping.value = false), 100);
  }

  return { rawDateTime, isTyping, onInput, onOutput };
}
