<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md row justify-center">
        <div style="width: 100%; max-width: 400px">
          <q-chat-message label="Sunday, 19th" />

          <q-chat-message
            name="me"
            avatar="https://cdn.quasar.dev/img/avatar4.jpg"
            :text="['hey, how are you?']"
            sent
            stamp="7 minutes ago"
          />
          <q-chat-message
            name="Jane"
            avatar="https://cdn.quasar.dev/img/avatar3.jpg"
            :text="['doing fine, how r you?']"
            stamp="4 minutes ago"
          />
          <q-chat-message
            name="Jane"
            avatar="https://cdn.quasar.dev/img/avatar3.jpg"
            :text="['moshi moshi']"
            stamp="5 minutes ago"
          />
        </div>
      </div>
  </q-page>
</template>

<script>
import { defineComponent} from 'vue'
export default defineComponent({
  name: "PageIndex",
});
</script>
