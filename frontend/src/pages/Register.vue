<template>
  <div class="q-pa-md row q-mt-xl" >
    <div class="col-4"></div>
    <div class="col-8">
      <h4>Registration Form</h4>
      <br />
      <q-input
        filled
        v-model="username"
        label="Username"
        dense
        border
        style="width: 350px; height: 50px"
      />
      <div class = "row">
        
        <q-input
          class="col-8"
          filled
          v-model="firstname"
          label="Firstname"
          dense
          border
          style="width: 180px; height: 50px"
        />
        <q-input
          class="col-4 q-ml-md"
          filled
          v-model="lastname"
          label="Lastname"
          dense
          border
          style="width: 153px; height: 50px"
        />
      </div>
      <q-input
        filled
        v-model="email"
        label="Email"
        dense
        border
        style="width: 350px; height: 50px"
      />
      <q-input
        filled
        dense
        border
        style="width: 350px; height: 50px"
        v-model="pass"
        :type="isPwd ? 'password' : 'text'"
        label="Password"/>
      <q-input
        filled
        dense
        border
        style="width: 350px; height: 50px"
        v-model="cfpass"
        :type="isPwd ? 'password' : 'text'"
        label="Confirm Password"/>

      <q-btn
        class="q-mt-md"
        unelevated
        color="primary"
        label="Register now"
        style="width: 350px; height: 50px"
      />
      <br />
      <q-btn
        class="q-mt-md"
        unelevated
        color="primary"
        label="Cancel"
        style="width: 350px; height: 50px"
      />
    </div>
    <div class="col-2"></div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { api } from "boot/axios";
import { ref } from "vue";
export default defineComponent({
  username: "",
  firstname: "",
  lastname: "",
  pass: "",
  cfpass: "",
  right: "right",
  email: "",

  data() {
    return {
      username: "",
      pass: "",
      cfpass: "",
      email: "",
      isPwd: ref(true),
      firstname: "",
      lastname: "",
      right: ref(false),
    };
  },
});
</script>
