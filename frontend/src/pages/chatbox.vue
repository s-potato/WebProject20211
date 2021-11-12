<template>
  <q-page class="flex flex-center absolute-top">
    <div class="q-pa-md" style="width:100% ">
      <q-toolbar class="bg-purple text-white">
        <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
        </q-avatar>
        <q-toolbar-title> Friend 1 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</q-toolbar-title>
        <q-btn flat round dense icon="call" class="q-mr-xs" />
        <q-btn flat round dense icon="videocam" class="q-mr-xs" />
        <q-btn flat round dense icon="search" class="q-mr-xs" />
        <q-btn flat round dense icon="more_vert" />
      </q-toolbar>
      <div style="width: 100%">
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
import { defineComponent } from "vue";
export default defineComponent({
  name: "PageIndex",
});
</script>
