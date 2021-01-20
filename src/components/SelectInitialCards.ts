
import Vue from 'vue';

import {Button} from './common/Button';
import {CardFinder} from '../CardFinder';
import {CardName} from '../CardName';
import * as constants from '../constants';
import {CorporationCard} from '../cards/corporation/CorporationCard';
import {PlayerInputModel} from '../models/PlayerInputModel';
import {PlayerModel} from '../models/PlayerModel';
import {SelectCard} from './SelectCard';

export const SelectInitialCards = Vue.component('select-initial-cards', {
  props: {
    player: {
      type: Object as () => PlayerModel,
    },
    playerinput: {
      type: Object as () => PlayerInputModel,
    },
    onsave: {
      type: Function as unknown as () => (out: Array<Array<string>>) => void,
    },
    showsave: {
      type: Boolean,
    },
    showtitle: {
      type: Boolean,
    },
  },
  components: {
    Button,
    'select-card': SelectCard,
  },
  data: function() {
    return {
      selectedCards: [] as Array<CardName>,
      selectedCorporation: undefined as CorporationCard | undefined,
      selectedPrelude: [] as Array<CardName>,
    };
  },
  methods: {
    getAfterPreludes: function() {
      let result = 0;
      if (this.selectedPrelude.includes(CardName.ALLIED_BANKS)) {
        result += 3;
      }
      if (this.selectedPrelude.includes(CardName.BUSINESS_EMPIRE)) {
        result -= 6;
      }
      if (this.selectedPrelude.includes(CardName.AQUIFER_TURBINES)) {
        result -= 3;
      }
      if (this.selectedPrelude.includes(CardName.DONATION)) {
        result += 21;
      }
      if (this.selectedPrelude.includes(CardName.GALILEAN_MINING)) {
        result -= 5;
      }
      if (this.selectedPrelude.includes(CardName.HUGE_ASTEROID)) {
        result -= 5;
      }
      if (this.selectedPrelude.includes(CardName.LOAN)) {
        result += 30;
      }
      if (this.selectedPrelude.includes(CardName.MARTIAN_INDUSTRIES)) {
        result += 6;
      }
      if (this.selectedPrelude.includes(CardName.NITROGEN_SHIPMENT)) {
        result += 5;
      }
      if (this.selectedCorporation?.name === CardName.THARSIS_REPUBLIC) {
        if (this.selectedPrelude.includes(CardName.SELF_SUFFICIENT_SETTLEMENT)) {
          result += 3;
        }
        if (this.selectedPrelude.includes(CardName.EARLY_SETTLEMENT)) {
          result += 3;
        }
      }
      return result;
    },
    getOption: function(idx: number) {
      if (this.playerinput.options === undefined || this.playerinput.options[idx] === undefined) {
        throw new Error('invalid input, missing option');
      }
      return this.playerinput.options[idx];
    },
    getStartingMegacredits: function() {
      if (this.selectedCorporation === undefined) {
        return NaN;
      }
      let starting = this.selectedCorporation.startingMegaCredits;
      const cardCost = this.selectedCorporation.cardCost === undefined ? constants.CARD_COST : this.selectedCorporation.cardCost;
      starting -= this.selectedCards.length * cardCost;
      return starting;
    },
    saveData: function() {
      const result: Array<Array<string>> = [];
      result.push([]);
      if (this.selectedCorporation !== undefined) {
        result[0].push(this.selectedCorporation.name);
      }
      if (this.hasPrelude()) {
        result.push(this.selectedPrelude);
      }
      result.push(this.selectedCards);
      this.onsave(result);
    },
    hasPrelude: function() {
      return this.playerinput.options !== undefined && this.playerinput.options.length === 3;
    },
    cardsChanged: function(cards: Array<CardName>) {
      this.selectedCards = cards;
    },
    corporationChanged: function(cards: Array<CardName>) {
      this.selectedCorporation = new CardFinder().getCorporationCardByName(cards[0]);
    },
    preludesChanged: function(cards: Array<CardName>) {
      this.selectedPrelude = cards;
    },
  },
  template: `<div class="select-initial-cards">
   <select-card :player="player" :playerinput="getOption(0)" :showtitle="true" v-on:cardschanged="corporationChanged" />
    <select-card v-if="hasPrelude()" :player="player" :playerinput="getOption(1)" :showtitle="true" v-on:cardschanged="preludesChanged" />
    <select-card :player="player" :playerinput="getOption(hasPrelude() ? 2 : 1)" :showtitle="true" v-on:cardschanged="cardsChanged" />
    <div v-if="selectedCorporation" v-i18n>Starting Megacredits: <div class="megacredits">{{getStartingMegacredits()}}</div></div>
    <div v-if="selectedCorporation && hasPrelude()" v-i18n>After Preludes: <div class="megacredits">{{getStartingMegacredits() + getAfterPreludes()}}</div></div>
    <Button v-if="showsave" :onClick="saveData" type="submit" :title="playerinput.buttonLabel" />
  </div>`,
});

