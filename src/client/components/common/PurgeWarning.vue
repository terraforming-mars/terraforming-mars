<template>
  <span v-if="expectedPurgeTimeMs != 0">
    <div :class="klass">{{ warningText }} <a href=""><span i-18n>Why?</span></a></div>
  </span>
</template>
<script lang="ts">
import {translateTextWithParams} from '@/client/directives/i18n';
import Vue from 'vue';

export default Vue.extend({
  name: 'PurgeWarning',
  props: {
    expectedPurgeTimeMs: {
      type: Number,
    },
  },
  computed: {
    hoursLeft(): number {
      const nowMs = Date.now();
      const diffMs = this.expectedPurgeTimeMs - nowMs;
      const diffh = diffMs / 3_600_000;
      return diffh;
    },
    purgeTime(): string {
      const date = new Date(this.expectedPurgeTimeMs);
      function pad(n: number): string {
        return ('0' + n).slice(-2);
      }
      return '' + date.getFullYear() + '-' + pad(date.getMonth()+1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes());
    },
    soon(): boolean {
      return this.hoursLeft < 48;
    },
    klass(): string {
      return this.soon ? 'general-warning' : '';
    },
    warningText(): string {
      if (this.soon) {
        return translateTextWithParams('Warning: This game will be purged in approximately ${0} hours.', [Math.floor(this.hoursLeft).toString()]);
      } else {
        return translateTextWithParams('Warning: This server automatically purges unfinished games. Try to complete this game by ${0}.', [this.purgeTime]);
      }
    },
  },
  methods: {
  },
});
</script>
