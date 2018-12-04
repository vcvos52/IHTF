<template>
  <b-col lg="12" id="login">
    <form class="component" v-on:submit.prevent="login" method="post">
      <h4>Login with your Kerberos or Certificates!</h4>

      <input type="submit" value="Login" class="button">

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
      error: "",
      kerberos: "",
      client_id: "ab2aab03-b1aa-4fda-aa27-518b9b5c05e5",
      client_secret:
        "AJakB9Zn_Tosrn306Op1flIZ0vBCweBdbkFq5V7g4OjIbnEZ2aa0d21voitKYSBHyAEdmT_WMiAL5kvZnUcLQc4",
      registration_access_token:
        "eyJhbGciOiJSUzI1NiJ9.eyJhdWQiOlsiYWIyYWFiMDMtYjFhYS00ZmRhLWFhMjctNTE4YjliNWMwNWU1Il0sImlzcyI6Imh0dHBzOlwvXC9vaWRjLm1pdC5lZHVcLyIsImp0aSI6ImZiZmZmNTc1LTdkMGYtNDlmMC1iNzJhLTFlNTBiOWRmMjI1MCIsImlhdCI6MTU0MjY1ODczMH0.JPqggez-nVf98_fGzkZPi1qAfGFHhq2F0yN24LhkgRdTFCDAzTREfj9t34G3bl_OS9WduWBRegF-QT9h5dOmZ7ULKyVidmTIiajhKPC-Ll3AFkpdn_UhUwWTHmow66KeOVzlA-nEmz-j-DBefFHOb7ibDPyaZBsLvqQdNMdHnKXEHatWoqTIT6Zu1UlosDfgHrGoJCkK7OY8lUBYbPWZGVvnsxgvi20wXfKqcX4APF12z9FIIVY-RRxVyrVmY9-y27ngG41wLYV96zQXn7jf4Mbz_h6JU-oJyER_BugGJV_x7dm2GxNucj96KpU6wQgWChdvbEJPEMrZi_yDNQU3CA",
      client_config_url:
        "https://oidc.mit.edu/register/ab2aab03-b1aa-4fda-aa27-518b9b5c05e5"
    };
  },

  methods: {
    //OpenID Connect login
    login: async function() {
      // resetting variables
      this.error = "";
      // OpenID Connect
      // Step 1: Redirecting to Authorize
      let response_type = "response_type=code";
      let scope = "scope=openid%20email";
      let redirect_url = "redirect_url=localhost%3A3000"; //https%3A%2F%2Fihtf.herokuapp.com
      let state = "state=g5afc5n89"; //used to mitigate csrf or xsrf attacks
      let queryParams =
        "?client_id=" +
        this.client_id +
        "&" +
        response_type +
        "&" +
        scope +
        "&" +
        redirect_url +
        "&" +
        state;
      // redirecting QUESTION: hide parameters? AND localhost:3000?
      console.log(queryParams);
      window.location = " https://oidc.mit.edu/authorize" + queryParams;

      // Step 2: catch redirection from /autorize and parse code and state
      // QUESTION: await?
      // TODO
      let authorization_code = "";
      let stateReturned = "";

      // Check if state is equal to before
      if (state.substring(7) !== stateReturned) {
        this.error = "Could not validate state.";
        return;
      }

      // Step 3: HTTP Post to Token Endpoint
      axios({
        method: "post",
        url: "https://oidc.mit.edu/token",
        auth: {
          username: this.client_id,
          password: this.client_secret
        },
        body: {
          grant_type: "authorization_code",
          code: authorization_code,
          redirect_url: "localhost:3000" // https://ihtf.herokuapp.com -> URL encode?
        }
      })
        .then(res => {
          // Step 4: Parse and Validate the ID Token
          console.log(res);
          parsedJson = JSON.parse(res);
          // check that id_token and scope are there.
          if (parsedJson.id_token === undefined) {
            this.error = "Id_token missing";
            return;
          } else if (parsedJson.scope === undefined) {
            this.error = "Scope missing";
            return;
          } else if (parsedJson.email === undefined) {
            this.error = "User did not grant access to scope for email";
            return;
          }
          let [header, body, signature] = parsedJson.id_token.split(".");

          // Step 5: Validate signature on ID token using JWS
          // TODO

          // Step 6: Get user info through Bearer Token from access_token
          axios({
            method: "get",
            url: "https://oidc.mit.edu/userinfo",
            auth: "" // TODO Bearer Token
          })
            .then(res => {
              parsedInfo = JSON.parse(res);
              let email = parsedInfo.email;
              kerberos = email.substring(0, email.length - 8);
              // Step 7: Sign in the app!
              axios
                .post(`/api/users/${this.kerberos}`)
                .then(() => {
                  eventBus.$emit("login-action");
                })
                .catch(err => {
                  this.error = err.response.data;
                });
            })
            .catch(err => {
              this.error = err.data;
            });
        })
        .catch(err => {
          this.error = err.data;
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
