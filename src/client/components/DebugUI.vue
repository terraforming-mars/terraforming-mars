<template>
        <div class="debug-ui-container" :class="getLanguageCssClass()">
            <h1>Cards List</h1>
            <div class="legacy-anchor">
              <a href="https://ssimeonoff.github.io/cards-list" target="_blank">legacy card UI</a>
            </div>
            <div class="form-group">
              <input class="form-input form-input-line" placeholder="filter" v-model="filterText">
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

              <input type="checkbox" name="pathfinders" id="pathfinders-checkbox" v-model="pathfinders">
              <label for="pathfinders-checkbox" class="expansion-button">
                <div class="create-game-expansion-icon expansion-icon-pathfinders"></div>
                <span v-i18n>Pathfinders</span>
              </label><span/>
            </div>

            <div class="create-game-page-column" style = "flex-flow: inherit; ">
              <span v-for="type in allTypes" :key="type">
                <input type="checkbox" :name="`${type}-cardType`" :id="`${type}-cardType-checkbox`" v-model="types[type]">
                <label :for="`${type}-cardType-checkbox`" class="expansion-button">
                    <span v-i18n>{{type}}</span>
                </label>
              </span>
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

            <section class="debug-ui-cards-list">
              <h2>Global Events</h2>
              <div class="cardbox" v-for="globalEventName in getAllGlobalEvents()" :key="globalEventName">
                <!-- <global-event :globalEvent="getGlobalEvent(globalEventName)" type="prior" :showIcons="false"></global-event> -->
                <global-event :globalEvent="getGlobalEvent(globalEventName)" type="prior" :showIcons="true"></global-event>
              </div>
            </section>
        </div>
</template>

<script lang="ts">

import Vue from 'vue';
import Card from '@/client/components/card/Card.vue';
import {GameModule} from '@/common/cards/GameModule';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {PreferencesManager} from '@/client/utils/PreferencesManager';
import {GlobalEventName} from '@/common/turmoil/globalEvents/GlobalEventName';
import {GlobalEventModel} from '@/common/models/TurmoilModel';
import {PartyName} from '@/common/turmoil/PartyName';
import {ALL_EVENTS, getGlobalEventByName} from '@/turmoil/globalEvents/GlobalEventDealer';
import GlobalEvent from '@/client/components/GlobalEvent.vue';
import {byType, getCard, getCards, toName} from '@/client/cards/ClientCardManifest';

const MODULE_BASE = 'b';
const MODULE_CORP = 'c';
const MODULE_PRELUDE = 'p';
const MODULE_VENUS = 'v';
const MODULE_COLONIES = 'o';
const MODULE_TURMOIL = 't';
const MODULE_COMMUNITY = '*';
const MODULE_PROMO = 'r';
const MODULE_ARES = 'a';
const MODULE_MOON = 'm';

const ALL_MODULES = `${MODULE_BASE}${MODULE_CORP}${MODULE_PRELUDE}${MODULE_VENUS}${MODULE_COLONIES}${MODULE_TURMOIL}${MODULE_COMMUNITY}${MODULE_PROMO}${MODULE_ARES}${MODULE_MOON}`;

export interface DebugUIModel {
  filterText: string,
  sortById: boolean,
  base: boolean,
  corporateEra: boolean,
  prelude: boolean,
  venusNext: boolean,
  colonies: boolean,
  turmoil: boolean,
  community: boolean,
  ares: boolean,
  moon: boolean,
  pathfinders: boolean,
  promo: boolean,
  types: Record<CardType, boolean>,
}

export default Vue.extend({
  name: 'debug-ui',
  components: {
    Card,
    GlobalEvent,
  },
  data() {
    return {
      filterText: '',
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
      pathfinders: true,
      types: {
        event: true,
        active: true,
        automated: true,
        prelude: true,
        corporation: true,
        standard_project: true,
      },
    } as DebugUIModel;
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchString = urlParams.get('search');
    if (searchString) {
      this.filterText = searchString;
    }
    const modules = urlParams.get('m') || ALL_MODULES;
    this.base = modules.includes(MODULE_BASE);
    this.corporateEra = modules.includes(MODULE_CORP);
    this.prelude = modules.includes(MODULE_PRELUDE);
    this.venusNext = modules.includes(MODULE_VENUS);
    this.colonies = modules.includes(MODULE_COLONIES);
    this.turmoil = modules.includes(MODULE_TURMOIL);
    this.community = modules.includes(MODULE_COMMUNITY);
    this.promo = modules.includes(MODULE_PROMO);
    this.ares = modules.includes(MODULE_ARES);
    this.moon = modules.includes(MODULE_MOON);
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
    types() {
      this.updateUrl();
    },
  },
  computed: {
    allTypes(): Array<CardType> {
      return [
        CardType.EVENT,
        CardType.ACTIVE,
        CardType.AUTOMATED,
        CardType.PRELUDE,
        CardType.CORPORATION,
        CardType.STANDARD_PROJECT,
      ];
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
        if (this.base) m += MODULE_BASE;
        if (this.corporateEra) m += MODULE_CORP;
        if (this.prelude) m += MODULE_PRELUDE;
        if (this.venusNext) m += MODULE_VENUS;
        if (this.colonies) m += MODULE_COLONIES;
        if (this.turmoil) m += MODULE_TURMOIL;
        if (this.community) m += MODULE_COMMUNITY;
        if (this.promo) m += MODULE_PROMO;
        if (this.ares) m += MODULE_ARES;
        if (this.moon) m += MODULE_MOON;
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
      data.pathfinders = !data.pathfinders;
    },
    sort(names: Array<CardName>): Array<CardName> {
      const copy = [...names];
      if (this.$data.sortById) {
        return copy.sort((a: CardName, b: CardName) => {
          const an = getCard(a)?.card.metadata.cardNumber || '';
          const bn = getCard(b)?.card.metadata.cardNumber || '';
          return an.localeCompare(bn);
        });
      } else {
        return copy.sort((a, b) => a.localeCompare(b));
      }
    },
    getAllStandardProjectCards() {
      const names = getCards(byType(CardType.STANDARD_PROJECT)).map(toName);
      return this.sort(names);
    },
    getAllProjectCards() {
      const names: Array<CardName> = [];
      names.push(...getCards(byType(CardType.AUTOMATED)).map(toName));
      names.push(...getCards(byType(CardType.ACTIVE)).map(toName));
      names.push(...getCards(byType(CardType.EVENT)).map(toName));
      return this.sort(names);
    },
    getAllCorporationCards() {
      const names = getCards(byType(CardType.CORPORATION)).map(toName);
      return this.sort(names);
    },
    getAllPreludeCards() {
      const names = getCards(byType(CardType.PRELUDE)).map(toName);
      return this.sort(names);
    },
    getAllGlobalEvents() {
      return ALL_EVENTS.keys();
    },
    // Copied from LogPanel.vue
    getGlobalEvent(globalEventName: GlobalEventName): GlobalEventModel {
      const globalEvent = getGlobalEventByName(globalEventName);
      if (globalEvent) {
        return {
          name: globalEvent.name,
          description: globalEvent.description,
          revealed: globalEvent.revealedDelegate,
          current: globalEvent.currentDelegate,
        };
      }
      return {
        name: globalEventName,
        description: 'global event not found',
        revealed: PartyName.GREENS,
        current: PartyName.GREENS,
      };
    },
    filtered(cardName: CardName): boolean {
      const card = getCard(cardName);
      if (card === undefined) {
        return false;
      }

      const filterText = this.$data.filterText.toUpperCase();
      if (this.$data.filterText.length > 0) {
        if (cardName.toUpperCase().includes(filterText) === false) {
          return false;
        }
      }

      if (!this.types[card.card.cardType]) return false;

      switch (card.module) {
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
      case GameModule.Pathfinders:
        return this.pathfinders === true;
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
