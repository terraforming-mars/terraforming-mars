<template>
  <div class="card-help" @click="click"><a :href="url" target="_blank">?</a></div>
</template>

<script lang="ts">

import {defineComponent} from '@/client/vue3-compat';
import {CardName} from '@/common/cards/CardName';

export default defineComponent({
  name: 'CardHelp',
  props: {
    name: {
      type: String as () => CardName,
      required: true,
    },
  },
  methods: {
    getClasses(): string {
      const classes = ['card-help'];
      return classes.join(' ');
    },
    click() {
      window.open(this.url, '_blank');
    },
  },
  computed: {
    url(): string {
      const anchor = this.name.toLowerCase().replaceAll(' ', '-');
      return 'https://github.com/terraforming-mars/terraforming-mars/wiki/Card-Details#' + anchor;
    },
  },
});

</script>
