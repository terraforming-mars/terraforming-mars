import Vue from 'vue';
import {Card} from './../card/Card';
import {CardName} from './../../CardName';

export const HelpStandardProjects = Vue.component('help-standard-projects', {
  components: {
    Card,
  },
  methods: {
    getStandardProjects: () => [
      CardName.SELL_PATENTS_STANDARD_PROJECT,
      CardName.POWER_PLANT_STANDARD_PROJECT,
      CardName.ASTEROID_STANDARD_PROJECT,
      CardName.AQUIFER_STANDARD_PROJECT,
      CardName.GREENERY_STANDARD_PROJECT,
      CardName.CITY_STANDARD_PROJECT,
      CardName.AIR_SCRAPPING_STANDARD_PROJECT,
      CardName.BUFFER_GAS_STANDARD_PROJECT,
      CardName.MOON_COLONY_STANDARD_PROJECT,
      CardName.MOON_MINE_STANDARD_PROJECT,
      CardName.MOON_ROAD_STANDARD_PROJECT,
    ],
  },
  template: `
    <div class="help-standard-projects-container">
      <div class="cardbox" v-for="card in getStandardProjects()">
        <Card :card="{'name': card}" />
      </div>
    </div>
    `,
});
