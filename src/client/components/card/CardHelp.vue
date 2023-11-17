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
      // TODO(kberg): use replaceAll when upgrading browser version.
      const anchor = this.name.toLowerCase().split(' ').join('-');
      return 'https://github.com/terraforming-mars/terraforming-mars/wiki/Card-Details#' + anchor;
    },
  },
});

</script>
