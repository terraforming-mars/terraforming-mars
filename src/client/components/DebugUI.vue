<template>
        <div class="debug-ui-container" :class="getLanguageCssClass()">
            <h1>Cards List</h1>
            <div class="legacy-anchor">
              <a href="https://ssimeonoff.github.io/cards-list" target="_blank">legacy card UI</a>
            </div>
            <div class="form-group">
              <input class="form-input form-input-line" placeholder="filter" v-model="filterText">
            </div>

            <div class="create-game-page-column" style = "flex-flow: inherit; ">
            <button id="toggle-checkbox" v-on:click="toggleAll()">
                <span v-i18n>Toggle all</span>
            </button>

            <input type="checkbox" name="base" id="base-checkbox" v-model="expansions.base">
              <label for="base-checkbox" class="expansion-button">
                  <span v-i18n>Base</span>
              </label>

              <input type="checkbox" name="corpera" id="corpera-checkbox" v-model="expansions.corpera">
              <label for="corpera-checkbox" class="expansion-button">
                  <div class="create-game-expansion-icon expansion-icon-CE"></div>
                  <span v-i18n>Corporate Era</span>
              </label>

              <input type="checkbox" name="prelude" id="prelude-checkbox" v-model="expansions.prelude">
              <label for="prelude-checkbox" class="expansion-button">
                  <div class="create-game-expansion-icon expansion-icon-prelude"></div>
                  <span v-i18n>Prelude</span>
              </label>

              <input type="checkbox" name="venusNext" id="venusNext-checkbox" v-model="expansions.venus">
              <label for="venusNext-checkbox" class="expansion-button">
              <div class="create-game-expansion-icon expansion-icon-venus"></div>
                  <span v-i18n>Venus Next</span>
              </label>

              <input type="checkbox" name="colonies" id="colonies-checkbox" v-model="expansions.colonies">
              <label for="colonies-checkbox" class="expansion-button">
              <div class="create-game-expansion-icon expansion-icon-colony"></div>
                  <span v-i18n>Colonies</span>
              </label>

              <input type="checkbox" name="turmoil" id="turmoil-checkbox" v-model="expansions.turmoil">
              <label for="turmoil-checkbox" class="expansion-button">
                  <div class="create-game-expansion-icon expansion-icon-turmoil"></div>
                  <span v-i18n>Turmoil</span>
              </label>

              <input type="checkbox" name="promo" id="promo-checkbox" v-model="expansions.promo">
              <label for="promo-checkbox" class="expansion-button">
                  <div class="create-game-expansion-icon expansion-icon-promo"></div>
                  <span v-i18n>Promos</span>
              </label>

              <input type="checkbox" name="ares" id="ares-checkbox" v-model="expansions.ares">
              <label for="ares-checkbox" class="expansion-button">
                  <div class="create-game-expansion-icon expansion-icon-ares"></div>
                  <span v-i18n>Ares</span>
              </label>

              <input type="checkbox" name="community" id="community-checkbox" v-model="expansions.community">
              <label for="community-checkbox" class="expansion-button">
                  <div class="create-game-expansion-icon expansion-icon-community"></div>
                  <span v-i18n>Community</span>
              </label><span/>

              <input type="checkbox" name="moon" id="moon-checkbox" v-model="expansions.moon">
              <label for="moon-checkbox" class="expansion-button">
                <div class="create-game-expansion-icon expansion-icon-themoon"></div>
                <span v-i18n>The Moon</span>
              </label><span/>

              <input type="checkbox" name="pathfinders" id="pathfinders-checkbox" v-model="expansions.pathfinders">
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
              <span>
                <input type="checkbox" name="globalEvents-cardType" id="globalEvents-checkbox" v-model="types.globalEvents">
                <label for="globalEvents-checkbox" class="expansion-button">
                    <span v-i18n>Global Events</span>
                </label>
              </span>
              <span>
                <input type="checkbox" name="colonyTiles-cardType" id="colonyTiles-checkbox" v-model="types.colonyTiles">
                <label for="colonyTiles-checkbox" class="expansion-button">
                    <span v-i18n>Colony Tiles</span>
                </label>
              </span>
            </div>
            <div class="create-game-page-column" style = "flex-flow: inherit; ">
              <span v-for="tag in allTags" :key="tag">
                <input type="checkbox" :name="`${tag}-cardType`" :id="`${tag}-cardType-checkbox`" v-model="tags[tag]">
                <label :for="`${tag}-cardType-checkbox`" class="expansion-button">
                    <span v-i18n>{{tag}}</span>
                </label>
              </span>
            </div>
            <section class="debug-ui-cards-list">
                <h2>Project Cards</h2>
                <div class="cardbox" v-for="card in getAllProjectCards()" :key="card">
                    <Card v-show="showCard(card)" :card="{'name': card}" />
                </div>
            </section>
            <br>
            <section class="debug-ui-cards-list">
                <h2>Corporations</h2>
                <div class="cardbox" v-for="card in getAllCorporationCards()" :key="card">
                    <Card v-show="showCard(card)" :card="{'name': card}" />
                </div>
            </section>
            <br>
            <section class="debug-ui-cards-list">
                <h2>Preludes</h2>
                <div class="cardbox" v-for="card in getAllPreludeCards()" :key="card">
                    <Card v-show="showCard(card)" :card="{'name': card}" />
                </div>
            </section>
            <br>
            <section class="debug-ui-cards-list">
              <h2>Standard Projects</h2>
              <div class="cardbox" v-for="card in getAllStandardProjectCards()" :key="card">
                  <Card v-show="showCard(card)" :card="{'name': card}" />
              </div>
            </section>

            <section class="debug-ui-cards-list">
              <h2>Global Events</h2>
              <template v-if="types.globalEvents">
                <div class="cardbox" v-for="globalEventName in getAllGlobalEvents()" :key="globalEventName">
                  <global-event v-show="showGlobalEvent(globalEventName)" :globalEvent="getGlobalEventModel(globalEventName)" type="prior"></global-event>
                </div>
              </template>
            </section>

            <section>
              <h2>Colonies</h2>
              <template v-if="types.colonyTiles">
                <div class="player_home_colony_cont">
                  <div class="player_home_colony" v-for="colonyName in getAllColonyNames()" :key="colonyName">
                    <colony v-show="showColony(colonyName)" :colony="colonyModel(colonyName)"></colony>
                  </div>
                </div>
              </template>
            </section>
            <div class="free-floating-preferences-icon">
              <preferences-icon></preferences-icon>
            </div>
        </div>
</template>

<script lang="ts">

import Vue from 'vue';
import Card from '@/client/components/card/Card.vue';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {getPreferences} from '@/client/utils/PreferencesManager';
import {GlobalEventName} from '@/common/turmoil/globalEvents/GlobalEventName';
import {GlobalEventModel} from '@/common/models/TurmoilModel';
import {allGlobalEventNames, getGlobalEventModel} from '@/client/turmoil/ClientGlobalEventManifest';
import GlobalEvent from '@/client/components/turmoil/GlobalEvent.vue';
import {byType, getCard, getCards, toName} from '@/client/cards/ClientCardManifest';
import Colony from '@/client/components/colonies/Colony.vue';
import {COMMUNITY_COLONY_NAMES, OFFICIAL_COLONY_NAMES} from '@/common/colonies/AllColonies';
import {ColonyModel} from '@/common/models/ColonyModel';
import {ColonyName} from '@/common/colonies/ColonyName';
import PreferencesIcon from '@/client/components/PreferencesIcon.vue';
import {GameModule} from '@/common/cards/GameModule';
import {Tags} from '@/common/cards/Tags';

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
const MODULE_PATHFINDERS = 'P';

const ALL_MODULES =
  MODULE_BASE +
  MODULE_CORP +
  MODULE_PRELUDE +
  MODULE_VENUS +
  MODULE_COLONIES +
  MODULE_TURMOIL +
  MODULE_COMMUNITY +
  MODULE_PROMO +
  MODULE_ARES +
  MODULE_MOON +
  MODULE_PATHFINDERS;

export interface DebugUIModel {
  filterText: string,
  expansions: Record<GameModule, boolean>,
  types: Record<CardType | 'colonyTiles' | 'globalEvents', boolean>,
  tags: Record<Tags, boolean>,
}

export default Vue.extend({
  name: 'debug-ui',
  components: {
    Card,
    GlobalEvent,
    Colony,
    PreferencesIcon,
  },
  data(): DebugUIModel {
    return {
      filterText: '',
      expansions: {
        base: true,
        corpera: true,
        prelude: true,
        venus: true,
        colonies: true,
        turmoil: true,
        community: true,
        ares: true,
        moon: true,
        promo: true,
        pathfinders: true,
      },
      types: {
        event: true,
        active: true,
        automated: true,
        prelude: true,
        corporation: true,
        standard_project: true,
        standard_action: false,
        proxy: false,
        globalEvents: true,
        colonyTiles: true,
      },
      tags: {
        building: true,
        space: true,
        science: true,
        power: true,
        earth: true,
        jovian: true,
        venus: true,
        plant: true,
        microbe: true,
        animal: true,
        city: true,
        moon: true,
        mars: true,
        wild: true,
        event: true,
        clone: true,
      },
    };
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchString = urlParams.get('search');
    if (searchString) {
      this.filterText = searchString;
    }
    const modules = urlParams.get('m') || ALL_MODULES;
    this.expansions.base = modules.includes(MODULE_BASE);
    this.expansions.corpera = modules.includes(MODULE_CORP);
    this.expansions.prelude = modules.includes(MODULE_PRELUDE);
    this.expansions.venus = modules.includes(MODULE_VENUS);
    this.expansions.colonies = modules.includes(MODULE_COLONIES);
    this.expansions.turmoil = modules.includes(MODULE_TURMOIL);
    this.expansions.community = modules.includes(MODULE_COMMUNITY);
    this.expansions.promo = modules.includes(MODULE_PROMO);
    this.expansions.ares = modules.includes(MODULE_ARES);
    this.expansions.moon = modules.includes(MODULE_MOON);
    this.expansions.pathfinders = modules.includes(MODULE_PATHFINDERS);
  },
  watch: {
    filterText(newSearchString: string) {
      this.updateUrl(newSearchString);
    },
    base() {
      this.updateUrl();
    },
    corpera() {
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
    allTags(): Array<Tags> {
      const results: Array<Tags> = [];
      for (const tag in Tags) {
        if (Object.prototype.hasOwnProperty.call(Tags, tag)) {
          results.push((<any>Tags)[tag]);
        }
      }
      return results;
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
        if (this.expansions.base) m += MODULE_BASE;
        if (this.expansions.corpera) m += MODULE_CORP;
        if (this.expansions.prelude) m += MODULE_PRELUDE;
        if (this.expansions.venus) m += MODULE_VENUS;
        if (this.expansions.colonies) m += MODULE_COLONIES;
        if (this.expansions.turmoil) m += MODULE_TURMOIL;
        if (this.expansions.community) m += MODULE_COMMUNITY;
        if (this.expansions.promo) m += MODULE_PROMO;
        if (this.expansions.ares) m += MODULE_ARES;
        if (this.expansions.moon) m += MODULE_MOON;
        if (this.expansions.pathfinders) m += MODULE_PATHFINDERS;
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
      data.corpera = !data.corpera;
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
      return copy.sort((a, b) => a.localeCompare(b));
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
      return allGlobalEventNames();
    },
    getAllColonyNames() {
      return OFFICIAL_COLONY_NAMES.concat(COMMUNITY_COLONY_NAMES);
    },
    getGlobalEventModel(globalEventName: GlobalEventName): GlobalEventModel {
      return getGlobalEventModel(globalEventName);
    },
    filterByName(name: string) {
      const filterText = this.$data.filterText.toUpperCase();
      if (this.$data.filterText.length > 0) {
        if (name.toUpperCase().includes(filterText) === false) {
          return false;
        }
      }
      return true;
    },
    showCard(cardName: CardName): boolean {
      if (!this.filterByName(cardName)) return false;

      const card = getCard(cardName);
      if (card === undefined) {
        return false;
      }

      if (!this.types[card.cardType]) return false;
      for (const tag of card.tags) {
        if (!this.tags[tag]) return false;
      }
      return this.expansions[card.module] === true;
    },
    showGlobalEvent(name: GlobalEventName): boolean {
      return this.filterByName(name);
    },
    showColony(name: ColonyName): boolean {
      return this.filterByName(name);
    },
    getLanguageCssClass() {
      const language = getPreferences().lang;
      return 'language-' + language;
    },
    colonyModel(colonyName: ColonyName): ColonyModel {
      return {
        colonies: [],
        isActive: true,
        name: colonyName,
        trackPosition: 5,
        visitor: undefined,
      };
    },
  },
});

</script>
