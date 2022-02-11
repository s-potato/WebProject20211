<template>
<v-dialog
    transition="dialog-top-transition"
    max-width="600"
    v-model="value">
        <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="grey"
              v-bind="attrs"
              v-on="on"
              icon>
                <v-icon>fas fa-cog</v-icon>
            </v-btn>
        </template>
        <template>
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
                            :rules="[rules.required, rules.min]"></v-text-field>
                        <v-text-field
                            v-model="newPassConfirm"
                            label="New password"
                            :type="show ? 'text' : 'password'"
                            :rules="[rules.required, rules.min, passwordConfirmationRule]"></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" @click="updatePassword();">
                            <v-icon left dark>check</v-icon>
                            Save Changes
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-layout>
        </template>
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
            token: token,
            show: false,
            user: decoded,
            password: '',
            newPass: '',
            newPassConfirm: '',
            rules: {
                required: value => !!value || 'Required.',
                min: v => v.length >= 8 || 'Min 8 characters',
            },
            value: false,
            snackbar: false,
            text: '',
            timeout: 1000,
        }
    },
    mounted: function (){
        let params = {
            username: this.user.username,
            jwt: this.token
        };
        axios.post(process.env.VUE_APP_SERVER_ADDRESS+"/users/info",params)
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
        async updatePassword() {
            let params = {
                username: this.user.username,
                oldpassword: this.password,
                newpassword: this.newPass,
                jwt: this.token
            };
            await axios
            .post(process.env.VUE_APP_SERVER_ADDRESS+"/users/changepassword", params)
            .then( ()=>{
                    let here = this
                    setTimeout(function(){here.value = false}, 1000);
                    this.text = "Password successfully updated";
                    this.password = '';
                    this.newPass = '';
                    this.newPassConfirm = '';
                }
            )
            .catch(() => {
                this.text = "Password fails"
            });
            this.snackbar = true
        }
    }
  }
</script>
