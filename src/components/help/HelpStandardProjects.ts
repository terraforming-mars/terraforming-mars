import Vue from 'vue';
import {Card} from './../card/Card';
import {CardName} from './../../CardName';

export const HelpStandardProjects = Vue.component('help-standard-projects', {
  components: {
    Card,
  },
  methods: {
    getOfficialStandardProjectCards: function(): Array<string> {
      const projectList = [];
      projectList.push(CardName.SELL_PATENTS_STANDARD_PROJECT);
      projectList.push(CardName.POWER_PLANT_STANDARD_PROJECT);
      projectList.push(CardName.ASTEROID_STANDARD_PROJECT);
      projectList.push(CardName.AQUIFER_STANDARD_PROJECT);
      projectList.push(CardName.GREENERY_STANDARD_PROJECT);
      projectList.push(CardName.CITY_STANDARD_PROJECT);
      projectList.push(CardName.AIR_SCRAPPING_STANDARD_PROJECT);
      projectList.push(CardName.BUFFER_GAS_STANDARD_PROJECT);
      return projectList;
    },
  },
  template: `
    <div class="help-page-standard-projects">
      <div class="cardbox" v-for="card in getOfficialStandardProjectCards()">
        <Card :card="{'name': card}" />
      </div>
    </div>
    `,
});
