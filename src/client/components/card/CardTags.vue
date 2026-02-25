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

import {defineComponent} from '@/client/vue3-compat';
import CardTag from '@/client/components/card/CardTag.vue';
import {Tag} from '@/common/cards/Tag';

export default defineComponent({
  name: 'CardTags',
  props: {
    tags: {
      type: Array as () => Array<Tag>,
      required: true,
    },
  },
  components: {
    CardTag,
  },
});

</script>

