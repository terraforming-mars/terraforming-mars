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

type Group = GameModule | 'All';

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
    getItemsByGroup(group: Group): Array<CardName> {
      if (group === 'All') return Array.from(this.cardsByModule.values());

      const corps = this.cardsByModule.get(group);
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
  },
  watch: {
    selectedCorporations(value) {
      this.$emit('corporation-list-changed', value);
    },
    corporateEra(enabled) {
      this.watchSelect(GameModule.CorpEra, enabled);
    },
    prelude(enabled) {
      this.watchSelect(GameModule.Prelude, enabled);
    },
    venusNext(enabled) {
      this.watchSelect(GameModule.Venus, enabled);
    },
    colonies(enabled) {
      this.watchSelect(GameModule.Colonies, enabled);
    },
    turmoil(enabled) {
      this.watchSelect(GameModule.Turmoil, enabled);
    },
    promoCardsOption(enabled) {
      this.watchSelect(GameModule.Promo, enabled);
    },
    communityCardsOption(enabled) {
      this.watchSelect(GameModule.Community, enabled);
    },
    moonExpansion(enabled) {
      this.watchSelect(GameModule.Moon, enabled);
    },
    pathfindersExpansion(enabled) {
      this.watchSelect(GameModule.Pathfinders, enabled);
    },
  },
});
</script>
