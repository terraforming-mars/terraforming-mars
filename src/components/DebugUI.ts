import Vue from 'vue';
import {Card} from './card/Card';
import {
  ALL_CORPORATION_CARD_NAMES,
  ALL_PRELUDE_CARD_NAMES,
  ALL_PROJECT_CARD_NAMES,
} from '../cards/AllCards';

export const DebugUI = Vue.component('debug-ui', {
  components: {
    Card,
  },
  data: function() {
    return {
      filterText: '',
    };
  },
  methods: {
    getAllProjectCards: function() {
      return ALL_PROJECT_CARD_NAMES.sort();
    },
    getAllCorporationCards: function() {
      return ALL_CORPORATION_CARD_NAMES.sort();
    },
    getAllPreludeCards: function() {
      return ALL_PRELUDE_CARD_NAMES.sort();
    },
    filtered: function(cardName: string): boolean {
      return (
        this.$data.filterText.length === 0 ||
                cardName
                    .toUpperCase()
                    .indexOf(this.$data.filterText.toUpperCase()) > -1
      );
    },
  },
  template: `
        <div class="debug-ui-container">
            <input class="form-input form-input-line" placeholder="filter" v-model="filterText">
            <div class="cardbox"" v-for="card in getAllProjectCards()"></div>
            <section class="debug-ui-cards-list">
                <h2>Project Cards</h2>
                <div class="cardbox"" v-for="card in getAllProjectCards()">
                    <Card v-show="filtered(card)" :card="{'name': card}" />
                </div>
            </section>
            <br>
            <section class="debug-ui-cards-list">
                <h2>Corporations</h2>
                <div class="cardbox"" v-for="card in getAllCorporationCards()">
                    <Card v-show="filtered(card)" :card="{'name': card}" />
                </div>
            </section>
            <br>
            <section class="debug-ui-cards-list">
                <h2>Preludes</h2>
                <div class="cardbox"" v-for="card in getAllPreludeCards()">
                    <Card v-show="filtered(card)" :card="{'name': card}" />
                </div>
            </section>
        </div>
    `,
});
