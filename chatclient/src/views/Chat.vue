<template>
  <v-app :style="{ background: $vuetify.theme.themes.dark.background }">
    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="3" lg="3" class="border">
          <v-app-bar flat color="rgba(0,0,0,0,0)">
            <v-dialog transition="dialog-top-transition" max-width="600">
              <template v-slot:activator="{ on, attrs }">
                <v-btn title color="white" block v-bind="attrs" v-on="on">
                  <v-icon left color="blue">fas fa-plus</v-icon>
                  <v-divider class="mx-3" vertical></v-divider>
                  New conversation
                </v-btn>
              </template>
              <template v-slot:default="dialog">
                <v-card>
                  <v-toolbar color="primary" dark>Create Group</v-toolbar>
                  <v-text-field
                    v-model="groupName"
                    label="Group name"
                    outlined
                  ></v-text-field>
                  <v-list
                    two-line
                    color="rgba(0,0,0,0)"
                    style="overflow: auto; height: 40%"
                  >
                    <v-list-item-group>
                      <template v-for="(item, index) in direct">
                        <v-list-item
                          :key="item.friend._id"
                          :disabled="item.friend.added"
                          @click="addIntoGroupList(item.friend, index)"
                        >
                          <v-badge
                            bordered
                            bottom
                            color="green"
                            dot
                            offset-x="22"
                            offset-y="26"
                          >
                            <v-list-item-avatar>
                              <v-img
                                :src="item.friend.avatar ? item.friend.avatar : '/avatar.png'"
                              ></v-img>
                            </v-list-item-avatar>
                          </v-badge>
                          <template>
                            <v-list-item-content>
                              <v-list-item-title
                                v-text="item.friend.display_name"
                              ></v-list-item-title>
                            </v-list-item-content>
                          </template>
                          <v-icon small v-if="item.friend.added === true" >fas fa-check</v-icon>
                          <v-icon small v-else>fas fa-user-plus</v-icon>
                        </v-list-item>
                        <v-divider
                          v-if="index < direct.length - 1"
                          :key="index"
                        ></v-divider>
                      </template>
                    </v-list-item-group>
                  </v-list>
                  <v-card-actions color="primary" class="justify-end">
                    <v-btn text @click="dialog.value = false, createGroup()">Confirm</v-btn>
                  </v-card-actions>
                  <v-card-actions class="justify-end">
                    <v-btn text @click="dialog.value = false">Close</v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </v-app-bar>
          <v-app-bar flat color="rgba(0,0,0,0,0)">
            <v-toolbar-title class="title">Chat</v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- <v-btn icon @click="logUserOut">
              <v-icon>logout</v-icon>
            </v-btn> -->
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
              <v-btn
                title
                :color="groupType == 'group' ? 'grey' : 'white'"
                block
                @click="chooseGroup"
              >
                Group
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                title
                :color="groupType == 'direct' ? 'grey' : 'white'"
                block
                @click="chooseDirect"
              >
                Direct
              </v-btn>
            </v-col>
          </v-row>

          <v-list
            two-line
            color="rgba(0,0,0,0)"
            style="overflow: auto; height: 40%"
          >
            <v-list-item-group v-if="groupType == 'group'">
              <template v-for="(item, index) in group">
                <v-list-item
                  :key="item.id"
                  @click="setID(item.id, item.name), infoRoom(item.id)">
                  <v-badge
                    bordered
                    bottom
                    color="green"
                    dot
                    offset-x="22"
                    offset-y="26"
                  >
                    <v-list-item-avatar>
                      <v-img
                        :src="'https://cdn.vuetifyjs.com/images/lists/1.jpg'"
                      ></v-img>
                    </v-list-item-avatar>
                  </v-badge>
                  <template>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                    </v-list-item-content>
                  </template>
                </v-list-item>
                <v-divider
                  v-if="index < group.length - 1"
                  :key="index"
                ></v-divider>
              </template>
            </v-list-item-group>
            <v-list-item-group v-else>
              <template v-for="(item, index) in direct">
                <v-list-item
                  :key="item.friend.username"
                  @click="setID(item.room._id, item.friend.username)"
                >
                  <v-badge
                    bordered
                    bottom
                    color="green"
                    dot
                    offset-x="22"
                    offset-y="26"
                  >
                    <v-list-item-avatar>
                      <v-img
                        :src="item.friend.avatar ? item.friend.avatar : '/avatar.png'"
                      ></v-img>
                    </v-list-item-avatar>
                  </v-badge>
                  <template>
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="item.friend.display_name"
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
          v-if="groupType != 'none'"
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
              {{ this.nameChoose }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-title class="title pl-0 mr-2 mt-n4">
              Members :
            </v-toolbar-title>
            <AddGroup
              :username='user.username'
              :members="this.groupUsers"
              :idRoomChoose="this.idRoomChoose"
              @addIntoGroup="addIntoGroup">
            </AddGroup>
            <v-avatar class="mt-n5 mr-2" size="30" elevation="10">
              <img src="https://cdn.vuetifyjs.com/images/lists/5.jpg" />
            </v-avatar>
            <v-divider vertical inset class="mt-n1"></v-divider>

            <v-dialog transition="dialog-bottom-transition" max-width="600">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="black"
                  icon
                  class="mt-n5"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-link-variant</v-icon>
                </v-btn>
              </template>
              <template v-slot:default="dialog">
                <v-card>
                  <v-toolbar color="black" dark>Get link</v-toolbar>
                  <div class="mt-8">
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" sm="9" lg="9">
                          <a
                            :href="currentUrl"
                            class="text-dark"
                            target="_blank"
                            rel="noopener noreferrer"
                            ref="mylink"
                          >
                            {{ currentUrl }}
                          </a>
                        </v-col>
                        <v-col cols="12" sm="3" lg="3">
                          <v-btn
                            title
                            color="white"
                            @click="copyURL(currentUrl)"
                            block
                          >
                            Copy
                          </v-btn>
                        </v-col></v-row
                      >
                    </v-card-text>
                  </div>
                  <v-card-actions class="justify-end">
                    <v-btn text @click="dialog.value = false">Close</v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
            <v-btn
              color="black"
              icon
              class="mt-n5"
              @click="isSearch = !isSearch"
            >
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-btn
              color="black"
              icon
              class="mt-n5"
              @click="isActive = !isActive"
            >
              <v-icon>mdi-cog</v-icon>
            </v-btn>
          </v-app-bar>
          <div style="overflow: auto; max-height: 82%; height:750px">
            <div v-for="(message,index) in messages" :key="message.date">
              <!-- user send -->
              <v-app-bar
                class="space content"
                color="rgba(0,0,0,0)"
                flat
                v-if="message.sender === user.username"
                @mouseover="active = true"
                @mouseout="active = false"
              >
                <v-spacer></v-spacer>
                <!-- sub message -->

                  <v-menu left bottom :offset-x="offset">
                    <template class="space1" v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on" >
                        <v-icon v-show="active"> fas fa-ellipsis-h</v-icon>
                      </v-btn>
                    </template>

                  <v-list>
                    <v-list-item clickable @click="addPin(message._id)">
                      <v-list-item-title>
                        <v-icon>mdi-pin</v-icon>
                        Pin</v-list-item-title
                      >
                    </v-list-item>
                    <v-list-item clickable @click="isReply = true,getUser(message.sender)">
                      <v-list-item-title>
                        <v-icon>mdi-share</v-icon>
                        Reply</v-list-item-title
                      >
                    </v-list-item>
                    <v-list-item clickable @click="deleteMessage(message, index)">
                      <v-list-item-title>
                        <v-icon>mdi-delete</v-icon>
                        Delete</v-list-item-title
                      >
                    </v-list-item>
                  </v-list>
                </v-menu>

                  <v-menu class="space1" left bottom :offset-x="offset">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon v-show="active">far fa-grin-beam</v-icon>
                      </v-btn>
                    </template>
                    <VuemojiPicker @emojiClick="handleEmojiClick" />
                  </v-menu>
                <!-- chat message -->
                <div>
                  <div class="name">{{ getDisplayName(message.sender) }}</div>
                  <span v-if="message.type === 'image'" class="content">
                    <img :src="message.file.data" class="messageimg"/>
                  </span>
                  <span v-else-if="message.type === 'file'" class="content">
                    <a @click="downloadFile(message._id)">{{message.file.filename}}</a>
                  </span>
                  <v-card  v-else class="mr-2 recept" max-width="350px" color="blue" dark>
                    <v-tooltip top >
                      <template v-slot:activator="{ on, attrs }">
                        <v-list-item v-bind="attrs" v-on="on">
                          <v-list-item-content class="content">
                            <div>{{ message.message}}</div>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                      <span> {{ format_date(message.date) }}</span>
                    </v-tooltip>
                  </v-card>
                  <v-card >
                    <v-tooltip top >
                      <template v-slot:activator="{ on, attrs }">
                        <div class="emo" v-bind="attrs" v-on="on">
                         {{emo}}
                        </div>
                      </template>
                      <span> {{emo}} {{message.sender}}</span>
                    </v-tooltip>
                  </v-card>
                </div>
                <v-badge
                  class="space"
                  bordered
                  bottom
                  color="green"
                  dot
                  offset-x="10"
                  offset-y="10"
                >
                  <v-avatar size="30" elevation="10">
                    <img :src="getAvatar(message.sender)" @error="this.onerror=null;this.src='/avatar.png';" />
                  </v-avatar>
                </v-badge>
              </v-app-bar>
              <!-- other send -->
              <v-app-bar
                class="content"
                color="rgba(0,0,0,0)"
                flat
                v-else
                @mouseover="active = true"
                @mouseout="active = false"
              >
                <v-badge
                  bordered
                  bottom
                  color="green"
                  dot
                  offset-x="10"
                  offset-y="10"
                >
                  <v-avatar size="30" elevation="10">
                    <img :src="getAvatar(message.sender)" @error="this.onerror=null;this.src='/avatar.png';"/>
                  </v-avatar>
                </v-badge>
                <div>
                  <div class="name">{{ getDisplayName(message.sender) }}</div>
                  <span v-if="message.type === 'image'" class="content">
                    <img :src="message.file.data" class="messageimg"/>
                  </span>
                  <span v-else-if="message.type === 'file'" class="content">
                    <a @click="downloadFile(message._id)">{{message.file.filename}}</a>
                  </span>
                  <v-card  v-else class="mr-2 sender" max-width="350px">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-list-item v-bind="attrs" v-on="on">
                          <v-list-item-content class="content">
                            <div>{{ message.message }}</div>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                      <span> {{ format_date(message.date) }}</span>
                    </v-tooltip>
                  </v-card>
                </div>
                <v-menu left bottom :offset-x="offset">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on" class="ml-2">
                      <v-icon v-show="active">far fa-grin-beam</v-icon>
                    </v-btn>
                  </template>
                  <VuemojiPicker @emojiClick="handleEmojiClick" />
                </v-menu>
                <v-menu left bottom :offset-x="offset">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon v-show="active">fas fa-ellipsis-h</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item clickable @click="addPin(message._id)">
                      <v-list-item-title>
                        <v-icon>mdi-pin</v-icon>
                        Pin</v-list-item-title
                      >
                    </v-list-item>
                    <v-list-item clickable >
                      <v-list-item-title>
                        <v-icon>mdi-share</v-icon>
                        Reply</v-list-item-title
                      >
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-app-bar>
            </div>
          </div>
          <VuemojiPicker
            v-show="pickEmojiShow"
            @emojiClick="handleEmojiClick"
            class="emojiPicker"
            :class="isActive ? 'leftEmoji' : 'rightEmoji'"
          />
            <div class="reply" v-if="isReply == true">
              <v-icon style="color: white">mdi-share</v-icon>
              Reply to {{this.replyUser}}
              <v-icon class="btn" icon clickable v-on:click="isReply = !isReply"
                >mdi-close-circle-outline</v-icon
              >
            </div>
          <v-btn-toggle v-model="icon" borderless v-if="openMenuChat">
            <v-btn @click="openMenuChat = !openMenuChat" class="mr-5">
              <v-icon right class="mr-5">
                fas fa-window-close
              </v-icon>
              <span class="hidden-sm-and-down">Close</span>
            </v-btn>

            <v-btn class="mr-5" @click="chooseImg">
              <v-icon right class="mr-5">
                fas fa-images
              </v-icon>
              <span class="hidden-sm-and-down">Image</span>
            </v-btn>
            <input
              ref="inputImg"
              type="file"
              accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
              @change="uploadImage()"
              style="display: none;">

            <v-btn class="mr-5" @click="chooseFile">
              <v-icon right class="mr-5" > fas fa-file-upload </v-icon>

              <span class="hidden-sm-and-down">Files</span>
            </v-btn>
            <input
              ref="inputFile"
              type="file"
              @change="uploadFile()"
              style="display: none;">

            <v-btn class="mr-5">
              <v-icon right class="mr-5"> fas fa-video </v-icon>

              <span class="hidden-sm-and-down">Video</span>
            </v-btn>
          </v-btn-toggle>
          <v-text-field
            v-model="message"
            v-else
            append-icon="mdi-emoticon"
            prepend-icon="fas fa-plus"
            filled
            clear-icon="mdi-close-circle"
            clearable
            label="Message"
            type="text"
            class="chatbar"
            :append-outer-icon="message ? 'mdi-send' : 'mdi-microphone'"
            :rules="[rules.required]"
            :class="isActive ? 'half' : 'full'"
            @keyup="typingIndicatorOn"
            @keyup.enter="sendMessage"
            @click:append-outer="sendMessage"
            @click:append="pickEmojiShow = !pickEmojiShow"
            @click:prepend="openMenuChat = !openMenuChat"
          >
          </v-text-field>
          <div :class="['dots',isTyping ? 'active' : '']">●●●</div>
        </v-col>
        <v-col
          cols="12"
          :sm="isActive ? '3' : '0'"
          :lg="isActive ? '3' : '0'"
          v-show="isActive"
          v-if="groupType != 'none'"
        >
          <v-app-bar v-if="isSearch == true" flat color="rgba(0,0,0,0,0)">
            <v-row>
              <v-col class="mt-6" cols="12" sm="8" lg="8">
                <v-text-field
                  filled
                  label="Search Here"
                  append-icon="mdi-magnify"
                  color="grey"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="4" lg="4">
                <v-btn class="mt-8" depressed @click="isSearch = !isSearch">
                  Cancel
                </v-btn>
              </v-col>
            </v-row>
          </v-app-bar>
          <div v-else>
            <Extension
              :groupType="groupType"
              :members="this.groupUsers"
              :nameChoose="this.nameChoose"
              :idRoomChoose="this.idRoomChoose"
              @updateGroup="updateGroup"
            ></Extension>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import VueJwtDecode from "vue-jwt-decode";
import axios from 'axios';
import socket from '../socket';
import moment from 'moment';
import { VuemojiPicker } from 'vuemoji-picker';
import AddGroup from '../components/AddGroup.vue';
import Extension from '../components/Extension.vue';
import _ from 'underscore';

export default {
  components: {
    VuemojiPicker,
    Extension,
    AddGroup,
  },
  data() {
    let token = localStorage.getItem("jwt");
    let decoded = VueJwtDecode.decode(token);
    this.user = decoded;

    return {
      token: token,
      offset: true,
      active: false,
      user: decoded,
      groupType: "none",
      isActive: true,
      selected: [2],
      show: false,
      message: "",
      marker: true,
      iconIndex: 0,
      idRoomChoose: "",
      replyUser: "",
      isReply: false,
      emoMess:"",
      groupUsers: [],
      group: [],
      direct: [],
      messages: [],
      addGroupList: [],
      groupName: "",
      nameChoose: "",
      // get Link
      currentUrl: "",
      // search
      isSearch: false,
      isTyping:false,
      rules: {
        required: (value) => !!value || "Required.",
      },
      openMenuChat: false,
      pickEmojiShow: false,
      emo: "",
      isEmo:false,
    };
  },
  created() {
    socket.on("connect", () => {
      socket.emit("userconnected", { username: this.user.username });
    })
    socket.on("response", (data) => {
      // get room list
      if (data.room_id === this.idRoomChoose) {
        this.messages.push(data);
      } 
      // else bôi đen
    })
    socket.on("A member added", (data)=>{
      console.log(1)
      if (data.room_id === this.idRoomChoose) {
        let params = {
          id: this.idRoomChoose,
        };
        console.log(2)
        axios
          .post("http://localhost:8000/rooms/members", params)
          .then((response) => {
            this.groupUsers = response.data;
            console.log(3)
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    socket.on("Join room",(data)=> {
      let params = {
        username: this.user.username,
      };
    // show group list
      axios
      .post("http://localhost:8000/users/rooms", params)
      .then((response) => {
        this.group = response.data;
        socket.emit("Joined room", { room_id: data.room_id });
      })
    })
    socket.on("Join direct room",(data)=> {
      let params = {
        username: this.user.username,
      };
    // show group list
      axios
      .post("http://localhost:8000/users/directs", params)
      .then((response) => {
        this.direct = response.data;
        socket.emit("Joined room", { room_id: data.room_id });
      })
    })
    socket.on("deleted", (data)=>{
      if (data.room_id === this.idRoomChoose) {
        this.messages.splice(data.index,1);
      }
    })
    // get Link
    this.currentUrl = window.location.href
  },
  computed: {
    theme() {
      return this.$vuetify.theme.dark ? "dark" : "light";
    },
  },
  mounted: function () {
    let params = {
      username: this.user.username,
    };
    // show group list
    axios
      .post("http://localhost:8000/users/rooms", params)
      .then((response) => {
        if (response.data[0]) {
          this.idRoomChoose = response.data[0].id;
          this.nameChoose = response.data[0].name;
          let params = {
            id: this.idRoomChoose,
          };
          axios
            .post("http://localhost:8000/rooms/messages", params)
            .then((response) => {
              this.messages = response.data;
            })
            .catch((err) => {
              console.log(err);
            });
          axios
            .post("http://localhost:8000/rooms/members", params)
            .then((response) => {
              this.groupUsers = response.data;
            })
            .catch((err) => {
              console.log(err);
            });
            this.groupType = 'group'
        } else {
          this.groupType = 'none';
        }
        this.group = response.data;
      })
      .catch((err) => {
        console.log(err);
      });

    // show direct list
    axios
      .post("http://localhost:8000/users/directs", params)
      .then((response) => {
        this.direct = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    getDisplayName(username) {
      return this.groupUsers.find( element => element.username == username ).display_name
    },
    getAvatar(username) {
      return this.groupUsers.find( element => element.username == username ).avatar ?
          this.groupUsers.find( element => element.username == username ).avatar : '/avatar.png'
    },
    typingIndicatorOn(e){
      if(_.indexOf(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'],e.code) == -1 ){
          if(!this.isTyping){
            this.isTyping = true
          }
          _.debounce(this.typingIndicatorOff,1600)()
      }
    },
    typingIndicatorOff(){
      this.isTyping = false
    },
    // logUserOut() {
    //   localStorage.removeItem("jwt");
    //   this.$router.go("/login");
    // },
    sendMessage() {
      socket.emit("chat message", {
        room_id: this.idRoomChoose,
        sender: this.user.username,
        message: this.message,
      });
      this.resetIcon();
      this.clearMessage();
    },
    clearMessage() {
      this.message = "";
    },
    resetIcon() {
      this.iconIndex = 0;
    },
    setID(id, name) {
      this.idRoomChoose = id;
      this.nameChoose = name;
      let params = {
        id: this.idRoomChoose,
      };
      axios
        .post("http://localhost:8000/rooms/messages", params)
        .then((response) => {
          this.messages = response.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    infoRoom(id) {
      // show message list
      this.idRoomChoose = id;
      let params = {
        id: this.idRoomChoose,
      };
      axios
        .post("http://localhost:8000/rooms/members", params)
        .then((response) => {
          this.groupUsers = response.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    format_date(value) {
      if (value) {
        return moment(value).format("h:mm");
      }
    },
    handleEmojiClick(EmojiClickEventDetail) {
      console.log(EmojiClickEventDetail);
      this.pickEmojiShow = false;
      this.emo = EmojiClickEventDetail.unicode;
      // this.isEmo = true;
    },
    addIntoGroupList(friend, index) {
      this.addGroupList.push(friend);
      this.$set(this.direct[index].friend, 'added', true);
    },
    createGroup() {
      let params = {
        username: this.user.username,
        roomname: this.groupName,
        members: this.addGroupList,
      };
      (this.groupName = ""),
        axios
          .post("http://localhost:8000/users/createroom", params)
          .then( (response) => {
            socket.emit("create group", {username: this.user.username, room_id: response.data._id, members: this.addGroupList})
            this.direct.forEach(element => {
              this.$set(element.friend, 'added', false);
            });
            this.addGroupList = []
          })
          .catch((err) => {
            console.log(err);
          });
    },
    // get link
    async copyURL(mytext) {
      try {
        await navigator.clipboard.writeText(mytext);
        // alert('Copied');
      } catch ($e) {
        alert("Cannot copy");
      }
      //
    },
    getUser(data){
      this.replyUser = data;
      this.emoMess = data;
    },    
    addPin(messageId){
      let params = {
        username: this.user.username,
        message_id: messageId,
        room_id: this.idRoomChoose,
      };
      axios
        .post("http://localhost:8000/users/pinmessage", params)
        .then(()=>
        {
          console.log("");
          socket.emit("Pin message",params);
        }
        )
        .catch((err) => {
          console.log(err);
        });
    },
    async chooseImg() {
      this.$refs.inputImg.click()
    },
    async chooseFile() {
      this.$refs.inputFile.click();
    },
    uploadImage() {
      const file = document.querySelector('input[type=file]').files[0]
      const reader = new FileReader()

      let rawImg;
      reader.onloadend = () => {
        rawImg = reader.result;
        socket.emit("file message", {
        room_id: this.idRoomChoose,
        sender: this.user.username,
        file: {
          data: rawImg,
          filename: file.name
        },
        type: "image"
      });
      }
      reader.readAsDataURL(file);
    },
    uploadFile() {
      const file = this.$refs.inputFile.files[0]
      const form = new FormData();
      form.append('file', file);
      console.log(file)
      axios.post("http://localhost:8000/rooms/upload", form)
      .then((response)=>{
        socket.emit("file message", {
        room_id: this.idRoomChoose,
        sender: this.user.username,
        file: {
          data: response.data.filename,
          filename: file.name
        },
        type: "file"
        });
      })
    },
    downloadFile(messageid) {
      window.open("http://localhost:8000/rooms/download?id="+messageid + "&jwt=" + this.token, "_blank");
    },
    addIntoGroup(){
      // need to check
      this.$router.go()
    },
    updateGroup(name){
      this.nameChoose = name;
      // get list room again
    },
    deleteMessage(message, index) {
      let params = {
        message_id: message._id,
      };
      message.index = index;
      axios
        .post("http://localhost:8000/users/deleteMessage", params)
        .then(()=>
        {
          socket.emit("delete",message);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    chooseGroup(){
      if (this.group[0]) {
        this.groupType = 'group'
        
        this.setID(this.group[0].id, this.group[0].name)
        this.infoRoom(this.group[0].id)
      } else {
        this.groupType = 'none'
      }
    },
    chooseDirect(){
      if (this.direct[0]) {
        this.groupType = 'direct'
        this.setID(this.direct[0].room._id, this.direct[0].friend.username)
      } else {
        this.groupType = 'none'
      }
    }
  },
};
</script>
<style scoped>
.boder {
  border-right: 1px solid grey;
}
.sender {
  border-radius: 1px 50px 50px;
}
.recept {
  border-radius: 50px 50px 1px;
}
.chatbar {
  position: absolute;
  bottom: 0;
  margin-left: 5px;
}
.half {
  width: 47%;
}
.full {
  width: 72%;
}
.subtitle {
  size: "1rem";
  font-weight: "400";
  letter-spacing: ".009375em";
}
.name {
  color: grey;
  font-family: "Times New Roman", Times, serif;
  padding-left: 30px;
  margin-top: 10px;
}
.space {
  margin-top: 50px;
}
.cb{
  margin-right: 80px;
}
.emojiPicker{
  position: absolute;
  bottom: 87px;
}
.rightEmoji{
  right: 50px;
}
.leftEmoji{
  right: 450px;
}
.content::v-deep {
  height: max-content !important;
  word-break: break-word;
}
>>> .v-toolbar__content {
  height: max-content !important;
}
.messageimg {
  border: 1px solid #555;
  display: block;
  max-width:250px;
  max-height:250px;
  width: auto;
  height: auto;
}
.reply{
    border: 2px solid;
    border-radius: 50px 50px 1px;
    background-color:grey;
    color: white;
}
.emo{
    position: fixed;
    border: 2px solid;
    border-radius: 20px ;
    color: white;
}
.btn {
  background-color: grey;
  left: 666px;
  color: white;
}
.dots{
  background: lightgray;
  display: inline-block;
  padding:3px 6px;
  color:gray;
  border-radius:8px;
  opacity: 0;
  transition: opacity .5s;
  margin-left: 10px;
}
.active{
  opacity: 1 !important;
}
</style>
