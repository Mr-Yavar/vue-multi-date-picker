import { onBeforeUnmount, onMounted, type Ref } from 'vue'

export default function useDetectOutsideClick(component: Ref<HTMLElement | null>[], callback: any) {
  if (!component) return

  const listener = (event: Event) => {
    if (event.composedPath().some((item) => component.some((rf) => rf.value === item))) {
      return
    }

    if (typeof callback === 'function') {
      callback()
    }
  }
  onMounted(() => {
    window.addEventListener('click', listener)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('click', listener)
  })

  return { listener }
}
