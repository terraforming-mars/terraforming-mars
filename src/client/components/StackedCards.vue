<template>
    <div class="cardbox">
        <div v-for="(card, index) in cards" :key="card.name" :class="{'cards-stack':(index > 0),'cards-stack-first':(index === 0) }">
            <Card :card="card" />
        </div>
    </div>
</template>

<script lang="ts">

import {defineComponent} from '@/client/vue3-compat';
import Card from '@/client/components/card/Card.vue';
import {CardModel} from '@/common/models/CardModel';

export default defineComponent({
  name: 'stacked-cards',
  props: {
    cards: {
      type: Array as () => ReadonlyArray<CardModel>,
      required: true,
    },
  },
  components: {
    Card,
  },
});

</script>

