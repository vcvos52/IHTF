<template>
  <b-row>
    <b-col></b-col>
    <b-col lg="6" id="receive">
      <b-form class="component" @submit.prevent="receiveRequest">
        <h4>Receive a Meal!</h4>
        <p>Select the dining halls at which you could meet your match
          <br>(ctrl-select to select multiple):
        </p>
        <b-form-select
          multiple
          :select-size="4"
          v-model="diningHalls"
          :options="diningOptions"
          class="preset"
        />
        <p>Select the date:</p>
        <b-form-input v-model="date" type="date" class="date"/>
        <p>Select the times in which you can receive
          <br>(ctrl-select to select multiple):
        </p>
        <b-form-select
          multiple
          :select-size="4"
          v-model="hours"
          :options="hourOptions"
          class="multi-select"
        />
        <b-button type="submit" class="button">Submit</b-button>
      </b-form>
      <div v-if="success" class="success-message">{{ success }}</div>
      <div v-if="error" class="error-message">
        <b>{{error}}</b>
      </div>
    </b-col>
    <b-col></b-col>
  </b-row>
</template>


<script>
import { eventBus } from "../main";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import axios from "axios";

export default {
  name: "Receive",

  data() {
    return {
      error: "",
      success: "",
      diningHalls: [],
      hours: [],
      date: null,

      diningOptions: [
        { value: "baker", text: "Baker" },
        { value: "maseeh", text: "Maseeh" },
        { value: "mccormick", text: "McCormick" },
        { value: "next", text: "Next" },
        { value: "simmons", text: "Simmons" }
      ],

      hourOptions: [
        { value: ["17:00", "17:30"], text: "5.00pm - 5.30pm" },
        { value: ["17:31", "18:00"], text: "5.31pm - 6.00pm" },
        { value: ["18:01", "18:30"], text: "6.01pm - 6.30pm" },
        { value: ["18:31", "19:00"], text: "6.31pm - 7.00pm" },
        { value: ["19:01", "19:30"], text: "7.01pm - 7.30pm" },
        { value: ["19:31", "20:00"], text: "7.31pm - 8.00pm" }
      ]
    };
  },

  methods: {
    receiveRequest() {
      this.error = "";
      this.success = "";
      const bodyContent = {
        diningHalls: this.diningHalls,
        date: this.date,
        hours: this.hours
      };
      axios
        .post("/api/requests/receive/", bodyContent)
        .then(res => {
          this.success = "Receive request made";
          eventBus.$emit("refresh-requests");
          eventBus.$emit("update-action", "choice");
          alert(res.data);
        })
        .catch(err => {
          this.error = err.response.data.error;
        });
    }
  }
};
</script>


<style scoped>
* {
  text-align: center;
}
</style>

