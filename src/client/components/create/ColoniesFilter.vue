<template>
    <div class="colonies-filter">
        <div>
            <h2 v-i18n>Colonies</h2>
            <div class="corporations-filter-toolbox corporations-filter-toolbox--topmost">
                <a href="#" v-i18n v-on:click.prevent="selectAll('All')">All*</a> |
                <a href="#" v-i18n v-on:click.prevent="selectNone('All')">None*</a> |
                <a href="#" v-i18n v-on:click.prevent="invertSelection('All')">Invert*</a>
            </div>
        </div>
        <div class="colonies-filter-list" v-for="module in modules" v-bind:key="module">
            <h2 v-i18n>{{title(module)}}</h2>
              <a href="#" v-i18n v-on:click.prevent="selectAll(module)">All</a> |
              <a href="#" v-i18n v-on:click.prevent="selectNone(module)">None</a> |
              <a href="#" v-i18n v-on:click.prevent="invertSelection(module)">Invert</a>
            <label class="form-checkbox" v-for="colony in getColonies(module)" v-bind:key="colony">
                <input type="checkbox" v-model="selectedColonies" :value="colony">
                <i class="form-icon"></i><span v-i18n>{{ colony }} - ({{ description(colony) }})</span>
            </label>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {ColonyName} from '@/common/colonies/ColonyName';
import {COLONY_DESCRIPTIONS} from '@/common/colonies/ColonyDescription';
import {OFFICIAL_COLONY_NAMES, COMMUNITY_COLONY_NAMES} from '@/common/colonies/AllColonies';

type Data = {
  allColonies: Array<ColonyName>,
  officialColonies: Array<ColonyName>,
  communityColonies: Array<ColonyName>,
  selectedColonies: Array<ColonyName>,
  modules: Array<ColonyModule>,
}
type ColonyModule = 'colonies' | 'community';
type Group = ColonyModule | 'All';

export default Vue.extend({
  name: 'ColoniesFilter',
  props: {
    communityCardsOption: {
      type: Boolean,
    },
    venusNext: {
      type: Boolean,
    },
    turmoil: {
      type: Boolean,
    },
  },
  data() {
    const officialColonies = [...OFFICIAL_COLONY_NAMES].sort();
    const communityColonies = [...COMMUNITY_COLONY_NAMES].sort();

    const data: Data = {
      allColonies: officialColonies.concat(communityColonies),
      officialColonies,
      communityColonies,
      selectedColonies: [
        ...officialColonies,
        ...this.communityCardsOption ? communityColonies: [],
      ],
      modules: ['colonies', 'community'],
    };
    return data;
  },
  methods: {
    // Do not delete this method. It's used by CreateGameForm.
    updateColoniesByNames(colonyNames: Array<ColonyName>) {
      this.selectedColonies = [];
      for (const colony of this.allColonies) {
        if (colonyNames.includes(colony)) {
          this.selectedColonies.push(colony);
        }
      }
    },
    description(colonyName: ColonyName): string {
      return COLONY_DESCRIPTIONS.get(colonyName) ?? 'unknown';
    },
    getItemsByGroup(group: Group): Array<ColonyName> {
      switch (group) {
      case 'All': return this.allColonies;
      case 'colonies': return this.officialColonies;
      case 'community': return this.communityColonies;
      default: return [];
      }
    },
    selectAll(group: Group) {
      const items = this.getItemsByGroup(group);
      for (const item of items) {
        if (this.selectedColonies.includes(item) === false) {
          this.selectedColonies.push(item);
        }
      }
    },
    removeFromSelection(colonyName: ColonyName) {
      const itemIdx = this.selectedColonies.indexOf(colonyName);
      if (itemIdx !== -1) {
        this.selectedColonies.splice(itemIdx, 1);
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
        if (this.selectedColonies.includes(items[idx])) {
          this.removeFromSelection(items[idx]);
        } else {
          this.selectedColonies.push(items[idx]);
        }
      }
    },
    title(module: ColonyModule) {
      if (module === 'colonies') return 'Official';
      if (module === 'community') return 'Community';
      return module;
    },
    getColonies(module: ColonyModule) {
      if (module === 'colonies') return this.officialColonies;
      if (module === 'community') return this.communityColonies;
      return [];
    },
  },
  watch: {
    selectedColonies(value: Array<ColonyName>) {
      const colonyNames: Array<ColonyName> = [...value];
      this.$emit('colonies-list-changed', colonyNames);
    },
    communityCardsOption(enabled) {
      if (enabled) {
        this.selectedColonies = OFFICIAL_COLONY_NAMES.concat(COMMUNITY_COLONY_NAMES).slice();
        if (this.venusNext === false) this.selectedColonies = this.selectedColonies.filter((c) => c !== ColonyName.VENUS);
        if (this.turmoil === false) this.selectedColonies = this.selectedColonies.filter((c) => c !== ColonyName.PALLAS);
      } else {
        this.selectedColonies = OFFICIAL_COLONY_NAMES.slice();
      }
    },
    venusNext(enabled) {
      if (this.communityCardsOption && Array.isArray(this.selectedColonies)) {
        if (enabled === false) {
          this.selectedColonies = this.selectedColonies.filter((c) => c !== ColonyName.VENUS);
        } else if (this.selectedColonies.find((c) => c === ColonyName.VENUS) === undefined) {
          this.selectedColonies.push(ColonyName.VENUS);
        }
      }
    },
    turmoil(enabled) {
      if (this.communityCardsOption && Array.isArray(this.selectedColonies)) {
        if (enabled === false) {
          this.selectedColonies = this.selectedColonies.filter((c) => c !== ColonyName.PALLAS);
        } else if (this.selectedColonies.find((c) => c === ColonyName.PALLAS) === undefined) {
          this.selectedColonies.push(ColonyName.PALLAS);
        }
      }
    },
  },
});
</script>
