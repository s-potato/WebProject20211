<template>
  <q-layout view="hHh lpR fFf">
    <!-- <q-img src="~assets/background.png" class="background-img absolute-top" /> -->
    <div class="row">
      <div class="col">
        <q-img src = ~assets/moutains.png spinner-color="white"
        style="object-fit: scale-down" />
      </div>
      <div class="col">
        <q-page-container>
          <router-view />
        </q-page-container>
      </div>
    </div>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "PageIndex",
});
</script>

<style lang="scss">
.background-img {
  height: 100%;
  z-index: -1;
}
</style>
