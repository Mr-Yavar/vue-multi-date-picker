
<script setup lang="ts">

import  MultiDatePicker from "./MyComponent/MultiDatePicker.vue"
import { useForm } from '@tanstack/vue-form'

const FormObj = useForm({
  defaultValues: {
    dates: [],
  },
  onSubmit: async ({ value }) => {
    // Do something with form data
    console.log(value.dates)
  },
})
</script>


<template>
  <form @submit.prevent.stop="FormObj.handleSubmit">
    <div class="bg-gray-500">
      <FormObj.Field name="dates">
        <template v-slot="{ field }">
          <MultiDatePicker :handleChange="field.handleChange" :value="field.value" :field="field"/>
        </template>
      </FormObj.Field>
    </div>
    <button type="submit">Start</button>
  </form>
  <!-- {{ JSON.stringify(d) }} -->
</template>
