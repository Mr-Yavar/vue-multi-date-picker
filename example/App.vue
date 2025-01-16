<template>
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
      :type="'TIME'"
      :subType="'TIME'"
      :date-separator="'  |  '"
      :rangeSeparator="'~'"
      :calendar="persian"
      :locale="persian_fa"
      :enableTeleport="true"
      format="HH:mm:ss"
    >
      <template #entryPoint="{ updateValue, value, toggle, setReference }">
        <button @click.prevent="toggle" :ref="(el) => setReference(el as Element)">
          {{ value == '' ? '----------' : value }}
        </button>
      </template>
    </PickerContainer>
  </div>
</template>

<script setup lang="ts">
function t(a: any) {
  console.log(a)
}
import { PickerContainer } from './../src/main.ts'
import persian_fa from 'react-date-object/locales/persian_fa'
import persian from 'react-date-object/calendars/persian'
</script>
