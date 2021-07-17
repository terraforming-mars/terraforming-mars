import Vue from 'vue';
import {Card} from './card/Card';
import {CardModel} from '../models/CardModel';

export const StackedCards = Vue.component('stacked-cards', {
  props: {
    cards: {
      type: Array as () => Array<CardModel>,
    },
  },
  components: {
    Card,
  },
  methods: {
  },
  template: `
    <div class="cardbox">
        <div v-for="(card, index) in cards" :key="card.name" :class="{'cards-stack':(index > 0),'cards-stack-first':(index === 0) }">
            <Card :card="card" />
        </div>
    </div>
    `,
});
