<template>
    <div class="cards-filter">
        <h2 v-i18n>Cards to exclude from the game</h2>
        <div class="cards-filter-results-cont" v-if="selectedCardNames.length">
            <div class="cards-filter-result" v-for="cardName in selectedCardNames" v-bind:key="cardName">
                <label>{{ cardName }}<i class="create-game-expansion-icon expansion-icon-prelude" title="This card is prelude" v-if="isPrelude(cardName)"></i></label>
                <Button size="small" type="close" @click="removeCard(cardName)" />
            </div>
        </div>
        <div class="cards-filter-input">
            <div>
                <input class="form-input" :placeholder="$t('Start typing the card name to exclude')" v-model="searchTerm" />
            </div>
            <div class="cards-filter-suggest" v-if="foundCardNames.length">
                <div class="cards-filter-suggest-item" v-for="cardName in foundCardNames" v-bind:key="cardName">
                    <a href="#" v-on:click.prevent="addCard(cardName)">
                      {{ cardName }}
                      <i class="create-game-expansion-icon expansion-icon-prelude" title="This card is prelude" v-if="isPrelude(cardName)"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {CardName} from '@/common/cards/CardName';
import Button from '@/client/components/common/Button.vue';
import {byType, getCard, getCards, toName} from '@/client/cards/ClientCardManifest';
import {CardType} from '@/common/cards/CardType';

const allItems: Array<CardName> = [
  ...getCards(byType(CardType.AUTOMATED)),
  ...getCards(byType(CardType.ACTIVE)),
  ...getCards(byType(CardType.EVENT)),
  ...getCards(byType(CardType.PRELUDE)),
].map(toName)
  .sort((a, b) => a.localeCompare(b));

interface CardsFilterModel {
    selectedCardNames: Array<CardName>;
    foundCardNames: Array<CardName>;
    searchTerm: string;
}

export default Vue.extend({
  name: 'CardsFilter',
  props: {},
  data() {
    return {
      selectedCardNames: [],
      foundCardNames: [],
      searchTerm: '',
    } as CardsFilterModel;
  },
  components: {Button},
  methods: {
    isPrelude(cardName: CardName) {
      return getCard(cardName)?.cardType === CardType.PRELUDE;
    },
    removeCard(cardNameToRemove: CardName) {
      this.selectedCardNames = this.selectedCardNames.filter((curCardName) => curCardName !== cardNameToRemove).sort();
    },
    addCard(cardNameToAdd: CardName) {
      if (this.selectedCardNames.includes(cardNameToAdd)) return;
      this.selectedCardNames.push(cardNameToAdd);
      this.selectedCardNames.sort();
      this.searchTerm = '';
    },
  },
  watch: {
    selectedCardNames(value) {
      this.$emit('cards-list-changed', value);
    },
    searchTerm(value: string) {
      if (value === '') {
        this.foundCardNames = [];
        return;
      }
      if (value.indexOf(',') !== -1) {
        const cardNames = new Set(value.split(',').map((c) => c.trim()));
        for (const item of allItems) {
          if (cardNames.has(item)) {
            this.addCard(item);
          }
        }
        return;
      }
      const newCardNames = allItems.filter(
        (candidate: CardName) => ! this.selectedCardNames.includes(candidate) && candidate.toLowerCase().indexOf(value.toLowerCase()) !== -1,
      ).sort();
      this.foundCardNames = newCardNames.slice(0, 5);
    },
  },
});
</script>
