<template>
  <div class="card-tags">
    <CardTag v-for="(cardTag, index) in tags" :key="index" :index="index" :type="cardTag"/>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import CardTag from '@/client/components/card/CardTag.vue';
import {Tags} from '@/cards/Tags';

export default Vue.extend({
  name: 'CardTags',
  props: {
    tags: Array as () => Array<Tags>,
  },
  components: {
    CardTag,
  },
});

</script>

