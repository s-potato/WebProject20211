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
        label="Password"
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
      <br />
      <q-btn
        to="/register"
        class="q-mt-md"
        unelevated
        color="primary"
        label="Sign in"
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
    async Login() {
      let params = {
        username: this.username,
        password: this.pass
      };
      api.post("http://localhost:8000/users/login",params)
        .then(response => {
          console.log(response);
          let token = response.data.data.jwt;
          localStorage.setItem("jwt", token);
          if (token) {
            console.log("success");
            this.$router.push('/chat')
          }
        })
        .catch((err) => {
          console.log(err);
        })
      this.username='';
      this.pass='';
      },
  }
  
});
</script>
