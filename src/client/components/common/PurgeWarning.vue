<template>
  <span v-if="expectedPurgeTimeMs != 0">
    <div :class="hoursLeft < 48 ? 'general-warning' : ''">
      <span v-i18n>{{translateTextWithParams('Warning: This game will be purged in approximately ${0} hours.', [Math.floor(hoursLeft).toString()])}}</span>
      <a href="https://github.com/terraforming-mars/terraforming-mars/wiki/FAQ#purge" target="_blank">
        <span v-i18n>Why?</span>
      </a>
    </div>
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
    translateTextWithParams(): typeof translateTextWithParams {
      return translateTextWithParams;
    },
  },
});
</script>
