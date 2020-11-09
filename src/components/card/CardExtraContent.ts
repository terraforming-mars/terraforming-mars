import Vue from 'vue';
import {CardModel} from '../../models/CardModel';
import {CardName} from '../../CardName';

export const CardExtraContent = Vue.component('CardExtraContent', {
  props: {
    card: {
      type: Object,
      required: true,
    },
  },
  methods: {
    lifeFound: function(card: CardModel): boolean {
      return card.name === CardName.SEARCH_FOR_LIFE && card.resources !== undefined && card.resources > 0;
    },
  },
  template: `
        <img v-if="lifeFound(card)" class="little-green-men" src="assets/martian.png" />
    `,
});
