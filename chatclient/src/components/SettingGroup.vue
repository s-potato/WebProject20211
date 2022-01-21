<template>
    <div>
        <v-dialog transition="dialog-top-transition" max-width="600">
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                color="blue"
                v-bind="attrs"
                v-on="on">
                    Setting Group
                </v-btn>
            </template>
            <template v-slot:default="dialog">
                <v-layout column>
                    <v-card>
                        <v-card-text>
                            <v-flex class="mb-4">
                                <v-avatar size="96" class="mr-4">
                                    <img :src="`${group.avatar}`" />
                                </v-avatar>
                                <v-btn @click="openAvatarPicker">Change Group Avatar</v-btn>
                                <input
                                    ref="inputAvatar"
                                    type="file"
                                    accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                                    style="display: none;" @change="changeAvatar()">
                            </v-flex>
                            <v-text-field
                                v-model="group.groupname"
                                label="New Group Name"
                                ></v-text-field>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="primary" :loading="loading" @click="dialog.value = false; updateGroup();">
                                <v-icon left dark>check</v-icon>
                                Save Changes
                            </v-btn>
                            <v-btn color="primary" :loading="loading" @click="dialog.value = false;">
                                <v-icon left dark>fas fa-times</v-icon>
                                Close
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-layout>
            </template>
        </v-dialog>
        <v-btn color="blue" @click="OutGroup">Out Group</v-btn>
    </div>
</template>


<script>
  import axios from 'axios';
  import VueJwtDecode from "vue-jwt-decode";
  import socket from '../socket';

  export default {
    name: 'profile',
    props: {
        nameChoose: String,
        idRoomChoose: String
    },
    data () {
        let token = localStorage.getItem("jwt");
        let decoded = VueJwtDecode.decode(token);
        this.user = decoded;
        return{
            displayname: "",
            user: decoded,
            group: {
                avatar: null,
                groupname: this.nameChoose,
            }
        }
    },
    methods: {
        openAvatarPicker() {
            this.$refs.inputAvatar.click()
        },
        changeAvatar(){
            const file = document.querySelector('input[type=file]').files[0]
            const reader = new FileReader()

            let rawImg;
            reader.onloadend = () => {
                rawImg = reader.result;
                let params = {
                    username: this.user.username,
                    avatar: rawImg
                };
                console.log(params);
                // axios
                // .post("http://localhost:8000/rooms/updateinfo", params)
                // .then(this.$router.go())
                // .catch((err) => {
                // console.log(err);
                // });
            }
            reader.readAsDataURL(file);
        },
        updateGroup() {
            let params = {
                id: this.idRoomChoose,
                groupname: this.group.groupname
            };
            axios
            .post("http://localhost:8000/rooms/updateinfo", params)
            .then(
                this.$emit('updateGroup',this.group.groupname)
            )
            .catch((err) => {
            console.log(err);
            });
        },
        OutGroup(){
            let params = {
                id: this.idRoomChoose,
                username: this.user.username
            }
            // cứ làm đi tui đang nghe intern ko bật tiếng bên meet lun
            axios
            .post("http://localhost:8000/rooms/outgroup", params)
            .then(()=>{
                socket.emit("Leave room", {room_id: this.idRoomChoose} );
                this.$router.go()  
                }
            )
            .catch((err) => {
            console.log(err);
            });
        }
    }
  }
</script>
