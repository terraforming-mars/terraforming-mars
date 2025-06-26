<template>
    <div class="corporations-filter">
        <div class="corporations-filter-toolbox-cont">
            <h2 v-i18n>Corporations</h2>
            <div class="corporations-filter-toolbox corporations-filter-toolbox--topmost">
                <a href="#" v-i18n v-on:click.prevent="selectAll('All')">All*</a> |
                <a href="#" v-i18n v-on:click.prevent="selectNone('All')">None*</a> |
                <a href="#" v-i18n v-on:click.prevent="invertSelection('All')">Invert*</a>
                <input ref="filter" class="filter" :placeholder="$t('filter')" v-model="filterText">
            </div>
        </div>
        <br/>
        <template v-for="module in GAME_MODULES">
          <div class="corporations-filter-group" v-if="cardsByModule[module].length > 0" v-bind:key="module">
            <div class="corporations-filter-toolbox-cont">
                <div><span v-i18n>{{MODULE_NAMES[module]}}</span>&nbsp;<div :class="icon(module)"></div></div><br>
                <div class="corporations-filter-toolbox">
                    <a href="#" v-i18n v-on:click.prevent="selectAll(module)">All</a> |
                    <a href="#" v-i18n v-on:click.prevent="selectNone(module)">None</a> |
                    <a href="#" v-i18n v-on:click.prevent="invertSelection(module)">Invert</a>
                </div>
            </div>
            <div v-for="corporation in cardsByModule[module]" v-bind:key="corporation" v-show="include(corporation)">
                <label class="form-checkbox">
                    <input type="checkbox" v-model="selectedCorporations" :value="corporation"/>
                    <i class="form-icon"></i><span v-i18n>{{ corporation }}</span>
                    <div v-for="expansion in compatibility(corporation)" :key="expansion" :class="icon(expansion)"></div>
                </label>
            </div>
          </div>
        </template>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import {CardName} from '@/common/cards/CardName';
import {Expansion, GameModule, GAME_MODULES, MODULE_NAMES} from '@/common/cards/GameModule';
import {byModule, byType, getCard, getCards} from '@/client/cards/ClientCardManifest';
import {CardType} from '@/common/cards/CardType';
import {toName} from '@/common/utils/utils';

function corpCardNames(module: GameModule): Array<CardName> {
  return getCards(byModule(module))
    .filter(byType(CardType.CORPORATION))
    .map(toName)
    .filter((name) => name !== CardName.BEGINNER_CORPORATION);
}

type Group = GameModule | 'All';

export default Vue.extend({
  name: 'CorporationsFilter',
  props: {
    expansions: Object as () => Record<Expansion, boolean>,
  },
  data() {
    // Start by giving every entry a default value
    // Ideally, remove 'x' and inline it into Object.fromEntries, but Typescript doesn't like it.
    const x = GAME_MODULES.map((module) => [module, []]);
    const cardsByModule: Record<GameModule, Array<CardName>> = Object.fromEntries(x);

    getCards(byType(CardType.CORPORATION)).forEach((card) => {
      if (card.name !== CardName.BEGINNER_CORPORATION) {
        cardsByModule[card.module].push(card.name);
      }
    });
    GAME_MODULES.forEach((module) => cardsByModule[module].sort());

    return {
      filterText: '',
      cardsByModule: cardsByModule,
      customCorporationsList: false,
      selectedCorporations: [
        // A bit sloppy since map is just above, but it will do.
        ...corpCardNames('base'),
        ...this.expansions.corpera ? corpCardNames('corpera') : [],
        ...this.expansions.prelude ? corpCardNames('prelude') : [],
        ...this.expansions.prelude2 ? corpCardNames('prelude2') : [],
        ...this.expansions.venus ? corpCardNames('venus') : [],
        ...this.expansions.colonies ? corpCardNames('colonies') : [],
        ...this.expansions.turmoil ? corpCardNames('turmoil') : [],
        ...this.expansions.promo ? corpCardNames('promo') : [],
        ...this.expansions.community ? corpCardNames('community') : [],
        ...this.expansions.moon ? corpCardNames('moon') : [],
        ...this.expansions.pathfinders ? corpCardNames('pathfinders') : [],
      ],
      GAME_MODULES: GAME_MODULES,
      MODULE_NAMES: MODULE_NAMES,
    };
  },
  methods: {
    getItemsByGroup(group: Group): Array<CardName> {
      if (group === 'All') return GAME_MODULES.map((module) => this.cardsByModule[module]).flat();
      const corps = this.cardsByModule[group];
      if (corps === undefined) {
        console.log('module %s not found', group);
        return [];
      } else {
        return corps.slice();
      }
    },
    selectAll(group: Group) {
      const items = this.getItemsByGroup(group);
      for (const item of items) {
        if (this.selectedCorporations.includes(item) === false) {
          this.selectedCorporations.push(item);
        }
      }
    },
    removeFromSelection(cardName: CardName) {
      const itemIdx = this.selectedCorporations.indexOf(cardName);
      if (itemIdx !== -1) {
        this.selectedCorporations.splice(itemIdx, 1);
      }
    },
    selectNone(group: Group) {
      const items = this.getItemsByGroup(group);
      for (const item of items) {
        this.removeFromSelection(item);
      }
    },
    invertSelection(group: Group) {
      const items = this.getItemsByGroup(group);

      for (const idx in items) {
        if (this.selectedCorporations.includes(items[idx])) {
          this.removeFromSelection(items[idx]);
        } else {
          this.selectedCorporations.push(items[idx]);
        }
      }
    },
    watchSelect(module: GameModule, enabled: boolean) {
      enabled ? this.selectAll(module) : this.selectNone(module);
    },
    compatibility(corporation: CardName): Array<GameModule> {
      return getCard(corporation)?.compatibility ?? [];
    },
    icon(module: GameModule) {
      let suffix: string = module;
      if (module === 'colonies') suffix = 'colony';
      if (module === 'moon') suffix = 'themoon';
      return `create-game-expansion-icon expansion-icon-${suffix}`;
    },
    include(name: string) {
      const normalized = this.filterText.toLocaleUpperCase();
      if (normalized.length === 0) {
        return true;
      }
      return name.toLocaleUpperCase().includes(normalized);
    },
  },
  watch: {
    selectedCorporations(value) {
      this.$emit('corporation-list-changed', value);
    },
    corporateEra(enabled) {
      this.watchSelect('corpera', enabled);
    },
    prelude(enabled) {
      this.watchSelect('prelude', enabled);
    },
    venusNext(enabled) {
      this.watchSelect('venus', enabled);
    },
    colonies(enabled) {
      this.watchSelect('colonies', enabled);
    },
    turmoil(enabled) {
      this.watchSelect('turmoil', enabled);
    },
    promoCardsOption(enabled) {
      this.watchSelect('promo', enabled);
    },
    communityCardsOption(enabled) {
      this.watchSelect('community', enabled);
    },
    moonExpansion(enabled) {
      this.watchSelect('moon', enabled);
    },
    pathfindersExpansion(enabled) {
      this.watchSelect('pathfinders', enabled);
    },
  },
});
</script>
