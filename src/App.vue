<template>
  <b-container fluid id="app">
    <b-row :no-gutters="true" id="nav">
      <b-col lg="12"> 
      <h2 @click='goHome' id="home-button">
          Welcome to I Have This Food!
      </h2>
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

    <b-row>
      <b-col id="copyrights">
        Made by Surf the High C's
      </b-col>
    </b-row>
  </b-container>
</template>


<script>
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
      logged: true
    };
  },

  // adds the reactive aspect to the app. Every time the currentAction changes,
  // the app will change (read by this eventBus)
  created: function() {
    eventBus.$on("update-action", res => {
      this.currentAction = res;
    });
    eventBus.$on("login-action", () => {
      this.logged = true;
    });
    eventBus.$on("logout-action", () => {
      this.logged = false;
    });
  },

  methods: {
    goHome: function() {
      eventBus.$emit("update-action", "choice");
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
