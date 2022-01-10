<template>
    <v-menu left bottom :offset-x="offset">
                  <template class="space1" v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on" >
                      <v-icon v-show="message.active"> fas fa-ellipsis-h</v-icon>
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

                <!-- <v-menu class="space1" left bottom :offset-x="offset">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon v-show="message.active">far fa-grin-beam</v-icon>
                    </v-btn>
                  </template>
                  <VuemojiPicker @emojiClick="handleEmojiClick" />
                </v-menu> -->
</template>
<script>
import { VuemojiPicker } from 'vuemoji-picker';
export default {
    components: {
        VuemojiPicker
    },
    methods: {
        handleEmojiClick(EmojiClickEventDetail) {
            console.log(EmojiClickEventDetail);
            this.pickEmojiShow = false;
        },
    }
}
</script>
<style scoped>

</style>
