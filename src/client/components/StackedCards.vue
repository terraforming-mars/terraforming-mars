<template>
    <div class="cardbox">
        <div v-for="(card, index) in props.cards" :key="card.name" :class="{'cards-stack':(index > 0),'cards-stack-first':(index === 0) }">
            <Card :card="card" />
        </div>
    </div>
</template>

<script setup lang="ts">
import Card from '@/client/components/card/Card.vue';
import {CardModel} from '@/common/models/CardModel';

const props = defineProps<{
  cards: ReadonlyArray<CardModel>;
}>();
</script>
