<template>
  <div>
    <div v-for="(warning, idx) in (warnings || [])" :key="idx" class="card-warning">
      {{ $t(descriptions[warning]) }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Warning} from '@/common/cards/Warning';

const descriptions: Record<Warning, string> = {
  'maxtemp': 'Note: the temperature is already at its goal.',
  'maxoceans': 'Note: all oceans are already on the board.',
  'maxvenus': 'Note: Venus scale is already at its goal.',
  'buildOnLuna': 'You will only be able to build the colony on Luna.',
};

export default Vue.extend({
  name: 'WarningsComponent',
  props: {
    warnings: {
      type: Object as () => Array<Warning> | undefined,
      required: true,
    },
  },
  computed: {
    descriptions(): typeof descriptions {
      return descriptions;
    },
  },
});
</script>
