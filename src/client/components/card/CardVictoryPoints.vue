<template>
  <div v-if="isObject(victoryPoints)" :class="getClasses()">
    <template v-if="!victoryPoints.targetOneOrMore">
      <div>{{ points() }}</div>
      <CardRenderItemComponent v-if="victoryPoints.item !== undefined" :item="victoryPoints.item" data-test="item"/>
    </template>
    <template v-else>
      <div class="card-points-item-first">
        <CardRenderItemComponent v-if="victoryPoints.item !== undefined" :item="victoryPoints.item" data-test="item"/>
        *:3
      </div>
    </template>
  </div>
  <div v-else :class="getClasses()">{{ victoryPoints }}</div>
</template>

<script lang="ts">

import Vue from 'vue';
import {ICardRenderDynamicVictoryPoints} from '@/common/cards/render/ICardRenderDynamicVictoryPoints';
import CardRenderItemComponent from '@/client/components/card/CardRenderItemComponent.vue';

export default Vue.extend({
  name: 'CardVictoryPoints',
  props: {
    victoryPoints: {
      type: [Number, Object as () => ICardRenderDynamicVictoryPoints],
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
    isObject(item: any): item is ICardRenderDynamicVictoryPoints {
      return item.points !== undefined;
    },
    points(): string {
      if (!this.isObject(this.victoryPoints)) return '';
      const vps = this.victoryPoints;
      if (vps.item === undefined && vps.points === 0 && vps.target === 0) return '?';
      if (vps.item === undefined) return `${vps.points}`;
      if (vps.target === vps.points || vps.target === 1) return `${vps.points}/`;
      return `${vps.points}/${vps.target}`;
    },
  },
});

</script>

