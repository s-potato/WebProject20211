<template>
    <div>
      <v-text-field
        v-model="searchMessage"
        filled
        label="Search Here"
        append-icon="mdi-magnify"
        color="grey"
        @keyup.enter = "Search"
      ></v-text-field>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'SearchMessage',
    props: {
        idRoom: String,
    },
    data() {
        return {
            searchMessage: '',
            searchList: [],
        }
    },
    methods: {
        Search() {
            let params = {
                term: this.searchMessage.trim(),
                room_id: this.idRoom
            };
            axios.post("http://localhost:8000/rooms/search",params)
            .then((response) => {
              console.log(response.data)
              return this.searchList = response.data
            })
            .catch((err) => {
                console.log(err);
            })
        },
    }
}
</script>

<style>

</style>