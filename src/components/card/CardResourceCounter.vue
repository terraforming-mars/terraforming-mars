import Vue from 'vue';
export const CardResourceCounter = Vue.component('CardResourceCounter', {
  props: {
    amount: {
      type: Number,
      required: true,
    },
  },
  template: `
        <div class="card-resources-counter">
            <span class="card-resources-counter-label">res:</span><span class="card-resources-counter-number"> {{ amount }}</span>
        </div>
    `,
});
