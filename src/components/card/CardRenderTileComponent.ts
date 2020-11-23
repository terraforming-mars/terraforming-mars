import Vue from 'vue';
import {CardRenderTile} from '../../cards/render/CardRenderer';
export const CardRenderTileComponent = Vue.component('CardRenderTileComponent', {
  props: {
    item: {
      type: Object as () => CardRenderTile,
      required: true,
    },
  },
  methods: {
    getClasses: function(): string {
      return this.item.selector + ' tile';
    },
  },
  template: `
  <div class="tile special-tile">
    <div :class="getClasses()"></div>
  </div>
    `,
});
