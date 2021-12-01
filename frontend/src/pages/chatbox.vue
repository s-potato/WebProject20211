
<template>
  <q-page class="flex">
    <div style="width: 100%" class="column">
      <q-toolbar class="bg-purple text-white">
        <q-avatar >
          <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
        </q-avatar>
        <q-toolbar-title> friend 1 </q-toolbar-title>
        <q-btn flat round icon="call" class="q-mr-xs" />
        <q-btn flat round icon="videocam" class="q-mr-xs" />
        <q-btn flat round icon="search" class="q-mr-xs" />
        <q-btn flat round icon="more_horiz" class="q-mr-xs"/>
      </q-toolbar>
    <div class="col">
      <q-chat-message class=" q-pr-xs text-align" label="Sunday, 19th" />
    </div>
    <div class="col">
      <q-chat-message
        name="me"
        avatar="https://cdn.quasar.dev/img/avatar4.jpg"
        :text="['hey, how are you?']"
        sent
        stamp="7 minutes ago"
      />
    </div>
    
    <div class="col">
      <q-chat-message
        name="Jane"
        avatar="https://cdn.quasar.dev/img/avatar3.jpg"
        :text="['doing fine, how r you?']"
        stamp="4 minutes ago"
      />
    </div>
    <div class="col" v-for="message in messages" :key="message.data.date">
       <q-chat-message
        :name="message.data.sender"
        avatar="https://cdn.quasar.dev/img/avatar4.jpg"
        :text="[message.data.message]"
        sent
        stamp="7 minutes ago"
      />
    </div>
    </div>
    <q-input
      filled
      bottom-slots
      v-model="text"
      label="Type a message..."
      counter
      maxlength="200"
      :dense="dense"
      class="bg-white absolute-bottom">
        <template v-slot:before>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/avatar4.jpg">
          </q-avatar>
        </template>

        <template v-slot:append>
          <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer" />
          <q-icon name="schedule" />
        </template>

        <template v-slot:hint>
          Field hint
        </template>

        <template v-slot:after>
          <q-btn round dense flat icon="send" @click="send()" />
        </template>
      </q-input>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { api } from "boot/axios";
import VueJwtDecode from "vue-jwt-decode";
import io from 'socket.io-client';


export default defineComponent({
  name: "PageIndex",
  user: {},
  data () {
    //Vue.nextTick().then( () => { console.log(this.$route.params) });
    let token = localStorage.getItem("jwt");
    let decoded = VueJwtDecode.decode(token);
    this.user = decoded;
    return {
      text: '',
      messages: [],
      socket: io("http://localhost:8000")
    }
  },
  methods: {
    send: function () {
      this.socket.emit("chat message", {room: "rapxiec", sender: this.user.username, message: this.text});
    },
  },
  mounted: function () {
    let params = {
        name: "rapxiec"
      };
      api.post("http://localhost:8000/rooms/messages",params)
        .then(response => {
          this.messages = response.data;
          //console.log(this.messages)
        })
        .catch((err) => {
          console.log(err);
        })
      // this.socket.emit('join room', {name: "rapxiec"});
  },
  created() {
    this.socket.on('response', (data) => {
      console.log(data);
      this.messages.push(data);
      console.log(this.messages[0].data);
    })
  }
});
</script>
