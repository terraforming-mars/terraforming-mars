import Vue from 'vue';
import {Resources} from '../../Resources';

export const PlayerResource = Vue.component('player-resource', {
  props: {
    type: {
      type: Object as () => Resources,
    },
    count: {
      type: Number,
    },
    production: {
      type: Number,
    },
  },
  data: function() {
    return {};
  },
  methods: {
    mainCSS: function(): string {
      return 'resource_item--' + this.type;
    },
    iconCSS: function(): string {
      return 'resource_icon--' + this.type;
    },
    productionSign: function(): string {
      if (this.production > 0) return '+';
      return '';
    },
  },
  template: `
        <div class="resource_item" :class="mainCSS()">
            <div class="resource_item_stock">
                <i class="resource_icon" :class="iconCSS()"></i>
                <div class="resource_item_stock_count">{{ count }}</div>
            </div>
            <div class="resource_item_prod">
                <span class="resource_item_prod_count">{{ productionSign() }}{{ production }}</span>
            </div>
        </div>
    `,
});
