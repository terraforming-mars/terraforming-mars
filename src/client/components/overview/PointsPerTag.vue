<template>
  <div v-if="show" :class="cssClasses">
    {{ amount }}
  </div>
</template>

<script lang="ts">

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
      } else if (Math.abs(fraction - (1/3)) < Number.EPSILON) {
        vulgarFraction = '⅓';
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
