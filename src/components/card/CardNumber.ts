import Vue from 'vue';
import {PreferencesManager} from '../PreferencesManager';

export const CardNumber = Vue.component('CardNumber', {
  props: {
    number: {
      type: String,
      required: true,
    },
  },
  methods: {
    showCardNumber: function(): boolean {
      return PreferencesManager.load('show_card_number') === '1';
    },
  },
  template: `
        <div class="card-nr-outer"><span class="card-nr-inner" v-if="showCardNumber()">{{ number }}</span></div>
    `,
});
