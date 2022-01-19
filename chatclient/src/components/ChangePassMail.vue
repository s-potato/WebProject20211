<template>
  <v-dialog transition="dialog-top-transition" max-width="600">
        <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="grey"
              v-bind="attrs"
              v-on="on"
              icon>
                <v-icon>fas fa-cog</v-icon>
            </v-btn>
        </template>
        <template v-slot:default="dialog">
            <v-layout column>
                <v-card>
                    <v-card-text>
                        <v-flex class="mb-4">
                            <v-avatar size="96" class="mr-4">
                                <img :src="`${user.avatar}`" />
                            </v-avatar>
                        </v-flex>
                        <v-text-field
                            label="Email Address" :value="user.email"
                            readonly
                            ></v-text-field>
                        <v-text-field
                            v-model="password"
                            label="Password confirm"
                            :type="show ? 'text' : 'password'"
                            :append-icon="show ? 'visibility' : 'visibility_off'"
                            counter
                            @click:append="show = !show"
                            :rules="[rules.required]"></v-text-field>
                        <v-text-field
                            v-model="newPass"
                            label="New password"
                            :type="show ? 'text' : 'password'"
                            :append-icon="show ? 'visibility' : 'visibility_off'"
                            counter
                            @click:append="show = !show"
                            :rules="[rules.required, rules.min]"></v-text-field>
                        <v-text-field
                            v-model="newPassConfirm"
                            label="New password"
                            :type="show ? 'text' : 'password'"
                            :append-icon="show ? 'visibility' : 'visibility_off'"
                            counter
                            @click:append="show = !show"
                            :rules="[rules.required, rules.min, passwordConfirmationRule]"></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" :loading="loading" @click="dialog.value = false; updatePassword();">
                            <v-icon left dark>check</v-icon>
                            Save Changes
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-layout>
        </template>
    </v-dialog>
</template>


<script>

  import axios from 'axios';
  import VueJwtDecode from "vue-jwt-decode";

  export default {
    name: 'profile',
    data () {
        let token = localStorage.getItem("jwt");
        let decoded = VueJwtDecode.decode(token);
        this.user = decoded;
        return{
            show: false,
            user: decoded,
            password: '',
            newPass: '',
            newPassConfirm: '',
            rules: {
                required: value => !!value || 'Required.',
                min: v => v.length >= 8 || 'Min 8 characters',
            }
        }
    },
    mounted: function (){
        let params = {
            username: this.user.username
        };
        axios.post("http://localhost:8000/users/info",params)
        .then(response => {
            this.user = response.data;
        })
        .catch((err) => {
            console.log(err);
        })
    },
    computed:{
        passwordConfirmationRule() {
            return () => (this.newPass === this.newPassConfirm) || 'Password must match'
        }
    },
    methods: {
        updatePassword() {
            let params = {
                username: this.user.username,
                password: this.newPass
            };
            console.log(params);
                // axios
                // .post("http://localhost:8000/users/updateinfo", params)
                // .then()
                // .catch((err) => {
                // console.log(err);
                // });
        }
    }
  }
</script>
