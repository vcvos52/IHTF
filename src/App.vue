<template>
  <b-container fluid id="app">
    <b-row no-gutters="true" id="nav">
      <b-col lg="12"> 
      <h2>
          Welcome to Have This Food!
      </h2>
      </b-col>
    </b-row>

    <b-row v-if="logged === false">
      <Login/>
      <!-- Login is a b-col -->
    </b-row>
    <b-row v-else-if="logged === true" class="logged">
      <div v-if="currentAction === 'choice'">
        <Choice></Choice>
      </div>
      <div v-else-if="currentAction === 'donate'">
        <Donate></Donate>
      </div>
      <div v-else-if="currentAction === 'receive'">
        <Receive></Receive>
      </div>

      <Meals></Meals>
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

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

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
      logged: false
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
  /*margin: 0;*/
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
  font-size: 70%;
  text-align: center;
  padding-bottom: 5px;
  border-top: 1px solid black;
  width: 100%;
  position: fixed;
  bottom: 0;
}

.button {
  margin-top: 10px;
}

input {
  outline: 0;
  margin-left: 10px;
  background-color: white;
}

.error-message {
  padding: 30px;
  color: red;
}
</style>
