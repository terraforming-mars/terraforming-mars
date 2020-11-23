import Vue from 'vue';
import {Callisto} from '../colonies/Callisto';
import {Ceres} from '../colonies/Ceres';
import {Colony} from '../colonies/Colony';
import {Europa} from '../colonies/Europa';
import {Ganymede} from '../colonies/Ganymede';
import {Io} from '../colonies/Io';
import {Luna} from '../colonies/Luna';
import {Miranda} from '../colonies/Miranda';
import {Pluto} from '../colonies/Pluto';
import {Titan} from '../colonies/Titan';
import {Triton} from '../colonies/Triton';
import {Enceladus} from '../colonies/Enceladus';
import {ColonyName} from '../colonies/ColonyName';
import {Iapetus} from '../cards/community/Iapetus';
import {Mercury} from '../cards/community/Mercury';
import {Hygiea} from '../cards/community/Hygiea';
import {Titania} from '../cards/community/Titania';
import {Venus} from '../cards/community/Venus';
import {Leavitt} from '../cards/community/Leavitt';
import {Pallas} from '../cards/community/Pallas';
import {Deimos} from '../cards/community/Deimos';

const officialColonies: Array<Colony> = [
  new Callisto(),
  new Ceres(),
  new Enceladus(),
  new Europa(),
  new Ganymede(),
  new Io(),
  new Luna(),
  new Miranda(),
  new Pluto(),
  new Titan(),
  new Triton(),
];

let communityColonies: Array<Colony> = [
  new Iapetus(),
  new Mercury(),
  new Hygiea(),
  new Titania(),
  new Venus(),
  new Leavitt(),
  new Pallas(),
  new Deimos(),
];

export const ColoniesFilter = Vue.component('colonies-filter', {
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
    aresExtension: {
      type: Boolean,
    },
  },
  data: function() {
    if (!this.venusNext) communityColonies = communityColonies.filter((c) => c.name !== ColonyName.VENUS);
    if (!this.turmoil) communityColonies = communityColonies.filter((c) => c.name !== ColonyName.PALLAS);
    if (!this.aresExtension) communityColonies = communityColonies.filter((c) => c.name !== ColonyName.DEIMOS);

    return {
      allColonies: officialColonies.concat(communityColonies),
      officialColonies: officialColonies,
      communityColonies: communityColonies,
      selectedColonies: [
        ...officialColonies,
        ...this.communityCardsOption ? communityColonies: [],
      ] as Array<Colony> | boolean,
    };
  },
  methods: {
    updateColoniesByNames(colonyNames: Array<ColonyName>) {
      this.selectedColonies = [];
      for (const colony of this.allColonies) {
        if (colonyNames.includes(colony.name)) {
          this.selectedColonies.push(colony);
        }
      }
    },
  },
  watch: {
    selectedColonies: function(value) {
      const colonyNames: Array<ColonyName> = [];
      value.forEach(function(el: any) {
        colonyNames.push(el.name);
      } );
      this.$emit('colonies-list-changed', colonyNames);
    },
    communityCardsOption: function(enabled) {
      this.selectedColonies = enabled ? officialColonies.concat(communityColonies).slice() : officialColonies.slice();
    },
    venusNext: function(enabled) {
      const index = communityColonies.findIndex((c) => c.name === ColonyName.VENUS);

      if (enabled && index === -1) {
        communityColonies.push(new Venus());
      } else if (!enabled && index !== -1) {
        communityColonies.splice(index, 1);
      }
    },
    turmoil: function(enabled) {
      const index = communityColonies.findIndex((c) => c.name === ColonyName.PALLAS);

      if (enabled && index === -1) {
        communityColonies.push(new Pallas());
      } else if (!enabled && index !== -1) {
        communityColonies.splice(index, 1);
      }
    },
    aresExtension: function(enabled) {
      const index = communityColonies.findIndex((c) => c.name === ColonyName.DEIMOS);

      if (enabled && index === -1) {
        communityColonies.push(new Deimos());
      } else if (!enabled && index !== -1) {
        communityColonies.splice(index, 1);
      }
    },
  },
  template: `
    <div class="colonies-filter">
        <div>
            <h2 v-i18n>Colonies</h2>
        </div>
        <div class="colonies-filter-list">
            <h2>Official</h2>
            <label class="form-checkbox" v-for="colony in officialColonies">
                <input type="checkbox" v-model="selectedColonies" :value="colony"/>
                <i class="form-icon"></i><span v-i18n>{{ colony.name }} - ({{ colony.description }})</span>
            </label> 
        </div>
        <div class="colonies-filter-list">
            <h2>Community</h2>
            <label class="form-checkbox" v-for="colony in communityColonies">
                <input type="checkbox" v-model="selectedColonies" :value="colony"/>
                <i class="form-icon"></i><span v-i18n>{{ colony.name }} - ({{ colony.description }})</span>
            </label> 
        </div>
    </div>
    `,
});
