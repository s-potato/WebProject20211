<template>
  <q-layout view="lHh lpR lFr">
    
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          Title
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
      <div class="q-pa-md" style="max-width: 350px">
        <q-toolbar-title> EzNFT </q-toolbar-title>
        <div class="q-pa-md q-gutter-sm">
          <q-img
            :src="url"
            spinner-color="white"
            style="height: 140px; max-width: 150px"
          />
        </div>
        <q-btn push color="teal" label="Profile" @click="refresh" />
        <q-list bordered>
          Group<q-separator />

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
            </q-item-section>

            <q-item-section>Group 1</q-item-section>
          </q-item>
        </q-list>
      </div>
      <!-- end left -->
    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <!-- drawer content -->

      <q-toolbar class="bg-primary text-white shadow-2">
        <q-toolbar-title>Friends</q-toolbar-title>
      </q-toolbar>

      <q-list bordered>
        <q-item
          v-for="contact in contacts"
          :key="contact.id"
          class="q-my-sm"
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">
              {{ contact.letter }}
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ contact.name }}</q-item-label>
            <q-item-label caption lines="1">{{ contact.email }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="chat_bubble" color="green" />
          </q-item-section>
        </q-item>

        <q-separator />
        <q-item-label header>Offline</q-item-label>

        <q-item
          v-for="contact in offline"
          :key="contact.id"
          class="q-mb-sm"
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-avatar>
              <img :src="`https://cdn.quasar.dev/img/${contact.avatar}`" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ contact.name }}</q-item-label>
            <q-item-label caption lines="1">{{ contact.email }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="chat_bubble" color="grey" />
          </q-item-section>
        </q-item>
      </q-list>

      <!-- end right -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";

const groups = [
  { 
    id: "group 1",
    img:"https://cdn.quasar.dev/img/boy-avatar.png"
  },
  { 
    id: "group 2",
    img:"https://cdn.quasar.dev/img/boy-avatar.png"
  },
  { 
    id: "group 3",
    img:"https://cdn.quasar.dev/img/boy-avatar.png"
  },
  { 
    id: "group 4",
    img:"https://cdn.quasar.dev/img/boy-avatar.png"
  }
];

const contacts = [
  {
    id: 1,
    name: "Ruddy Jedrzej",
    email: "rjedrzej0@discuz.net",
    letter: "R",
  },
  {
    id: 2,
    name: "Mallorie Alessandrini",
    email: "malessandrini1@marketwatch.com",
    letter: "M",
  },
  {
    id: 3,
    name: "Elisabetta Wicklen",
    email: "ewicklen2@microsoft.com",
    letter: "E",
  },
  {
    id: 4,
    name: "Seka Fawdrey",
    email: "sfawdrey3@wired.com",
    letter: "S",
  },
];

const offline = [
  {
    id: 5,
    name: "Brunhilde Panswick",
    email: "bpanswick4@csmonitor.com",
    avatar: "avatar2.jpg",
  },
  {
    id: 6,
    name: "Winfield Stapforth",
    email: "wstapforth5@pcworld.com",
    avatar: "avatar6.jpg",
  },
];

export default {
  // Setup lay out
  setup() {
    const leftDrawerOpen = ref(false);
    const rightDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },

      rightDrawerOpen,
      toggleRightDrawer() {
        rightDrawerOpen.value = !rightDrawerOpen.value;
      },
    };
  },


  setup() {
    return {
      contacts,
      offline,
    };
  }
};
</script>
