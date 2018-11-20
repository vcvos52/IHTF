<template>
    <b-row>
        <b-col>
            <b-card title="Donate a Meal!"
                      img-src="https://picsum.photos/600/300/?image=25"
                      img-alt="Image"
                      img-top
                      tag="article"
                      class="mb-2">
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
                      img-src="https://picsum.photos/600/300/?image=25"
                      img-alt="Image"
                      img-top
                      tag="article"
                      class="mb-2">
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

<style lang="css" scoped>
</style>