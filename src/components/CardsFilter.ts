import Vue from 'vue';
import {CardName} from '../CardName';
import {ALL_PROJECT_CARD_NAMES} from '../cards/AllCards';
import {TranslateMixin} from './TranslateMixin';

const allItems: Array<CardName> = ALL_PROJECT_CARD_NAMES.sort();

interface CardsFilterModel {
    selectedCardNames: Array<CardName>;
    foundCardNames: Array<CardName>;
    searchTerm: string;
}

export const CardsFilter = Vue.component('cards-filter', {
  props: {},
  data: function() {
    return {
      selectedCardNames: [],
      foundCardNames: [],
      searchTerm: '',
    } as CardsFilterModel;
  },
  mixins: [TranslateMixin],
  methods: {
    removeCard: function(cardNameToRemove: CardName) {
      this.selectedCardNames = this.selectedCardNames.filter((curCardName) => curCardName !== cardNameToRemove).sort();
    },
    addCard: function(cardNameToAdd: CardName) {
      if (this.selectedCardNames.includes(cardNameToAdd)) return;
      this.selectedCardNames.push(cardNameToAdd);
      this.selectedCardNames = this.selectedCardNames.sort();
      this.searchTerm = '';
    },
  },
  watch: {
    selectedCardNames: function(value) {
      this.$emit('cards-list-changed', value);
    },
    searchTerm: function(value) {
      if (value === '') {
        this.foundCardNames = [];
        return;
      }
      const newCardNames = allItems.filter(
        (candidate: CardName) => ! this.selectedCardNames.includes(candidate) && candidate.toLowerCase().indexOf(value.toLowerCase()) !== -1,
      ).sort();
      this.foundCardNames = newCardNames.slice(0, 5);
    },
  },
  template: `
    <div class="cards-filter">
        <h2 v-i18n>Cards to exclude from the game</h2>
        <div class="cards-filter-results-cont" v-if="selectedCardNames.length">
            <div class="cards-filter-result" v-for="cardName in selectedCardNames">
                <label>{{ cardName }}</label>
                <Button size="small" type="close" :onClick="_=>removeCard(cardName)" /> 
            </div>
        </div>
        <div class="cards-filter-input">
            <div>
                <input class="form-input" :placeholder="$t('Start typing the card name to exclude')" v-model="searchTerm" />
            </div>
            <div class="cards-filter-suggest" v-if="foundCardNames.length">
                <div class="cards-filter-suggest-item" v-for="cardName in foundCardNames">
                    <a href="#" v-on:click.prevent="addCard(cardName)">{{ cardName }}</a> 
                </div>
            </div>
        </div>
    </div>
    `,
});
