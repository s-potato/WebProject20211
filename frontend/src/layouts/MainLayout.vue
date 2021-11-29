<template>
  <q-layout view="lHh lpR lFr">
    <q-img src="~assets/background.png" class="background-img absolute-top" />
    <q-header>
      <q-img src="~assets/background.png" class="background-img absolute-top" />
      <q-toolbar>
        <!--<q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />-->

        <q-toolbar-title>
          <div class="q-pa-md" style="max-width: 100%">
            <div class="row">
              <div class="col">
                <q-btn
                  color="green"
                  label="Friend"
                  icon="person"
                  style="margin-right: 10px"
                />
                <q-btn color="red" label="Group" icon="people" />
              </div>
              <div class="col"></div>
              <div class="col"></div>
              <div>
                <q-btn flat round dense icon="search" class="q-ml-xs" />
              </div>
            </div>
          </div>
        </q-toolbar-title>

        <!--<q-btn dense flat round icon="menu" @click="toggleRightDrawer" />-->
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above side="left" bordered class="text-white">
      <q-img src="~assets/background.png" class="background-img absolute-top" />
      <!-- drawer content -->
      <div class="q-pa-md" style="max-width: 350px">
        <div class="q-pa-md" style="max-width: 100%">
          <div class="row">
            <div class="col">
              <q-item-section avatar>
                <q-avatar>
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                </q-avatar>
              </q-item-section>
            </div>
            <div class="col">
              <q-toolbar-title> Chats </q-toolbar-title>
            </div>

            <div>
              <q-btn
                @click="logUserOut"
                flat
                round
                dense
                icon="logout"
                class="q-ml-xs"
              />
            </div>
          </div>
        </div>

        <div class="q-pa-md q-gutter-sm">
          <q-btn color="deep-orange" push @click="isActive = !isActive">
            <div class="row items-center no-wrap">
              <q-icon left name="home" />
              <div class="text-center">Home</div>
            </div>
            
          </q-btn>
          <br />
          <q-btn class="secondary" push color="red" label="Profile" />
        </div>
        Group
        <q-list bordered class="list-group">
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-avatar>
                <q-badge color="orange" floating>22</q-badge>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
            </q-item-section>

            <q-item-section>Group 1</q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-avatar>
                <q-badge color="orange" floating>22</q-badge>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
            </q-item-section>

            <q-item-section>Group 1</q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-avatar>
                <q-badge color="orange" floating>22</q-badge>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
            </q-item-section>

            <q-item-section>Group 1</q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
            </q-item-section>

            <q-item-section>Group 2</q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
            </q-item-section>

            <q-item-section>Group 2</q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
            </q-item-section>

            <q-item-section>Group 2</q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
            </q-item-section>
            <q-item-section>Group 3</q-item-section>
          </q-item>
        </q-list>
        Direct Message
        <q-list bordered class="list-group">
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
            </q-item-section>

            <q-item-section>Friend 1</q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
            </q-item-section>
            <q-item-section>Friend 2</q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
            </q-item-section>
            <q-item-section>Friend 3</q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
            </q-item-section>
            <q-item-section>Friend 4</q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
            </q-item-section>
            <q-item-section>Friend 5</q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
            </q-item-section>
            <q-item-section>Friend 6</q-item-section>
          </q-item>
        </q-list>
      </div>
      <!-- end left -->
    </q-drawer>

    <q-drawer
      show-if-above
      v-model="rightDrawerOpen"
      side="right"
      bordered
      class="text-white"
    >
      <div v-if="isActive == false">
        <q-img
          src="~assets/background.png"
          class="background-img absolute-top"
        />
        <!-- drawer content -->

        <q-toolbar>
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
              <q-item-label caption lines="1" class="text-white">{{
                contact.email
              }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="chat_bubble" color="green" />
            </q-item-section>
          </q-item>

          <q-separator />
          <q-item-label header class="text-white">Offline</q-item-label>

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
              <q-item-label caption lines="1" class="text-white">{{
                contact.email
              }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="chat_bubble" color="grey" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div v-else>
        <!-- friends -->

      </div>
      <!-- end right -->
    </q-drawer>

    <q-page-container class="text-white">
      <q-img src="~assets/background.png" class="background-img absolute-top" />
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";

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
  data() {
            return {
                isActive: true
            }
        },
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
      contacts,
      offline,
    };
  },

  methods: {
    refresh() {
      window.location.reload();
    },
    logUserOut() {
      localStorage.removeItem("jwt");
      this.$router.push("/login");
    }
  },
};
</script>

<style lang="scss">
.background-img {
  height: 100%;
  width: 100%;
  z-index: -1;
}
.list-group {
  height: 280px;
  overflow: auto;
}
</style>
