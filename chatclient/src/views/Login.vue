<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="8">
            <v-card class="elevation-12">
              <v-window v-model="step">
                <v-window-item :value="1">
                  <v-row>
                    <v-col cols="12" md="8">
                      <v-card-text class="mt-12">
                        <h1
                          class="text-center display-2 teal--text text--accent-3"
                        >Sign in to ChatApp</h1>
                        <h4 class="text-center mt-4 mb-10">Sign in right here</h4>
                        <v-form class="text-center mt-4 mb-10">
                          <v-text-field
                            label="Username"
                            name="Username"
                            prepend-icon="email"
                            type="text"
                            color="teal accent-3"
                            v-model="username"
                          />

                          <v-text-field
                            @keyup.enter="Login"
                            id="password"
                            label="Password"
                            name="password"
                            v-model="password"
                            prepend-icon="lock"
                            type="password"
                            color="teal accent-3"
                          />
                        </v-form>
                      </v-card-text>
                      <div class="text-center mt-8">
                        <v-btn rounded color="teal accent-3" dark @click="Login">SIGN IN</v-btn>
                      </div>
                    </v-col>
                    <v-col cols="12" md="4" class="teal accent-3">
                      <v-card-text class="white--text mt-12">
                        <h1 class="text-center display-1">Hello, Friend!</h1>
                        <h5
                          class="text-center"
                        >Enter your personal details and start journay with us</h5>
                      </v-card-text>
                      <div class="text-center">
                        <v-btn rounded outlined dark @click="step++">SIGN UP</v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-window-item>
                <v-window-item :value="2">
                  <v-row class="fill-height">
                    <v-col cols="12" md="4" class="teal accent-3">
                      <v-card-text class="white--text mt-12">
                        <h1 class="text-center display-1">Welcome Back!</h1>
                        <h5
                          class="text-center"
                        >To Keep connected with us please login with your personnel info</h5>
                      </v-card-text>
                      <div class="text-center">
                        <v-btn rounded outlined dark @click="step--">Sign in</v-btn>
                      </div>
                    </v-col>

                    <v-col cols="12" md="8">
                      <v-card-text class="mt-12">
                        <h1 class="text-center display-2 teal--text text--accent-3">Create Account</h1>
                        <h4 class="text-center mt-6 mb-10">Ensure your email for registration</h4>
                        <v-form class="text-center mt-6 mb-10">
                          <v-text-field
                            label="Name"
                            name="Name"
                            prepend-icon="person"
                            type="text"
                            color="teal accent-3"
                            v-model="username"
                            @keyup.enter="Register"
                          />
                          <v-text-field
                            label="Email"
                            name="Email"
                            prepend-icon="email"
                            type="text"
                            color="teal accent-3"
                            v-model="email"
                            :rules="emailRules"
                            @keyup.enter="Register"
                          />
                          <v-text-field
                            v-model="password"
                            prepend-icon="lock"
                            label="Password"
                            :append-icon="show ? 'visibility' : 'visibility_off'"
                            :type="show ? 'text' : 'password'"
                            @click:append="show = !show"
                            color="teal accent-3"
                            :rules="[rules.required, rules.min]"></v-text-field>
                        <v-text-field
                            v-model="passwordConfirm"
                            prepend-icon="lock"
                            label="Confirm password"
                            :type="show ? 'text' : 'password'"
                            color="teal accent-3"
                            :rules="[rules.required, rules.min, passwordConfirmationRule]"
                            @keyup.enter="Register"></v-text-field>
                        </v-form>
                      </v-card-text>
                      <div class="text-center mt-n5">
                        <v-btn rounded color="teal accent-3" dark @click="Register">SIGN UP</v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-window-item>
              </v-window>
              <v-snackbar
                v-model="snackbar"
                :timeout="timeout"
              >
                {{ text }}

                <template v-slot:action="{ attrs }">
                <v-btn
                    color="blue"
                    text
                    v-bind="attrs"
                    @click="snackbar = false"
                >
                    Close
                </v-btn>
                </template>
              </v-snackbar>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import socket from '../socket';

export default {
  data: () => ({
    step: 1,
    username: "",
    password: "",
    passwordConfirm: "",
    email: "",
    rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
    },
    emailRules: [ 
      v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
    ],
    show: false,
    snackbar: false,
    text: '',
    timeout: 3000,
  }),
  beforeCreate() {
    if(localStorage.getItem('jwt') !== null)
    {
      this.$router.push('/')
    }
  },
  computed:{
    passwordConfirmationRule() {
        return () => (this.password === this.passwordConfirm) || 'Password must match'
    }
  },
  methods: {
    async Login() {
      let params = {
        username: this.username,
        password: this.password
      };
      let username = params.username;
      await axios
        .post("http://localhost:8000/users/login",params)
        .then(response => {
          let token = response.data.data.jwt;
          localStorage.setItem("jwt", token);
          if (token) {
            socket.emit("userconnected", { username: username });
            this.$router.push('/')
          }
        })
        .catch((err) => {
          console.log(err);
        })
      this.username='';
      this.password='';
    },
    async Register() {
      let params = {
        username: this.username,
        password: this.password,
        email: this.email,
      };
      await axios
        .post("http://localhost:8000/users/register", params)
        .then(() => {
          this.text = "Register successfully."
          this.snackbar = true
          this.step = 1
        })
        .catch((err) => {
          let error = err.response;
          if (error.status == 500) {
            this.text = "User already registered."
            this.snackbar = true
          }
        });
      this.username = "";
      this.password = "";
      this.passwordConfirm = "";
      this.email = "";
    },
  }
};
</script>