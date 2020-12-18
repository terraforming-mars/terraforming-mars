import Vue from 'vue';
import {PartyName} from '../turmoil/parties/PartyName';
import {$t} from '../directives/i18n';
import {PoliticalAgendasModel, TurmoilModel} from '../models/TurmoilModel';

export const Turmoil = Vue.component('turmoil', {
  props: {
    turmoil: {
      type: Object as () => TurmoilModel,
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
    getBonus: function(party: PartyName, staticAgendas: PoliticalAgendasModel | undefined) {
      if (party === PartyName.MARS) {
        if (staticAgendas !== undefined && staticAgendas.marsFirstBonus === 'mb02') {
          return `<div class="resource money party-resource">1</div> / 
          <div class="tile empty-tile-small"></div>ON MARS`;
        } else {
          return `<div class="resource money party-resource">1</div> / 
          <div class="resource-tag tag-building party-resource-tag"></div>`;
        }
      } else if (party === PartyName.SCIENTISTS) {
        if (staticAgendas !== undefined && staticAgendas.scientistsBonus === 'sb02') {
          return `<div class="resource money party-resource">1</div> / 3
          <div class="resource card card-small"></div>`;
        } else {
          return `<div class="resource money party-resource">1</div> / 
          <div class="resource-tag tag-science party-resource-tag"></div>`;
        }
      } else if (party === PartyName.UNITY) {
        if (staticAgendas !== undefined && staticAgendas.unityBonus === 'ub02') {
          return `<div class="resource money party-resource">1</div> / 
            <div class="resource-tag tag-space party-resource-tag"></div> + 
            <div class="resource-tag tag-space party-resource-tag"></div>
            <div class="resource-tag tag-event party-resource-tag"></div>`;
        } else {
          return `<div class="resource money party-resource">1</div> / 
            <div class="resource-tag tag-venus party-resource-tag"></div>
            <div class="resource-tag tag-earth party-resource-tag"></div>
            <div class="resource-tag tag-jovian party-resource-tag"></div>`;
        }
      } else if (party === PartyName.KELVINISTS) {
        if (staticAgendas !== undefined && staticAgendas.kelvinistsBonus === 'kb02') {
          return `<div class="resource heat party-resource"></div> / 
            <div class="production-box party-production-box">
              <div class="heat production"></div>
            </div>`;
        } else {
          return `<div class="resource money party-resource">1</div> / 
            <div class="production-box party-production-box">
              <div class="heat production"></div>
            </div>`;
        }
      } else if (party === PartyName.REDS) {
        if (staticAgendas !== undefined && staticAgendas.redsBonus === 'rb02') {
          return `
            <div class="party-inferior-rating tile party-rating party-tile">&gt;</div> : 
            <div class="rating tile party-rating party-tile red-outline "></div>`;
        } else {
          return `
            <div class="party-inferior-rating tile party-rating party-tile">&lt;</div> : 
            <div class="rating tile party-rating party-tile"></div>`;
        }
      } else if (party === PartyName.GREENS) {
        if (staticAgendas !== undefined && staticAgendas.greensBonus === 'gb02') {
          return `<div class="resource money party-resource">2</div> / 
            <div class="tile greenery-tile greenery-tile-small"></div>`;
        } else {
          return `<div class="resource money party-resource">1</div> / 
            <div class="resource-tag tag-plant party-resource-tag"></div>
            <div class="resource-tag tag-microbe party-resource-tag"></div>
            <div class="resource-tag tag-animal party-resource-tag"></div>`;
        }
      } else {
        return '<p>Error</p>';
      }
    },
    getPolicy: function(party: PartyName | undefined, staticAgendas: PoliticalAgendasModel | undefined) {
      if (party === PartyName.MARS) {
        if (staticAgendas !== undefined && staticAgendas.marsFirstPolicy === 'mfp02') {
          return `<div class="resource card card-with-border policy-card-with-tag"><div class="card-icon tag-building"></div></div> : 
            <div class="resource money party-resource">1</div>`;
        } else if (staticAgendas !== undefined && staticAgendas.marsFirstPolicy === 'mfp03') {
          return `<div class="policy-top-margin"><div class="resource steel"></div> : 
            +<div class="resource money">1</div></div>`;
        } else if (staticAgendas !== undefined && staticAgendas.marsFirstPolicy === 'mfp04') {
          return `<span class="money resource">4</span>
            <span class="red-arrow-3x"></span>
            <div class="resource card card-with-border policy-card-with-tag"><div class="card-icon tag-building"></div></div>`;
        } else {
          return `<div class="policy-top-margin"><div class="tile empty-tile-small"></div> : 
            <span class="steel resource"></span></div>`;
        }
      }
      if (party === PartyName.SCIENTISTS) {
        if (staticAgendas !== undefined && staticAgendas.scientistsPolicy === 'sp02') {
          return `<span>
          <div class="tile oxygen-tile req-tile-small" style="margin: 10px -5px;"></div>
          <div class="tile ocean-tile req-tile-small"></div>
          <div class="tile temperature-tile req-tile-small"></div>
          : ± 2</span>`;
        } else if (staticAgendas !== undefined && staticAgendas.scientistsPolicy === 'sp03') {
          return `<span>
          <div class="tile oxygen-tile req-tile-small" style="margin: 10px -5px;"></div>
          <div class="tile ocean-tile req-tile-small"></div>
          <div class="tile temperature-tile req-tile-small"></div>
          : <div class="resource card card-with-border"></div></span>`;
        } else if (staticAgendas !== undefined && staticAgendas.scientistsPolicy === 'sp04') {
          return `<div class="scientists-requisite"><div class="resource-tag tag-science party-resource-tag"></div></div>`;
        } else {
          return `<span class="money resource">10</span>
            <span class="red-arrow"></span>
            <span class="card card-with-border resource party-resource"></span>
            <span class="card card-with-border resource party-resource"></span>
            <span class="card card-with-border resource party-resource"></span>`;
        }
      }
      if (party === PartyName.UNITY) {
        if (staticAgendas !== undefined && staticAgendas.unityPolicy === 'up02') {
          return `<div class="policy-top-margin">
            <span class="money resource">9</span>
            <span class="red-arrow-3x"></span> 4 <span class="titanium resource"></span>
            </div>`;
        } else if (staticAgendas !== undefined && staticAgendas.unityPolicy === 'up03') {
          return `<span class="money resource">4</span>
            <span class="red-arrow-3x"></span>
            <div class="resource card card-with-border policy-card-with-tag"><div class="card-icon tag-space"></div></div>`;
        } else if (staticAgendas !== undefined && staticAgendas.unityPolicy === 'up04') {
          return `<div class="policy-top-margin"><div class="resource-tag tag-space"></div> : <div class="money resource ">-2</div></div>`;
        } else {
          return `<div class="policy-top-margin"><div class="resource titanium"></div> : 
            + <div class="resource money">1</div></div>`;
        }
      }
      if (party === PartyName.KELVINISTS) {
        if (staticAgendas !== undefined && staticAgendas.kelvinistsPolicy === 'kp02') {
          return `<div class="tile temperature-tile req-tile-small" style="margin-right:5px;"></div> : <span class="money resource">3</span>`;
        } else if (staticAgendas !== undefined && staticAgendas.kelvinistsPolicy === 'kp03') {
          return `6 <span class="heat resource"></span>
          <span class="red-arrow-infinity"></span>
          <div class="tile temperature-tile"></div>`;
        } else if (staticAgendas !== undefined && staticAgendas.kelvinistsPolicy === 'kp04') {
          return `<div class="policy-top-margin"><div class="tile empty-tile-small"></div> : 
            <span class="heat resource"></span><span class="heat resource"></span></div>`;
        } else {
          return `<span class="money resource">10</span>
            <span class="red-arrow-infinity"></span>
            <div class="production-box production-box-size2">
              <div class="energy production"></div>
              <div class="heat production"></div>
            </div>`;
        }
      }
      if (party === PartyName.REDS) {
        if (staticAgendas !== undefined && staticAgendas.redsPolicy === 'rp02') {
          return `<div class="policy-top-margin"><div class="tile empty-tile-small"></div> : <span class="money resource">-3</span></div>`;
        } else if (staticAgendas !== undefined && staticAgendas.redsPolicy === 'rp03') {
          return `<span class="money resource">4</span>
          <span class="red-arrow-3x"></span>
          <div class="tile oxygen-tile req-tile-small red-outline" style="margin: 10px -5px;"></div> / 
          <div class="tile ocean-tile req-tile-small red-outline"></div> / 
          <div class="tile temperature-tile req-tile-small red-outline"></div>`;
        } else if (staticAgendas !== undefined && staticAgendas.redsPolicy === 'rp04') {
          return `<div class="tile oxygen-tile req-tile-small" style="margin: 10px -5px;"></div>
          <div class="tile ocean-tile req-tile-small"></div>
          <div class="tile temperature-tile req-tile-small"></div>
          : <div class="production-box production-box-size2" style="margin-left:5px;">
              <div class="production-prefix minus"></div><div class="money production">1</div>
            </div>`;
        } else {
          return `<div class="policy-top-margin">
            <div class="rating tile"></div> : 
            <div class="resource money">-3</div>
            </div>`;
        }
      }
      if (party === PartyName.GREENS) {
        if (staticAgendas !== undefined && staticAgendas.greensPolicy === 'gp02') {
          return `<div class="policy-top-margin"><div class="tile empty-tile-small"></div> : 
            <span class="plant resource"></span></div>`;
        } else if (staticAgendas !== undefined && staticAgendas.greensPolicy === 'gp03') {
          return `<div class="policy-top-margin">
          <div class="resource-tag tag-plant party-resource-tag"></div>
          <div class="resource-tag tag-microbe party-resource-tag"></div>
          <div class="resource-tag tag-animal party-resource-tag"></div> : <div class="resource money">2</div>
          </div>`;
        } else if (staticAgendas !== undefined && staticAgendas.greensPolicy === 'gp04') {
          return `<div class="policy-top-margin">
          <span class="money resource">5</span>
          <span class="red-arrow-3x"></span>3<span class="plant resource"></span> / 2<span class="microbe resource"></span>
          </div>`;
        } else {
          return `<div class="tile greenery-tile"></div> : 
            <div class="resource money">4</div>`;
        }
      }
      return '<p>' + $t('No ruling Policy') + '</p>';
    },
    toggleMe: function() {
      const currentState: boolean = this.isVisible();
      (this.$root as any).setVisibilityState('turmoil_parties', ! currentState);
    },
    isVisible: function() {
      return (this.$root as any).getVisibilityState('turmoil_parties');
    },
  },
  template: `
    <div class="turmoil" v-trim-whitespace>
      <div class="events-board">
          <div v-if="turmoil.distant" class="global-event">
            <div class="event-party event-party--top" :class="'event-party--'+partyNameToCss(turmoil.distant.revealed)" v-i18n>{{ turmoil.distant.revealed }}</div>
            <div class="event-party event-party--bottom" :class="'event-party--'+partyNameToCss(turmoil.distant.current)" v-i18n>{{ turmoil.distant.current }}</div>
            <div class="event-content"><div class="event-text" v-i18n>{{ turmoil.distant.description }}</div></div>
          </div>
          <div v-if="turmoil.comming" class="global-event global-event--comming">
            <div class="event-party event-party--top" :class="'event-party--'+partyNameToCss(turmoil.comming.revealed)" v-i18n>{{ turmoil.comming.revealed }}</div>
            <div class="event-party event-party--bottom" :class="'event-party--'+partyNameToCss(turmoil.comming.current)" v-i18n>{{ turmoil.comming.current }}</div>
            <div class="event-content" v-i18n>{{ turmoil.comming.description }}</div>
          </div>
          <div v-if="turmoil.current" class="global-event global-event--current">
            <div class="event-party event-party--top" :class="'event-party--'+partyNameToCss(turmoil.current.revealed)" v-i18n>{{ turmoil.current.revealed }}</div>
            <div class="event-party event-party--bottom" :class="'event-party--'+partyNameToCss(turmoil.current.current)" v-i18n>{{ turmoil.current.current }}</div>
            <div class="event-content" v-i18n>{{ turmoil.current.description }}</div>
          </div>
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
          <div class="dominant-party-bonus" v-html="getPolicy(turmoil.ruling, turmoil.staticAgendas)"></div>
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
              <div v-for="party in turmoil.parties" class='policy-block'>
                <div :class="'party-name party-name--'+partyNameToCss(party.name)" v-i18n>{{party.name}}</div>
                <div class="policy-bonus" v-html="getPolicy(party.name, turmoil.staticAgendas)"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid-leaders">
          <div v-for="party in turmoil.parties" :class="['leader-spot', 'leader-spot--'+partyNameToCss(party.name), {'player-token-new-leader': (party.name === turmoil.dominant)}]">
            <div class="delegate-spot">
              <div v-if="party.partyLeader" :class="['player-token', party.partyLeader]"></div>
            </div>    
          </div>
        </div>

        <div class="grid-parties">
          <div v-for="party in turmoil.parties" :class="'board-party board-party--'+partyNameToCss(party.name)">
            <div class="grid-delegates">
              <div class="delegate-spot" v-for="n in 6" :key="n">
                <div v-if="party.delegates.length >= n" :class="'player-token '+party.delegates[n-1].color">{{ party.delegates[n-1].number }}</div>
              </div>
            </div>
            <div :class="'party-name party-name--'+partyNameToCss(party.name)" v-i18n>{{party.name}}</div>
            <div class="party-bonus">
              <span v-html="getBonus(party.name, turmoil.staticAgendas)"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    `,
});
