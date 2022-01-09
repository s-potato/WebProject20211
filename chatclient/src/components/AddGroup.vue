<template>
    <v-dialog transition="dialog-top-transition" max-width="600">
        <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              color="blue"              
              v-bind="attrs"
              v-on="on">
                <v-icon>fas fa-plus</v-icon>
            </v-btn>
        </template>
        <template v-slot:default="dialog">
            <v-card>
            <v-toolbar color="primary" dark>Add friend to group</v-toolbar>
            <v-text-field v-model="term" label="Search" outlined @keyup = "Search" ></v-text-field>
            <v-list two-line color="rgba(0,0,0,0)" style="overflow: auto; height: 40%">
                <v-list-item-group>
                <template v-for="(item, index) in findUsers">
                    <v-list-item :key="item.username" :disabled="item.isFriend || item.isRequested" @click="sendRequest(item.username, index)">
                        <v-badge bordered bottom color="green" dot offset-x="22" offset-y="26">
                            <v-list-item-avatar>
                            <v-img :src="`https://cdn.vuetifyjs.com/images/lists/1.jpg`"></v-img>
                            </v-list-item-avatar>
                        </v-badge>
                        <template>
                            <v-list-item-content>
                            <v-list-item-title
                                v-text="item.username"
                            ></v-list-item-title>
                            </v-list-item-content>
                        </template>
                        <v-icon small v-if="item.isFriend === true" >fas fa-user-friends</v-icon>
                        <v-icon small v-else-if="item.isRequested === true" >fas fa-user-clock</v-icon>
                        <v-icon small v-else>fas fa-user-plus</v-icon>
                    </v-list-item>
                    <v-divider v-if="index < findUsers.length - 1" :key="index"></v-divider>
                </template>
                </v-list-item-group>
            </v-list>
            <v-card-actions class="justify-end">
                <v-btn text @click="dialog.value = false">Close</v-btn>
            </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script>
import axios from 'axios';
export default {
    name: 'dialog',
    props: {
        username: String,
        icon: Boolean,
        fab: Boolean,
    },
    data() {
        return {
            findUsers: [],
            term: '',
        }
    },
    methods: {
        Search() {
            let params = {
                term: this.term,
                username: this.username
            };
            axios.post("http://localhost:8000/users/find",params)
            .then(response => {
                console.log(response)
                return this.findUsers = response.data
            })
            .catch((err) => {
                console.log(err);
            })
        },
        sendRequest(username, index){
            this.findUsers[index].isRequested = true
            this.$emit('sendRequest',username)
        }
    }
}
</script>

<style>

</style>