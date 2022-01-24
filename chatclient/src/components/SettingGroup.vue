<template>
  <div>
    <v-list>
      <v-list-item>
        <v-switch
          v-model="$vuetify.theme.dark"
          inset
          label="Dark/Light Switch"
          persistent-hint
        ></v-switch>
      </v-list-item>
      <v-list-item>
        <v-dialog transition="dialog-top-transition" max-width="600">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on">
              <v-icon>mdi-cog</v-icon>
              Change Group Name
            </v-btn>
          </template>
          <template v-slot:default="dialog">
            <v-layout column>
              <v-card>
                <v-card-text>
                  <v-text-field
                    v-model="group.groupname"
                    label="New Group Name"
                  ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    color="primary"
                    @click="
                      dialog.value = false;
                      updateGroup();
                    "
                  >
                    <v-icon left dark>check</v-icon>
                    Save Changes
                  </v-btn>
                  <v-btn
                    color="primary"
                    @click="dialog.value = false"
                  >
                    <v-icon left dark>fas fa-times</v-icon>
                    Close
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-layout>
          </template>
        </v-dialog>
      </v-list-item>
      <v-list-item>
        <v-btn @click="OutGroup">
          <v-icon color="grey"> logout </v-icon>
          Leave</v-btn
        >
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import axios from "axios";
import VueJwtDecode from "vue-jwt-decode";
import socket from "../socket";

export default {
  name: "profile",
  props: {
    nameChoose: String,
    idRoomChoose: String,
  },
  data() {
    let token = localStorage.getItem("jwt");
    let decoded = VueJwtDecode.decode(token);
    this.user = decoded;
    return {
      displayname: "",
      user: decoded,
      group: {
        avatar: null,
        groupname: this.nameChoose,
      },
      token: token
    };
  },
  methods: {
    updateGroup() {
      let params = {
        id: this.idRoomChoose,
        groupname: this.group.groupname,
        jwt: this.token
      };
      axios
        .post("http://localhost:8000/rooms/updateinfo", params)
        .then(this.$emit("updateGroup", this.group.groupname))
        .catch((err) => {
          console.log(err);
        });
    },
    OutGroup() {
      let params = {
        id: this.idRoomChoose,
        username: this.user.username,
        jwt: this.token
      };
      axios
        .post("http://localhost:8000/rooms/outgroup", params)
        .then(() => {
          socket.emit("Leave room", { room_id: this.idRoomChoose });
          this.$router.go();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
