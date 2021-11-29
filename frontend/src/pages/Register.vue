<template>
  <div class="q-pa-md row q-mt-xl">
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
      <div class="row">
        <q-input
          class="col-8"
          filled
          v-model="firstname"
          label="firstnamename"
          dense
          border
          style="width: 180px; height: 50px"
        />
        <q-input
          class="col-4 q-ml-md"
          filled
          v-model="lastname"
          label="lastnamename"
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
        label="Password"
      />
      <q-input
        @keyup.enter="Register"
        filled
        dense
        border
        style="width: 350px; height: 50px"
        v-model="confirm"
        :type="isPwd ? 'password' : 'text'"
        label="Confirm Password"
      />

      <q-btn
        @click="Register"
        class="q-mt-md"
        unelevated
        color="primary"
        label="Register now"
        style="width: 350px; height: 50px"
      />
      <br />
      <q-btn
        to="/login"
        class="q-mt-md"
        unelevated
        color="primary"
        label="Login"
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
  confirm: "",
  right: "right",
  email: "",

  data() {
    return {
      username: "",
      pass: "",
      confirm: "",
      email: "",
      isPwd: ref(true),
      firstname: "",
      lastname: "",
      right: ref(false),
    };
  },
  methods: {
    Register() {
      let params = {
        username: this.username,
        password: this.pass,
        email: this.email,
      };
      api
        .post("http://localhost:8000/users/register", params)
        .then((response) => {
          console.log(response.data.data);
          let token = response.data.token;
          if (token) {
            localStorage.setItem("jwt", token);
            this.$router.push("/");
            console.log("success");
          } else {
            console.log("err");
          }
        })
        .catch((err) => {
          let error = err.response;
          if (error.status == 500) {
            console.log("err");
          }
        });
      this.username = "";
      this.pass = "";
      this.confirm = "";
      this.email = "";
      this.firstname = "";
      this.lastname = "";
    },
  },
});
</script>
