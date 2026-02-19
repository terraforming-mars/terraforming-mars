<template>
  <div class="player-tag-discount">
    <div class="megacredits-container">
      <div class="megacredits">-{{ amount }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from '@/client/vue3-compat';

export default defineComponent({
  name: 'PlayerTagDiscount',
  props: {
    amount: {
      type: Number,
      required: true,
    },
  },
});
</script>
