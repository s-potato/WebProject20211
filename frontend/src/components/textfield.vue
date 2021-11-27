<template>
  <div class="q-pa-md">
    <div class="q-gutter-md" style="max-width: 300px">
      <q-input filled v-model="text" label="Filled" />

      <q-input standout v-model="text" label="Standout" />
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      text: ref('textfield.vue')
    }
  }
}
</script>