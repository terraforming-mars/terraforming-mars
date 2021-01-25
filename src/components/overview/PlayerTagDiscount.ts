import Vue from 'vue';

export const PlayerTagDiscount = Vue.component('PlayerTagDiscount', {
  props: {
    amount: {
      type: Number,
    },
  },
  methods: {
    getClasses: function(): string {
      const classes = ['player-tag-discount'];
      return classes.join(' ');
    },
  },
  template: `
    <div :class="getClasses()">
      {{ amount }}    
    </div>
  `,
});
