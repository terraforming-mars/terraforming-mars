import Vue from 'vue';
import {CardRowComponent} from './CardRowComponent';

export const CardRowData = Vue.component('CardRowData', {
  props: {
    rowData: {
      type: Array,
      required: true,
    },
  },
  components: {
    CardRowComponent,
  },
  template: `
        <div class="card-row">
            <CardRowComponent v-for="(componentData, i) in rowData" :componentData="componentData" :key="i" />
        </div>
    `,
});
