<template>
    <b-row>
        <b-col>
            <b-row>
                <b-col align="center" id="title">
                    <h2>Upcoming Meals</h2>
                </b-col>
            </b-row>
            <b-row v-for="meal in meals">
                <b-col>
                    <b-card class="card">
                        Meet {{meal.otherPerson}} at {{meal.time}} in {{meal.diningHall}}!
                    </b-card>
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
/* eslint-disable */
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

export default {
  name: "Meals",

  data() {
    return {
      meals: [
        { otherPerson: "Giulio", time: "5:00PM", diningHall: "McCormick" },
        { otherPerson: "Husayn", time: "7:00PM", diningHall: "Maseeh" }
      ]
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
    }
  },

  created: function() {
    // setInterval(() => {
    //   this.loadMeals();
    // }, 3000);
  }
};
</script>

<style scoped>
#title {
  padding-bottom: 15px;
}
</style>

