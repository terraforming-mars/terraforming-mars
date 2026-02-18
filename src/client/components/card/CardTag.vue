<template>
  <div :class="getClasses()" />
</template>

<script lang="ts">

import {defineComponent} from '@/client/vue3-compat';
import {Tag} from '@/common/cards/Tag';

export default defineComponent({
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
      validator: (type: Tag | 'asterisk') => type === 'asterisk' || Object.values(Tag).includes(type),
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
