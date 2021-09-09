<template>
      <div v-if="isObject(victoryPoints) && !this.victoryPoints.targetOneOrMore" :class="getClasses()">
        <div>{{ this.victoryPoints.getPointsHtml() }}</div><CardRenderItemComponent v-if="this.victoryPoints.item !== undefined" :item="this.victoryPoints.item" /></div>
      <div v-else-if="isObject(victoryPoints) && this.victoryPoints.targetOneOrMore" :class="getClasses()">
        <div class="card-points-item-first"><CardRenderItemComponent v-if="this.victoryPoints.item !== undefined" :item="this.victoryPoints.item" />*:3</div>
      </div>
      <div v-else :class="getClasses()">{{ this.victoryPoints }}</div>
</template>

<script lang="ts">

import Vue from 'vue';
import {CardRenderDynamicVictoryPoints} from '@/cards/render/CardRenderDynamicVictoryPoints';
import CardRenderItemComponent from '@/components/card/CardRenderItemComponent.vue';

export default Vue.extend({
  name: 'CardVictoryPoints',
  props: {
    victoryPoints: {
      type: [Number, Object as () => CardRenderDynamicVictoryPoints],
      required: true,
    },
  },
  components: {
    CardRenderItemComponent,
  },
  methods: {
    getClasses(): string {
      const classes: string[] = ['card-points'];
      if (this.isObject(this.victoryPoints)) {
        const item = this.victoryPoints;
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
    isObject(item: any): item is CardRenderDynamicVictoryPoints {
      return item instanceof CardRenderDynamicVictoryPoints;
    },
  },
});

</script>

