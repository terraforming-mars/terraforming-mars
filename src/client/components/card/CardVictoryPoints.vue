<template>
  <div v-if="isObject(victoryPoints)" :class="getClasses()"> 
    <template v-if="isNotMultiple(victoryPoints)">
      <div >{{ points() }}</div>
      <CardRenderItemComponent v-if="victoryPoints.item !== undefined" :item="victoryPoints.item" data-test="item"/>
    </template>
    <template v-else-if="isMultiple(victoryPoints)">
      <div >{{ points() }}</div>
      <CardRenderItemComponent v-if="victoryPoints.item !== undefined" :item="victoryPoints.item" data-test="item"/>
      <div >{{ pointsMultiple() }}</div>
      <CardRenderItemComponent v-if="victoryPoints.item2 !== undefined" :item="victoryPoints.item2" data-test="item2"/>
    </template>
    <template v-else>
      <div class="card-points-item-first">
        <CardRenderItemComponent v-if="victoryPoints.item !== undefined" :item="victoryPoints.item" data-test="item"/>
        *:3
      </div>
    </template>
  </div>
  <div v-else :class="getClasses()" >{{ victoryPoints }}</div>
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
    isMultiple(item: any): item is ICardRenderDynamicVictoryPoints {
      return item.item2?.toString() !== undefined && !item.targetOneOrMore;
    },
    isNotMultiple(item: any): item is ICardRenderDynamicVictoryPoints {
      return item.item2?.toString() === undefined && !item.targetOneOrMore;
    },
    points(): string {
      if (!this.isObject(this.victoryPoints)) return '';
      const vps = this.victoryPoints;
      if (vps.item === undefined && vps.points === 0 && vps.target === 0) return '?';
      if (vps.item === undefined) return `${vps.points}`;
      if (vps.target === vps.points || vps.target === 1) return `${vps.points}/`;
      return `${vps.points}/${vps.target}`;
    },
    pointsMultiple(): string {
      if (!this.isObject(this.victoryPoints)) return '';
      const vps = this.victoryPoints;
      if (vps.item2 === undefined && vps.points2 === 0 && vps.target2 === 0) return '?';
      if (vps.item2 === undefined) return `${vps.points2}`;
      if (vps.target2 === vps.points2 || vps.target2 === 1) return `${vps.points2}/`;
      return `${vps.points2}/${vps.target2}`;
    },
  },
});

</script>

