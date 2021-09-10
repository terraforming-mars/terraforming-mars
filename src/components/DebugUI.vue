<template>
        <div class="debug-ui-container" :class="getLanguageCssClass()">
            <h1>Cards List</h1>
            <div class="legacy-anchor">
              <a href="https://ssimeonoff.github.io/cards-list" target="_blank">legacy card UI</a>
            </div>
            <div class="form-group">
              <input class="form-input form-input-line" placeholder="filter" v-model="filterText">
              <input type="checkbox" name="filterDescription" id="filterDescription-checkbox" v-model="filterDescription">
              <label for="filterDescription-checkbox">
                  <span v-i18n>Filter description</span>
              </label>
              <input type="checkbox" name="sortById" id="sortById-checkbox" v-model="sortById">
              <label for="sortById-checkbox">
                  <span v-i18n>Sort by ID (work in progress)</span>
              </label>
            </div>

            <div class="create-game-page-column" style = "flex-flow: inherit; ">
            <button id="toggle-checkbox" v-on:click="toggleAll()">
                <span v-i18n>Toggle all</span>
            </button>

            <input type="checkbox" name="base" id="base-checkbox" v-model="base">
              <label for="base-checkbox" class="expansion-button">
                  <span v-i18n>Base</span>
              </label>

              <input type="checkbox" name="corporateEra" id="corporateEra-checkbox" v-model="corporateEra">
              <label for="corporateEra-checkbox" class="expansion-button">
                  <div class="create-game-expansion-icon expansion-icon-CE"></div>
                  <span v-i18n>Corporate Era</span>
              </label>

              <input type="checkbox" name="prelude" id="prelude-checkbox" v-model="prelude">
              <label for="prelude-checkbox" class="expansion-button">
                  <div class="create-game-expansion-icon expansion-icon-prelude"></div>
                  <span v-i18n>Prelude</span>
              </label>

              <input type="checkbox" name="venusNext" id="venusNext-checkbox" v-model="venusNext">
              <label for="venusNext-checkbox" class="expansion-button">
              <div class="create-game-expansion-icon expansion-icon-venus"></div>
                  <span v-i18n>Venus Next</span>
              </label>

              <input type="checkbox" name="colonies" id="colonies-checkbox" v-model="colonies">
              <label for="colonies-checkbox" class="expansion-button">
              <div class="create-game-expansion-icon expansion-icon-colony"></div>
                  <span v-i18n>Colonies</span>
              </label>

              <input type="checkbox" name="turmoil" id="turmoil-checkbox" v-model="turmoil">
              <label for="turmoil-checkbox" class="expansion-button">
                  <div class="create-game-expansion-icon expansion-icon-turmoil"></div>
                  <span v-i18n>Turmoil</span>
              </label>

              <input type="checkbox" name="promo" id="promo-checkbox" v-model="promo">
              <label for="promo-checkbox" class="expansion-button">
                  <div class="create-game-expansion-icon expansion-icon-promo"></div>
                  <span v-i18n>Promos</span>
              </label>

              <input type="checkbox" name="ares" id="ares-checkbox" v-model="ares">
              <label for="ares-checkbox" class="expansion-button">
                  <div class="create-game-expansion-icon expansion-icon-ares"></div>
                  <span v-i18n>Ares</span>
              </label>

              <input type="checkbox" name="community" id="community-checkbox" v-model="community">
              <label for="community-checkbox" class="expansion-button">
                  <div class="create-game-expansion-icon expansion-icon-community"></div>
                  <span v-i18n>Community</span>
              </label><span/>

              <input type="checkbox" name="moon" id="moon-checkbox" v-model="moon">
              <label for="moon-checkbox" class="expansion-button">
                <div class="create-game-expansion-icon expansion-icon-themoon"></div>
                <span v-i18n>The Moon</span>
              </label><span/>
            </div>

            <section class="debug-ui-cards-list">
                <h2>Project Cards</h2>
                <div class="cardbox" v-for="card in getAllProjectCards()" :key="card">
                    <Card v-show="filtered(card)" :card="{'name': card}" />
                </div>
            </section>
            <br>
            <section class="debug-ui-cards-list">
                <h2>Corporations</h2>
                <div class="cardbox" v-for="card in getAllCorporationCards()" :key="card">
                    <Card v-show="filtered(card)" :card="{'name': card}" />
                </div>
            </section>
            <br>
            <section class="debug-ui-cards-list">
                <h2>Preludes</h2>
                <div class="cardbox" v-for="card in getAllPreludeCards()" :key="card">
                    <Card v-show="filtered(card)" :card="{'name': card}" />
                </div>
            </section>
            <br>
            <section class="debug-ui-cards-list">
              <h2>Standard Projects</h2>
              <div class="cardbox" v-for="card in getAllStandardProjectCards()" :key="card">
                  <Card v-show="filtered(card)" :card="{'name': card}" />
              </div>
            </section>
        </div>
</template>

<script lang="ts">

import Vue from 'vue';
import Card from './card/Card.vue';
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
import {CardName} from '../CardName';
import {ICardFactory} from '../cards/ICardFactory';
import {PreferencesManager} from './PreferencesManager';

const cards: Map<CardName, {card: ICard, module: GameModule, cardNumber: string}> = new Map();

ALL_CARD_MANIFESTS.forEach((manifest) => {
  const module = manifest.module;
  [
    manifest.projectCards,
    manifest.corporationCards,
    manifest.preludeCards,
    manifest.standardProjects].forEach((deck) => {
    deck.factories.forEach((cf: ICardFactory<ICard>) => {
      const card: ICard = new cf.Factory();
      const cardNumber = card.metadata.cardNumber;
      cards.set(card.name, {card, module, cardNumber});
    });
  });
});

const BASE = 'b';
const CORP = 'c';
const PRELUDE = 'p';
const VENUS = 'v';
const COLONIES = 'o';
const TURMOIL = 't';
const COMMUNITY = '*';
const PROMO = 'r';
const ARES = 'a';
const MOON = 'm';

const ALL_MODULES = `${BASE}${CORP}${PRELUDE}${VENUS}${COLONIES}${TURMOIL}${COMMUNITY}${PROMO}${ARES}${MOON}`;

export interface DebugUIModel {
  filterText: string,
  filterDescription: boolean | unknown[],
  sortById: boolean | unknown[],
  base: boolean | unknown[],
  corporateEra: boolean | unknown[],
  prelude: boolean | unknown[],
  venusNext: boolean | unknown[],
  colonies: boolean | unknown[],
  turmoil: boolean | unknown[],
  community: boolean | unknown[],
  ares: boolean | unknown[],
  moon: boolean | unknown[],
  promo: boolean | unknown[],
}

export default Vue.extend({
  name: 'debug-ui',
  components: {
    Card,
  },
  data() {
    return {
      filterText: '',
      filterDescription: false,
      sortById: false,
      base: true,
      corporateEra: true,
      prelude: true,
      venusNext: true,
      colonies: true,
      turmoil: true,
      community: true,
      ares: true,
      moon: true,
      promo: true,
    } as DebugUIModel;
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchString = urlParams.get('search');
    if (searchString) {
      this.filterText = searchString;
    }
    const modules = urlParams.get('m') || ALL_MODULES;
    this.base = modules.includes(BASE);
    this.corporateEra = modules.includes(CORP);
    this.prelude = modules.includes(PRELUDE);
    this.venusNext = modules.includes(VENUS);
    this.colonies = modules.includes(COLONIES);
    this.turmoil = modules.includes(TURMOIL);
    this.community = modules.includes(COMMUNITY);
    this.promo = modules.includes(PROMO);
    this.ares = modules.includes(ARES);
    this.moon = modules.includes(MOON);
  },
  watch: {
    filterText(newSearchString: string) {
      this.updateUrl(newSearchString);
    },
    base() {
      this.updateUrl();
    },
    corporateEra() {
      this.updateUrl();
    },
    prelude() {
      this.updateUrl();
    },
    venusNext() {
      this.updateUrl();
    },
    colonies() {
      this.updateUrl();
    },
    turmoil() {
      this.updateUrl();
    },
    community() {
      this.updateUrl();
    },
    ares() {
      this.updateUrl();
    },
    moon() {
      this.updateUrl();
    },
    promo() {
      this.updateUrl();
    },
  },
  methods: {
    updateUrl(search?: string) {
      if (window.history.pushState) {
        let url = window.location.protocol + '//' + window.location.host + window.location.pathname;
        if (search) {
          url = url + '?search=' + search;
        }

        let m = '';
        if (this.base) m += BASE;
        if (this.corporateEra) m += CORP;
        if (this.prelude) m += PRELUDE;
        if (this.venusNext) m += VENUS;
        if (this.colonies) m += COLONIES;
        if (this.turmoil) m += TURMOIL;
        if (this.community) m += COMMUNITY;
        if (this.promo) m += PROMO;
        if (this.ares) m += ARES;
        if (this.moon) m += MOON;
        if (m === '') m = '-'; // - means no modules.

        if (m !== ALL_MODULES) {
          url = url + '?m=' + m;
        }
        window.history.pushState({path: url}, '', url);
      }
    },
    toggleAll() {
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
      data.moon = !data.moon;
    },
    sort(names: Array<CardName>): Array<CardName> {
      if (this.$data.sortById) {
        return names.sort((a: CardName, b: CardName) => {
          const an = cards.get(a)?.cardNumber || '';
          const bn = cards.get(b)?.cardNumber || '';
          return an.localeCompare(bn);
        });
      } else {
        return names.sort();
      }
    },
    getAllStandardProjectCards() {
      return this.sort(ALL_STANDARD_PROJECT_CARD_NAMES);
    },
    getAllProjectCards() {
      return this.sort(ALL_PROJECT_CARD_NAMES);
    },
    getAllCorporationCards() {
      return this.sort(ALL_CORPORATION_CARD_NAMES);
    },
    getAllPreludeCards() {
      return this.sort(ALL_PRELUDE_CARD_NAMES);
    },
    filtered(cardName: CardName): boolean {
      const card = cards.get(cardName);
      const filterText = this.$data.filterText.toUpperCase();
      if (this.$data.filterText.length > 0) {
        if (cardName.toUpperCase().includes(filterText) === false) {
          if (this.$data.filterDescription) {
            let desc: string | ICardRenderDescription | undefined = card?.card.metadata?.description;
            if (isIDescription(desc)) {
              desc = desc.text;
            }
            // TODO(kberg): optimize by having all the descriptions in upper case.
            if (desc === undefined || desc.toUpperCase().includes(filterText) === false) {
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
      case GameModule.Moon:
        return this.moon === true;
      default:
        return true;
      }
    },
    getLanguageCssClass() {
      const language = PreferencesManager.load('lang') || 'en';
      return 'language-' + language;
    },
  },
});

</script>

