import Vue from 'vue';
import {CardMetadata} from '../../cards/CardMetadata';
import {CardRequirementsComponent} from './CardRequirementsComponent';
import {CardVictoryPoints} from './CardVictoryPoints';
import {CardDescription} from './CardDescription';
import {CardRenderData} from "./CardRenderData";

export const CardContent = Vue.component('CardContent', {
  props: {
    metadata: {
      type: Object as () => CardMetadata,
      required: true,
    },
  },
  components: {
    CardRequirementsComponent,
    CardVictoryPoints,
    CardDescription,
    CardRenderData
  },
  methods: {
    getClasses: function(): string {
      const classes: Array<string> = ['card-content'];
      return classes.join(' ');
    },
  },
  template: `
        <div :class="getClasses()">
            <CardRequirementsComponent v-if="metadata.requirements !== undefined" :requirements="metadata.requirements"/>
            <CardRenderData v-if="metadata.renderData !== undefined" :data="metadata.renderData" />
            <CardDescription v-if="metadata.description !== undefined" :text="metadata.description" />
            <CardVictoryPoints v-if="metadata.victoryPoints !== undefined" :amount="metadata.victoryPoints" />
        </div>
    `,
});
