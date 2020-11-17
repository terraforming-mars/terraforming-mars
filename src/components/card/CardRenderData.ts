import Vue from 'vue';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {CardRowData} from './CardRowData';

export const CardRenderData = Vue.component('CardRenderData', {
  props: {
    renderData: {
      type: Object as () => CardRenderer,
      required: true,
    },
  },
  components: {
    CardRowData,
  },
  template: `
        <div class="card-rows">
            <CardRowData v-for="(cardData, i) in renderData.rows" :rowData="cardData" :key="i" />
        </div>
    `,
});
