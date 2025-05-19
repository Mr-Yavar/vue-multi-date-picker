
<script setup lang="ts">
import persian_fa from 'react-date-object/locales/persian_fa'
import persian from 'react-date-object/calendars/persian'
import PickerContainer from '../../src/main';
interface Props {
  handleChange: CallableFunction
  value: any
  field:any
}

const props = defineProps<Props>();

</script>

<template>
  <PickerContainer
    :type="'MULTI_RANGE_DATE'"
    :subType="'DAY'"
    :date-separator="'  |  '"
    :rangeSeparator="'~'"
    :calendar="persian"
    :locale="persian_fa"
    :enableTeleport="true"
    format="YYYY-MM-DD HH:mm:ss"
    :handleChange="handleChange"
    :value="value"
  >
    <template #entryPoint="{ onInput, value, toggle, setReference, isTyping, onRawInput }">
      <input
        @click.prevent="toggle"
        type="text"
        @input="onInput"
        class="p-2 rounded-md border-dark border-2"
        :ref="(el) => setReference(el as Element)"
        contenteditable="true"
        :value="value"
      />
    </template>
  </PickerContainer>
</template>
