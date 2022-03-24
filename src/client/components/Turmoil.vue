
<template>
    <div class="turmoil" v-trim-whitespace>
      <div class="events-board">
        <global-event v-if="turmoil.distant" :globalEvent="turmoil.distant" type="distant"></global-event>
        <global-event v-if="turmoil.coming" :globalEvent="turmoil.coming" type="coming"></global-event>
        <global-event v-if="turmoil.current" :globalEvent="turmoil.current" type="current"></global-event>
      </div>

      <div class="turmoil-board">
        <div class="turmoil-header">
          <div class="turmoil-lobby">
            <div class="lobby-spot" v-for="n in 5" :key="n">
                <div v-if="turmoil.lobby.length >= n" :class="'player-token '+turmoil.lobby[n-1]"></div>
            </div>
          </div>
          <div class="dominant-party-name">
            <div :class="'party-name party-name--'+partyNameToCss(turmoil.ruling)" v-i18n>{{ turmoil.ruling }}</div>
          </div>
          <agendas type="dominant-bonus" :id="getPolicy(turmoil.ruling)"></agendas>
          <div class="policy-user-cubes">
            <template v-for="n in turmoil.policyActionUsers">
              <div v-if="n.turmoilPolicyActionUsed" :key="n.color" :class="'policy-use-marker board-cube--'+n.color"></div>
              <div v-if="n.politicalAgendasActionUsedCount > 0" :key="n.color" :class="'policy-use-marker board-cube--'+n.color">{{n.politicalAgendasActionUsedCount}}</div>
            </template>
          </div>
          <div class="chairman-spot"><div v-if="turmoil.chairman" :class="'player-token '+turmoil.chairman"></div></div>
          <div class="turmoil-reserve">
              <div class="lobby-spot" v-for="n in turmoil.reserve.length" :key="n">
                <div v-if="turmoil.reserve.length >= n" :class="'player-token '+turmoil.reserve[n-1].color">{{ turmoil.reserve[n-1].number }}</div>
              </div>
          </div>
          <div class="policies">
            <div class="policies-title">
                <a class="policies-clickable" href="#" v-on:click.prevent="toggleMe()" v-i18n>Policies</a>
            </div>
            <div v-show="isVisible()" class='policies-global'>
              <div v-for="party in turmoil.parties" :key="party.name" class='policy-block'>
                <div :class="'party-name party-name--'+partyNameToCss(party.name)" v-i18n>{{party.name}}</div>
                <agendas type="policy-bonus" :id="getPolicy(party.name)"></agendas>
              </div>
            </div>
          </div>
        </div>

        <div class="grid-leaders">
          <div v-for="party in turmoil.parties" :key="party.name" :class="['leader-spot', 'leader-spot--'+partyNameToCss(party.name), {'player-token-new-leader': (party.name === turmoil.dominant)}]">
            <div class="delegate-spot">
              <div v-if="party.partyLeader" :class="['player-token', party.partyLeader]"></div>
            </div>
          </div>
        </div>

        <div class="grid-parties">
          <div v-for="party in turmoil.parties" :key="party.name" :class="'board-party board-party--'+partyNameToCss(party.name)">
            <div class="grid-delegates">
              <div class="delegate-spot" v-for="n in 6" :key="n">
                <div v-if="party.delegates.length >= n" :class="'player-token '+party.delegates[n-1].color">{{ party.delegates[n-1].number }}</div>
              </div>
            </div>
            <div :class="'party-name party-name--'+partyNameToCss(party.name)" v-i18n>{{party.name}}</div>
            <div class="party-bonus">
              <agendas type="party-bonus" :id="getBonus(party.name)"></agendas>
            </div>
          </div>
        </div>

        <div class="turmoil-party-transition-arrow-grid">
          <div class="turmoil-party-transition-arrow"></div>
          <div class="turmoil-party-transition-arrow"></div>
          <div class="turmoil-party-transition-arrow"></div>
          <div class="turmoil-party-transition-arrow"></div>
          <div class="turmoil-party-transition-arrow"></div>
        </div>
      </div>
    </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {PartyName} from '@/common/turmoil/PartyName';
import {TurmoilModel} from '@/common/models/TurmoilModel';
import GlobalEvent from '@/client/components/GlobalEvent.vue';
import Agendas from '@/client/components/turmoil/Agendas.vue';

export default Vue.extend({
  name: 'turmoil',
  props: {
    turmoil: {
      type: Object as () => TurmoilModel,
    },
  },
  methods: {
    partyNameToCss(party: PartyName | undefined): string {
      if (party === undefined) {
        console.warn('no party provided');
        return '';
      }
      return party.toLowerCase().split(' ').join('_');
    },
    getBonus(party: PartyName | undefined) {
      const politicalAgendas = this.turmoil.politicalAgendas;
      if (politicalAgendas !== undefined) {
        switch (party) {
        case PartyName.MARS:
          return politicalAgendas.marsFirst.bonusId;
        case PartyName.SCIENTISTS:
          return politicalAgendas.scientists.bonusId;
        case PartyName.UNITY:
          return politicalAgendas.unity.bonusId;
        case PartyName.KELVINISTS:
          return politicalAgendas.kelvinists.bonusId;
        case PartyName.REDS:
          return politicalAgendas.reds.bonusId;
        case PartyName.GREENS:
          return politicalAgendas.greens.bonusId;
        }
      }
      return undefined;
    },
    getPolicy(partyName: PartyName | undefined) {
      const politicalAgendas = this.turmoil.politicalAgendas;
      if (politicalAgendas !== undefined) {
        switch (partyName) {
        case PartyName.MARS:
          return politicalAgendas.marsFirst.policyId;
        case PartyName.SCIENTISTS:
          return politicalAgendas.scientists.policyId;
        case PartyName.UNITY:
          return politicalAgendas.unity.policyId;
        case PartyName.KELVINISTS:
          return politicalAgendas.kelvinists.policyId;
        case PartyName.REDS:
          return politicalAgendas.reds.policyId;
        case PartyName.GREENS:
          return politicalAgendas.greens.policyId;
        }
      }
      return undefined;
    },
    toggleMe() {
      const currentState: boolean = this.isVisible();
      (this.$root as any).setVisibilityState('turmoil_parties', ! currentState);
    },
    isVisible() {
      return (this.$root as any).getVisibilityState('turmoil_parties');
    },
  },
  components: {
    'global-event': GlobalEvent,
    'agendas': Agendas,
  },
});

</script>

