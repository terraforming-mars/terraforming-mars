<template>
<div>
  <div v-if="experimentalUI()" v-i18n>
    <label>
      <input type="checkbox" v-model="showReorder" /> Reorder Cards
    </label>
  </div>
  <div class="sortable-cards">
    <div ref="draggers" :class="{ 'dragging': Boolean(dragCard) }" v-for="(card, index) in getSortedCards()" :key="card.name" draggable="true" v-on:dragend="onDragEnd()" v-on:dragstart="onDragStart(card.name)">
      <div v-if="dragCard" ref="droppers" class="drop-target" v-on:dragover="onDragOver(card.name)"></div>
      <div ref="cardbox" class="cardbox" @click="clickMethod">
        <Card :card="card"/>
        <div v-if="showReorder" class="reorder-banners-container">
          <div class="reorder-banners-left" v-if="index > 0"></div>
          <div class="reorder-banners-right" v-if="index < cards.length - 1"></div>
        </div>
      </div>
    </div>
    <div v-if="dragCard" ref="dropend" class="drop-target" v-on:dragover="onDragOver('end')"></div>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Card from '@/client/components/card/Card.vue';
import {CardName} from '@/common/cards/CardName';
import {CardModel} from '@/common/models/CardModel';
import {CardOrderStorage} from '@/client/utils/CardOrderStorage';
import {getPreferences} from '@/client/utils/PreferencesManager';

type DataModel = {
  /** When true use the point-and-click reorder UI */
  showReorder: boolean;
  /** Mapping from card name to its order */
  cardOrder: {[x: string]: number};
  /** When defined, it is the name of the card being dragged. */
  dragCard: CardName | undefined;
};

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
  data(): DataModel {
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
      showReorder: false,
      cardOrder: cardOrder,
      dragCard: undefined,
    };
  },
  methods: {
    getSortedCards() {
      return CardOrderStorage.getOrdered(
        this.cardOrder,
        this.cards,
      );
    },
    onDragStart(source: CardName): void {
      this.dragCard = source;
    },
    onDragEnd(): void {
      this.dragCard = undefined;
    },
    onDragOver(source: CardName | 'end'): void {
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
    doNotDragAndDropOnReorder() {
      return this.showReorder ? 'do-not-drag-and-drop' : '';
    },
    clickMethod(e: MouseEvent) {
      if (!this.showReorder) return;
      const target = e.currentTarget as HTMLElement;
      if (!target) return;
      if (target.matches('.sortable-cards *')) {
        const rect = target.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const direction = x <= 0.25 ? -1.5 : x >= 0.75 ? 1.5 : null;
        if (direction) {
          const cardTitle = target.querySelector('.card-title');
          if (cardTitle) {
            const textContent = cardTitle.textContent;
            if (textContent) {
              const thisCard = textContent.trim();
              this.cardOrder[thisCard] += direction;
              Object.entries(this.cardOrder)
                .sort((a, b) => a[1]-b[1])
                .forEach((entry, i) => {
                  this.cardOrder[entry[0]] = i+1;
                });
              CardOrderStorage.updateCardOrder(this.playerId, this.cardOrder);
            }
          }
        }
      }
    },
    experimentalUI(): boolean {
      return getPreferences().experimental_ui;
    },
  },
});
</script>
