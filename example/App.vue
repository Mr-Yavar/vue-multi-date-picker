<template>
  <div
    style="
      height: 700px;
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
      format="HH:mm:ss"
    />
  </div>
</template>

<script setup lang="ts">
import { PickerContainer } from './../src/main.ts'
import persian_fa from 'react-date-object/locales/persian_fa'
import persian from 'react-date-object/calendars/persian'
</script>
