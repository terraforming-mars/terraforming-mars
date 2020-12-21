import Vue from 'vue';
import {CardRenderEffectBoxComponent} from './CardRenderEffectBoxComponent';
import {CardRenderEffect} from '../../cards/render/CardRenderer';

export const CardRenderCorpBoxComponent = Vue.component('CardRenderCorpBoxComponent', {
  props: {
    rows: {
      type: Array as () => Array<CardRenderEffect>,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  components: {
    CardRenderEffectBoxComponent,
  },
  methods: {
    getClasses: function(): string {
      const classes: Array<string> = ['card-corporation-box'];
      return classes.join(' ');
    },
  },
  template: `
      <div :class="getClasses()">
          <div class="card-corporation-label">{{ label }}</div>
          <CardRenderEffectBoxComponent v-for="(rowData, index) in rows" :key="index" :effectData="rowData[0]" />
      </div>
    `,
});
