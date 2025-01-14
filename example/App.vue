<script setup lang="ts">
import PickerContainer from '@/container/PickerContainer.vue';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa'; /* PartiallyEnd: #3632/scriptSetup.vue */
</script>

<template>
    <div>
        <PickerContainer :type="'RANGE_DATE'" :subType="'DAY'" :date-separator="'/'" :calendar="persian" :locale="persian_fa" format="YYYY-MM-DD HH:mm:ss" />
    </div>
</template>
