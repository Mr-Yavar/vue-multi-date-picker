<script setup lang="ts">
import { MAP_KEYS } from '@/constants/ComponentMap'
import type { ComponentMapKeys, DateStorage } from '@/types'
import type { ComputedRef, DeepReadonly } from 'vue'

interface Props {
  type: ComponentMapKeys
  dataSource: ComputedRef<DeepReadonly<DateStorage<Props['type']>>>
  storageToString: (rangeSeparator: string, dateSeparator: string) => string
  removeFromStorage: (index: number) => void
  rangeSeparator: string
  dateSeparator: string
}

const props = defineProps<Props>()

function list() {
  const strOfStore = props.storageToString('__SEP_RANGE__', '__SEP_DATE__')
  let arr: Array<string> = []
  if (!strOfStore) return arr

  switch (props.type as string) {
    case MAP_KEYS.MULTI_RANGE_DATE:
      arr = strOfStore
        .split('__SEP_RANGE__')
        .map((x) => x.replaceAll('__SEP_DATE__', props.dateSeparator))
      break
    case MAP_KEYS.MULTI_DATE:
    case MAP_KEYS.MULTI_TIME:
      arr = strOfStore.split('__SEP_DATE__')

    default:
      break
  }

  return arr
}
</script>
<template>
  <div class="w-[300px] max-h-[300px] overflow-y-scroll overflow-x-hidden">
    <ul>
      <li class="text-right">انتخاب‌ها:</li>
      <li
        v-for="(txt, i) in list()"
        :key="txt"
        class="p-[0.5] px-2 my-1 bg-blue-500 rounded text-white relative"
      >
        {{ txt }}

        <span
          key=""
          class="absolute top-[10%] right-[2%] inline-block bg-blue-700 shadow-xxl rounded-full leading-1 w-[1.25em] leading-[1.25em] text-center"
          @click.prevent="
            () => {
              console.log(i)
              removeFromStorage(i)
            }
          "
          >×</span
        >
      </li>
    </ul>
  </div>
</template>
