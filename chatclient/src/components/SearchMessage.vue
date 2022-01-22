<template>
  <div>
    <v-text-field
      v-model="searchMessage"
      filled
      label="Search Here"
      append-icon="mdi-magnify"
      color="grey"
      @keyup.enter="Search"
    ></v-text-field>
    <v-list v-show="findSig" v-for="item in searchList" :key="item.message">
      <v-list-item> {{item.sender}} : {{item.message}} ({{ format_date(item.date) }})</v-list-item>
    </v-list>
  </div>
</template>

<script>
import axios from "axios";
import moment from 'moment';
export default {
  name: "SearchMessage",
  props: {
    idRoom: String,
  },
  data() {
    return {
      searchMessage: "",
      searchList: [{
        date: "",
        message: "",
        sender: ""
      }],
      findSig: false,
    };
  },
  methods: {
    Search() {
      this.findSig = true;
      let params = {
        term: this.searchMessage.trim(),
        room_id: this.idRoom,
      };
      axios
        .post("http://localhost:8000/rooms/search", params)
        .then((response) => {
          console.log(response.data);
          return (this.searchList = response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    format_date(value) {
      if (value) {
        return moment(value).format("DD/MM/Y h:mm");
      }
    },
  },
};
</script>

<style></style>
