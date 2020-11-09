import Vue from 'vue';
import {CardRowComponent} from './CardRowComponent';

export const CardRowData = Vue.component('CardRowData', {
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  components: {
    CardRowComponent,
  },
  template: `
        <div class="card-row">
            <CardRowComponent v-for="(componentData, i) in data" :data="componentData" :key="i" />
        </div>
    `,
});
