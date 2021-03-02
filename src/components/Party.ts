import Vue from 'vue';
import {PartyModel} from '../models/TurmoilModel';
import {PartyName} from '../turmoil/parties/PartyName';

export const Party = Vue.component('party', {
  props: {
    party: {
      type: Object as () => PartyModel,
    },
    isDominant: {
      type: Boolean,
    },
    isAvailable: {
      type: Boolean,
    },
  },
  methods: {
    partyNameToCss: function(party: PartyName | undefined): string {
      if (party === undefined) {
        console.warn('no party provided');
        return '';
      }
      return party.toLowerCase().split(' ').join('_');
    },
    getDominantClass: function(): string {
      return 'select-party-leader-spot' + (this.isDominant ? ' dominance-marker' : '');
    },
    getUnavailablePartyClass: function(): string {
      return this.isAvailable ? '' : ' unavailable-party';
    },
  },
  template: `
    <div :class="'filterDiv party-container party-background--' + partyNameToCss(party.name) + getUnavailablePartyClass()">
      <div :class="'board-party board-party--' + partyNameToCss(party.name)">
        <div :class="getDominantClass()">
          <div class="send-delegate-leader-spot">
            <div v-if="party.partyLeader" :class="['player-token', party.partyLeader]"></div>
          </div>
        </div>
        <div class="grid-delegates grid-in-send-delegate">
          <div class="delegate-spot" v-for="n in 6" :key="n">
            <div v-if="party.delegates.length >= n" :class="'player-token '+party.delegates[n-1].color">
              <div class="count-in-send-delegate">{{ party.delegates[n-1].number }}</div>
            </div>
          </div>
        </div>
        <div :class="'selectable-party-name party-name party-name--'+partyNameToCss(party.name)" v-i18n>{{party.name}}</div>
      </div>
    </div>
    `,
});
