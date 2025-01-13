<script setup lang="ts">
import { ComponentMap, MapKeys } from '@/constants/ComponentMap'
import { ComponentMapKeys, DateStorage } from '@/types'
import { ComputedRef, DeepReadonly } from 'vue'

interface Props {
    type: ComponentMapKeys
    dataSource: ComputedRef<DeepReadonly<DateStorage<Props['type']>>>
    storageToString: (rangeSeparator: string, dateSeparator: string) => string
    rangeSeparator: string
    dateSeparator: string
}

const props = defineProps<Props>()

function list() {
    const strOfStore = props.storageToString('__SEP_RANGE__', '__SEP_DATE__')
    let arr: Array<string> = []
    if (!strOfStore) return arr

    console.log(strOfStore)

    switch (props.type as string) {
        case MapKeys.MULTI_RANGE_DATE:
            arr = strOfStore.split('__SEP_RANGE__').map((x) => x.replaceAll('__SEP_DATE__', props.dateSeparator))
            break
        case MapKeys.MULTI_DATE:
        case MapKeys.MULTI_TIME:
            arr = strOfStore.split('__SEP_DATE__')

        default:
            break
    }

    return arr
}
</script>
<template>
    <div>
        <ul>
            <li>انتخاب‌ها:</li>
            <li v-for="i in list()">
                {{ i }}
            </li>
        </ul>
    </div>
</template>
