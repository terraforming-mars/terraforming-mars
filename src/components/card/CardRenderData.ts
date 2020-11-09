import Vue from 'vue';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {CardRowData} from './CardRowData';

export const CardRenderData = Vue.component('CardRenderData', {
  props: {
    data: {
      type: Object as () => CardRenderer,
      required: true,
    },
  },
  components: {
    CardRowData,
  },
  template: `
        <div class="card-rows">
            <CardRowData v-for="(cardData, i) in data.rows" :data="cardData" :key="i" />
        </div>
    `,
});
