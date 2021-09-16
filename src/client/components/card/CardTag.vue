<template>
  <div :class="getClasses()" />
</template>

<script lang="ts">

import Vue from 'vue';
import {Tags} from '@/cards/Tags';

export default Vue.extend({
  name: 'CardTag',
  props: {
    index: {
      type: Number,
      required: true,
      validator: (i) => i < 4,
    },
    type: {
      type: String,
      required: true,
      validator: (type: Tags) => Object.values(Tags).includes(type),
    },
  },
  methods: {
    getClasses(): string {
      const classes = ['card-tag'];
      classes.push(`tag-${this.type.toLocaleLowerCase()}`);

      return classes.join(' ');
    },
  },
});

</script>
