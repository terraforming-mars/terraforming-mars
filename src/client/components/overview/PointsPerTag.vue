<template>
  <div v-if="show" :class="cssClasses">
    {{ amount }}
  </div>
</template>

<script lang="ts">

const ONE_THIRD = 1/3;
const TWO_THIRDS = 2/3;

import Vue from 'vue';

export type Points = {
  points: number;
  halfPoints: number;
}

export default Vue.extend({
  name: 'PointsPerTag',
  props: {
    points: {
      type: Object as () => Points,
    },
  },
  computed: {
    amount(): string {
      if (this.points.halfPoints === 2) {
        // This string is particularly good for rendering fractions because it's using a specific fraction slash.
        return '2⁄2';
      }

      const points = this.points.points + (this.points.halfPoints / 2);
      const integer = Math.floor(points);
      const fraction = points - integer;
      let vulgarFraction = '';
      if (fraction === 0.5) {
        vulgarFraction = '½';
      } else if (Math.abs(fraction - ONE_THIRD) < Number.EPSILON) {
        vulgarFraction = '⅓';
      } else if (Math.abs(fraction - TWO_THIRDS) < Number.EPSILON) {
        vulgarFraction = '⅔';
      }
      return `${integer || ''}${vulgarFraction}`;
    },
    cssClasses(): string {
      if (this.points.halfPoints === 2) {
        return 'points-per-tag points-per-tag--XS';
      }
      return this.amount.length === 1 ?
        'points-per-tag' :
        'points-per-tag points-per-tag--S';
    },
    show(): boolean {
      return this.points.points !== 0 || this.points.halfPoints !== 0;
    },
  },
});
</script>
