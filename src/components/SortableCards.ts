import Vue from 'vue';
import {Card} from './card/Card';
import {CardModel} from '../models/CardModel';
import {CardOrderStorage} from './CardOrderStorage';

export const SortableCards = Vue.component('sorted-cards', {
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
  data: function() {
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
    getSortedCards: function() {
      return CardOrderStorage.getOrdered(
        this.cardOrder,
        this.cards,
      );
    },
    onDragStart: function(source: string): void {
      this.dragCard = source;
    },
    onDragEnd: function(): void {
      this.dragCard = undefined;
    },
    onDragOver: function(source: string): void {
      if (this.dragCard !== undefined && source !== this.dragCard) {
        const temp = this.cardOrder[source];
        this.cardOrder[source] = this.cardOrder[this.dragCard];
        this.cardOrder[this.dragCard] = temp;
        CardOrderStorage.updateCardOrder(this.playerId, this.cardOrder);
      }
    },
  },
  template: `
  <div>
<div ref="cardbox" v-for="card in getSortedCards()" :key="card.name" class="cardbox" draggable="true" v-on:dragend="onDragEnd()" v-on:dragstart="onDragStart(card.name)" v-on:dragover="onDragOver(card.name)">
    <Card :card="card"/>
</div></div>`,
});

