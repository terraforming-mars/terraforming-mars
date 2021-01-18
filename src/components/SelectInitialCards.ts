
import Vue from 'vue';

import {Button} from './common/Button';
import {CardFinder} from '../CardFinder';
import {CardName} from '../CardName';
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
    getOption: function(idx: number) {
      if (this.playerinput.options === undefined || this.playerinput.options[idx] === undefined) {
        throw new Error('invalid input, missing option');
      }
      return this.playerinput.options[idx];
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
  template: `<div>
    <select-card :player="player" :playerinput="getOption(0)" :showtitle="true" v-on:cardschanged="corporationChanged" />
    <select-card v-if="hasPrelude()" :player="player" :playerinput="getOption(1)" :showtitle="true" v-on:cardschanged="preludesChanged" />
    <select-card :player="player" :playerinput="getOption(hasPrelude() ? 2 : 1)" :showtitle="true" v-on:cardschanged="cardsChanged" />
    <Button v-if="showsave" :onClick="saveData" type="submit" :title="playerinput.buttonLabel" />
  </div>`,
});

