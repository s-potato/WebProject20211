<template>
  <q-page>
    <q-toolbar dense class="bg-purple text-white toolbal">
        <q-avatar >
          <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
        </q-avatar>
        <q-toolbar-title> rapxiec </q-toolbar-title>
        <q-btn flat round icon="call" class="q-mr-xs" />
        <q-btn flat round icon="videocam" class="q-mr-xs" />
        <q-btn flat round icon="search" class="q-mr-xs" />
        <q-btn flat round icon="more_horiz" class="q-mr-xs"/>
    </q-toolbar>
    <div class="list-group2 chatbox">
    <div >
      <q-chat-message class=" q-pr-xs text-align" label="Sunday, 19th" />
    </div>
    <div v-for="message in messages" :key="message.date">
       <q-chat-message separator
        :name="message.sender"
        avatar="https://cdn.quasar.dev/img/avatar4.jpg"
        :text="[message.message]"
        sent
        :stamp="relativeDate(message.date)"
        v-if="message.sender === this.user.username"
      />
      <q-chat-message
        :name="message.sender"
        avatar="https://cdn.quasar.dev/img/avatar3.jpg"
        :text="[message.message]"
        :stamp="relativeDate(message.date)"
        v-else
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
      @keyup.enter="send()"
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
import { formatDistance } from 'date-fns';
import moment from 'moment';


export default defineComponent({
  name: "PageIndex",
  user: {},
  data () {
    //Vue.nextTick().then( () => { console.log(this.$route.params) });
    let token = localStorage.getItem("jwt");
    let decoded = VueJwtDecode.decode(token);
    this.user = decoded;
    console.log(this.user);
    return {
      text: '',
      messages: [],
      socket: io("http://localhost:8000")
    }
  },

  methods: {
    send: function () {
      this.socket.emit("chat message", {room: "rapxiec", sender: this.user.username, message: this.text});
      this.text='';
    },
    relativeDate(value){
      return formatDistance(value, new Date())
    },
    format_date(value){
         if (value) {
           return moment(String(value)).format('hh:mm')
        }
    },
  },
  mounted: function () {
    let params = {
        name: "rapxiec"
      };
      api.post("http://localhost:8000/rooms/messages",params)
        .then(response => {
          //console.log(response);
          this.messages = response.data
          // console.log(this.messages)
        })
        .catch((err) => {
          console.log(err);
        })
      // this.socket.emit('join room', {name: "rapxiec"});
  },
  created() {
    this.socket.on('response', (data) => {
      //console.log(data);
      this.messages.push(data);
      console.log(this.messages[0]);
    })
  }
});
</script>
<style lang="scss">
.list-group2 {
  overflow: auto;
}
.toolbal{
  height: 50px;
}
.chatbox{
  width: 100%;
  height: 743px;
  margin-top: -78px;
}
</style>