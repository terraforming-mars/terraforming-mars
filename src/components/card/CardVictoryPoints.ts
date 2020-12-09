import Vue from 'vue';
import {CardRenderDynamicVictoryPoints} from '../../cards/render/CardRenderDynamicVictoryPoints';
import {CardRenderItemComponent} from './CardRenderItemComponent';

export const CardVictoryPoints = Vue.component('CardPoints', {
  props: {
    victoryPoints: {
      required: true,
    },
  },
  components: {
    CardRenderItemComponent,
  },
  methods: {
    getClasses: function(): string {
      const classes: string[] = ['card-points'];
      if (this.isObject()) {
        const item = <CardRenderDynamicVictoryPoints> this.victoryPoints;
        if (item.anyPlayer) {
          classes.push('card-points-big');
          classes.push('red-outline');
        } else {
          classes.push('card-points-normal');
        }
      } else {
        classes.push('card-points-big');
      }
      return classes.join(' ');
    },
    isObject: function(): boolean {
      return this.victoryPoints instanceof CardRenderDynamicVictoryPoints;
    },
  },
  template: `
      <div v-if="isObject()" :class="getClasses()"><div>{{ this.victoryPoints.getPointsHtml() }}</div><CardRenderItemComponent v-if="this.victoryPoints.item !== undefined" :item="this.victoryPoints.item" /></div>
      <div v-else :class="getClasses()">{{ this.victoryPoints }}</div>
    `,
});
