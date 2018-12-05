<template>
  <b-col lg="12" id="login">
    <form class="component" v-on:submit.prevent="login" method="post">
      <h4>Login with your Kerberos or Certificates!</h4>

      <input type="submit" value="Login" class="button">
      <div v-if="success" class="success-message">
        <b>{{success}}</b>
      </div>
      <div v-if="error" class="error-message">
        <b>{{error}}</b>
      </div>
    </form>
  </b-col>
</template>


<script>
import { eventBus } from "../main";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import axios from "axios";

export default {
  name: "Login",

  data() {
    return {
      test: true,
      success: "",
      error: "",
      kerberos: "",
      client_id: "ab2aab03-b1aa-4fda-aa27-518b9b5c05e5"
    };
  },

  methods: {
    //OpenID Connect login
    login: async function() {
      // resetting variables
      this.success = "";
      this.error = "";

      if (this.test === true) {
        this.redirect_url = "redirect_url=http://127.0.0.1:3000/logging";
      } else {
        this.redirect_url = "redirect_url=https://ihtf.herokuapp.com/logging";
      }

      // OpenID Connect
      // Step 1: Redirecting to Authorize
      let response_type = "response_type=code";
      let scope = "scope=openid%20email";
      let state = "state=g5afc5n89"; //used to mitigate csrf or xsrf attacks
      let queryParams =
        "?client_id=" +
        this.client_id +
        "&" +
        response_type +
        "&" +
        scope +
        "&" +
        this.redirect_url +
        "&" +
        state;
      // redirecting
      window.location = "https://oidc.mit.edu/authorize" + queryParams;
      this.success = "Redirecting... this may take a second";
      // Rest of the magic happens in openidconnect.js after successful autentication
    }
  },

  created: function() {
    this.error = "";
    this.sucess = "";
  },

  updated: function() {
    this.error = "";
    this.sucess = "";
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
