<template>
  <span v-if="expectedPurgeTimeMs != 0">
    <div v-if="hoursLeft < 48" class="general-warning">
      Warning: This game will be purged in approximately {{Math.floor(hoursLeft)}} hours.
    </div>
    <div v-else>
      Warning: This server automatically purges unfinished games. Try to complete this game by {{ purgeTime }}.
    </div>
  </span>
      <!-- <label class="label label-error">{{ $t(warning) }}</label> -->


</template>
<script lang="ts">
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
  },
});
</script>
