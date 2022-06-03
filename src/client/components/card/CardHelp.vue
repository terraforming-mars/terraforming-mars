<template>
  <div class="card-help"><a :href="url" target="_blank">?</a></div>
</template>

<script lang="ts">

import Vue from 'vue';
import {CardName} from '@/common/cards/CardName';

export default Vue.extend({
  name: 'CardHelp',
  props: {
    name: {
      type: String as () => CardName,
    },
  },
  methods: {
    getClasses(): string {
      const classes = ['card-help'];
      return classes.join(' ');
    },
  },
  computed: {
    url(): string {
      const anchor = this.name.toLowerCase().replace(' ', '-'); // 'botanical-experience';
      return 'https://github.com/terraforming-mars/terraforming-mars/wiki/Card-Details#' + anchor;
    },
  },
});

</script>
