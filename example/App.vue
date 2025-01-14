<template>
  <div class="mt-40">
    <div>
      <PickerContainer
        :type="'RANGE_DATE'"
        :subType="'DAY'"
        :date-separator="'  |  '"
        :calendar="persian"
        :locale="persian_fa"
        format="YYYY-MM-DD HH:mm:ss"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PickerContainer from '@/container/pickerContainer.vue'
import persian_fa from 'react-date-object/locales/persian_fa'
import persian from 'react-date-object/calendars/persian'
</script>
