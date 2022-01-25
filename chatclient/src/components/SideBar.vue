<template>
    <v-row>
        <span>
            <nav>
                <v-navigation-drawer v-model="drawer" dark app mini-variant mini-variant-width="100" class="white">
                    <v-list>
                        <v-list-item >
                            <v-list-item-content>
                                <v-icon class="mb-2" large color="blue">fas fa-dove</v-icon>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-avatar >
                                <v-avatar size="40">
                                    <v-img :src="user.avatar ? user.avatar : '/avatar.png'"></v-img>
                                </v-avatar>
                            </v-list-item-avatar>
                        </v-list-item>
                    </v-list>
                    <v-list flat>
                        <v-list-item>
                            <v-list-item-content>
                                <Dialog
                                  :username='user.username'
                                  :icon="true"
                                  @sendRequest='sendRequest'>
                                </Dialog>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <Profile></Profile>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                    <v-list style="position: absolute; bottom:0" class="ml-5" flat>
                        <v-list-item >
                            <v-list-item-content>
                                <v-menu
                                    v-model="menu"
                                    :close-on-content-click="false"
                                    :nudge-width="400"
                                    offset-x
                                    >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="grey" clickable v-bind="attrs" v-on="on">fas fa-users</v-icon>
                                    </template>
                                    <v-card>
                                        <h2 class="ml-4">Pending</h2>
                                        <v-divider></v-divider>
                                        <v-list>
                                            <v-list-item v-for="(item,index) in pending" :key=item.id>
                                                <v-list-item-avatar>
                                                <img :src="item.requester.avatar ? item.requester.avatar : 'https://cdn.vuetifyjs.com/images/john.jpg'">
                                                </v-list-item-avatar>
                                                <v-list-item-content>
                                                <v-list-item-title>{{item.requester.display_name}}</v-list-item-title>
                                                </v-list-item-content>
                                                <v-spacer></v-spacer>
                                                <v-btn
                                                    @click="menu = false"
                                                    outlined
                                                >
                                                    Decline
                                                </v-btn>
                                                <v-btn
                                                    class="ml-2"
                                                    outlined
                                                    @click="acceptRequest(item._id,index)"
                                                >
                                                    Accept
                                                </v-btn>
                                            </v-list-item>
                                        </v-list>
                                    </v-card>
                                </v-menu>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <!-- <v-icon color="grey">
                                    fas fa-cog
                                </v-icon> -->
                                <ChangePassMail></ChangePassMail>
                            </v-list-item-content>
                        </v-list-item>
                        <!-- <v-list-item>
                            <v-list-item-avatar class="mb-5">
                                <v-badge bordered bottom color="green" dot offset-x="10" offset-y="10">
                                    <v-avatar size="40">
                                        <v-img :src="user.avatar ? user.avatar : '/avatar.png'"></v-img>
                                    </v-avatar>
                                </v-badge>
                            </v-list-item-avatar>
                        </v-list-item> -->
                        <v-list-item @click="logUserOut">
                            <v-list-item-content>
                                <v-icon color="grey">
                                    logout
                                </v-icon>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-navigation-drawer>
            </nav>
        </span>
        <v-col>
            <router-view>
                
            </router-view>
        </v-col>
    </v-row>   
</template>
<script>
import axios from 'axios';
import Dialog from './Dialog.vue';
import Profile from './Profile.vue';
import ChangePassMail from './ChangePassMail.vue';
import socket from '../socket';

export default {
    components: {
        Dialog,
        Profile,
        ChangePassMail,
    },
    data () {
        let token = localStorage.getItem("jwt");
        return{
            user: {},
            drawer: true,
            showPending: false,
            menu: false,
            term: '',
            findUsers: [],
            pending: [],
            token: token
        }
    },
    mounted: function (){
        var params = {
            jwt: this.token
        };
        axios.post("http://localhost:8000/users", params)
        .then((response)=>{
            this.user = response.data
            params = {
                username: this.user.username,
                jwt: this.token
            };
            axios.post("http://localhost:8000/users/inrequest",params)
            .then(response => {
                this.pending = response.data;
            })
            .catch((err) => {
                console.log(err);
            })
            axios.post("http://localhost:8000/users/info",params)
            .then(response => {
                this.user = response.data;
            })
            .catch((err) => {
                console.log(err);
            })
        }).catch(()=>{
            localStorage.removeItem("jwt");
            this.$router.push('/login');
        })
    },
    created() {
        socket.on("F-request", () => {
            let params = {
                username: this.user.username,
                jwt: this.token
            };  
            // show pending list
            axios.post("http://localhost:8000/users/inrequest",params)
            .then(response => {
                this.pending = response.data
            })
            .catch((err) => {
                console.log(err);
            })
        })

    },
    methods: {
        sendRequest(friendName) {
            let params = {
                friendname: friendName,
                username: this.user.username,
                jwt: this.token
            };
            axios.post("http://localhost:8000/users/sendrequest",params)
            .then(()=>{
                socket.emit("Send f-request", {requester: this.user.username, request_to: friendName})
            }
            )
            .catch((err) => {
                console.log(err);
            })
        },
        acceptRequest(id,index) {
            let params = {               
                request_id: id,
                jwt: this.token
            };
            axios.post("http://localhost:8000/users/acceptrequest",params)
            .then( (response) => {
                socket.emit("Accept f-request", {room_id: response.data._id, requester: response.data.requester, request_to: response.data.request_to})
                this.pending.splice(index, 1)
                }
            )
            .catch((err) => {
                console.log(err);
            })
        },
        logUserOut() {
            localStorage.removeItem("jwt");
            this.$router.go("/login");
        },
    },
    
}
</script>
