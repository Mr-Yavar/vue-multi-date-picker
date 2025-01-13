<script setup lang="ts">
import Container from '@/container/Container.vue'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
</script>

<template>
    <div>
        <Container :type="'MULTI_RANGE_DATE'" :subType="'DAY'" :calendar="persian" :locale="persian_fa" format="YYYY-MM-DD HH:mm:ss" />
    </div>
</template>
