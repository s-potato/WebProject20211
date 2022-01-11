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
                        <v-icon small v-if="item.inGroup === true || item.added === true" >fas fa-check</v-icon>
                        <v-icon small v-else>fas fa-plus</v-icon>
                    </v-list-item>
                    <v-divider v-if="index < findUsers.length - 1" :key="index"></v-divider>
                </template>
                </v-list-item-group>
            </v-list>
            <v-card-actions class="justify-end">
                <v-btn text @click="dialog.value = false, add()">Close</v-btn>
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
        members: Array,
    },
    data() {
        return {
            findUsers: [],
            addGroupList: [],
            term: '',
        }
    },
    methods: {
        Search() {
            let params = {
                term: this.term,
                username: this.username
            };
            let findUsers = []
            axios.post("http://localhost:8000/users/find",params)
            .then(response => {
                findUsers = response.data
                for( var i = 0; i < findUsers.length; i++) {
                    if (!findUsers[i].isFriend){
                        findUsers.splice(i,1);
                        i--;
                    }
                }
                // console.log(this.members)
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
            this.addGroupList.push(username);
        },
        add(){
            
        }
    }
}
</script>

<style>

</style>