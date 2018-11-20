<template>
  <div id="app">
    <div id="nav">
      <h2> Welcome to Have This Food!</h2>
    </div>
    <div v-if="logged === false">
           <Login/>
    </div>
    <div v-else-if="logged === true">
           
    </div>
    <div id="copyrights">
      Made by Surf the High C's
    </div>
  </div>
</template>


<script>
import { eventBus } from "./main";
import Login from "./components/Login";
export default {
  name: "app",

  props: {
    logged: Boolean
  },

  components: {
    Login
    // Meals,
    // Choice,
    // Donate,
    // Receive
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
  margin: 0;
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
</style>
