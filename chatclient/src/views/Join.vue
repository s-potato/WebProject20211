<template>
  <div>Loading.....</div>
</template>

<script>
  import axios from 'axios';
  import VueJwtDecode from "vue-jwt-decode";

  export default {
    name: 'join',
    data () {
        let token = localStorage.getItem("jwt");
        let decoded = VueJwtDecode.decode(token);
        this.user = decoded;
        return{
            displayname: "",
            user: decoded,
            token: token
        }
    },
    mounted: function() {
      let params = {
        username: this.user.username,
        key: this.$route.params.id,
        jwt: this.token
      }
      axios.post(process.env.VUE_APP_SERVER_ADDRESS+"/rooms/joinwithkey", params)
        .then(()=>{
          this.$router.push('/');
        })
    } 
  }
</script>
