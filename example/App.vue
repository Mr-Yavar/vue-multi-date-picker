<template>
  <form>
    <div
      style="
        max-height: 50px;
        overflow: scroll;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
      "
    >
      <PickerContainer
        :type="'ONE_DATE'"
        :subType="'DAY'"
        :date-separator="'  |  '"
        :rangeSeparator="'~'"
        :calendar="persian"
        :locale="persian_fa"
        :enableTeleport="true"
        format="YYYY-MM-DD HH:mm:ss"
        :handleChange="handleChange2"
        :defaultValue="value"
      >
        <template #entryPoint="{ onInput, value, toggle, setReference, isTyping, onRawInput }">
          <input
            @click.prevent="toggle"
            type="text"
            @input="onInput"
            :ref="(el) => setReference(el as Element)"
            contenteditable="true"
            :value="value"
          />
        </template>
      </PickerContainer>
    </div>
    <button>sss</button>
  </form>
  {{ JSON.stringify(d) }}
</template>

<script setup lang="ts">
import persian_fa from 'react-date-object/locales/persian_fa'
import persian from 'react-date-object/calendars/persian'
import PickerContainer from '../src/main.ts'

import { markRaw, readonly, ref, shallowReactive, shallowRef, toValue, unref, watch } from 'vue'
import DateObject from 'react-date-object'

function handleChange2(v: any) {
  console.log(getValues('date'))

  setValue('date', v)
  console.log(getValues('date').date?.format('YYYY'))

  // handleChange(v)
}
// const form = useForm({}) // works fine when this line is commented
// const { handleChange, value } = useField<DateObject>('date')

// watch([value], () => {
//   console.log(unref(value))
//   console.log(toValue(value).format('YYYY/MM/DD'))
// })

// const d = ref(markRaw(new DateObject()))
import { useForm } from 'vue-use-form'
const { setValue, getValues, register } = useForm({ defaultValues: { date: null } })
console.log(register('date'))
</script>
