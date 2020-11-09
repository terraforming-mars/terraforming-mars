import Vue from 'vue';

export const CardNumber = Vue.component('CardNumber', {
  props: {
    number: {
      type: String,
      required: true,
    },
  },
  template: `
        <div class="card-nr">#{{ number }}</div>
    `,
});
