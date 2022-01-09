<template>
  <div class="reply">
    <div><v-icon style="color:white">mdi-share</v-icon>
        Reply to {{this.message.sender}}
        <v-icon class="btn" icon clickable v-on:click="change(isReply)" >mdi-close-circle-outline</v-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: "reply",
  props: {
      isReply: Boolean,
  },
  data() {},
  methods:{
    //   change(isReply){
    //       isReply != isReply;
    //       this.$emit('changeEvent',isReply);
    //   }
  }
};
</script>

<style>
.reply{
    border: 2px solid;
    border-radius: 50px 50px 1px;
    background-color:grey;
    color: white;
}
.btn{
    background-color:grey;
    left: 666px;
    color:white;
}
</style>
