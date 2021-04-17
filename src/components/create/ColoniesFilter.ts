import Vue from 'vue';
import {Callisto} from '../../colonies/Callisto';
import {Ceres} from '../../colonies/Ceres';
import {Colony} from '../../colonies/Colony';
import {Europa} from '../../colonies/Europa';
import {Ganymede} from '../../colonies/Ganymede';
import {Io} from '../../colonies/Io';
import {Luna} from '../../colonies/Luna';
import {Miranda} from '../../colonies/Miranda';
import {Pluto} from '../../colonies/Pluto';
import {Titan} from '../../colonies/Titan';
import {Triton} from '../../colonies/Triton';
import {Enceladus} from '../../colonies/Enceladus';
import {ColonyName} from '../../colonies/ColonyName';
import {Iapetus} from '../../cards/community/Iapetus';
import {Mercury} from '../../cards/community/Mercury';
import {Hygiea} from '../../cards/community/Hygiea';
import {Titania} from '../../cards/community/Titania';
import {Venus} from '../../cards/community/Venus';
import {Leavitt} from '../../cards/community/Leavitt';
import {Pallas} from '../../cards/community/Pallas';

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

const communityColonies: Array<Colony> = [
  new Iapetus(),
  new Mercury(),
  new Hygiea(),
  new Titania(),
  new Leavitt(),
  new Venus(),
  new Pallas(),
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
  },
  data: function() {
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
      if (enabled) {
        this.selectedColonies = officialColonies.concat(communityColonies).slice();
        if (this.venusNext === false) this.selectedColonies = this.selectedColonies.filter((c) => c.name !== ColonyName.VENUS);
        if (this.turmoil === false) this.selectedColonies = this.selectedColonies.filter((c) => c.name !== ColonyName.PALLAS);
      } else {
        this.selectedColonies = officialColonies.slice();
      }
    },
    venusNext: function(enabled) {
      if (this.communityCardsOption && Array.isArray(this.selectedColonies)) {
        if (enabled === false) {
          this.selectedColonies = this.selectedColonies.filter((c) => c.name !== ColonyName.VENUS);
        } else if (this.selectedColonies.find((c) => c.name === ColonyName.VENUS) === undefined) {
          this.selectedColonies.push(new Venus());
        }
      }
    },
    turmoil: function(enabled) {
      if (this.communityCardsOption && Array.isArray(this.selectedColonies)) {
        if (enabled === false) {
          this.selectedColonies = this.selectedColonies.filter((c) => c.name !== ColonyName.PALLAS);
        } else if (this.selectedColonies.find((c) => c.name === ColonyName.PALLAS) === undefined) {
          this.selectedColonies.push(new Pallas());
        }
      }
    },
  },
  template: `
    <div class="colonies-filter">
        <div>
            <h2 v-i18n>Colonies</h2>
        </div>
        <div class="colonies-filter-list">
            <h2 v-i18n>Official</h2>
            <label class="form-checkbox" v-for="colony in officialColonies">
                <input type="checkbox" v-model="selectedColonies" :value="colony"/>
                <i class="form-icon"></i><span v-i18n>{{ colony.name }} - ({{ colony.description }})</span>
            </label>
        </div>
        <div class="colonies-filter-list">
            <h2 v-i18n>Community</h2>
            <label class="form-checkbox" v-for="colony in communityColonies">
                <input type="checkbox" v-model="selectedColonies" :value="colony"/>
                <i class="form-icon"></i><span v-i18n>{{ colony.name }} - ({{ colony.description }})</span>
            </label>
        </div>
    </div>
    `,
});
