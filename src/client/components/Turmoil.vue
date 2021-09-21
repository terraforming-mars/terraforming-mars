
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
          <div class="dominant-party-bonus" v-html="getPolicy(turmoil.ruling)"></div>
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
                <div class="policy-bonus" v-html="getPolicy(party.name)"></div>
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
              <span v-html="getBonus(party.name)"></span>
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
import {PartyName} from '@/turmoil/parties/PartyName';
import {TurmoilModel} from '@/models/TurmoilModel';
import {BonusId} from '@/turmoil/Bonus';
import {PolicyId} from '@/turmoil/Policy';
import GlobalEvent from '@/client/components/GlobalEvent.vue';

const AGENDA_HTML: Map<BonusId | PolicyId, string> = new Map([
  ['mb01',
    `<div class="resource money party-resource">1</div> /
    <div class="resource-tag tag-building party-resource-tag"></div>`],
  ['mb02',
    `<div class="resource money party-resource">1</div> /
    <div class="tile empty-tile-small"></div>ON MARS`],
  ['sb01',
    `<div class="resource money party-resource">1</div> /
    <div class="resource-tag tag-science party-resource-tag"></div>`],
  ['sb02',
    `<div class="resource money party-resource">1</div> / 3
    <div class="resource card card-small"></div>`],
  ['ub01',
    `<div class="resource money party-resource">1</div> /
    <div class="resource-tag tag-venus party-resource-tag"></div>
    <div class="resource-tag tag-earth party-resource-tag"></div>
    <div class="resource-tag tag-jovian party-resource-tag"></div>`],
  ['ub02',
    `<div class="resource money party-resource">1</div> /
    <div class="resource-tag tag-space party-resource-tag"></div>`],
  ['kb01',
    `<div class="resource money party-resource">1</div> /
    <div class="production-box party-production-box">
      <div class="heat production"></div>
    </div>`],
  ['kb02',
    `<div class="resource heat party-resource"></div> /
    <div class="production-box party-production-box">
      <div class="heat production"></div>
    </div>`],
  ['rb01',
    `<div class="party-inferior-rating tile party-rating party-tile">&lt;</div> :
  <div class="rating tile party-rating party-tile"></div>`],
  ['rb02',
    `<div class="party-inferior-rating tile party-rating party-tile">&gt;</div> :
  <div class="rating tile party-rating party-tile red-outline "></div>`],
  ['gb01',
    `<div class="resource money party-resource">1</div> /
    <div class="resource-tag tag-plant party-resource-tag"></div>
    <div class="resource-tag tag-microbe party-resource-tag"></div>
    <div class="resource-tag tag-animal party-resource-tag"></div>`],
  ['gb02',
    `<div class="resource money party-resource">2</div> /
    <div class="tile greenery-tile greenery-tile-small"></div>`],
  ['mfp01',
    `<div class="policy-top-margin"><div class="tile empty-tile-small"></div> :
    <span class="steel resource"></span></div>`],
  ['mfp02',
    `<div class="policy-top-margin"><div class="resource-tag tag-building"></div> : <div class="money resource">2</div></div>`],
  ['mfp03',
    `<div class="policy-top-margin"><div class="resource steel"></div> : +<div class="resource money">1</div></div>`],
  ['mfp04',
    `<span class="money resource">4</span>
     <span class="red-arrow-3x"></span>
    <div class="resource card card-with-border policy-card-with-tag"><div class="card-icon tag-building"></div></div>`],
  ['sp01',
    `<span class="money resource">10</span>
    <span class="red-arrow"></span>
    <span class="card card-with-border resource party-resource"></span>
    <span class="card card-with-border resource party-resource"></span>
    <span class="card card-with-border resource party-resource"></span>`],
  ['sp02',
    `<span>
    <div class="tile oxygen-tile req-tile-small" style="margin: 10px -5px;"></div>
    <div class="tile ocean-tile req-tile-small"></div>
    <div class="tile temperature-tile req-tile-small"></div>
    : ± 2</span>`],
  ['sp03', `<span>
    <div class="tile oxygen-tile req-tile-small" style="margin: 10px -5px;"></div>
    <div class="tile ocean-tile req-tile-small"></div>
    <div class="tile temperature-tile req-tile-small"></div>
    : <div class="resource card card-with-border"></div></span>`],
  ['sp04', `<div class="scientists-requisite"><div class="resource-tag tag-science party-resource-tag"></div></div>`],
  ['up01',
    `<div class="policy-top-margin"><div class="resource titanium"></div> :
    + <div class="resource money">1</div></div>`],
  ['up02',
    `<div class="policy-top-margin">
    <span class="money resource">4</span>
    <span class="red-arrow-3x"></span>2<span class="titanium resource"></span> / 2<span class="floater resource"></span>
    </div>`],
  ['up03',
    `<span class="money resource">4</span>
    <span class="red-arrow-3x"></span>
    <div class="resource card card-with-border policy-card-with-tag"><div class="card-icon tag-space"></div></div>`],
  ['up04', `<div class="policy-top-margin"><div class="resource-tag tag-space"></div> : <div class="money resource">-2</div></div>`],
  ['kp01',
    `<span class="money resource">10</span>
    <span class="red-arrow-infinity"></span>
    <div class="production-box production-box-size2">
      <div class="energy production"></div>
      <div class="heat production"></div>
    </div>`],
  ['kp02', `<div class="tile temperature-tile req-tile-small" style="margin-right:5px;"></div> : <span class="money resource">3</span>`],
  ['kp03',
    `6 <span class="heat resource"></span>
    <span class="red-arrow-infinity"></span>
    <div class="tile temperature-tile"></div>`],
  ['kp04',
    `<div class="policy-top-margin"><div class="tile empty-tile-small"></div> :
    <span class="heat resource"></span><span class="heat resource"></span></div>`],
  ['rp01',
    `<div class="policy-top-margin">
    <div class="rating tile"></div> :
    <div class="resource money">-3</div>
    </div>`],
  ['rp02', `<div class="policy-top-margin"><div class="tile empty-tile-small"></div> : <span class="money resource">-3</span></div>`],
  ['rp03',
    `<span class="money resource">4</span>
    <span class="red-arrow-3x"></span>
    <div class="tile oxygen-tile req-tile-small red-outline" style="margin: 10px -5px;"></div> /
    <div class="tile ocean-tile req-tile-small red-outline"></div> /
    <div class="tile temperature-tile req-tile-small red-outline"></div>`],
  ['rp04',
    `<div class="tile oxygen-tile req-tile-small" style="margin: 10px -5px;"></div>
    <div class="tile ocean-tile req-tile-small"></div>
    <div class="tile temperature-tile req-tile-small"></div>
    : <div class="production-box production-box-size2" style="margin-left:5px;">
      <div class="production-prefix minus"></div><div class="money production">1</div>
    </div>`],
  ['gp01', `<div class="tile greenery-tile"></div> : <div class="resource money">4</div>`],
  ['gp02',
    `<div class="policy-top-margin"><div class="tile empty-tile-small"></div> :
    <span class="plant resource"></span></div>`],
  ['gp03',
    `<div class="policy-top-margin">
    <div class="resource-tag tag-plant party-resource-tag"></div>
    <div class="resource-tag tag-microbe party-resource-tag"></div>
    <div class="resource-tag tag-animal party-resource-tag"></div> : <div class="resource money">2</div>
    </div>`],
  ['gp04',
    `<div class="policy-top-margin">
    <span class="money resource">5</span>
    <span class="red-arrow-3x"></span>3<span class="plant resource"></span> / 2<span class="microbe resource"></span>
    </div>`],
]);

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
    getBonus(party: PartyName | undefined): string {
      const politicalAgendas = this.turmoil.politicalAgendas;
      let bonusId: BonusId | undefined = undefined;
      if (politicalAgendas !== undefined) {
        switch (party) {
        case PartyName.MARS:
          bonusId = politicalAgendas.marsFirst.bonusId;
          break;
        case PartyName.SCIENTISTS:
          bonusId = politicalAgendas.scientists.bonusId;
          break;
        case PartyName.UNITY:
          bonusId = politicalAgendas.unity.bonusId;
          break;
        case PartyName.KELVINISTS:
          bonusId = politicalAgendas.kelvinists.bonusId;
          break;
        case PartyName.REDS:
          bonusId = politicalAgendas.reds.bonusId;
          break;
        case PartyName.GREENS:
          bonusId = politicalAgendas.greens.bonusId;
          break;
        }
      }
      if (bonusId !== undefined) {
        const bonus = AGENDA_HTML.get(bonusId);
        return bonus || `No ruling Bonus`;
      }
      return `No ruling Bonus`;
    },
    getPolicy(partyName: PartyName | undefined) {
      const politicalAgendas = this.turmoil.politicalAgendas;
      let policyId: PolicyId | undefined = undefined;
      if (politicalAgendas !== undefined) {
        switch (partyName) {
        case PartyName.MARS:
          policyId = politicalAgendas.marsFirst.policyId;
          break;
        case PartyName.SCIENTISTS:
          policyId = politicalAgendas.scientists.policyId;
          break;
        case PartyName.UNITY:
          policyId = politicalAgendas.unity.policyId;
          break;
        case PartyName.KELVINISTS:
          policyId = politicalAgendas.kelvinists.policyId;
          break;
        case PartyName.REDS:
          policyId = politicalAgendas.reds.policyId;
          break;
        case PartyName.GREENS:
          policyId = politicalAgendas.greens.policyId;
          break;
        }
      }

      if (policyId !== undefined) {
        const policy = AGENDA_HTML.get(policyId);
        return policy || `No ruling Policy`;
      }
      return '<p>' + this.$t('No ruling Policy') + '</p>';
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
  },
});

</script>

