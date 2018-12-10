<template>
  <b-row>
    <b-col></b-col>
    <b-col lg="6" id="donate">
      <b-form class="component" @submit.prevent="donateRequest">
        <h4>Donate a Meal!</h4>
        <p>
          Select the dining halls where you could meet your match.
          <a
            href="https://mit.cafebonappetit.com"
            target="_blank"
          >Here</a>
          you can find hours of operation.
          <br>(ctrl-select to select multiple):
        </p>
        <b-form-select
          multiple
          :select-size="4"
          v-model="diningHalls"
          :options="diningOptions"
          class="preset"
        />
        <p>Select the date (format: mm/dd/yyyy):</p>
        <b-form-input v-model="date" type="date" class="date"/>
        <p>Select the times in which you can donate
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
      <div v-if="wait" class="success-message">
        <b>{{wait}}</b>
      </div>
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
  name: "Donate",

  data() {
    return {
      error: "",
      success: "",
      diningHalls: [],
      hours: [],
      date: null,
      wait: "",

      diningOptions: [
        { value: "baker", text: "Baker" },
        { value: "maseeh", text: "Maseeh" },
        { value: "mccormick", text: "McCormick" },
        { value: "next", text: "Next" },
        { value: "simmons", text: "Simmons" }
      ],

      hourOptions: [
        { value: ["08:00", "08:30"], text: "8.00am - 8.30am" },
        { value: ["08:31", "09:00"], text: "8.31am - 9.00am" },
        { value: ["09:01", "09:30"], text: "9.01am - 9.30am" },
        { value: ["09:31", "10:00"], text: "9.31am - 10.00am" },
        { value: ["10:01", "10:30"], text: "10.01am - 10.30am" },
        { value: ["10:31", "11:00"], text: "10.31am - 11.00am" },
        { value: ["11:01", "11:30"], text: "11.00am - 11.30am" },
        { value: ["11:31", "12:00"], text: "11.31am - 12.00pm" },
        { value: ["12:01", "12:30"], text: "12.00pm - 12.30pm" },
        { value: ["12:31", "13:00"], text: "12.31pm - 1.00pm" },
        { value: ["17:00", "17:30"], text: "5.00pm - 5.30pm" },
        { value: ["17:31", "18:00"], text: "5.31pm - 6.00pm" },
        { value: ["18:01", "18:30"], text: "6.01pm - 6.30pm" },
        { value: ["18:31", "19:00"], text: "6.31pm - 7.00pm" },
        { value: ["19:01", "19:30"], text: "7.01pm - 7.30pm" },
        { value: ["19:31", "20:00"], text: "7.31pm - 8.00pm" },
        { value: ["20:01", "20:30"], text: "8.00pm - 8.30pm" },
        { value: ["20:31", "21:00"], text: "8.31pm - 9.00pm" },
        { value: ["21:01", "21:30"], text: "9.01pm - 9.30pm" },
        { value: ["21:31", "22:00"], text: "9.31pm - 10.00pm" },
        { value: ["22:01", "22:30"], text: "10.01pm - 10.30pm" },
        { value: ["22:31", "23:00"], text: "10.31pm - 11.00pm" },
        { value: ["23:01", "23:30"], text: "11.01pm - 11.30pm" },
        { value: ["23:31", "23:59"], text: "11.31pm - 11.59pm" }
      ]
    };
  },

  methods: {
    donateRequest() {
      if (this.date==null || this.diningHalls.length==0 || this.hours.length==0) {
        this.error = "Please fill out all fields!";
      }
      else {
        this.error = "";
        this.success = "";
        this.wait = "Please wait as donation is being made.";
        const bodyContent = {
          diningHalls: this.diningHalls,
          date: this.date,
          hours: this.hours
        };
        axios
          .post("/api/requests/donate/", bodyContent)
          .then(res => {
            console.log(this.wait);
            this.success = "Donation request made";
            alert(res.data);
            eventBus.$emit("update-action", "choice");
            eventBus.$emit("refresh-requests");
            this.wait = "";
          })
          .catch(err => {
            // this.error = err.response;
            this.wait = "";
            this.error = err.response.data.error;
          });
        }
    }
  }
};
</script>


<style scoped>
* {
  text-align: center;
}
</style>
