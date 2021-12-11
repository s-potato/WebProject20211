<template>
  <v-app  style="overflow: hidden; height: 100vh">
    <v-main style="max-height: 100%">
      <router-view style="max-height: 100%"></router-view>
    </v-main>
  </v-app>
</template>

<script>
// import SideBar from './components/SideBar'
export default {
  name: 'App',

  components: {
    // SideBar,
  },

  data: () => ({
    //
  }),
};
</script>
