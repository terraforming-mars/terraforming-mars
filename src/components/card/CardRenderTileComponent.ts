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
    getOuterClasses: function(): string {
      return this.item.isAresTile ? '' : 'tile special-tile';
    },
    getInnerClasses: function(): string {
      return this.item.selector + (this.item.isAresTile ? ' ares-tile' : ' tile');
    },
  },
  template: `
  <div :class="getOuterClasses()">
    <div :class="getInnerClasses()"></div>
  </div>
    `,
});
