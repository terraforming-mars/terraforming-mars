<template>
  <div class="card-resources-counter">
            <span class="card-resources-counter-label">res:</span><span class="card-resources-counter-number"> {{ amount }}</span>
        </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'CardResourceCounter',
  props: {
    amount: {
      type: Number,
      required: true,
    },
  },
});
</script>

<style lang="less" scoped>
</style>
