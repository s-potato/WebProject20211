<template>
  <div class="q-pa-md row q-mt-xl">
    <div class="col-4"></div>
    <div class="q-pa-md">
      <h7>Welcome back</h7>
      <h4 style="color: #06f91e">Login to your account</h4>
      <h6>Email</h6>
      <q-input
        filled
        v-model="username"
        label="Username"
        dense
        border
        style="width: 350px; height: 50px"
      />
      <h6>Password</h6>
      <q-input
        @keyup.enter="Login"
        filled
        dense
        border
        style="width: 350px; height: 50px"
        v-model="pass"
        :type="isPwd ? 'password' : 'text'"/>
      <div class="q-gutter-sm">
        <q-checkbox class="q-mr-xl" v-model="right" label="Remember me" />
        <q-btn
          float-left
          flat
          style="color: #ff0080"
          label="Forgot password?"
        />
      </div>
      <q-btn
        @click="Login"
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
    <div class="col-2"></div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { api } from "boot/axios";
import { ref } from "vue";
export default defineComponent({
  name: "Login",
  username: '',
  pass: '',
  right: "right",

  data() {
    return {
      username: "",
      pass:  ref(''),
      isPwd: ref(true),
      right: ref(false),
    };
  },

  methods: {
    Login() {
      let params = {
        user: this.username,
        password: this.pass
      };
      api.post("https://619f57421ac52a0017ba4733.mockapi.io/api/user",params)
        .then(response => {
          console.log(response.data.data);
        })
      this.username='';
      this.pass='';
    }
  }
  
});
</script>
