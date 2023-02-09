<template>
  <div :class="getClasses()" />
</template>

<script lang="ts">

import Vue from 'vue';
import {Tag} from '@/common/cards/Tag';

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
      validator: (type: Tag) => Object.values(Tag).includes(type),
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
