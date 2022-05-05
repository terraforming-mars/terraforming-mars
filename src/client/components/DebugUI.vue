<template>
  <div class="debug-ui-container" :class="getLanguageCssClass()">
      <h1>Cards List</h1>
      <div class="legacy-anchor">
        <a href="https://ssimeonoff.github.io/cards-list" target="_blank">legacy card UI</a>
      </div>

      <!-- start filters -->

      <div class="form-group">
        <input class="form-input form-input-line" placeholder="filter" v-model="filterText">
      </div>

      <div class="create-game-page-column">
      <button id="toggle-checkbox" v-on:click="invertExpansions()">
          <span v-i18n>Invert</span>
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

      <!-- types -->
      <div class="create-game-page-column">
        <button id="toggle-checkbox" v-on:click="invertTypes()">
            <span v-i18n>Invert</span>
        </button>

        <span v-for="type in allTypes" :key="type">
          <input type="checkbox" :name="`${type}-cardType`" :id="`${type}-cardType-checkbox`" v-model="types[type]">
          <label :for="`${type}-cardType-checkbox`" class="expansion-button">
              <span v-if="type === 'colonyTiles'" v-i18n>Colony Tiles</span>
              <span v-else-if="type === 'globalEvents'" v-i18n>Global Events</span>
              <span v-else v-i18n>{{type}}</span>
          </label>
        </span>
      </div>

      <!-- tags -->
      <div class="create-game-page-column">
        <button id="toggle-checkbox" v-on:click="invertTags()">
            <span v-i18n>Invert</span>
        </button>
        <span v-for="tag in allTags" :key="tag">
          <input type="checkbox" :name="`${tag}-cardType`" :id="`${tag}-cardType-checkbox`" v-model="tags[tag]">
          <label :for="`${tag}-cardType-checkbox`" class="expansion-button">
            <!-- a terrible hack, using create-game-expansion-icon because card-tag isn't enough to show the tag.-->
            <div :class="'create-game-expansion-icon card-tag tag-' + tag"></div>
          </label>
        </span>
      </div>

      <!-- start cards -->

      <section class="debug-ui-cards-list">
          <h2>Project Cards</h2>
          <div class="cardbox" v-for="card in getAllProjectCards()" :key="card">
              <Card v-if="showCard(card)" :card="{'name': card}" />
          </div>
      </section>
      <br>
      <section class="debug-ui-cards-list">
          <h2>Corporations</h2>
          <div class="cardbox" v-for="card in getAllCorporationCards()" :key="card">
              <Card v-if="showCard(card)" :card="{'name': card}" />
          </div>
      </section>
      <br>
      <section class="debug-ui-cards-list">
          <h2>Preludes</h2>
          <div class="cardbox" v-for="card in getAllPreludeCards()" :key="card">
              <Card v-if="showCard(card)" :card="{'name': card}" />
          </div>
      </section>
      <br>
      <section class="debug-ui-cards-list">
        <h2>Standard Projects</h2>
        <div class="cardbox" v-for="card in getAllStandardProjectCards()" :key="card">
            <Card v-if="showCard(card)" :card="{'name': card}" />
        </div>
      </section>

      <section class="debug-ui-cards-list">
        <h2>Global Events</h2>
        <template v-if="types.globalEvents">
          <div class="cardbox" v-for="globalEventName in getAllGlobalEvents()" :key="globalEventName">
            <global-event v-if="showGlobalEvent(globalEventName)" :globalEvent="getGlobalEventModel(globalEventName)" type="prior"></global-event>
          </div>
        </template>
      </section>

      <section>
        <h2>Colonies</h2>
        <template v-if="types.colonyTiles">
          <div class="player_home_colony_cont">
            <div class="player_home_colony" v-for="colonyName in getAllColonyNames()" :key="colonyName">
              <colony v-if="showColony(colonyName)" :colony="colonyModel(colonyName)"></colony>
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
import {allGlobalEventNames, getGlobalEvent, getGlobalEventModel} from '@/client/turmoil/ClientGlobalEventManifest';
import GlobalEvent from '@/client/components/turmoil/GlobalEvent.vue';
import {byType, getCard, getCards, toName} from '@/client/cards/ClientCardManifest';
import Colony from '@/client/components/colonies/Colony.vue';
import {COMMUNITY_COLONY_NAMES, OFFICIAL_COLONY_NAMES} from '@/common/colonies/AllColonies';
import {ColonyModel} from '@/common/models/ColonyModel';
import {ColonyName} from '@/common/colonies/ColonyName';
import PreferencesIcon from '@/client/components/PreferencesIcon.vue';
import {GameModule, GAME_MODULES} from '@/common/cards/GameModule';
import {Tags} from '@/common/cards/Tags';
import {getColony} from '@/client/colonies/ClientColonyManifest';

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

type TypeOptions = CardType | 'colonyTiles' | 'globalEvents';
type TagOptions = Tags | 'none';

export interface DebugUIModel {
  filterText: string,
  expansions: Record<GameModule, boolean>,
  types: Record<TypeOptions, boolean>,
  tags: Record<TagOptions, boolean>,
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
      // TODO(kberg): remove this huge initializer with something like the toggle
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
        none: true,
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
  computed: {
    allTypes(): Array<TypeOptions> {
      return [
        CardType.EVENT,
        CardType.ACTIVE,
        CardType.AUTOMATED,
        CardType.PRELUDE,
        CardType.CORPORATION,
        CardType.STANDARD_PROJECT,
        'colonyTiles',
        'globalEvents',
      ];
    },
    allTags(): Array<Tags | 'none'> {
      const results: Array<Tags | 'none'> = [];
      for (const tag in Tags) {
        if (Object.prototype.hasOwnProperty.call(Tags, tag)) {
          results.push((<any>Tags)[tag]);
        }
      }
      return results.concat('none');
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
    invertExpansions() {
      GAME_MODULES.forEach((module) => this.$data.expansions[module] = !this.$data.expansions[module]);
    },
    invertTags() {
      this.allTags.forEach((tag) => this.$data.tags[tag] = !this.$data.tags[tag]);
    },
    invertTypes() {
      this.allTypes.forEach((type) => this.$data.types[type] = !this.$data.types[type]);
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
      if (card.tags.length === 0 && this.tags['none'] === false) return false;
      for (const tag of card.tags) {
        if (!this.tags[tag]) return false;
      }
      return this.expansions[card.module] === true;
    },
    showGlobalEvent(name: GlobalEventName): boolean {
      if (!this.filterByName(name)) return false;
      const globalEvent = getGlobalEvent(name);
      console.log(globalEvent?.module);
      return globalEvent !== undefined && this.expansions[globalEvent.module] === true;
    },
    showColony(name: ColonyName): boolean {
      if (!this.filterByName(name)) return false;
      const colony = getColony(name);
      return colony !== undefined && this.expansions[colony.module ?? 'base'] === true;
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
