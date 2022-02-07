<template>
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
          <div class="corporations-filter-group" v-for="entry in cardsByModule.associations()" v-bind:key="entry[0]">
            <div v-if="entry[1].length > 0">
              <div class="corporations-filter-toolbox-cont">
                  <div class="corporations-filter-toolbox">
                      <a href="#" v-i18n v-on:click.prevent="selectAll(entry[0])">All</a> |
                      <a href="#" v-i18n v-on:click.prevent="selectNone(entry[0])">None</a> |
                      <a href="#" v-i18n v-on:click.prevent="invertSelection(entry[0])">Invert</a>
                  </div>
              </div>
              <div v-for="corporation in entry[1]" v-bind:key="corporation">
                  <label class="form-checkbox">
                      <input type="checkbox" v-model="selectedCorporations" :value="corporation"/>
                      <i class="form-icon"></i>{{ corporation }}
                  </label>
              </div>
          </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import {CardName} from '@/common/cards/CardName';
import {GameModule} from '@/common/cards/GameModule';
import {byModule, byType, getCards, toName} from '@/client/cards/ClientCardManifest';
import {CardType} from '@/common/cards/CardType';
import {MultiMap} from 'mnemonist';

function corpCardNames(module: GameModule): Array<CardName> {
  return getCards(byModule(module))
    .filter(byType(CardType.CORPORATION))
    .map(toName)
    .filter((name) => name !== CardName.BEGINNER_CORPORATION);
}

export default Vue.extend({
  name: 'CorporationsFilter',
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
    pathfindersExpansion: {
      type: Boolean,
    },
  },
  data() {
    const cardsByModule: MultiMap<GameModule, CardName> = new MultiMap();
    getCards(byType(CardType.CORPORATION)).forEach((cam) => {
      if (cam.card.name !== CardName.BEGINNER_CORPORATION) {
        cardsByModule.set(cam.module, cam.card.name);
      }
    });

    return {
      cardsByModule: cardsByModule,
      customCorporationsList: false,
      selectedCorporations: [
        // A bit sloppy since map is just above, but it will do.
        ...corpCardNames(GameModule.Base)!,
        ...this.corporateEra ? corpCardNames(GameModule.CorpEra) : [],
        ...this.prelude ? corpCardNames(GameModule.Prelude) : [],
        ...this.venusNext ? corpCardNames(GameModule.Venus) : [],
        ...this.colonies ? corpCardNames(GameModule.Colonies) : [],
        ...this.turmoil ? corpCardNames(GameModule.Turmoil) : [],
        ...this.promoCardsOption ? corpCardNames(GameModule.Promo) : [],
        ...this.communityCardsOption ? corpCardNames(GameModule.Community) : [],
        ...this.moonExpansion ? corpCardNames(GameModule.Moon) : [],
        ...this.pathfindersExpansion ? corpCardNames(GameModule.Pathfinders) : [],
      ],
    };
  },
  methods: {
    getSelected(): Array<CardName> {
      if (Array.isArray(this.selectedCorporations)) {
        return this.selectedCorporations;
      }
      console.warn('unexpectedly got boolean for selectedCorporations');
      return [];
    },
    getItemsByGroup(group: string): Array<CardName> {
      if (group === 'All') return Array.from(this.cardsByModule.values());

      const corps = this.cardsByModule.get(group as GameModule);
      if (corps === undefined) {
        console.log('module %s not found', group);
        return [];
      } else {
        return corps.slice();
      }
    },
    selectAll(group: string) {
      const items = this.getItemsByGroup(group);
      for (const item of items) {
        if (this.getSelected().includes(item) === false) {
          this.getSelected().push(item);
        }
      }
    },
    removeFromSelection(cardName: CardName) {
      const itemIdx = this.getSelected().indexOf(cardName);
      if (itemIdx !== -1) {
        this.getSelected().splice(itemIdx, 1);
      }
    },
    selectNone(group: string) {
      const items = this.getItemsByGroup(group);
      for (const item of items) {
        this.removeFromSelection(item);
      }
    },
    invertSelection(group: string) {
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
    selectedCorporations(value) {
      this.$emit('corporation-list-changed', value);
    },
    corporateEra(enabled) {
      enabled ? this.selectAll(GameModule.CorpEra) : this.selectNone(GameModule.CorpEra);
    },
    prelude(enabled) {
      enabled ? this.selectAll(GameModule.Prelude) : this.selectNone(GameModule.Prelude);
    },
    venusNext(enabled) {
      enabled ? this.selectAll(GameModule.Venus) : this.selectNone(GameModule.Venus);
    },
    colonies(enabled) {
      enabled ? this.selectAll(GameModule.Colonies) : this.selectNone(GameModule.Colonies);
    },
    turmoil(enabled) {
      enabled ? this.selectAll(GameModule.Turmoil) : this.selectNone(GameModule.Turmoil);
    },
    promoCardsOption(enabled) {
      enabled ? this.selectAll(GameModule.Promo) : this.selectNone(GameModule.Promo);
    },
    communityCardsOption(enabled) {
      enabled ? this.selectAll(GameModule.Community) : this.selectNone(GameModule.Community);
    },
    moonExpansion(enabled) {
      enabled ? this.selectAll(GameModule.Moon) : this.selectNone(GameModule.Moon);
    },
  },
});
</script>
