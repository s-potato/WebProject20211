<template>
  <q-layout view="hHh lpR fFf">
    <!-- <q-img src = /background.png spinner-color="white"
            style="object-fit: scale-down" /> -->
    <div class="q-pa-md">
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
    </div>
  </q-layout>
</template>