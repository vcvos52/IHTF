<template>
  <b-container fluid id="app">
    <b-row :no-gutters="true" id="nav">
      <b-col lg="12">
        <h2 @click="goHome" id="home-button">Welcome to I Have This Food!</h2>
      </b-col>
    </b-row>

    <b-row v-if="logged === false" class="not-logged">
      <Login/>
      <!-- Login is a b-col -->
    </b-row>
    <b-row v-else-if="logged === true" class="logged">
      <b-col lg="8" id="left">
        <div v-if="currentAction === 'choice'">
          <Choice></Choice>
        </div>
        <div v-else-if="currentAction === 'donate'">
          <Donate></Donate>
        </div>
        <div v-else-if="currentAction === 'receive'">
          <Receive></Receive>
        </div>
      </b-col>
      <b-col lg="4" id="right">
        <Meals></Meals>
      </b-col>
    </b-row>
    <b-row v-if="logged === true">
      <b-col/>
      <b-col lg="1">
        <button class="button" id="signout" @click="logout">Log Out</button>
        <div v-if="error" class="error-message">
          <b>{{error}}</b>
        </div>
      </b-col>
      <b-col/>
    </b-row>
    <b-row>
      <b-col id="copyrights">Made by Surf the High C's</b-col>
    </b-row>
  </b-container>
</template>


<script>
import axios from "axios";
import { eventBus } from "./main";
import Login from "./components/Login";
import Meals from "./components/Meals";
import Choice from "./components/Choice";
import Donate from "./components/Donate";
import Receive from "./components/Receive";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

export default {
  name: "app",

  components: {
    Login,
    Meals,
    Choice,
    Donate,
    Receive
  },

  data() {
    return {
      currentAction: "choice",
      logged: false,
      error: ""
    };
  },

  // adds the reactive aspect to the app. Every time the currentAction changes,
  // the app will change (read by this eventBus). Makes an initial axios call
  // to session to see if authentication was confirmed.
  created: async function() {
    eventBus.$on("update-action", res => {
      this.currentAction = res;
      axios.post(`/api/requests/setAction/${res}`);
    });
    eventBus.$on("login-action", () => {
      this.logged = true;
    });
    eventBus.$on("logout-action", () => {
      this.logged = false;
    });

    /**
     * Checks if the user is currently signed in
     * This decided what HTML elements to render
     */
    axios
      .get("/api/users/isSignedIn")
      .then(() => {
        this.logged = true;
      })
      .catch(res => {
        this.isSignedIn = false;
      });

    /**
     * Checks if the user is currently signed in
     * This decided what HTML elements to render
     */
    axios
      .get("/api/requests/getAction")
      .then(res => {
        this.currentAction = res.data;
      })
      .catch(res => {
        this.currentAction = "choice";
      });
  },

  mounted: async function() {
    // checks if user has logged in via OpenId Connect
    await axios
      .get("/api/users/session")
      .then(res => {
        if (res.status === 200) {
          this.logged = true;
        } else {
          this.logged = false;
        }
      })
      .catch(err => {
        this.error = err;
      });
  },

  methods: {
    goHome: function() {
      var choice = "choice";
      this.currentAction = choice;
      axios.post(`/api/requests/setAction/${choice}`);
    },

    logout: function() {
      this.error = "";
      axios
        .put("/api/users/logout")
        .then(() => {
          this.logged = false;
        })
        .catch(err => {
          this.error = err.response.data;
        });
    }
  }
};
</script>


<style>
* {
  background-color: #ffebaf;
}

#app {
  font-family: "Pacifico", cursive;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 0;
}

#nav h2 {
  color: white;
  background-color: #f1b101;
  margin: 0;
  padding: 10px;
  text-align: center;
}

#copyrights {
  font-family: "Pacifico", sans-serif;
  font-size: 100%;
  text-align: center;
  padding-bottom: 5px;
  border-top: 1px solid black;
  width: 100%;
  position: fixed;
  bottom: 0;
}

.button {
  margin-top: 10px;
  background-color: #f1b101;
}

#home-button:hover {
  background-color: #ffbb00;
  cursor: pointer;
}

input {
  outline: 0;
  margin-left: 10px;
  background-color: white;
}

#signout {
  margin-top: 50px;
  margin-bottom: 50px;
  font-size: 80%;
}

#signout:hover {
  cursor: pointer;
  background-color: #ffbb00;
}

.success-message {
  padding: 30px;
  color: green;
}

.error-message {
  padding: 30px;
  color: red;
}

.logged,
.not-logged {
  font-family: "EB Garamond", serif;
  padding-top: 40px;
}

#left {
  padding-left: 50px;
  padding-right: 50px;
  border-right: 1px solid black;
}

#right {
  padding-left: 50px;
  padding-right: 50px;
  border-right: 1px solid black;
  padding-bottom: 50px;
}

.preset {
  margin: 5px;
}

.multi-select,
.date {
  background-color: white;
  margin: 10px;
}

p {
  margin: 0;
  padding-bottom: 0;
  padding-top: 20px;
}

option {
  background-color: white;
}

.card {
  border-color: black;
}
</style>
