import Vue from 'vue';
import {CardMetadata} from '../../cards/CardMetadata';
import {CardRequirementsComponent} from './CardRequirementsComponent';
import {CardVictoryPoints} from './CardVictoryPoints';
import {CardDescription} from './CardDescription';
import {CardRenderData} from './CardRenderData';

export const CardContent = Vue.component('CardContent', {
  props: {
    metadata: {
      type: Object as () => CardMetadata,
      required: true,
    },
    isCorporation: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    CardRequirementsComponent,
    CardVictoryPoints,
    CardDescription,
    CardRenderData,
  },
  methods: {
    getClasses: function(): string {
      const classes: Array<string> = ['card-content'];
      if (this.isCorporation) {
        classes.push('card-content-corporation');
      }
      return classes.join(' ');
    },
  },
  template: `
        <div :class="getClasses()">
            <CardRequirementsComponent v-if="metadata.requirements !== undefined" :requirements="metadata.requirements"/>
            <CardRenderData v-if="metadata.renderData !== undefined" :renderData="metadata.renderData" />
            <CardDescription v-if="metadata.description !== undefined" :item="metadata.description" />
            <CardVictoryPoints v-if="metadata.victoryPoints !== undefined" :victoryPoints="metadata.victoryPoints" />
        </div>
    `,
});
