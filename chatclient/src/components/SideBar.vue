<template>
    <v-row>
        <v-col-1>
            <nav>
                <v-navigation-drawer v-model="drawer" dark app mini-variant mini-variant-width="100" class="white">
                    <v-list>
                        <v-list-item class="mb-16">
                            <v-list-item-content>
                                <v-icon class="mb-2" large color="blue">fas fa-dove</v-icon>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                    <v-list flat>
                        <v-list-item>
                            <v-list-item-content>
                                <v-dialog transition="dialog-top-transition" max-width="600">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon left color="blue" v-bind="attrs" v-on="on">fas fa-plus</v-icon>
                                </template>
                                <template v-slot:default="dialog">
                                    <v-card>
                                    <v-toolbar color="primary" dark>Add Friend</v-toolbar>
                                    <v-text-field
                                        v-model="search"
                                        label="Outlined"
                                        outlined
                                        @keyup = "Search"
                                    ></v-text-field>
                                    <v-list
                                        two-line
                                        color="rgba(0,0,0,0)"
                                        style="overflow: auto; height: 40%"
                                    >
                                        <v-list-item-group>
                                        <template v-for="(item, index) in findUsers">
                                            <v-list-item :key="item.username">
                                            <v-badge bordered bottom color="green" dot offset-x="22" offset-y="26">
                                                <v-list-item-avatar>
                                                <v-img :src="'https://cdn.vuetifyjs.com/images/lists/1.jpg'"></v-img>
                                                </v-list-item-avatar>
                                            </v-badge>
                                            <template>
                                                <v-list-item-content>
                                                <v-list-item-title
                                                    v-text="item.username"
                                                ></v-list-item-title>
                                                </v-list-item-content>
                                            </template>
                                            <!-- <v-btn color="blue" icon class="mt-n5 mr-n2" outlined max-height="35" max-width="35" @click="item.icon = !item.icon">
                                                <v-icon small v-if="item.icon == true" >fas fa-plus</v-icon>
                                                <v-icon small v-else>mdi-check</v-icon>
                                            </v-btn> -->
                                            </v-list-item>
                                            <v-divider v-if="index < items.length - 1" :key="index"></v-divider>
                                        </template>
                                        </v-list-item-group>
                                    </v-list>
                                    <v-card-actions class="justify-end">
                                        <v-btn text @click="dialog.value = false">Close</v-btn>
                                    </v-card-actions>
                                    </v-card>
                                </template>
                                </v-dialog>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item router to="/">
                            <v-list-item-content>
                                <v-icon class="mb-2" color="grey">
                                    fas fa-calendar-day
                                </v-icon>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item router to="/">
                            <v-list-item-content>
                                <v-icon class="mb-2" color="blue">
                                    fas fa-comment-alt
                                </v-icon>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item router to="/">
                            <v-badge color="blue" dot overlap>
                                <v-list-item-content>
                                    <v-icon class="mb-2" color="blue">
                                        fas fa-bell
                                    </v-icon>
                                </v-list-item-content>
                            </v-badge>
                        </v-list-item>
                    </v-list>
                    <v-list style="position: absolute; bottom:0" class="ml-5" flat>
                        <v-list-item >
                            <v-list-item-content>
                                <v-menu
                                    v-model="menu"
                                    :close-on-content-click="false"
                                    :nudge-width="320"
                                    offset-x
                                    >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="grey" clickable v-bind="attrs" v-on="on">fas fa-users</v-icon>
                                    </template>
                                    <v-card>
                                        <h2 class="ml-4">Pending</h2>
                                        <v-divider></v-divider>
                                        <v-list>
                                            <v-list-item>
                                                <v-list-item-avatar>
                                                <img
                                                    src="https://cdn.vuetifyjs.com/images/john.jpg"
                                                    alt="John"
                                                >
                                                </v-list-item-avatar>
                                                <v-list-item-content>
                                                <v-list-item-title>John Leider</v-list-item-title>
                                                </v-list-item-content>
                                                <v-spacer></v-spacer>
                                                <v-btn
                                                    @click="menu = false"
                                                    outlined
                                                >
                                                    Cancel
                                                </v-btn>
                                                <v-btn
                                                    class="ml-2"
                                                    outlined
                                                    @click="menu = false"
                                                >
                                                    Save
                                                </v-btn>
                                            </v-list-item>
                                        </v-list>
                                    </v-card>
                                </v-menu>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item router to="/">
                            <v-list-item-content>
                                <v-icon color="grey">
                                    fas fa-cog
                                </v-icon>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item router to="/">
                            <v-list-item-avatar class="mb-5">
                                <v-badge bordered bottom color="green" dot offset-x="10" offset-y="10">
                                    <v-avatar size="40">
                                        <v-img src="https://cdn.vuetifyjs.com/images/lists/2.jpg"></v-img>
                                    </v-avatar>
                                </v-badge>
                            </v-list-item-avatar>
                        </v-list-item>
                    </v-list>
                </v-navigation-drawer>
            </nav>
        </v-col-1>
        <v-col>
            <router-view>
                
            </router-view>
        </v-col>
    </v-row>    
</template>
<script>
import axios from 'axios';
import VueJwtDecode from "vue-jwt-decode";
export default {
    data () {
        let token = localStorage.getItem("jwt");
        let decoded = VueJwtDecode.decode(token);
        this.user = decoded;
        return{
            user: decoded,
            drawer: true,
            showPending: false,
            menu: false,
            items: [
                {
                    avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
                    subtitle: "I'll be in your neighborhood doing errands this weekend. Do you want to hang out?",
                    title: "Ali Connors",
                    icon: true,
                }],
            search: '',
            findUsers: [],
        }
    },
    methods: {
        Search() {
            let params = {
                term: this.search,
                username: this.user.username
            };
            axios.post("http://localhost:8000/users/find",params)
            .then(response => {
                // console.log(response);
                this.findUsers = response.data
                console.log(this.findUsers)
            })
            .catch((err) => {
                console.log(err);
            })
        }
    },
    
}
</script>
