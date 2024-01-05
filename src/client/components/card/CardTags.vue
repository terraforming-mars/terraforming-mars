<template>
  <div class="card-tags">
    <template v-if="tags.length <= 4">
      <CardTag v-for="(cardTag, index) in tags" :key="index" :index="index" :type="cardTag"/>
    </template>
    <template v-else>
      <CardTag :key="0" :index="0" type="asterisk"/>
    </template>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import CardTag from '@/client/components/card/CardTag.vue';
import {Tag} from '@/common/cards/Tag';

export default Vue.extend({
  name: 'CardTags',
  props: {
    tags: Array as () => Array<Tag>,
  },
  components: {
    CardTag,
  },
});

</script>

