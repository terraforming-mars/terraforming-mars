import Vue from "vue";

import { PartyName } from '../turmoil/parties/PartyName';

export const Turmoil = Vue.component("turmoil", {
    props: [
      "turmoil"
    ],
    data: function () {
      return {
        MARS : PartyName.MARS,
        SCIENTISTS: PartyName.SCIENTISTS
      };
    },
    methods: {
        getMars:(): string => {
          return PartyName.MARS;
        },
        getScientists:(): string => {
          return PartyName.SCIENTISTS;
        }
    },
    template: `
    <div class="turmoil">
      <div class="events-board">
          <div class="global-event">
            <div class="event-title">Event title here</div>
            <div class="event-parties">
              <div class="event-party">top party</div>
              <div class="event-party">bottom party</div>
            </div>
            <div class="event-content">Event content here with icons or/and with text.</div>
          </div>
          <div class="global-event">
            <div class="event-title">Event title here</div>
            <div class="event-parties">
              <div class="event-party">top party</div>
              <div class="event-party">bottom party</div>
            </div>
            <div class="event-content">Event content here with icons or/and with text.</div>
          </div>
          <div class="global-event global-event-current">
            <div class="event-title">Event title here</div>
            <div class="event-parties">
              <div class="event-party">top party</div>
              <div class="event-party">bottom party</div>
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
              <div class="party-bonus">party bonus</div>
            </div>
          </div>
        </div>
      </div>
    `
});
