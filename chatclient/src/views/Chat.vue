<template>
  <v-app :style="{ background: $vuetify.theme.themes.dark.background }">
    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="3" lg="3" class="border">
          <v-app-bar flat color="rgba(0,0,0,0,0)">
            <v-btn title color="white" block>
              <v-icon left color="blue">fas fa-plus</v-icon>
              <v-divider class="mx-3" vertical></v-divider>
              New conversation
            </v-btn>
          </v-app-bar>
          <v-app-bar flat color="rgba(0,0,0,0,0)">
            <v-toolbar-title class="title">Chat</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="logUserOut">
              <v-icon>logout</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>fas fa-ellipsis-h</v-icon>
            </v-btn>
          </v-app-bar>
          <v-app-bar flat color="rgba(0,0,0,0,0)">
            <v-text-field
              filled
              label="Search Here"
              append-icon="mdi-magnify"
              color="grey"
            >
            </v-text-field>
          </v-app-bar>
          <v-row class="mt-1 mb-1">
            <v-col color="rgba(0,0,0,0,0)">
              <v-btn title color="white" block @click="isDirect = false">
                Group
              </v-btn>
            </v-col>
            <v-col color="rgba(0,0,0,0,0)">
              <v-btn title color="white" block @click="isDirect = true">
                Direct
              </v-btn>
            </v-col>
          </v-row>

          <v-list
            two-line
            color="rgba(0,0,0,0)"
            style="overflow: auto; height: 40%"
          >
            <v-list-item-group
              v-if="isDirect == false"
              v-model="selected"
              active-class="blue lighten-4"
              multiple
            >
              <template v-for="(item, index) in group">
                <v-list-item :key="item.name" @click="setID(item.id)">
                  <v-badge bordered bottom color="green" dot offset-x="22" offset-y="26">
                    <v-list-item-avatar>
                      <v-img :src="'https://cdn.vuetifyjs.com/images/lists/1.jpg'"></v-img>
                    </v-list-item-avatar>
                  </v-badge>
                  <template>
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="item.name"
                      ></v-list-item-title>
                    </v-list-item-content>
                  </template>
                </v-list-item>
                <v-divider
                  v-if="index < group.length - 1"
                  :key="index"
                ></v-divider>
              </template>
            </v-list-item-group>
            <v-list-item-group
              v-else
              v-model="selected"
              active-class="blue lighten-4"
              multiple
            >
              <template v-for="(item, index) in direct">
                <v-list-item :key="item.friend.username" @click="setID(item.room._id)">
                  <v-badge
                    bordered
                    bottom
                    color="green"
                    dot
                    offset-x="22"
                    offset-y="26"
                  >
                    <v-list-item-avatar>
                      <v-img :src="'https://cdn.vuetifyjs.com/images/lists/1.jpg'"></v-img>
                    </v-list-item-avatar>
                  </v-badge>
                  <template>
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="item.friend.username"
                      ></v-list-item-title>
                    </v-list-item-content>
                  </template>
                </v-list-item>
                <v-divider
                  v-if="index < direct.length - 1"
                  :key="index"
                ></v-divider>
              </template>
            </v-list-item-group>
          </v-list>
        </v-col>
        <v-col
          cols="12"
          :sm="isActive ? '6' : '9'"
          :lg="isActive ? '6' : '9'"
          class="border"
        >
          <v-app-bar flat color="rgba(0,0,0,0,0)">
            <v-badge
              bordered
              bottom
              color="green"
              dot
              offset-x="11"
              offset-y="13"
            >
              <v-avatar class="mt-n7" size="40" elevation="10">
                <img src="https://cdn.vuetifyjs.com/images/lists/1.jpg" />
              </v-avatar>
            </v-badge>
            <v-toolbar-title class="title pl-0 ml-2 mt-n4">
              Fernando Gaucho
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-title class="title pl-0 mr-2 mt-n4">
              Members :
            </v-toolbar-title>
            <v-btn
              color="blue"
              icon
              class="mt-n5 mr-n2"
              outlined
              max-height="35"
              max-width="35"
            >
              <v-icon small>fas fa-plus</v-icon>
            </v-btn>
            <v-avatar class="mt-n5 mr-2" size="30" elevation="10">
              <img src="https://cdn.vuetifyjs.com/images/lists/5.jpg" />
            </v-avatar>
            <v-divider vertical inset class="mt-n1"></v-divider>
            <v-btn
              color="black"
              icon
              class="mt-n5"
              @click="isActive = !isActive"
            >
              <v-icon>mdi-cog</v-icon>
            </v-btn>
          </v-app-bar>
          <!-- <div style="overflow: auto; max-height: 52%">
            <v-app-bar color="rgba(0,0,0,0)" flat class="mb-16">
              <v-badge
                bordered
                bottom
                color="green"
                dot
                offset-x="10"
                offset-y="10"
              >
                <v-avatar class="mt-n5" size="30" elevation="10">
                  <img src="https://cdn.vuetifyjs.com/images/lists/1.jpg" />
                </v-avatar>
              </v-badge>
              <v-card class="mt-10 ml-2" max-width="350px">
                <v-list-item three-line>
                  <v-list-item-content>
                    <div class="mb-4">
                      Fernando shared 3 photos :<br /><br />
                      <v-avatar size="60" tile class="mr-2">
                        <v-img src="1.jpg"></v-img>
                      </v-avatar>
                      <v-avatar size="60" tile class="mr-2">
                        <v-img src="2.jpg"></v-img>
                      </v-avatar>
                      <v-avatar size="60" tile>
                        <v-img src="3.jpg"></v-img>
                      </v-avatar>
                    </div>
                    <v-list-item-subtitle>12 mins ago</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-app-bar>
            <v-app-bar color="rgba(0,0,0,0)" flat class="mb-8">
              <v-spacer></v-spacer>
              <v-card class="mt-10 mr-2" max-width="350px" color="blue" dark>
                <v-list-item>
                  <v-list-item-content>
                    <div class="mb-4">
                      There many variations of passages of Loreama
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
              <v-badge bordered bottom color="green" dot offset-x="10" offset-y="10">
                <v-avatar size="30" elevation="10">
                  <img src="https://cdn.vuetifyjs.com/images/lists/5.jpg" />
                </v-avatar>
              </v-badge>
            </v-app-bar>
          </div> -->
          <div style="overflow: auto; max-height: 52%">
          <div v-for="message in messages" :key="message.date">
            <v-app-bar color="rgba(0,0,0,0)" flat v-if="message.sender === user.username"  @mouseover="active = true" @mouseleave="active = false">
              <v-spacer></v-spacer>
              <v-menu left bottom>
                <template  v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on" >
                    <v-icon v-show="active">fas fa-ellipsis-h</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item clickable>
                    <v-list-item-title>
                      <v-icon>mdi-share</v-icon>
                      Reply</v-list-item-title>
                  </v-list-item >
                  <!-- <v-list-item clickable>
                    <v-list-item-title>
                      <v-icon>mdi-circle-edit-outline</v-icon>
                      Edit</v-list-item-title>
                  </v-list-item>
                  <v-list-item clickable>
                    <v-list-item-title>
                      <v-icon>mdi-content-copy</v-icon>
                      Copy</v-list-item-title>
                  </v-list-item> -->
                  <v-list-item clickable>
                    <v-list-item-title>
                      <v-icon>mdi-delete</v-icon>
                      Delete</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-icon class="mr-2" v-show="active">far fa-grin-beam</v-icon>
              <v-card class="mr-2 recept" max-width="350px" color="blue" dark>
                <v-list-item>
                  <v-list-item-content>
                    <div>{{message.message}}</div>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
              <v-badge
                bordered
                bottom
                color="green"
                dot
                offset-x="10"
                offset-y="10"
              >
                <v-avatar size="30" elevation="10">
                  <img src="https://cdn.vuetifyjs.com/images/lists/5.jpg" />
                </v-avatar>
              </v-badge>
            </v-app-bar>
            <v-app-bar  color="rgba(0,0,0,0)" flat v-else  @mouseover="active = true" @mouseleave="active = false">
              <v-badge bordered bottom color="green" dot offset-x="10" offset-y="10">
                <v-avatar size="30" elevation="10">
                  <img src="https://cdn.vuetifyjs.com/images/lists/1.jpg" />
                </v-avatar>
              </v-badge>
              <v-card class="ml-2 sender" max-width="350px">
                <v-list-item>
                  <v-list-item-content>
                    <div>
                      {{message.message}}
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
              <v-icon class="ml-2" v-show="active">far fa-grin-beam</v-icon>
              <v-menu left bottom>
                <template  v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on" >
                    <v-icon v-show="active">fas fa-ellipsis-h</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item clickable>
                    <v-list-item-title>
                      <v-icon>mdi-share</v-icon>
                      Reply</v-list-item-title>
                  </v-list-item >
                  <!-- <v-list-item clickable>
                    <v-list-item-title>
                      <v-icon>mdi-circle-edit-outline</v-icon>
                      Edit</v-list-item-title>
                  </v-list-item>
                  <v-list-item clickable>
                    <v-list-item-title>
                      <v-icon>mdi-content-copy</v-icon>
                      Copy</v-list-item-title>
                  </v-list-item> -->
                  <v-list-item clickable>
                    <v-list-item-title>
                      <v-icon>mdi-delete</v-icon>
                      Delete</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-app-bar>
          </div>
          </div>
          <v-text-field
            v-model="message"
            append-icon="mdi-emoticon"
            :append-outer-icon="message ? 'mdi-send' : 'mdi-microphone'"
            filled
            clear-icon="mdi-close-circle"
            clearable
            label="Message"
            type="text"
            @keyup.enter="sendMessage"
            @click:append-outer="sendMessage"
            @click:clear="clearMessage"
          ></v-text-field>
        </v-col>
        <v-col cols="12" :sm="isActive ? '3' : '0'" :lg="isActive ? '3' : '0'">
          <v-card class="text-center mt-8 mb-3" shaped>
            <v-badge
              bordered
              bottom
              color="green"
              dot
              offset-x="11"
              offset-y="13"
            >
              <v-avatar class="mt-n7" size="60" elevation="10">
                <img src="https://cdn.vuetifyjs.com/images/lists/1.jpg" />
              </v-avatar>
            </v-badge>
            <v-card-title class="layout justify-center"
              >Fernando Gaucho</v-card-title
            >
            <v-card-subtitle class="layout justify-center"
              >CEO & Founder at Highly inc</v-card-subtitle
            >
            <v-list> </v-list>
          </v-card>
          <v-expansion-panels v-model="panel" multiple>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <h3>Information</h3>
              </v-expansion-panel-header>
              <v-expansion-panel-content> </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <h3>Images(14)</h3>
              </v-expansion-panel-header>
              <v-expansion-panel-content> </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <h3>Files(3)</h3>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-list shaped>
                  <v-list-item-group>
                    <v-list-item v-for="(item, i) in files" :key="i">
                      <v-list-item-icon>
                        <v-icon v-text="item.icon" color="green"></v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="item.text"
                        ></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <h3>Pinned items</h3>
              </v-expansion-panel-header>
              <v-expansion-panel-content> </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import VueJwtDecode from "vue-jwt-decode";
import axios from 'axios';
import io from 'socket.io-client';

export default {

  data() {
    let token = localStorage.getItem("jwt");
    let decoded = VueJwtDecode.decode(token);
    this.user = decoded;

    return {
      active: false,
      user: decoded,
      isDirect: false,
      isActive: true,
      selected: [2],
      panel: [2],
      show: false,
      message: '',
      marker: true,
      iconIndex: 0,
      idChoose: '',
      files: [
          { text: 'Landing_page.zip', icon: ' mdi-cloud-upload' },
          { text: 'Requirements.pdf', icon: ' mdi-cloud-upload' },
          { text: 'Uwagi.docx', icon: ' mdi-cloud-upload' },
      ],
      group: [],
      direct: [],
      messages: [],
      socket: io('http://localhost:8000')
    }
  },
  created() {
    this.socket.on('connect',()=>{
      this.socket.emit('userconnected', {username: this.user.username})
    }),
    this.socket.on('response', (data) => {
      console.log(data);
      if(data.room_id === this.idChoose){
        this.messages.push(data);
        console.log(this.messages);
      }
    })
  },
  computed: {
    theme() {
        return this.$vuetify.theme.dark ? "dark" : "light";
    }
  },
  mounted: function (){
    let params = {
      username: this.user.username
    };
    // show group list
    axios.post("http://localhost:8000/users/rooms",params)
      .then(response => {
        if (response.data[0]) {
          this.idChoose = response.data[0].id;
          let params = {
            id: this.idChoose
          };
          axios.post("http://localhost:8000/rooms/messages",params)
            .then(response => {
            this.messages = response.data
            })
            .catch((err) => {
              console.log(err);
            })
        }
        this.group = response.data;
      })
      .catch((err) => {
        console.log(err);
      })
    
    // show direct list
    axios.post("http://localhost:8000/users/directs",params)
      .then(response => {
        this.direct = response.data;
        // console.log(this.group);
      })
      .catch((err) => {
        console.log(err);
      })
  },
  methods: {
    logUserOut() {
      localStorage.removeItem("jwt");
      this.$router.push("/login");
    },
    sendMessage () {
      this.socket.emit("chat message", {room_id: this.idChoose, sender: this.user.username, message: this.message});
      this.resetIcon()
      this.clearMessage()
    },
    clearMessage() {
      this.message = ''
    },
    resetIcon () {
      this.iconIndex = 0
    },
    joinGroup() {
      //TODO:
    },
    sendRequest() { 
      //TODO:
    },
    setID(id) {
      // show message list
      this.idChoose = id
      let params = {
        id: this.idChoose
      };
      axios.post("http://localhost:8000/rooms/messages",params)
      .then(response => {
        // console.log(response);
        this.messages = response.data
      })
      .catch((err) => {
        console.log(err);
      })
    },
  }
}
</script>
<style scoped>
.boder {
  border-right: 1px solid grey;
}
.sender {
  border-radius: 1px 50px 50px;
}
.recept{
  border-radius: 50px 50px 1px;
}
</style>
