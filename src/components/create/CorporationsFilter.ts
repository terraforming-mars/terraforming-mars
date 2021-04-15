import Vue from 'vue';

import {CardName} from '../../CardName';
import {ALL_CARD_MANIFESTS, MANIFEST_BY_MODULE} from '../../cards/AllCards';
import {GameModule} from '../../GameModule';

function corpCardNames(module: GameModule): Array<CardName> {
  const manifest = MANIFEST_BY_MODULE.get(module);
  if (manifest === undefined) {
    console.log('manifest %s not found', manifest);
    return [];
  } else {
    const cards: Array<CardName> = [];
    manifest.corporationCards.factories.forEach((cf) => {
      if (cf.cardName !== CardName.BEGINNER_CORPORATION) {
        cards.push(cf.cardName);
      }
    });
    return cards;
  }
}

const allItems: Array<CardName> = [];
ALL_CARD_MANIFESTS.forEach((manifest) => {
  manifest.corporationCards.factories.forEach((cf) => {
    allItems.push(cf.cardName);
  });
});

export const CorporationsFilter = Vue.component('corporations-filter', {
  props: {
    corporateEra: {
      type: Boolean,
    },
    prelude: {
      type: Boolean,
    },
    venusNext: {
      type: Boolean,
    },
    colonies: {
      type: Boolean,
    },
    turmoil: {
      type: Boolean,
    },
    promoCardsOption: {
      type: Boolean,
    },
    communityCardsOption: {
      type: Boolean,
    },
    moonExpansion: {
      type: Boolean,
    },
  },
  data: function() {
    const cardsByModuleMap: Map<GameModule, Array<CardName>> =
            new Map(ALL_CARD_MANIFESTS.map((m) => [m.module, corpCardNames(m.module)]));
    return {
      cardsByModuleMap: cardsByModuleMap,
      customCorporationsList: false,
      selectedCorporations: [
        ...cardsByModuleMap.get(GameModule.Base)!,
        ...this.corporateEra ? cardsByModuleMap.get(GameModule.CorpEra)! : [],
        ...this.prelude ? cardsByModuleMap.get(GameModule.Prelude)! : [],
        ...this.venusNext ? cardsByModuleMap.get(GameModule.Venus)! : [],
        ...this.colonies ? cardsByModuleMap.get(GameModule.Colonies)! : [],
        ...this.turmoil ? cardsByModuleMap.get(GameModule.Turmoil)! : [],
        ...this.promoCardsOption ? cardsByModuleMap.get(GameModule.Promo)! : [],
        ...this.communityCardsOption ? cardsByModuleMap.get(GameModule.Community)! : [],
        ...this.moonExpansion ? cardsByModuleMap.get(GameModule.Moon)! : [],
      ] as Array<CardName> | boolean /* v-model thinks this can be boolean */,
      corpsByModule: Array.from(cardsByModuleMap),
    };
  },
  methods: {
    getSelected: function(): Array<CardName> {
      if (Array.isArray(this.selectedCorporations)) {
        return this.selectedCorporations;
      }
      console.warn('unexpectedly got boolean for selectedCorporations');
      return [];
    },
    getItemsByGroup: function(group: string): Array<CardName> {
      if (group === 'All') return allItems.slice();

      const corps = this.cardsByModuleMap.get(group as GameModule);
      if (corps === undefined) {
        console.log('module %s not found', group);
        return [];
      } else {
        return corps.slice();
      }
    },
    selectAll: function(group: string) {
      const items = this.getItemsByGroup(group);
      for (const item of items) {
        if (this.getSelected().includes(item) === false) {
          this.getSelected().push(item);
        }
      }
    },
    removeFromSelection: function(cardName: CardName) {
      const itemIdx = this.getSelected().indexOf(cardName);
      if (itemIdx !== -1) {
        this.getSelected().splice(itemIdx, 1);
      }
    },
    selectNone: function(group: string) {
      const items = this.getItemsByGroup(group);
      for (const item of items) {
        this.removeFromSelection(item);
      }
    },
    invertSelection: function(group: string) {
      const items = this.getItemsByGroup(group);

      for (const idx in items) {
        if (this.getSelected().includes(items[idx])) {
          this.removeFromSelection(items[idx]);
        } else {
          this.getSelected().push(items[idx]);
        }
      }
    },
  },
  watch: {
    selectedCorporations: function(value) {
      this.$emit('corporation-list-changed', value);
    },
    corporateEra: function(enabled) {
      enabled ? this.selectAll(GameModule.CorpEra) : this.selectNone(GameModule.CorpEra);
    },
    prelude: function(enabled) {
      enabled ? this.selectAll(GameModule.Prelude) : this.selectNone(GameModule.Prelude);
    },
    venusNext: function(enabled) {
      enabled ? this.selectAll(GameModule.Venus) : this.selectNone(GameModule.Venus);
    },
    colonies: function(enabled) {
      enabled ? this.selectAll(GameModule.Colonies) : this.selectNone(GameModule.Colonies);
    },
    turmoil: function(enabled) {
      enabled ? this.selectAll(GameModule.Turmoil) : this.selectNone(GameModule.Turmoil);
    },
    promoCardsOption: function(enabled) {
      enabled ? this.selectAll(GameModule.Promo) : this.selectNone(GameModule.Promo);
    },
    communityCardsOption: function(enabled) {
      enabled ? this.selectAll(GameModule.Community) : this.selectNone(GameModule.Community);
    },
    moonExpansion: function(enabled) {
      enabled ? this.selectAll(GameModule.Moon) : this.selectNone(GameModule.Moon);
    },
  },
  template: `
    <div class="corporations-filter">
        <div class="corporations-filter-toolbox-cont">
            <h2 v-i18n>Corporations</h2>
            <div class="corporations-filter-toolbox corporations-filter-toolbox--topmost">
                <a href="#" v-i18n v-on:click.prevent="selectAll('All')">All*</a> |
                <a href="#" v-i18n v-on:click.prevent="selectNone('All')">None*</a> |
                <a href="#" v-i18n v-on:click.prevent="invertSelection('All')">Invert*</a>
            </div>
        </div>
        <br/>
        <div class="corporations-filter-group" v-for="entry in corpsByModule" v-if="entry[1].length > 0">
            <div class="corporations-filter-toolbox-cont">
                <div class="corporations-filter-toolbox">
                    <a href="#" v-i18n v-on:click.prevent="selectAll(entry[0])">All</a> |
                    <a href="#" v-i18n v-on:click.prevent="selectNone(entry[0])">None</a> |
                    <a href="#" v-i18n v-on:click.prevent="invertSelection(entry[0])">Invert</a>
                </div>
            </div>
            <div v-for="corporation in entry[1]">
                <label class="form-checkbox">
                    <input type="checkbox" v-model="selectedCorporations" :value="corporation"/>
                    <i class="form-icon"></i>{{ corporation }}
                </label>
            </div>
        </div>
    </div>
    `,
});
