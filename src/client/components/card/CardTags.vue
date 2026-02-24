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

<script setup lang="ts">
import CardTag from '@/client/components/card/CardTag.vue';
import {Tag} from '@/common/cards/Tag';

defineProps<{
  tags: Array<Tag>;
}>();
</script>
