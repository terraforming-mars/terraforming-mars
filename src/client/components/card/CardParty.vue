<template>
  <div class="card-party">
  <span :class="classes"></span>
  </div>
</template>

<script lang="ts">

import {defineComponent} from '@/client/vue3-compat';

export default defineComponent({
  name: 'CardParty',
  props: {
    party: {
      required: true,
      type: String,
    },
    size: {
      required: false,
      default: 'card',
      type: String as () => 'card' | 'req',
    },
  },
  computed: {
    classes(): string {
      const p = this.party.toLowerCase().replace(' ', '-');
      const suffix = this.size === 'req' ? '-req' : '';
      return `card-party--${p}${suffix}`;
    },
  },
});

</script>

