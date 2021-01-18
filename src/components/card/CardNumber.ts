import Vue from 'vue';

export const CardNumber = Vue.component('CardNumber', {
  props: {
    number: {
      type: String,
      required: true,
    },
  },
  template: `
        <div class="card-nr-outer"><span class="card-nr-inner">{{ number }}</span></div>
    `,
});
