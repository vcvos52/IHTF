<template>
    <b-col lg="12" id=login>
        <form class="component" v-on:submit.prevent='login' method="post">
            <h4> Login with your Kerberos: </h4>
            
            <div class="short-answer">
                <label for="kerberos"> Kerberos: </label>
                <input id="kerberos" v-model="kerberos" type="text" name="kerberos">
            </div>
            
            <input type="submit" value="Login" class="button">

            <div v-if="error" class="error-message">
                <b> {{error}} </b>
            </div>
        </form>
    </b-col>
</template>


<script>
import { eventBus } from "../main";
import axios from 'axios';

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import axios from "axios";

export default {
  name: "Login",

  data() {
    return {
      error: "",
      kerberos: ""
    };
  },

  methods: {
    //handles request for login
    login: function() {
      // resetting variables
      this.error = "";
      axios
        .post("/api/users/", this.kerberos)
        .then(() => {
          eventBus.$emit("login-action");
        })
        .catch(err => {
          this.error = err.response.data.error;
        });
    }
  }
};
</script>


<style scoped>
#login {
  padding-top: 40px;
  width: 100%;
  position: fixed;
  text-align: center;
}

h4 {
  font-size: 120%;
}
</style>
