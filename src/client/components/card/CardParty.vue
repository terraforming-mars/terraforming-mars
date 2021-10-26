<template>
  <div class="card-party">
  <span :class="getClasses()"></span>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {generateClassString} from '@/utils/utils';

export default Vue.extend({
  name: 'CardParty',
  props: {
    party: {
      required: true,
      type: String,
    },
  },
  methods: {
    getClasses(): string {
      const classes: string[] = ['card-description', 'card-party--' + this.party.toLowerCase().replace(' ', '-')];
      return generateClassString(classes);
    },
  },
});

</script>

