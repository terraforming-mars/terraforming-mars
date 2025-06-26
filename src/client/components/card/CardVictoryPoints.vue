<template>
  <div v-if="typeof victoryPoints !== 'number'" :class="classes">
    <template v-if="victoryPoints.targetOneOrMore">
       <!-- This is the Search for Life special case. -->
      <div class="card-points-item-first">
        <CardRenderItemComponent v-if="victoryPoints.item !== undefined" :item="victoryPoints.item" data-test="item"/>
        *:3
      </div>
    </template>
    <template v-else-if="victoryPoints.vermin">
      10
      <CardRenderItemComponent :item="animal"/>
      : -1/
      <CardRenderItemComponent :item="city"/>
      *
    </template>
    <template v-else>
      <div>{{ points }}</div>
      <CardRenderItemComponent v-if="victoryPoints.item !== undefined" :item="victoryPoints.item" data-test="item"/>
    </template>
    <div v-if="victoryPoints.asterisk === true">*</div>
  </div>
  <div v-else class="card-points card-points-big">{{ victoryPoints }}</div>
</template>

<script lang="ts">

import Vue from 'vue';
import CardRenderItemComponent from '@/client/components/card/CardRenderItemComponent.vue';
import {CardRenderDynamicVictoryPoints} from '@/common/cards/render/CardRenderDynamicVictoryPoints';
import {CardRenderItemType} from '@/common/cards/render/CardRenderItemType';
import {CardResource} from '@/common/CardResource';
import {ICardRenderItem} from '@/common/cards/render/Types';
import {Size} from '@/common/cards/render/Size';

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
  computed: {
    classes(): string {
      if (typeof this.victoryPoints === 'number') {
        return '';
      } else {
        const classes: string[] = ['card-points'];
        if (this.victoryPoints.vermin) {
          classes.push('card-points-normal');
          classes.push('card-points-vermin');
          classes.push('red-outline');
        } else if (this.victoryPoints.anyPlayer) {
          classes.push('card-points-big');
          classes.push('red-outline');
        } else {
          classes.push('card-points-normal');
        }
        return classes.join(' ');
      }
    },
    points(): string {
      if (typeof this.victoryPoints === 'number') {
        return '';
      }
      const vps = this.victoryPoints;
      if (vps.item === undefined && vps.points === 0 && vps.target === 0) {
        return '?';
      }
      if (vps.item === undefined) {
        return `${vps.points}`;
      }
      if (vps.target === vps.points || vps.target === 1) {
        return `${vps.points}/`;
      }
      if (vps.asFraction) {
        if (vps.target ===3 && vps.points === 1) {
          return '⅓';
        }
      }
      return `${vps.points}/${vps.target}`;
    },
    animal(): ICardRenderItem {
      return {is: 'item', type: CardRenderItemType.RESOURCE, resource: CardResource.ANIMAL, size: Size.SMALL, amount: 1};
    },
    city(): ICardRenderItem {
      return {is: 'item', type: CardRenderItemType.CITY, size: Size.SMALL, amount: 1};
    },
  },
});

</script>

