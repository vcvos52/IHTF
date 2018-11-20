<template>
    <b-row id="choice">
        <b-col>
            <b-card title="Donate a Meal!"
                      :img-src="require('../assets/donate.png')"
                      img-alt="Image"
                      img-top
                      tag="article"
                      class="card">
                <p class="card-text">
                  Give someone a meal you don't need!
                </p>
                <b-form @submit.prevent="chooseDonate">
                    <b-button type="submit" class="button">Donate</b-button>
                </b-form>
            </b-card>
        </b-col>
        <b-col>
            <b-card title="Receive a Meal!"
                      :img-src="require('../assets/receive.jpg')"
                      img-alt="Image"
                      img-top
                      tag="article"
                      class="card">
                <p class="card-text">
                  Give someone a meal you don't need!
                </p>
                <b-form @submit.prevent="chooseReceive">
                    <b-button type="submit" class="button">Receive</b-button>
                </b-form>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
import { eventBus } from "../main";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

export default {
  name: "Choice",

  data() {
    return {};
  },

  methods: {
    chooseDonate() {
      eventBus.$emit("update-action", "donate");
    },

    chooseReceive() {
      eventBus.$emit("update-action", "receive");
    }
  }
};
</script>

<style scoped>
#choice {
  text-align: center;
}
</style>