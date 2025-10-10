<template>
<div>
  <div>
    <label>
      <input type="checkbox" v-model="handJiveIsChecked" /> hand jive
    </label>
  </div>
  <div class="sortable-cards">
    <div ref="draggers" :class="{ 'dragging': Boolean(dragCard) }" v-for="card in getSortedCards()" :key="card.name" draggable="true" v-on:dragend="onDragEnd()" v-on:dragstart="onDragStart(card.name)">
      <div v-if="dragCard" ref="droppers" class="drop-target" v-on:dragover="onDragOver(card.name)"></div>
      <div ref="cardbox" class="cardbox" @click="clickMethod" style="position:relative;width:100%">
        <Card :card="card" :style="handJiveIsChecked ? handJiveCardStyle : undefined"/>
        <div v-if="handJiveIsChecked" style="
          position:absolute;inset:0;pointer-events:none;z-index:400;
          transform:translate(-6%,0%);opacity:0.5;
          background:linear-gradient(to right,transparent 0%,transparent 10%,red 10%,red 20%,transparent 20%,transparent 80%,red 80%,red 90%,transparent 90%,transparent 100%)
        "></div>
        </div>
    </div>
    <div v-if="dragCard" ref="dropend" class="drop-target" v-on:dragover="onDragOver('end')"></div>
  </div>
</div>
</template>

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
      handJiveIsChecked: false,
      handJiveCardStyle: Object.freeze({
        pointerEvents: 'none',
      }),
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
    clickMethod(e: MouseEvent) {
      if (!this.handJiveIsChecked) return;
      const target = e.currentTarget as HTMLElement;
      if (!target) return;
      if (target.matches(".sortable-cards *")) {
        const rect = target.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const direction = x <= 0.25 ? -1.5 : x >= 0.75 ? 1.5 : null;
        if (direction) {
          const thisCard = target.querySelector(".card-title")!.textContent!.trim()
          this.cardOrder[thisCard] += direction
          Object.entries(this.cardOrder)
            .sort((a,b) => a[1]-b[1])
            .forEach((entry, i) => {
              this.cardOrder[entry[0]] = i+1
            })
          CardOrderStorage.updateCardOrder(this.playerId, this.cardOrder);
        }
      }
    },
  },
});
</script>
