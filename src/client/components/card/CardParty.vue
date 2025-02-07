<template>
  <div class="card-party">
  <span :class="classes"></span>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';

export default Vue.extend({
  name: 'CardParty',
  props: {
    party: {
      required: true,
      type: String,
    },
    size: {
      required: false,
      default: 'card',
      type: String,
    },
  },
  computed: {
    classes(): string {
      const p = this.party.toLowerCase().replace(' ', '-');
      switch (this.size) {
      case 'card':
        // TODO(kberg): remove card-description if it turns out to not be necessary.
        return 'card-description card-party--' + p;
      case 'req':
        return 'card-party--' + p + '-req';
      }
      return '';
    },
  },
});

</script>

