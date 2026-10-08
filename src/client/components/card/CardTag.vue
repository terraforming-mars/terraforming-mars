<template>
  <div class="card-tag" :class="`tag-${type}`"></div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import {Tag} from '@/common/cards/Tag';

export default defineComponent({
  name: 'CardTag',
  props: {
    index: {
      type: Number,
      required: true,
      validator: (i: number) => i < 4,
    },
    type: {
      type: String,
      required: true,
      validator: (type: Tag | 'asterisk') => type === 'asterisk' || Object.values(Tag).includes(type),
    },
  },
});

</script>
