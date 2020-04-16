import Vue from "vue";
import { PartyName } from '../turmoil/parties/PartyName';

export const Turmoil = Vue.component("turmoil", {
    props: [
      "turmoil"
    ],
    methods: {
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
          <div class="party-inferior-rating tile party-rating party-tile"><</div> : 
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
      }
    },
    template: `
    <div class="turmoil">
      <div class="events-board">
          <div v-if="turmoil.distant" class="global-event">
            <div class="event-title">{{ turmoil.distant.name }}</div>
            <div class="event-parties">
              <div class="event-party">{{ turmoil.distant.revealed }}</div>
              <div class="event-party">{{ turmoil.distant.current }}</div>
            </div>
            <div class="event-content">Event content here with icons or/and with text.</div>
          </div>
          <div v-if="turmoil.comming" class="global-event">
            <div class="event-title">{{ turmoil.comming.name }}</div>
            <div class="event-parties">
              <div class="event-party">{{ turmoil.comming.revealed }}</div>
              <div class="event-party">{{ turmoil.comming.current }}</div>
            </div>
            <div class="event-content">Event content here with icons or/and with text.</div>
          </div>
          <div v-if="turmoil.current" class="global-event global-event-current">
            <div class="event-title">{{ turmoil.current.name }}</div>
            <div class="event-parties">
              <div class="event-party">{{ turmoil.current.revealed }}</div>
              <div class="event-party">{{ turmoil.current.current }}</div>
            </div>
            <div class="event-content">Event content here with icons or/and with text.</div>
          </div>
        </div>
        <div class="turmoil-board">
          <div class="turmoil-header">
            <div class="grid-lobby">
              <div class="lobby-spot" v-for="n in 5" :key="n">
                  <div v-if="turmoil.lobby.length >= n" :class="'player-token '+turmoil.lobby[n-1]"></div>
              </div>
            </div>
            <div class="label-lobby">LOBBY</div>
            <div class="chairman-spot"><div v-if="turmoil.chairman" :class="'player-token '+turmoil.chairman"></div></div>
            <div class="label-5mc">RESERVE</div>
            <div class="grid-lobby">
                <div class="lobby-spot" v-for="n in 6" :key="n">
                  <div v-if="turmoil.reserve.length >= n" :class="'player-token '+turmoil.reserve[n-1].color">{{ turmoil.reserve[n-1].number }}</div>
                </div>
            </div>
          </div>
          <div class="grid-leaders">
            <div v-for="party in turmoil.parties" :class="'leader-spot leader-spot--'+party.name.toLowerCase().replace(/ /g,'')">
              <div class="delegate-spot">
                <div v-if="party.partyLeader" :class="['player-token', party.partyLeader, {'player-token-new-leader': (party.name === turmoil.dominant)}]"></div>
              </div>    
            </div>
          </div>
          <div class="grid-parties">
            <div v-for="party in turmoil.parties" :class="'board-party board-party--'+party.name.toLowerCase().replace(/ /g,'')">
              <div class="grid-delegates">
                <div class="delegate-spot" v-for="n in 6" :key="n">
                  <div v-if="party.delegates.length >= n" :class="'player-token '+party.delegates[n-1].color">{{ party.delegates[n-1].number }}</div>
                </div>
              </div>
              <div :class="'party-name party-name--'+party.name.toLowerCase().replace(/ /g,'')">{{party.name.toUpperCase()}}</div>
              <div class="party-bonus">
                <span v-html="getBonus(party.name)"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
});
