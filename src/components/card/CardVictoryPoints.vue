<template>
  <div v-if="isObject() && !this.victoryPoints.targetOneOrMore" :class="getClasses()">
        <div>{{ this.victoryPoints.getPointsHtml() }}</div><CardRenderItemComponent v-if="this.victoryPoints.item !== undefined" :item="this.victoryPoints.item" /></div>
      <div v-else-if="isObject() && this.victoryPoints.targetOneOrMore" :class="getClasses()">
        <div class="card-points-item-first"><CardRenderItemComponent v-if="this.victoryPoints.item !== undefined" :item="this.victoryPoints.item" />*:3</div>
      </div>
      <div v-else :class="getClasses()">{{ this.victoryPoints }}</div>
</template>

<script lang="ts">
import Vue from 'vue';
import {CardRenderDynamicVictoryPoints} from '../../cards/render/CardRenderDynamicVictoryPoints';
import CardRenderItemComponent from './CardRenderItemComponent.vue';

export default Vue.extend({
  name: 'CardVictoryPoints',
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
});
</script>

<style lang="less" scoped>
</style>
