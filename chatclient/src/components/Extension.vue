<template>
  <div class="extension" v-if="groupType == 'group'">
    <!-- Groups -->
    <v-card class="text-center mt-8 mb-3" shaped>
      <v-badge bordered bottom color="green" dot offset-x="11" offset-y="13">
        <v-avatar class="mt-n7" size="60" elevation="10">
          <img src="https://cdn.vuetifyjs.com/images/lists/1.jpg" />
        </v-avatar>
      </v-badge>
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
        <v-expansion-panel-content style="overflow: auto; height:121px;"> 
          <v-list
            color="rgba(0,0,0,0)"
          >
            <v-list-item-group>
              <template v-for="(item, index) in members">
                <v-list-item
                  :key="index"
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
                        :src="item.avatar ? item.avatar : '/avatar.png'"
                      ></v-img>
                    </v-list-item-avatar>
                  </v-badge>
                  <template>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.display_name"></v-list-item-title>
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
          <h3>Setting group</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content> 
          <SettingGroup
          :nameChoose="nameChoose"
          :idRoomChoose="idRoomChoose"
          @updateGroup="updateGroup"
          ></SettingGroup>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- theme -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Theme</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content> </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- Files -->
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
                  <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- pinned messages -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Pinned Message</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content style="overflow: auto; height:181px;"> 
          <v-list three-line>
            <template v-for="(item, index) in pinList">
              <v-list-item
                :key="index"
              >
                <v-list-item-avatar>
                  <v-img :src="'https://cdn.vuetifyjs.com/images/lists/1.jpg'"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-html="item.content"></v-list-item-title>
                  <v-list-item-subtitle v-html="item.sendUser"></v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="unPin(item.id,index)">
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
      <v-badge bordered bottom color="green" dot offset-x="11" offset-y="13">
        <v-avatar class="mt-n7" size="60" elevation="10">
          <img src="https://cdn.vuetifyjs.com/images/lists/1.jpg" />
        </v-avatar>
      </v-badge>
      <v-card-title class="layout justify-center">{{
        this.nameChoose
      }}</v-card-title>
      <v-card-subtitle class="layout justify-center"
        >You chatting with {{ this.nameChoose }}</v-card-subtitle
      >
    </v-card>
    <v-expansion-panels v-model="panel" multiple>
      <!-- Nickname -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Nickname</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content> 
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- theme -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Theme</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content> </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- Files -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Files(3)</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list shaped>
            <template v-for="(item, i) in files">
                <v-list-item :key="i">
                  <v-list-item-icon>
                    <v-icon v-text="item.icon" color="green"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.text"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
            </template>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- Block -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Block</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content> </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- Pinned Message -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Pinned Message</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content style="overflow: auto; height:181px;"> 
          <v-list three-line>
            <template v-for="(item, index) in pinList">
              <v-list-item
                :key="index"
              >
                <v-list-item-avatar>
                  <v-img :src="'https://cdn.vuetifyjs.com/images/lists/1.jpg'"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-html="item.content"></v-list-item-title>
                  <v-list-item-subtitle v-html="item.sendUser"></v-list-item-subtitle>
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
import axios from 'axios';
import socket from '../socket';
import SettingGroup from './SettingGroup.vue';
export default {
  name: "extension",
  props:{
      nameChoose:{
          type: String,
          default : 'default'
      },
      members:{
        type: Array,
        required: true
      },
      groupType: String,
      idRoomChoose:{
        type: String,
      }
  },
  components: {
    SettingGroup,
  },
  created() {
    socket.on("A message pinned", () =>{ 
      this.getPinList();

    });
  socket.on("Unpinned a message",()=>{
    this.getPinList();
   });
  },

  data() {
    let token = localStorage.getItem("jwt");
    let decoded = VueJwtDecode.decode(token);
    this.user = decoded;
    return {
      panel: [2],
      files: [
        { text: "Landing_page.zip", icon: " mdi-cloud-upload" },
        { text: "Requirements.pdf", icon: " mdi-cloud-upload" },
        { text: "Uwagi.docx", icon: " mdi-cloud-upload" },
      ],
      pinList: [],
    };
  },
  watch: {
    idRoomChoose: function(newVal, oldVal) {
      if(newVal != oldVal)
        this.getPinList()
    }
  },
  methods: {
    getPinList() {
      let params = {
        id: this.idRoomChoose,
      };
      axios
        .post("http://localhost:8000/rooms/pins", params)
        .then( (response) => {
          let pinList = response.data;
          pinList.forEach(pin => {
            this.members.forEach(member => {
              if(pin.sender == member.id)
                pin.sendUser = member.username
            })
          })
          this.pinList = pinList;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    unPin(messageId,index){
      let params = {
        username: this.user.username,
        message_id: messageId,
        room_id: this.idRoomChoose,
      };
      axios
        .post("http://localhost:8000/users/unpin", params)
        .then(()=>{
            socket.emit("Unpin message", {room_id: this.idRoomChoose, message_id: messageId})
            this.pinList.splice(index,1);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updateGroup(name) {
      this.$emit('updateGroup',name);
    },
  }
};
</script>

<style></style>
