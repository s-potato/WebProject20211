<template>
  <div class="q-pa-md">
    <div class="q-pa-md">
      <h7>Welcome back</h7>
      <h4 style="color: #06f91e">Login to your account</h4>
      <br />
      <h6>Email</h6>
      <br />
      <q-input
        filled
        v-model="username"
        label="Username"
        dense
        border
        style="width: 350px; height: 50px"
      />
      <br />
      <h6>Password</h6>
      <br />
      <q-input
        filled
        v-model="pass"
        label="Password"
        dense
        border
        style="width: 350px; height: 50px"
      />
      <div class="q-gutter-sm">
        <q-checkbox class="q-mr-xl" v-model="right" label="Remember me" />
        <q-btn
          float-left
          flat
          style="color: #ff0080"
          label="Forgot password?"
        />
      </div>
      <br />
      <q-btn
        class="q-mt-md"
        unelevated
        color="primary"
        label="Login now"
        style="width: 350px; height: 50px"
      />
      <br />
      <q-btn
        class="q-mt-md"
        unelevated
        color="primary"
        label="Or sign-in with google"
        style="width: 350px; height: 50px"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { ref } from "vue";
export default defineComponent({
  name: "Login",
  username: "none",
  pass: "none",
  right: "right",

  data() {
    return {
      username: "",
      pass: "",
      right: ref(false),
    };
  },
});
</script>
