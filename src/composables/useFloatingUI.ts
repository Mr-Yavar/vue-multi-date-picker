import { ref, computed, onMounted, onBeforeUnmount, watch, useCssModule } from 'vue'
import {
  useFloating,
  offset,
  flip,
  shift,
  arrow,
  autoPlacement,
  type Placement,
  type Middleware,
  size,
} from '@floating-ui/vue'

interface UseFloatingUIOptions {
  placement?: Placement
  offset?: number
  shiftPadding?: number
  arrowPadding?: number
  autoPlacement?: boolean
  autoCloseOnOutsideClick?: boolean
  autoCloseOnEscape?: boolean
  openDelay?: number
  closeDelay?: number
  matchReferenceWidth?: boolean
  teleportTarget?: string
  zIndex?: number | string
  animationClasses?: string
}

export function useFloatingUI(options: UseFloatingUIOptions = {}) {
  const reference = ref<HTMLElement | null>(null)
  const floating = ref<HTMLElement | null>(null)
  const floatingArrow = ref<HTMLElement | null>(null)
  const isOpen = ref(false)

  const {
    placement = 'bottom-start',
    offset: offsetVal = 8,
    shiftPadding = 8,
    arrowPadding = 0,
    autoPlacement: autoPlace = true,
    autoCloseOnOutsideClick = true,
    autoCloseOnEscape = true,
    openDelay = 0,
    closeDelay = 0,
    matchReferenceWidth = false,
    teleportTarget = '',
    zIndex = 999,
    animationClasses = '',
  } = options

  const middleware = ref<Middleware[]>([])

  watch([floating, floatingArrow], () => {
    if (!floating.value || !reference.value) return

    const mw: Middleware[] = [offset(offsetVal)]

    if (floatingArrow.value) {
      mw.push(arrow({ element: floatingArrow.value, padding: arrowPadding }))
    }

    if (autoPlace) {
      mw.push(
        autoPlacement({ alignment: 'start', crossAxis: true }), // You can tune this
        shift({ padding: shiftPadding }), // <-- Crucial to prevent overflow
      )
    } else {
      mw.push(flip(), shift({ padding: shiftPadding }))
    }

    // mw.push(
    //   size({
    //     apply({ availableHeight, rects, elements }) {
    //       Object.assign(elements.floating.style, {
    //         maxHeight: `${availableHeight}px`,
    //         overflowY: 'auto',
    //       })
    //     },
    //     padding: 8,
    //   }),
    // )
    middleware.value = mw
    update() // Trigger update once middleware is ready
  })

  const {
    floatingStyles,
    middlewareData,
    placement: actualPlacement,
    update,
  } = useFloating(reference, floating, {
    placement,
    middleware,
  })

  const arrowStyles = computed(() => {
    const arrowData = middlewareData.value.arrow
    if (!arrowData) return {}

    const { x, y } = arrowData
    const side = actualPlacement.value.split('-')[0]

    return {
      position: 'absolute',
      left: x != null ? `${x}px` : '',
      top: y != null ? `${y}px` : '',
      [side === 'top' ? 'bottom' : side === 'bottom' ? 'top' : side === 'left' ? 'right' : 'left']:
        '-5px',
    }
  })

  const arrowClassType = computed(() => {
    const defaultCss = useCssModule('arrowType')
    const side = actualPlacement.value.split('-')[0]

    return `${defaultCss[Object.keys(defaultCss).find((x) => x.includes(side)) as string]}`
  })

  function setReference(el: HTMLElement | null) {
    reference.value = el
  }

  function open() {
    if (openDelay > 0) {
      setTimeout(() => (isOpen.value = true), openDelay)
    } else {
      isOpen.value = true
    }
  }

  function dismiss() {
    if (closeDelay > 0) {
      setTimeout(() => (isOpen.value = false), closeDelay)
    } else {
      isOpen.value = false
    }
  }

  function toggle() {
    if (isOpen.value) dismiss()
    else open()
  }

  function manualUpdate() {
    update()
  }

  // Handle outside click
  function onClickOutside(event: MouseEvent) {
    if (
      !floating.value?.contains(event.target as Node) &&
      !reference.value?.contains(event.target as Node)
    ) {
      dismiss()
    }
  }

  // Handle Escape key
  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      dismiss()
    }
  }

  watch(isOpen, (open) => {
    if (open) update()
  })

  onMounted(() => {
    if (autoCloseOnOutsideClick) {
      document.addEventListener('mousedown', onClickOutside)
    }

    if (autoCloseOnEscape) {
      document.addEventListener('keydown', onKeyDown)
    }

    window.onresize = () => {
      manualUpdate()
    }
  })

  onBeforeUnmount(() => {
    document.removeEventListener('mousedown', onClickOutside)
    document.removeEventListener('keydown', onKeyDown)
  })

  return {
    reference,
    floating,
    floatingArrow,
    isOpen,
    setReference,
    open,
    toggle,
    dismiss,
    manualUpdate,
    floatingStyles: computed(() => ({
      ...floatingStyles.value,
      width:
        matchReferenceWidth && reference.value ? `${reference.value.offsetWidth}px` : undefined,
      zIndex,
    })),
    arrowStyles,
    arrowClassType,
    actualPlacement,
    teleportTarget,
    animationClasses,
  }
}
