<template>
  <b-row>
    <b-col>
      <b-row>
        <b-col align="center" id="title">
          <h3>Upcoming Meals</h3>
        </b-col>
      </b-row>
      <b-row v-for="meal in meals">
        <b-col>
          <b-card class="card">
            <button
              type="button"
              class="close"
              aria-label="Close"
              v-on:click.prevent="deleteMeal(meal.id)"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            Meet {{meal.otherPerson}} at {{meal.time}} on {{meal.day}}, in {{meal.diningHall}}!
          </b-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col align="center" id="title">
          <h3>Pending Requests</h3>
        </b-col>
      </b-row>
      <b-row v-for="request in requests">
        <b-col>
          <b-card class="card">
            <button
              type="button"
              class="close"
              aria-label="Close"
              v-on:click.prevent="deleteRequest(request.id)"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            Request type: {{request.type}}
            <br>
            Dining Halls: {{request.diningHalls}}
            <br>
            Day: {{request.day}}
            <br>
            Times: {{request.intervals}}!
          </b-card>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
/* eslint-disable */
import axios from "axios";
import { eventBus } from "../main";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

export default {
  name: "Meals",

  data() {
    return {
      meals: [],
      requests: []
    };
  },

  methods: {
    loadMeals() {
      axios
        .get(`/api/users/matches`)
        .then(res => {
          this.meals = res.data;
        })
        .catch()
        .then();
    },
    loadRequests() {
      axios
        .get(`/api/users/requests`)
        .then(res => {
          this.requests = res.data;
        })
        .catch()
        .then();
    },
    deleteMeal(id) {
      console.log(id);
    },
    deleteRequest(id) {
      console.log(id);
    }
  },

  created: function() {
    this.loadMeals();
    this.loadRequests();
    setInterval(() => {
      this.loadMeals();
    }, 3000);
    eventBus.$on("refresh-requests", () => {
      this.loadRequests();
    });
  }
};
</script>

<style scoped>
#title {
  padding-bottom: 10px;
  padding-top: 15px;
}
</style>

