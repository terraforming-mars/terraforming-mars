import Vue from 'vue';
import {Card} from './card/Card';
import {
  ALL_CARD_MANIFESTS,
  ALL_CORPORATION_CARD_NAMES,
  ALL_PRELUDE_CARD_NAMES,
  ALL_PROJECT_CARD_NAMES,
  ALL_STANDARD_PROJECT_CARD_NAMES,
} from '../cards/AllCards';
import {GameModule} from '../GameModule';
import {ICard} from '../cards/ICard';
import {ICardRenderDescription, isIDescription} from '../cards/render/ICardRenderDescription';

interface Entry {
  card: ICard,
  module: GameModule
}
const cards: Map<string, Entry> = new Map();
ALL_CARD_MANIFESTS.forEach((manifest) => {
  manifest.projectCards.cards.forEach((card) =>
    cards.set(card.cardName, {card: new card.Factory(), module: manifest.module}));
  manifest.corporationCards.cards.forEach((card) =>
    cards.set(card.cardName, {card: new card.Factory(), module: manifest.module}));
  manifest.preludeCards.cards.forEach((card) =>
    cards.set(card.cardName, {card: new card.Factory(), module: manifest.module}));
});

export interface DebugUIModel {
  filterText: string,
  filterDescription: boolean | unknown[],
  base: boolean | unknown[],
  corporateEra: boolean | unknown[],
  prelude: boolean | unknown[],
  venusNext: boolean | unknown[],
  colonies: boolean | unknown[],
  turmoil: boolean | unknown[],
  community: boolean | unknown[],
  ares: boolean | unknown[],
  promo: boolean | unknown[],
}
export const DebugUI = Vue.component('debug-ui', {
  components: {
    Card,
  },
  data: function() {
    return {
      filterText: '',
      filterDescription: false,
      base: true,
      corporateEra: true,
      prelude: true,
      venusNext: true,
      colonies: true,
      turmoil: true,
      community: true,
      ares: true,
      promo: true,
    } as DebugUIModel;
  },
  methods: {
    toggleAll: function() {
      const data = this.$data;
      data.base = !data.base;
      data.corporateEra = !data.corporateEra;
      data.prelude = !data.prelude;
      data.venusNext = !data.venusNext;
      data.colonies = !data.colonies;
      data.turmoil = !data.turmoil;
      data.community = !data.community;
      data.promo = !data.promo;
      data.ares = !data.ares;
    },
    getAllStandardProjectCards: function() {
      return ALL_STANDARD_PROJECT_CARD_NAMES.sort();
    },
    getAllProjectCards: function() {
      return ALL_PROJECT_CARD_NAMES.sort();
    },
    getAllCorporationCards: function() {
      return ALL_CORPORATION_CARD_NAMES.sort();
    },
    getAllPreludeCards: function() {
      return ALL_PRELUDE_CARD_NAMES.sort();
    },
    filtered: function(cardName: string): boolean {
      const card = cards.get(cardName);
      const filterText = this.$data.filterText.toUpperCase();
      if (this.$data.filterText.length > 0) {
        if (cardName.toUpperCase().indexOf(filterText) === -1) {
          if (this.$data.filterDescription) {
            let desc: string | ICardRenderDescription | undefined = card?.card.metadata?.description;
            if (isIDescription(desc)) {
              desc = desc.text;
            }
            // TODO(kberg): optimize by having all the descriptions in upper case.
            if (desc === undefined || desc.toUpperCase().indexOf(filterText) === -1) {
              return false;
            }
          } else {
            return false;
          }
        }
      }

      switch (card?.module) {
      case GameModule.Base:
        return this.base === true;
      case GameModule.CorpEra:
        return this.corporateEra === true;
      case GameModule.Promo:
        return this.promo === true;
      case GameModule.Venus:
        return this.venusNext === true;
      case GameModule.Colonies:
        return this.colonies === true;
      case GameModule.Prelude:
        return this.prelude === true;
      case GameModule.Turmoil:
        return this.turmoil === true;
      case GameModule.Community:
        return this.community === true;
      case GameModule.Ares:
        return this.ares === true;
      default:
        return true;
      }
    },
  },
  template: `
        <div class="debug-ui-container">
            <input class="form-input form-input-line" placeholder="filter" v-model="filterText"></input>
            <input type="checkbox" name="filterDescription" id="filterDescription-checkbox" v-model="filterDescription"></input>
            <label for="filterDescription-checkbox">
                <span v-i18n>Filter description</span>
            </label>

            <div class="create-game-page-column" style = "flex-flow: inherit; ">
            <button id="toggle-checkbox" v-on:click="toggleAll()">
                <span v-i18n>Toggle all</span>
            </button>

            <input type="checkbox" name="base" id="base-checkbox" v-model="base"></input>
              <label for="base-checkbox" class="expansion-button">
                  <span v-i18n>Base</span>
              </label>

              <input type="checkbox" name="corporateEra" id="corporateEra-checkbox" v-model="corporateEra"></input>
              <label for="corporateEra-checkbox" class="expansion-button">
                  <div class="create-game-expansion-icon expansion-icon-CE"></div>
                  <span v-i18n>Corporate Era</span>
              </label>

              <input type="checkbox" name="prelude" id="prelude-checkbox" v-model="prelude"></input>
              <label for="prelude-checkbox" class="expansion-button">
                  <div class="create-game-expansion-icon expansion-icon-prelude"></div>
                  <span v-i18n>Prelude</span>
              </label>

              <input type="checkbox" name="venusNext" id="venusNext-checkbox" v-model="venusNext"></input>
              <label for="venusNext-checkbox" class="expansion-button">
              <div class="create-game-expansion-icon expansion-icon-venus"></div>
                  <span v-i18n>Venus Next</span>
              </label>

              <input type="checkbox" name="colonies" id="colonies-checkbox" v-model="colonies"></input>
              <label for="colonies-checkbox" class="expansion-button">
              <div class="create-game-expansion-icon expansion-icon-colony"></div>
                  <span v-i18n>Colonies</span>
              </label>

              <input type="checkbox" name="turmoil" id="turmoil-checkbox" v-model="turmoil"></input>
              <label for="turmoil-checkbox" class="expansion-button">
                  <div class="create-game-expansion-icon expansion-icon-turmoil"></div>
                  <span v-i18n>Turmoil</span>
              </label>
              
              <input type="checkbox" name="promo" id="promo-checkbox" v-model="promo"></input>
              <label for="promo-checkbox" class="expansion-button">
                  <div class="create-game-expansion-icon expansion-icon-promo"></div>
                  <span v-i18n>Promos</span>
              </label>

              <input type="checkbox" name="ares" id="ares-checkbox" v-model="ares"></input>
              <label for="ares-checkbox" class="expansion-button">
                  <div class="create-game-expansion-icon expansion-icon-ares"></div>
                  <span v-i18n>Ares</span>
              </label>

              <input type="checkbox" name="community" id="community-checkbox" v-model="community"></input>
              <label for="community-checkbox" class="expansion-button">
                  <div class="create-game-expansion-icon expansion-icon-community"></div>
                  <span v-i18n>Community</span>
              </label><span/>
            </div>
            <section class="debug-ui-cards-list">
                <h2>Project Cards</h2>
                <div class="cardbox" v-for="card in getAllProjectCards()">
                    <Card v-show="filtered(card)" :card="{'name': card}" />
                </div>
            </section>
            <br>
            <section class="debug-ui-cards-list">
                <h2>Corporations</h2>
                <div class="cardbox" v-for="card in getAllCorporationCards()">
                    <Card v-show="filtered(card)" :card="{'name': card}" />
                </div>
            </section>
            <br>
            <section class="debug-ui-cards-list">
                <h2>Preludes</h2>
                <div class="cardbox" v-for="card in getAllPreludeCards()">
                    <Card v-show="filtered(card)" :card="{'name': card}" />
                </div>
            </section>
            <br>
            <section class="debug-ui-cards-list">
              <h2>Standard Projects</h2>
              <div class="cardbox" v-for="card in getAllStandardProjectCards()">
                  <Card v-show="filtered(card)" :card="{'name': card}" />
              </div>
            </section>
        </div>
    `,
});
