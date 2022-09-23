<template>
    <div class="corporations-filter">
        <div class="corporations-filter-toolbox-cont">
            <h2 v-i18n>Preludes</h2>
            <div class="corporations-filter-toolbox corporations-filter-toolbox--topmost">
                <a href="#" v-i18n v-on:click.prevent="selectAll('All')">All*</a> |
                <a href="#" v-i18n v-on:click.prevent="selectNone('All')">None*</a> |
                <a href="#" v-i18n v-on:click.prevent="invertSelection('All')">Invert*</a>
            </div>
        </div>
        <br/>
        <template v-for="module in GAME_MODULES">
          <div class="corporations-filter-group" v-if="cardsByModule[module].length > 0" v-bind:key="module">
            <div class="corporations-filter-toolbox-cont">
                <div><span v-i18n>{{moduleName(module)}}</span>&nbsp;<div :class="icon(module)"></div></div><br>
                <div class="corporations-filter-toolbox">
                    <a href="#" v-i18n v-on:click.prevent="selectAll(module)">All</a> |
                    <a href="#" v-i18n v-on:click.prevent="selectNone(module)">None</a> |
                    <a href="#" v-i18n v-on:click.prevent="invertSelection(module)">Invert</a>
                </div>
            </div>
            <div v-for="prelude in cardsByModule[module]" v-bind:key="prelude">
                <label class="form-checkbox">
                    <input type="checkbox" v-model="selectedPreludes" :value="prelude"/>
                    <i class="form-icon"></i><span v-i18n>{{ prelude }}</span>
                    <div v-for="expansion in expansions(prelude)" :key="expansion" :class="icon(expansion)"></div>
                </label>
            </div>
          </div>
        </template>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import {CardName} from '@/common/cards/CardName';
import {GameModule, GAME_MODULES} from '@/common/cards/GameModule';
import {byModule, byType, getCard, getCards, toName} from '@/client/cards/ClientCardManifest';
import {CardType} from '@/common/cards/CardType';

function preludeCardNames(module: GameModule): Array<CardName> {
  return getCards(byModule(module))
    .filter(byType(CardType.PRELUDE))
    .map(toName);
}

type Group = GameModule | 'All';

export default Vue.extend({
  name: 'PreludesFilter',
  props: {
    promoCardsOption: {
      type: Boolean,
    },
    communityCardsOption: {
      type: Boolean,
    },
    moonExpansion: {
      type: Boolean,
    },
    pathfindersExpansion: {
      type: Boolean,
    },
  },
  data() {
    // Start by giving every entry a default value
    // Ideally, remove 'x' and inline it into Object.fromEntries, but Typescript doesn't like it.
    const x = GAME_MODULES.map((module) => [module, []]);
    const cardsByModule: Record<GameModule, Array<CardName>> = Object.fromEntries(x);

    getCards(byType(CardType.PRELUDE)).forEach((card) => {
      cardsByModule[card.module].push(card.name);
    });
    GAME_MODULES.forEach((module) => cardsByModule[module].sort());

    return {
      cardsByModule: cardsByModule,
      customPreludesList: false,
      selectedPreludes: [
        // A bit sloppy since map is just above, but it will do.
        ...preludeCardNames('prelude'),
        ...this.promoCardsOption ? preludeCardNames('promo') : [],
        ...this.communityCardsOption ? preludeCardNames('community') : [],
        ...this.moonExpansion ? preludeCardNames('moon') : [],
        ...this.pathfindersExpansion ? preludeCardNames('pathfinders') : [],
      ],
      GAME_MODULES: GAME_MODULES,
    };
  },
  methods: {
    // Do not delete this method. It's used by CreateGameForm.
    updatePreludes(cardNames: Array<CardName>) {
      this.selectedPreludes = [];
      for (const cardName of this.getItemsByGroup('All')) {
        if (cardNames.includes(cardName)) {
          this.selectedPreludes.push(cardName);
        }
      }
    },

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
        if (this.selectedPreludes.includes(item) === false) {
          this.selectedPreludes.push(item);
        }
      }
    },
    removeFromSelection(cardName: CardName) {
      const itemIdx = this.selectedPreludes.indexOf(cardName);
      if (itemIdx !== -1) {
        this.selectedPreludes.splice(itemIdx, 1);
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
        if (this.selectedPreludes.includes(items[idx])) {
          this.removeFromSelection(items[idx]);
        } else {
          this.selectedPreludes.push(items[idx]);
        }
      }
    },
    watchSelect(module: GameModule, enabled: boolean) {
      enabled ? this.selectAll(module) : this.selectNone(module);
    },
    expansions(prelude: CardName): Array<GameModule> {
      return getCard(prelude)?.compatibility ?? [];
    },
    icon(module: GameModule) {
      let suffix: string = module;
      if (module === 'colonies') suffix = 'colony';
      if (module === 'moon') suffix = 'themoon';
      return `create-game-expansion-icon expansion-icon-${suffix}`;
    },
    moduleName(module: GameModule) {
      switch (module) {
      case 'promo': return 'Promo';
      case 'prelude': return 'Prelude';
      case 'community': return 'Community';
      case 'moon': return 'The Moon';
      case 'pathfinders': return 'Pathfinders';
      }
      return '';
    },
  },
  watch: {
    selectedPreludes(value) {
      this.$emit('prelude-list-changed', value);
    },
    prelude(enabled) {
      this.watchSelect('prelude', enabled);
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
