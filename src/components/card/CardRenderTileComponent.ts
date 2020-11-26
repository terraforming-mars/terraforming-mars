import Vue from 'vue';
import {CardRenderTile} from '../../cards/render/CardRenderer';
import {generateClassString} from '../../utils/utils';
import {TileType} from '../../TileType';

export const CardRenderTileComponent = Vue.component('CardRenderTileComponent', {
  props: {
    item: {
      type: Object as () => CardRenderTile,
      required: true,
    },
  },
  methods: {
    getClasses: function(): string {
      const classes: string[] = ['card-tile'];
      if (this.item.tile === TileType.BIOFERTILIZER_FACILITY) {
        classes.push('card-special-tile--M');
        classes.push('card-biofertilizer_facility--M');
      }
      return generateClassString(classes);
    },
  },
  template: `
    <div :class="getClasses()"></div>
  `,
});
