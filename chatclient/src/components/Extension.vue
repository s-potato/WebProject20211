<template>
  <div class="extension" v-if="groupType == 'group'">
    <!-- Groups -->
    <v-card class="text-center mt-8 mb-3" shaped>
      <v-avatar class="mt-n7" size="60" elevation="10">
        <img src="/groupavatar.png" />
      </v-avatar>
      <v-card-title class="layout justify-center">{{
        this.nameChoose
      }}</v-card-title>
      <v-card-subtitle class="layout justify-center"
        >Hello this is {{ this.nameChoose }} room</v-card-subtitle
      >
    </v-card>
    <v-expansion-panels v-model="panel" multiple>
      <!-- members -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Member</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content style="overflow: auto; height: 121px">
          <v-list color="rgba(0,0,0,0)">
            <v-list-item-group>
              <template v-for="(item, index) in members">
                <v-list-item :key="'Members'+index">
                  <v-badge
                    bordered
                    bottom
                    :color="item.status ? 'green':'grey'"
                    dot
                    offset-x="22"
                    offset-y="26"
                  >
                    <v-list-item-avatar>
                      <v-img :src="typeof item.avatar != 'undefined'? item.avatar: '/avatar.png'"></v-img>
                    </v-list-item-avatar>
                  </v-badge>
                  <template>
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="item.display_name"
                      ></v-list-item-title>
                    </v-list-item-content>
                  </template>
                </v-list-item>
                <v-divider
                  v-if="index < members.length - 1"
                  :key="index"
                ></v-divider>
              </template>
            </v-list-item-group>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- group setting -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Options</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <SettingGroup
            :nameChoose="nameChoose"
            :idRoomChoose="idRoomChoose"
            @updateGroup="updateGroup"
          ></SettingGroup>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- pictures -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Pictures</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-container fluid>
            <v-row>
              <v-col v-for="img in imgList" :key="img._id" cols="4">
                <img
                  :src= img.file.data
                  alt="lorem"
                  class="image"
                  height="100%"
                  width="100%"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- Files -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Files</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list shaped>
            <template v-for="file in fileList">
              <v-list-item :key="file._id" clickable @click="downloadFile(file._id)" >
                <v-list-item-icon>
                  <v-icon color="green">mdi-cloud-upload</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                  {{file.file.filename}}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- pinned messages -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Pinned Message</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content style="overflow: auto; height: 181px">
          <v-list three-line>
            <template v-for="(item, index) in pinList">
              <v-list-item :key="'PinA' + index">
                <v-list-item-content>
                  <v-list-item-subtitle
                    v-html="item.sender.display_name + ':'"
                  ></v-list-item-subtitle>
                  <v-list-item-title v-html="item.content"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="unPin(item.id)">
                    <v-icon color="grey lighten-1">fas fa-trash-alt</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
  <div class="extension" v-else>
    <!-- Direct -->
    <v-card class="text-center mt-8 mb-3" shaped>
      <v-avatar class="mt-n7" size="60" elevation="10">
        <img :src="avatar"/>
      </v-avatar>
      <v-card-title class="layout justify-center">{{
        this.nameChoose
      }}</v-card-title>
      <v-card-subtitle class="layout justify-center"
        >You chatting with {{ this.nameChoose }}</v-card-subtitle
      >
    </v-card>
    <v-expansion-panels v-model="panel" multiple>
      <!-- theme -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Options</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list>
            <v-list-item>
              <v-switch
                v-model="$vuetify.theme.dark"
                inset
                label="Dark/Light Switch"
                persistent-hint
              ></v-switch>
            </v-list-item>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- Pictures -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Pictures</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-container fluid>
            <v-row>
              <v-col v-for="img in imgList" :key="img._id" cols="4">
                <img
                  :src= img.file.data
                  alt="lorem"
                  class="image"
                  height="100%"
                  width="100%"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- Files -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Files</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list shaped>
            <template v-for="file in fileList">
              <v-list-item :key="file._id" clickable @click="downloadFile(file._id)" >
                <v-list-item-icon>
                  <v-icon color="green">mdi-cloud-upload</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                  {{file.file.filename}}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- Pinned Message -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Pinned Message</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content style="overflow: auto; height: 181px">
          <v-list three-line>
            <template v-for="(item, index) in pinList">
              <v-list-item :key="'PinB' + index">
                <v-list-item-content>
                  <v-list-item-subtitle
                    v-html="item.sender.display_name + ':'"
                  ></v-list-item-subtitle>
                  <v-list-item-title v-html="item.content"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="unPin(item.id)">
                    <v-icon color="grey lighten-1">fas fa-trash-alt</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import VueJwtDecode from "vue-jwt-decode";
import axios from "axios";
import socket from "../socket";
import SettingGroup from "./SettingGroup.vue";
export default {
  name: "extension",
  props: {
    nameChoose: {
      type: String,
      default: "default",
    },
    members: {
      type: Array,
      required: true,
    },
    groupType: String,
    idRoomChoose: {
      type: String,
    },
    imgList: {
      type: Array,
      required: true,
    },
    fileList: {
      type: Array,
      required: true,
    },
    avatar: {
      type: String,
    }
  },
  components: {
    SettingGroup,
  },
  created() {
    socket.on("A message pinned", () => {
      this.getPinList();
    });
    socket.on("Unpinned a message", () => {
      this.getPinList();
    });

    socket.on("pin deleted", ()=>{
      this.getPinList();
    })

  },

  data() {
    let token = localStorage.getItem("jwt");
    let decoded = VueJwtDecode.decode(token);
    this.user = decoded;
    return {
      panel: [2],
      pinList: [],
      token: token,
    };
  },
  watch: {
    idRoomChoose: function (newVal, oldVal) {
      if (newVal != oldVal) this.getPinList();
    },
  },
  mounted: function () {
    let params = {
      id: this.idRoomChoose,
    };
    axios
      .post("http://localhost:8000/rooms/pins", params)
      .then((response) => {
        this.pinList = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    getPinList() {
      let params = {
        id: this.idRoomChoose,
      };
      axios
        .post("http://localhost:8000/rooms/pins", params)
        .then((response) => {
          let pinList = response.data;
          if (pinList) {
            pinList.forEach((pin) => {
              this.members.forEach((member) => {
                if (pin.sender == member.id) pin.sendUser = member.username;
              });
            });
            this.pinList = pinList;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    unPin(messageId) {
      let params = {
        username: this.user.username,
        message_id: messageId,
        room_id: this.idRoomChoose,
      };
      axios
        .post("http://localhost:8000/users/unpin", params)
        .then(() => {
          socket.emit("Unpin message", {
            room_id: this.idRoomChoose,
            message_id: messageId,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updateGroup(name) {
      this.$emit("updateGroup", name);
    },
    downloadFile(messageid) {
      window.open("http://localhost:8000/rooms/download?id="+messageid + "&jwt=" + this.token, "_blank");
    },
    
  },
};
</script>

<style></style>
