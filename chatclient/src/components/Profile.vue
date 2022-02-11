<template>
  <v-dialog transition="dialog-top-transition" max-width="600">
        <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="blue"
              v-bind="attrs"
              v-on="on"
              icon>
                <v-icon>fas fa-user-circle</v-icon>
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
                            <v-btn @click="openAvatarPicker">Change Avatar</v-btn>
                            <input
                                ref="inputAvatar"
                                type="file"
                                accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                                style="display: none;" @change="changeAvatar()">
                        </v-flex>
                        <v-text-field
                            label="User Name" :value="user.username"
                            readonly></v-text-field>
                        <v-text-field
                            v-model="displayname"
                            label="Display Name"></v-text-field>
                        <v-text-field
                            label="Email Address" :value="user.email"
                            readonly></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" @click="dialog.value = false; updateName();">
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
  
import ImageCompressor from 'js-image-compressor'

  export default {
    name: 'profile',
    data () {
        let token = localStorage.getItem("jwt");
        let decoded = VueJwtDecode.decode(token);
        this.user = decoded;
        return{
            displayname: "",
            user: decoded,
            token: token
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
            this.displayname = this.user.display_name;
            if (!response.data.avatar) this.user.avatar = '/avatar.png';
        })
        .catch((err) => {
            console.log(err);
        })
    },
    methods: {
        openAvatarPicker() {
            this.$refs.inputAvatar.click()
        },
        changeAvatar(){
            const ofile = document.querySelector('input[type=file]').files[0]
            let vue = this
            var options = {
                file: ofile,
                quality: 0.5,
                maxWidth: 200,
                maxHeight: 200,
                convertSize: 512000,
                // Callback before compression
                beforeCompress: function (result) {
                    console.log(result);
                },

                // Compression success callback
                success: function (result) {
                    console.log(result);
                    const reader = new FileReader()

                    let rawImg;
                    reader.onloadend = () => {
                        rawImg = reader.result;
                        let params = {
                            username: vue.user.username,
                            avatar: rawImg,
                            jwt: vue.token
                        };
                        axios
                            .post(process.env.VUE_APP_SERVER_ADDRESS+"/users/updateinfo", params)
                            .then(()=>{
                                vue.$router.go()
                                })
                            .catch((err) => {
                                console.log(err);
                            })
                    }
                    reader.readAsDataURL(result);
                },
                error: function (msg) {
                    console.error(msg);
                }
            };
            new ImageCompressor(options)
        },
        updateName() {
            let params = {
                username: this.user.username,
                display_name: this.displayname,
                jwt: this.token
            };
                axios
                .post(process.env.VUE_APP_SERVER_ADDRESS+"/users/updateinfo", params)
                .then()
                .catch((err) => {
                console.log(err);
                });
        }
    }
  }
</script>
