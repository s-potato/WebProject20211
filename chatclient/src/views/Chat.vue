<template>
  <v-app :style="{ background: $vuetify.theme.themes.dark.background }">
    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="3" lg="3" class="border">
          <v-app-bar flat color="rgba(0,0,0,0,0)">
            <v-dialog transition="dialog-top-transition" max-width="600">
              <template v-slot:activator="{ on, attrs }">
                <v-btn title color="blue" block v-bind="attrs" v-on="on">
                  <v-icon left color="white">fas fa-plus</v-icon>
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
                            <v-list-item-avatar>
                              <v-img
                                :src="item.friend.avatar ? item.friend.avatar : '/avatar.png'"
                              ></v-img>
                            </v-list-item-avatar>
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
                :color="groupType == 'group' ? 'grey' : 'blue'"
                block
                @click="chooseGroup"
              >
                Group
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                title
                :color="groupType == 'direct' ? 'grey' : 'blue'"
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
            <!-- group list -->
            <v-list-item-group v-if="groupType == 'group'" v-model='selectIndex'>
              <template v-for="(item, index) in group">
                <v-list-item
                  :key="'A'+index"
                  :value="item.id"
                  @click="setID(item.id, item.name), infoRoom(item.id)">
                  <v-list-item-avatar>
                    <v-img
                      :src="'/groupavatar.png'"
                    ></v-img>
                  </v-list-item-avatar>
                  <template>
                    <v-list-item-content :class="textRead">
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                      <v-list-item-subtitle v-if='item.latest_message' >{{item.latest_message.sender.display_name}}: {{item.latest_message.content}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-list-item>
                <v-divider
                  v-if="index < group.length - 1"
                  :key="index"
                ></v-divider>
              </template>
            </v-list-item-group>
            <!-- direct list -->
            <v-list-item-group v-else-if="groupType == 'direct'" v-model='selectIndex'>
              <template v-for="(item, index) in direct">
                <v-list-item
                  :key="'B'+index"
                  :value="item.room._id"
                  @click="setID(item.room._id, item.friend.username)"
                >
                  <v-badge
                    bordered
                    bottom
                    :color="item.friend.status ? 'green':'grey'"
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
                  <!-- <template>
                    <v-list-item-content :class="textRead">
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                      <v-list-item-subtitle >{{item.latest_message.sender.display_name}}: {{item.latest_message.content}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template> -->
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
            <v-avatar size="40" elevation="10" v-if="groupType == 'direct'">
              <img :src="getDirectAvatar(idRoomChoose)" />
            </v-avatar>
            <v-avatar size="40" elevation="10" v-else-if="groupType == 'group'">
                <img src="/groupavatar.png" />
            </v-avatar>
            
            <v-toolbar-title class="title pl-0 ml-2">
              {{ this.nameChoose }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
              <v-toolbar-title class="title pl-0 mr-2" v-if="groupType == 'group'">
                Members :
              </v-toolbar-title>
              <AddGroup
                :username='user.username'
                :members="this.groupUsers"
                :idRoomChoose="this.idRoomChoose"
                @addIntoGroup="addIntoGroup" v-if="groupType == 'group'">
              </AddGroup>
              <v-dialog transition="dialog-bottom-transition" max-width="600" v-if="groupType == 'group'">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-link-variant</v-icon>
                  </v-btn>
                </template>
                <template v-slot:default="dialog">
                  <v-card>
                    <v-toolbar color="black" dark>Get link</v-toolbar>
                    <div>
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
                          <v-col cols="12" sm="1" lg="1">
                            <v-btn
                              title
                              
                              @click="refreshLink()"
                              icon
                            >
                              <v-icon>fas fa-sync-alt</v-icon>
                            </v-btn>
                          </v-col>
                          <v-col cols="12" sm="2" lg="2">
                            <v-btn
                              title
                              
                              @click="copyURL(currentUrl)"
                              block
                            >
                              Copy
                            </v-btn>
                          </v-col>
                          
                        </v-row>
                      </v-card-text>
                    </div>
                    <v-card-actions class="justify-end">
                      <v-btn text @click="dialog.value = false">Close</v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            <!-- search -->
            <v-btn
              icon
              @click="isSearch = !isSearch"
            >
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-btn
              icon
              @click="isActive = !isActive"
            >
              <v-icon>mdi-cog</v-icon>
            </v-btn>
          </v-app-bar>
        
          <div style="overflow: auto; max-height: 82%; height:750px" ref="chatmessage">
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
                    <v-list-item clickable @click="isReply = true, getUser(message)">
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

                  <v-menu class="space1" left bottom :offset-x="offset" v-model="pickEmojiShowB[message._id]">
                      <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon v-show="active">far fa-grin-beam</v-icon>
                      </v-btn>
                      </template>
                    <VuemojiPicker @emojiClick="handleEmojiClick($event, message._id, index)"/>
                  </v-menu>
                <!-- chat message -->
                <div>
                  <div class="name">{{ getDisplayName(message.sender) }}</div>
                  <div class="replied" v-if='message.reply_to'>
                    <v-icon>mdi-share</v-icon>
                    Replied to: {{message.reply_to.message}}</div>
                  <span v-if="message.type === 'image'" class="content">
                    <img :src="message.file.data" class="messageimg"/>
                  </span>
                  <span v-else-if="message.type === 'file'" class="content">
                    <a class="file1" @click="downloadFile(message._id)">
                    <v-icon>mdi-file</v-icon>
                    {{message.file.filename}}</a>
                  </span>
                  <v-card  v-else class="mr-2 recept" max-width="350px" color="blue" dark>
                    <v-tooltip top >
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
                  <v-card v-if="message.react && message.react.length > 0">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <div class="emo" v-bind="attrs" v-on="on">
                         {{message.react.length > 0 ? message.react.length + message.react[0].icon : ""}}
                        </div>
                      </template>
                      <div v-for="(react, index) in message.react" :key="'React'+index"> {{react.icon}} {{react.user.display_name}}</div>
                    </v-tooltip>
                  </v-card>
                </div>
                <v-avatar size="30" elevation="10">
                  <img :src="getAvatar(message.sender)" @error="this.onerror=null;this.src='/avatar.png';" />
                </v-avatar>
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
                <v-avatar size="30" elevation="10">
                  <img :src="getAvatar(message.sender)" @error="this.onerror=null;this.src='/avatar.png';"/>
                </v-avatar>
                <div>
                  <div class="name">{{ getDisplayName(message.sender) }}</div>
                  <div class="replied" v-if='message.reply_to'>
                    <v-icon>mdi-share</v-icon>
                    Replied to: {{message.reply_to.message}}</div>
                  <span v-if="message.type === 'image'" class="content">
                    <img :src="message.file.data" class="messageimg"/>
                  </span>
                  <span v-else-if="message.type === 'file'" class="content">
                    <a class="file" @click="downloadFile(message._id)">
                    <v-icon>mdi-file</v-icon>
                    {{message.file.filename}}</a>
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
                  <v-card  v-if="message.react && message.react.length > 0">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <div class="emo" v-bind="attrs" v-on="on">
                         {{message.react.length > 0 ? message.react.length + message.react[0].icon : ""}}
                        </div>
                      </template>
                      <div v-for="(react, index) in message.react" :key="'React'+index"> {{react.icon}} {{react.user.display_name}}</div>
                    </v-tooltip>
                  </v-card>
                </div>
                <v-menu left bottom :offset-x="offset" v-model="pickEmojiShowB[message._id]">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on" class="ml-2">
                      <v-icon v-show="active">far fa-grin-beam</v-icon>
                    </v-btn>
                  </template>
                  <VuemojiPicker @emojiClick="handleEmojiClick($event, message._id, index)"/>
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
                    <v-list-item clickable @click="isReply = true, getUser(message)">
                      <v-list-item-title >
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
            @emojiClick="handleEmojiChat"
            class="emojiPicker"
            :class="isActive ? 'leftEmoji' : 'rightEmoji'"
          />
            <div class="reply" v-if="isReply == true">
              <v-icon style="color: white">mdi-share</v-icon>
              Reply to {{this.replyMess.replyUser}} :  {{this.replyMess.message}}
              <v-icon class="btn" icon clickable v-on:click="isReply = !isReply"
                >mdi-close-circle-outline</v-icon>
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
            :class="isActive ? 'half' : 'full'"
            @keyup="typingEvent"
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
            <search-message :idRoom="this.idRoomChoose"/>
          </v-app-bar>
          <div v-else>
            <Extension
              :groupType="groupType"
              :members="this.groupUsers"
              :nameChoose="this.nameChoose"
              :idRoomChoose="this.idRoomChoose"
              :imgList="this.imgList"
              :fileList="this.fileList"
              @updateGroup="updateGroup"
              :avatar="groupType == 'direct'? getDirectAvatar(this.idRoomChoose) : ''"
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
import SearchMessage from '../components/SearchMessage.vue';
import ImageCompressor from 'js-image-compressor'
import _ from 'underscore';

export default {
  components: {
    VuemojiPicker,
    Extension,
    AddGroup,
    SearchMessage
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
      replyMess: "",
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
      latest:"",
      isRead:false,
      openMenuChat: false,
      pickEmojiShow: false,
      pickEmojiShowB: {},
      emo: [],
      isEmo:false,
      selectIndex: "",
      fileList:[],
      imgList:[],
    };
  },
  created() {
    socket.on("connect", () => {
      socket.emit("userconnected", { username: this.user.username });
    })
    socket.on("response", (data) => {
      this.selectIndex = ""
      // get room list
      let params = {
        username: this.user.username,
      };
      axios
      .post("http://localhost:8000/users/rooms", params)
      .then((response) => {
        this.group = response.data;
        if (this.groupType == 'group'){
          this.selectIndex = this.idRoomChoose
        }
      })
      axios
      .post("http://localhost:8000/users/directs", params)
      .then((response) => {
        this.direct = response.data;
        if (this.groupType == 'direct'){
          this.selectIndex = this.idRoomChoose
        }
      })
      if (data.room_id === this.idRoomChoose) {
        this.messages.push(data);
        setTimeout(() => {
          this.$refs.chatmessage.scrollTop = this.$refs.chatmessage.scrollHeight;
        }, 200);
      }
    })
    socket.on("A member added", (data)=>{
      if (data.room_id === this.idRoomChoose) {
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
      let vue = this
      if (data.room_id === this.idRoomChoose) {
        this.messages.find((element, index)=>{
          if (element._id == data._id){
            vue.messages.splice(index, 1);
          }
        })
      }
    })
    socket.on("Reacted",(data)=>{
      console.log(data);
      if (data.room_id == this.idRoomChoose) {
        var message_index;
        this.messages.forEach((element, index)=>{
          if(element._id == data.message_id) {
            message_index = index
          }
        })
        console.log(message_index)
        var count = false;
        this.messages[message_index].react.forEach((element, index)=>{
          if (element.user.username == data.username) {
            if (element.icon == data.icon) {
              this.messages[message_index].react.splice(index, 1);
            } else {
              this.messages[message_index].react[index].icon = data.icon
            }
            count = true;
            return
          } 
        })
        if(count == false){
          this.messages[message_index].react.push({
            user: {
              _id: data.user_id,
              username: data.username,
              display_name: data.display_name
            },
            icon: data.icon
          })
        }
      }
    })
    socket.on("Someone typing" , (data)=>{
      if(data.room_id == this.idRoomChoose){
      this.typingIndicatorOn(data.e);
      }
    })
    // get Link
    // this.currentUrl = window.location.href
  },
  computed: {
    theme() {
      return this.$vuetify.theme.dark ? "dark" : "light";
    },
    textRead(){
    if(this.isRead == true){
      return "font-weight-black"
    }else{
      return ""
    }
  }
  },
  mounted: async function () {
    let params = {
      username: this.user.username,
    };
    // get info:
    await axios
      .post("http://localhost:8000/users/info", params)
      .then((response) => {
        this.user = response.data
      })
    // show group list
    await axios
      .post("http://localhost:8000/users/rooms", params)
      .then((response) => {
        if (response.data[0]) {
          this.idRoomChoose = response.data[0].id;
          this.nameChoose = response.data[0].name;
          this.selectIndex = this.idRoomChoose
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
          axios.get("http://localhost:8000/rooms/key", {params})
            .then((response) => {
              var host = window.location.protocol + "//" + window.location.host;
              this.currentUrl = host + '/join/' + response.data;
            })
        } else {
          this.groupType = 'none';
        }
        this.group = response.data;
      })
      .catch((err) => {
        console.log(err);
      });

    // show direct list
    await axios
      .post("http://localhost:8000/users/directs", params)
      .then((response) => {
        this.direct = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
    this.$refs.chatmessage.scrollTop = this.$refs.chatmessage.scrollHeight;
  },
  methods: {
    getDirectAvatar(room_id) {
      return ((room_id)=>{      // anonymous function
        var direct = this.direct.find(element=>element.room._id == room_id)
        if (direct && direct.friend.avatar) {
          return direct.friend.avatar
        } else {
          return '/avatar.png'
        }
      })(room_id)
    },
    getDisplayName(username) {
      return ((username)=>{
          if (this.user.username == username) {
            return this.user.display_name ? this.user.display_name : this.user.username
          }
          var user = this.groupUsers.find(element => element.username == username)
          if (!user) {
            var direct = this.direct.find(element=> element.friend.username == username)
            if (direct) user = direct.friend
          }
          if (user && user.display_name) {
            return user.display_name
          } else {
            return username
          }
        }
      )(username)
    },
    getAvatar(username) {
      return ((username)=>{
          if (this.user.username == username) {
            return this.user.avatar ? this.user.avatar : '/avatar.png'
          }
          var user = this.groupUsers.find(element => element.username == username)
          if (!user) {
            var direct = this.direct.find(element=>element.friend.username == username)
            if (direct) user = direct.friend
          }
          if (user && user.avatar) {
            return user.avatar
          } else {
            return '/avatar.png'
          }
        }
      )(username)
    },
    // floatting while typing
    typingIndicatorOn(e){
      if(_.indexOf(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'],e.code) == -1 ){
          if(!this.isTyping){
            this.isTyping = true
          }
          _.debounce(this.typingIndicatorOff,2000)()
      }
    },
    typingEvent(e){
      socket.emit("Typing", { room_id: this.idRoomChoose, user_id: this.user.username, e: e });
    },
    typingIndicatorOff(){
      this.isTyping = false
    },
    // end floatting
    async sendMessage() {
      let message = this.message.trim()
      let params = {
            room_id: this.idRoomChoose,
            sender: this.user.username,
            message: message,
            type: 'text'
      };
      if(this.isReply){
        params.reply_to = {
            _id: this.replyMess._id,
            message: this.replyMess.message
        }
      }
      if(message != ""){
          await socket.emit("chat message", params);
      }
      this.iconIndex = 0;
      this.message = "";
      this.isReply = false;
    },
    async setID(id, name) {
      this.idRoomChoose = id;
      this.nameChoose = name;
      let params = {
        id: this.idRoomChoose,
      };
      await axios
        .post("http://localhost:8000/rooms/messages", params)
        .then((response) => {
          this.messages = response.data;
          this.imgList = this.messages.filter(message => (message.type == "image"));
          this.fileList = this.messages.filter(message => message.type == "file");
          
        })
        .catch((err) => {
          console.log(err);
        });
        this.$refs.chatmessage.scrollTop = this.$refs.chatmessage.scrollHeight;
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
      axios.get("http://localhost:8000/rooms/key", {params})
        .then((response) => {
          var host = window.location.protocol + "//" + window.location.host;
          this.currentUrl = host + '/join/' + response.data;
        })
    },
    format_date(value) {
      if (value) {
        return moment(value).format("h:mm");
      }
    },
    handleEmojiClick(EmojiClickEventDetail, id) {
      console.log(this.pickEmojiShowB)
      this.pickEmojiShowB[id] = false;
      let params = {
        icon: EmojiClickEventDetail.unicode,
        message_id: id,
        user_id: this.user._id,
      };
      axios
        .post("http://localhost:8000/users/reactMessage", params)
        .then((response) =>{
          console.log(response.data);
          socket.emit("React a message",({
            message_id: id, 
            icon: EmojiClickEventDetail.unicode, 
            username:this.user.username, 
            room_id: this.idRoomChoose, 
            user_id: this.user._id,
            display_name: this.user.display_name
            }));
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleEmojiChat(EmojiClickEventDetail) {
      this.pickEmojiShow = false;
      this.message += EmojiClickEventDetail.unicode;
    },
    addIntoGroupList(friend, index) {
      this.addGroupList.push(friend);
      this.$set(this.direct[index].friend, 'added', true);
    },
    createGroup() {
      if(this.groupName != ""){
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
      }
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
      let message = {};
      message.replyUser = this.getDisplayName(data.sender);
      if (data.type != 'text') {
        message.message = data.type;
      } else {
        message.message = data.message;
      }
      message._id = data._id;
      this.replyMess = message
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
          {socket.emit("Pin message",params);}
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
      let vue = this
      var options = {
        file: file,
        quality: 0.5,
        maxWidth: 800,
        maxHeight: 800,
        convertSize: Infinity,
        // Callback before compression
        beforeCompress: function (result) {
          console.log('Image size before compression:', result.size);
          console.log('mime type:', result.type);
        },

        // Compression success callback
        success: function (result) {
          console.log('Image size after compression:', result.size);
          console.log('mime type:', result.type);
            const reader = new FileReader()

            let rawImg;
            reader.onloadend = () => {
              rawImg = reader.result;
              let params = {
                room_id: vue.idRoomChoose,
                sender: vue.user.username,
                file: {
                  data: rawImg,
                  filename: vue.name
                },
                type: "image"
              }
              if (vue.isReply) {
                params.reply_to = {
                  _id: vue.replyMess._id,
                  message: vue.replyMess.message
                }
              }
              socket.emit("file message", params);
              vue.isReply = false;
            }
            reader.readAsDataURL(result);
        }
      };
      new ImageCompressor(options)
    },
    uploadFile() {
      const file = this.$refs.inputFile.files[0]
      const form = new FormData();
      form.append('file', file);
      
      axios.post("http://localhost:8000/rooms/upload", form)
      .then((response)=>{
        let params = {
          room_id: this.idRoomChoose,
          sender: this.user.username,
          file: {
            data: response.data.filename,
            filename: file.name
          },
          type: "file"
        }
        if (this.isReply) {
          params.reply_to = {
            _id: this.replyMess._id,
            message: this.replyMess.message
          }
        }
        socket.emit("file message", params);
        this.isReply = false;
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
      let params = {
        username: this.user.username,
      };
      axios
      .post("http://localhost:8000/users/rooms", params)
      .then((response) => {
        this.group = response.data;
      })
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
          socket.emit("delete",{room_id: this.idRoomChoose, _id: message._id});
        })
        .catch((err) => {
          console.log(err);
        });
    },
    chooseGroup(){
      if (this.group[0]) {
        this.groupType = 'group'
        this.selectIndex = this.group[0].id
        this.setID(this.group[0].id, this.group[0].name)
        this.infoRoom(this.group[0].id)
      } else {
        this.groupType = 'none'
      }
    },
    chooseDirect(){
      if (this.direct[0]) {
        this.groupType = 'direct'
        this.selectIndex = this.direct[0].room._id
        this.setID(this.direct[0].room._id, this.direct[0].friend.username)
      } else {
        this.groupType = 'none'
      }
    },
    refreshLink(){
      let params = {
        id: this.idRoomChoose,
      }

      axios.post("http://localhost:8000/rooms/refreshKey", params)
      .then((response)=>{
        var host = window.location.protocol + "//" + window.location.host;
        this.currentUrl = host + '/join/' + response.data;
      })
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
.file{
    padding: 5px;
    border-radius: 50px 50px;
    background-color:white;
    color: black;
}
.file1{
    padding: 5px;
    border-radius: 50px 50px;
    background-color:rgb(85, 163, 252);
    color: white;
}
.replied{
    padding-bottom: 5px;
    border-radius: 50px 50px;
    background-color: #BBDEFB;
    outline: none;
}
.emo{
    position: fixed;
    color: rgb(22, 21, 21);
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
