<template>
    <div class="cardbox">
        <div v-for="(card, index) in cards" :key="card.name" :class="{'cards-stack':(index > 0),'cards-stack-first':(index === 0) }">
            <Card :card="card" />
        </div>
    </div>
</template>

<script lang="ts">

import Vue from 'vue';
import Card from '@/client/components/card/Card.vue';
import {CardModel} from '@/common/models/CardModel';

export default Vue.extend({
  name: 'stacked-cards',
  props: {
    cards: {
      type: Array as () => Array<CardModel>,
    },
  },
  components: {
    Card,
  },
});

</script>

