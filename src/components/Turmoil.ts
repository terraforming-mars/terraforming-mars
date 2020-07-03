import Vue from "vue";
import { PartyName } from '../turmoil/parties/PartyName';
import { $t } from "../directives/i18n";

export const Turmoil = Vue.component("turmoil", {
    props: [
      "turmoil"
    ],
    methods: {
      partyNameToCss: function (party: PartyName): string {
        return party.toLowerCase().split(" ").join("_");
      },
      getBonus: function (party: PartyName) {
        if (party === PartyName.MARS) {
          return `<div class="resource money party-resource">1</div> / 
          <div class="resource-tag tag-building party-resource-tag"></div>`;
        }
        else if (party === PartyName.SCIENTISTS) {
          return `<div class="resource money party-resource">1</div> / 
          <div class="resource-tag tag-science party-resource-tag"></div>`;
        }
        else if (party === PartyName.UNITY) {
          return `<div class="resource money party-resource">1</div> / 
          <div class="resource-tag tag-venus party-resource-tag"></div>
          <div class="resource-tag tag-earth party-resource-tag"></div>
          <div class="resource-tag tag-jovian party-resource-tag"></div>`;
        }
        else if (party === PartyName.KELVINISTS) {
          return `<div class="resource money party-resource">1</div> / 
          <div class="production-box party-production-box">
            <div class="heat party-production"></div>
          </div>`;
        }
        else if (party === PartyName.REDS) {
          return `
          <div class="party-inferior-rating tile party-rating party-tile">&lt;</div> : 
          <div class="rating tile party-rating party-tile"></div>`;
        }
        else if (party === PartyName.GREENS) {
          return `<div class="resource money party-resource">1</div> / 
          <div class="resource-tag tag-plant party-resource-tag"></div>
          <div class="resource-tag tag-microbe party-resource-tag"></div>
          <div class="resource-tag tag-animal party-resource-tag"></div>`;
        }
        else {
          return `<p>Error</p>`;
        }
      },
      getPolicy: function (party: PartyName) {
        if (party === PartyName.MARS) {
          return `<div class="tile empty-tile-small"></div> : 
          <span class="steel resource"></span>`;
        }
        else if (party === PartyName.SCIENTISTS) {
          return `<span class="money resource">10</span>
          <span class="red-arrow"></span>
          <span class="card resource party-resource"></span>
          <span class="card resource party-resource"></span>
          <span class="card resource party-resource"></span>`;
        }
        else if (party === PartyName.UNITY) {
          return `<div class="resource titanium"></div> : 
          + <div class="resource money">1</div>`;
        }
        else if (party === PartyName.KELVINISTS) {
          return `<span class="money resource">10</span>
          <span class="red-arrow"></span>
          <div class="production-box production-box-size2">
            <div class="energy production"></div>
            <div class="heat production"></div>
          </div>`;
        }
        else if (party === PartyName.REDS) {
          return `
          <div class="rating tile"></div> : 
          <div class="resource money">-3</div>`;
        }
        else if (party === PartyName.GREENS) {
          return `<div class="tile greenery-tile"></div> : 
          <div class="resource money">4</div>`;
        }
        else {
          return "<p>" + $t("No ruling Policy") + "</p>";
        }
      },
      toggleMe: function () {
        let currentState: boolean = this.isVisible();
        (this.$root as any).setVisibilityState("turmoil.parties", ! currentState);
      },
      isVisible: function () {
          return (this.$root as any).getVisibilityState("turmoil.parties");
      }
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
          <div class="dominant-party-bonus" v-html="getPolicy(turmoil.ruling)"></div>
          <div class="chairman-spot"><div v-if="turmoil.chairman" :class="'player-token '+turmoil.chairman"></div></div>
          <div class="turmoil-reserve">
              <div class="lobby-spot" v-for="n in 6" :key="n">
                <div v-if="turmoil.reserve.length >= n" :class="'player-token '+turmoil.reserve[n-1].color">{{ turmoil.reserve[n-1].number }}</div>
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
              <span v-html="getBonus(party.name)"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="policies">
        <div class="policies-title">
            <a class="policies-clickable" href="#" v-on:click.prevent="toggleMe()" v-i18n>Policies</a>
        </div>
        <div v-show="isVisible()" class='policies-global'>
          <div v-for="party in turmoil.parties" class='policy-block'>
            <div :class="'party-name party-name--'+partyNameToCss(party.name)" v-i18n>{{party.name}}</div>
            <div class="policy-bonus" v-html="getPolicy(party.name)"></div>
          </div>
        </div>
      </div>
    </div>
    `
});
