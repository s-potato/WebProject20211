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
                          @click="addIntoGroupList(item.friend)"
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
                                :src="'https://cdn.vuetifyjs.com/images/lists/1.jpg'"
                              ></v-img>
                            </v-list-item-avatar>
                          </v-badge>
                          <template>
                            <v-list-item-content>
                              <v-list-item-title
                                v-text="item.friend.username"
                              ></v-list-item-title>
                            </v-list-item-content>
                          </template>
                          <!-- <v-btn color="blue" icon class="mt-n5 mr-n2" outlined max-height="35" max-width="35" @click="item.icon = !item.icon">
                            <v-icon small v-if="item.icon == true"
                              >fas fa-plus</v-icon
                            >
                            <v-icon small v-else>mdi-check</v-icon>
                          </v-btn> -->
                        </v-list-item>
                        <v-divider
                          v-if="index < direct.length - 1"
                          :key="index"
                        ></v-divider>
                      </template>
                    </v-list-item-group>
                  </v-list>
                  <v-card-actions color="primary" class="justify-end">
                    <v-btn text @click="createGroup">Confirm</v-btn>
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
              <v-btn
                title
                :color="isDirect ? 'white' : 'grey'"
                block
                @click="isDirect = false"
              >
                Group
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                title
                :color="isDirect ? 'grey' : 'white'"
                block
                @click="isDirect = true"
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
            <v-list-item-group v-if="isDirect == false">
              <template v-for="(item, index) in group">
                <v-list-item
                  :key="item.name"
                  @click="setID(item.id, item.name),infoRoom(item.id, item.name)"
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
                        :src="'https://cdn.vuetifyjs.com/images/lists/1.jpg'"
                      ></v-img>
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
              {{ this.nameChoose }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-title class="title pl-0 mr-2 mt-n4">
              Members :
            </v-toolbar-title>
            <Dialog
            :fab="true"
            :class="fabButton">
            <v-toolbar color="primary" dark>Add friend to group</v-toolbar>
            </Dialog>
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
            <div v-for="message in messages" :key="message.date">
              <!-- user send -->
              <v-app-bar
                class="space content"
                color="rgba(0,0,0,0)"
                flat
                v-if="message.sender === user.username"
                @mouseover="active = true"
                @mouseleave="active = false"
              >
                <v-spacer></v-spacer>
                <v-menu left bottom :offset-x="offset">
                  <template class="space1" v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon v-show="active">fas fa-ellipsis-h</v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item clickable v-on:click="getPin(message.message)">
                      <v-list-item-title>
                        <v-icon>mdi-pin</v-icon>
                        Pin</v-list-item-title>
                    </v-list-item>
                    <v-list-item clickable >
                      <v-list-item-title>
                        <v-icon>mdi-share</v-icon>
                        Reply</v-list-item-title
                      >
                    </v-list-item>
                    <v-list-item clickable>
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
                <div>
                  <div class="name">{{ message.sender }}</div>
                  <span v-if="message.type === 'image'" class="content">
                    <img :src="message.file.data" class="messageimg"/>
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
                    <img src="https://cdn.vuetifyjs.com/images/lists/5.jpg" />
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
                @mouseleave="active = false"
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
                    <img src="https://cdn.vuetifyjs.com/images/lists/1.jpg" />
                  </v-avatar>
                </v-badge>
                <div>
                  <div class="name">{{ message.sender }}</div>
                  <span v-if="message.type === 'image'" class="content">
                    <img :src="message.file.data" class="messageimg"/>
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
                    <v-list-item clickable>
                      <v-list-item-title>
                        <v-icon>mdi-share</v-icon>
                        Reply</v-list-item-title
                      >
                    </v-list-item>
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
                        Delete</v-list-item-title
                      >
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-app-bar>
            </div>
          </div>
          <VuemojiPicker v-show="pickEmojiShow" @emojiClick="handleEmojiClick" class="emojiPicker" :class="isActive ? 'leftEmoji' : 'rightEmoji' "/>
          <v-btn-toggle
            v-model="icon"
            borderless
            v-if="openMenuChat"
          >
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

            <v-btn class="mr-5">
              <v-icon right class="mr-5">
                fas fa-file-upload
              </v-icon>
              <span class="hidden-sm-and-down">Files</span>
            </v-btn>

            <v-btn class="mr-5">
              <v-icon right class="mr-5">
                fas fa-video
              </v-icon>
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
            @keyup.enter="sendMessage"
            @click:append-outer="sendMessage"
            @click:append="pickEmojiShow = !pickEmojiShow"
            @click:prepend="openMenuChat = !openMenuChat"
          ></v-text-field>
        </v-col>
        <v-col cols="12" :sm="isActive ? '3' : '0'" :lg="isActive ? '3' : '0'" v-show="isActive" >
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
            <v-btn class="mt-8 " depressed @click="isSearch = !isSearch"> Cancel </v-btn>
            </v-col>
            </v-row>
          </v-app-bar>
          <div v-else>
            <!-- <v-card class="text-center mt-8 mb-3" shaped>
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
                >{{this.nameChoose}}</v-card-title
              >
              <v-card-subtitle class="layout justify-center"
                >Hello this is {{this.nameChoose}} room</v-card-subtitle>
            </v-card> -->
            <!-- <v-expansion-panels v-model="panel" multiple>
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
            </v-expansion-panels> -->
            <extension
            :pinList="pinList"
            :isDirect="isDirect"
            :members="this.groupUsers"
            :nameChoose="this.nameChoose"
            ></extension>
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
import Dialog from '../components/Dialog.vue';
import Extension from '../components/Extension.vue';

export default {
  components: {
    VuemojiPicker,
    Dialog,
    Extension,
  },
  data() {
    let token = localStorage.getItem("jwt");
    let decoded = VueJwtDecode.decode(token);
    this.user = decoded;

    return {
      offset: true,
      active: false,
      user: decoded,
      isDirect: false,
      isActive: true,
      selected: [2],
      // panel: [2],
      show: false,
      message: "",
      marker: true,
      iconIndex: 0,
      idChoose: "",
      groupUsers: [],
      pinList:[],
      // files: [
      //   { text: "Landing_page.zip", icon: " mdi-cloud-upload" },
      //   { text: "Requirements.pdf", icon: " mdi-cloud-upload" },
      //   { text: "Uwagi.docx", icon: " mdi-cloud-upload" },
      // ],
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
      rules: {
          required: value => !!value || 'Required.',
      },
      openMenuChat:false,
      pickEmojiShow: false,
    };
  },
  created() {
    socket.on("connect", () => {
      socket.emit("userconnected", { username: this.user.username });
    }),
      socket.on("response", (data) => {
        console.log(data);
        if (data.room_id === this.idChoose) {
          this.messages.push(data);
          console.log(data);
        }
      });
    // get Link
    this.currentUrl = window.location.href;
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
          this.idChoose = response.data[0].id;
          this.nameChoose = response.data[0].name;
          let params = {
            id: this.idChoose,
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
              console.log(this.groupUsers)
            })
            .catch((err) => {
              console.log(err);
            });
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
    logUserOut() {
      localStorage.removeItem("jwt");
      this.$router.push("/login");
    },
    sendMessage() {
      socket.emit("chat message", {
        room_id: this.idChoose,
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
    joinGroup() {
      //TODO:
    },
    sendRequest() {
      //TODO:
    },
    setID(id, name) {
      // show message list
      this.idChoose = id;
      this.nameChoose = name;
      let params = {
        id: this.idChoose,
      };
      axios
        .post("http://localhost:8000/rooms/messages", params)
        .then((response) => {
          this.messages = response.data;
          // console.log(response.data)
        })
        .catch((err) => {
          console.log(err);
        });
    },
    infoRoom(id, name) {
      // show message list
      this.idChoose = id;
      this.nameChoose = name;
      let params = {
        id: this.idChoose,
      };
      axios
        .post("http://localhost:8000/rooms/members", params)
        .then((response) => {
          this.groupUsers = response.data;
          console.log( this.groupUsers)
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
    },
    addIntoGroupList(friend) {
      this.addGroupList.push(friend);
    },
    createGroup() {
      let params = {
        username: this.user.username,
        roomname: this.groupName,
        members: this.addGroupList,
      };
      this.groupName = "",
        axios
          .post("http://localhost:8000/users/createroom", params)
          .then(this.$router.go())
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
    getPin(message){
      this.pinList.push(message)
      console.log(message)
    },
    async chooseImg() {
      this.$refs.inputImg.click()
    },
    uploadImage() {
      const file = document.querySelector('input[type=file]').files[0]
      const reader = new FileReader()

      let rawImg;
      reader.onloadend = () => {
        rawImg = reader.result;
        console.log(rawImg);
        socket.emit("image message", {
        room_id: this.idChoose,
        sender: this.user.username,
        file: {
          data: rawImg,
          filename: file.name
        },
        type: "image"
      });
      }
      reader.readAsDataURL(file);
      // console.log(file)

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
</style>
