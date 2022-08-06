<script lang="ts">
import Vue from 'vue';
import Card from '@/client/components/card/Card.vue';
import {CardModel} from '@/common/models/CardModel';
import {CardOrderStorage} from '@/client/utils/CardOrderStorage';

export default Vue.extend({
  name: 'SortableCards',
  components: {
    Card,
  },
  props: {
    cards: {
      type: Array as () => Array<CardModel>,
    },
    playerId: {
      type: String,
    },
  },
  data() {
    const cache = CardOrderStorage.getCardOrder(this.playerId);
    const cardOrder: {[x: string]: number} = {};
    const keys = Object.keys(cache);
    let max = 0;
    for (const key of keys) {
      if (this.cards.find((card) => card.name === key) !== undefined) {
        cardOrder[key] = cache[key];
        max = Math.max(max, cache[key]);
      }
    }
    max++;
    for (const card of this.cards) {
      if (cardOrder[card.name] === undefined) {
        cardOrder[card.name] = max++;
      }
    }
    return {
      cardOrder,
      dragCard: undefined as string | undefined,
    };
  },
  methods: {
    getSortedCards() {
      return CardOrderStorage.getOrdered(
        this.cardOrder,
        this.cards,
      );
    },
    onDragStart(source: string): void {
      this.dragCard = source;
    },
    onDragEnd(): void {
      this.dragCard = undefined;
    },
    onDragOver(source: string): void {
      if (this.dragCard === undefined || source === this.dragCard) {
        return;
      }
      // put the card at the end of the list
      if (source === 'end') {
        let max = 0;
        const keys = Object.keys(this.cardOrder);
        for (const key of keys) {
          max = Math.max(max, this.cardOrder[key]);
        }
        this.cardOrder[this.dragCard] = max + 1;
      } else {
        // place it ahead of the card
        const temp = this.cardOrder[source];
        const keys = Object.keys(this.cardOrder);
        for (const key of keys) {
          if (this.cardOrder[key] >= temp) {
            this.cardOrder[key]++;
          }
        }
        this.cardOrder[this.dragCard] = temp;
      }
      CardOrderStorage.updateCardOrder(this.playerId, this.cardOrder);
    },
  },
});
</script>
<template>
  <div class="sortable-cards">
    <div ref="draggers" :class="{ 'dragging': Boolean(dragCard) }" v-for="card in getSortedCards()" :key="card.name" draggable="true" v-on:dragend="onDragEnd()" v-on:dragstart="onDragStart(card.name)">
      <div v-if="dragCard" ref="droppers" class="drop-target" v-on:dragover="onDragOver(card.name)"></div>
      <div ref="cardbox" class="cardbox">
        <Card :card="card"/>
      </div>
    </div>
    <div v-if="dragCard" ref="dropend" class="drop-target" v-on:dragover="onDragOver('end')"></div>
  </div>
</template>
