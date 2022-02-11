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
                    <v-list-item :key="item.username" :disabled="item.inGroup" @click="addIntoGroup(item.username, index)">
                        <v-badge bordered bottom color="green" dot offset-x="22" offset-y="26">
                            <v-list-item-avatar>
                            <v-img :src="typeof item.avatar != 'undefined'? item.avatar: '/avatar.png'"></v-img>
                            </v-list-item-avatar>
                        </v-badge>
                        <template>
                            <v-list-item-content>
                            <v-list-item-title
                                v-text="item.username"
                            ></v-list-item-title>
                            </v-list-item-content>
                        </template>
                        <v-icon small v-if="item.inGroup === true || item.added === true" >fas fa-check</v-icon>
                        <v-icon small v-else>fas fa-plus</v-icon>
                    </v-list-item>
                    <v-divider v-if="index < findUsers.length - 1" :key="index"></v-divider>
                </template>
                </v-list-item-group>
            </v-list>
            <v-card-actions class="justify-end">
                <v-btn text @click="dialog.value = false, addGroup()">Add</v-btn>
                <v-btn text @click="dialog.value = false">Close</v-btn>
            </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script>
import socket from '../socket';
import axios from 'axios';
export default {
    name: 'vdialog',
    props: {
        username: String,
        members: Array,
        idRoomChoose: String,
    },
    data() {
        let token = localStorage.getItem("jwt");
        return {
            token: token,
            findUsers: [],
            addGroupList: [],
            term: '',
        }
    },
    methods: {
        Search() {
            let params = {
                term: this.term,
                username: this.username,
                jwt: this.token
            };
            let findUsers = []
            axios.post(process.env.VUE_APP_SERVER_ADDRESS+"/users/find",params)
            .then(response => {
                findUsers = response.data
                for( var i = 0; i < findUsers.length; i++) {
                    if (!findUsers[i].isFriend){
                        findUsers.splice(i,1);
                        i--;
                    }
                }
                for( i = 0; i < findUsers.length; i++) {
                    findUsers[i].added = false
                    for( var y = 0; y < this.members.length; y++) {
                        if(findUsers[i].username === this.members[y].username){
                            findUsers[i].inGroup = true
                            findUsers[i].added = true
                        }
                    }
                }
                return this.findUsers = findUsers
            })
            .catch((err) => {
                console.log(err);
            })
        },
        addIntoGroup(username,index){
            this.$set(this.findUsers[index], 'added', true);
            this.addGroupList.push( {"username": username});
        },
        addGroup(){
            let params = {
                username: this.username,
                room_id: this.idRoomChoose,
                members: this.addGroupList,
                jwt: this.token
            };
            axios
                .post(process.env.VUE_APP_SERVER_ADDRESS+"/users/addtogroup", params)
                .then(
                    socket.emit("Add member", {room_id: this.idRoomChoose, members: this.addGroupList})
                )
                .catch((err) => {
                    console.log(err);
                });
        }
    }
}
</script>

<style>

</style>