<template>
  <div class="card-tags">
            <CardTag v-for="(cardTag, index) in tags" :key="index" :index="index" :type="cardTag"/>
        </div>
</template>

<script lang="ts">
import Vue from 'vue';
import CardTag from './CardTag.vue';

export default Vue.extend({
  name: 'CardTags',
  props: {
    tags: Array,
  },
  components: {
    CardTag,
  },
});
</script>

<style lang="less" scoped>
</style>
