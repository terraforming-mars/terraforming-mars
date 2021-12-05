<template>
        <div id="game-end" class="game_end_cont">
            <h1>{{ constants.APP_NAME }} - Game finished!</h1>
            <div class="game_end">
                <div v-if="isSoloGame()">
                    <div v-if="game.isSoloModeWin">
                        <div class="game_end_success">
                            <h2 v-i18n>You win!</h2>
                            <div class="game_end_solo_img">
                                <img src="/assets/solo_win.png" />
                            </div>
                            <div class="game_end_notice" v-i18n>
                                But it isn't the reason to stop making Mars better.
                            </div>
                            <ul class="game_end_list">
                                <li v-i18n>Try to win with expansions enabled</li>
                                <li v-i18n>Try to win before the last generation comes</li>
                                <li><span v-i18n>Can you get</span> {{ players[0].victoryPointsBreakdown.total + 10 }}<span v-i18n>+ Victory Points?</span></li>
                            </ul>
                        </div>
                    </div>
                    <div v-else>
                        <div class="game_end_fail">
                            <h2 v-i18n>Sorry, you lose.</h2>
                            <div class="game_end_notice" v-i18n>
                                Next time you will get more luck!<br>
                                Also, take into account these small hints to win:
                            </div>
                            <ul class="game_end_list" v-i18n>
                                <li>Concentrate more on Global parameters, not on Victory Points</li>
                                <li>Don't be greedy on cards selection</li>
                                <li>Try to increase Heat production, not Megacredits</li>
                                <li>Try to start with Beginner corporation</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="game_end_go_home">
                    <a href="/" v-i18n>
                        <Button size="big" type="back" />
                        Go to main page
                    </a>
                </div>
                <div v-if="!isSoloGame() || game.isSoloModeWin" class="game-end-winer-announcement">
                    <span v-for="p in getWinners()" :key="p.color"><span :class="'log-player ' + getEndGamePlayerRowColorClass(p.color)">{{ p.name }}</span></span> won!
                </div>
                <div class="game_end_victory_points">
                    <h2 v-i18n>Victory points breakdown after<span> {{game.generation}} </span>generations</h2>
                    <table class="table game_end_table">
                        <thead>
                            <tr v-i18n>
                                <th><div class="card-delegate"></div></th>
                                <th><div class="tr"></div></th>
                                <th><div class="m-and-a" title="Milestones points">M</div></th>
                                <th><div class="m-and-a" title="Awards points">A</div></th>
                                <th><div class="table-forest-tile"></div></th>
                                <th><div class="table-city-tile"></div></th>
                                <th v-if="game.moon !== undefined"><div class="table-moon-road-tile"></div></th>
                                <th v-if="game.moon !== undefined"><div class="table-moon-colony-tile"></div></th>
                                <th v-if="game.moon !== undefined"><div class="table-moon-mine-tile"></div></th>
                                <th><div class="vp">VP</div></th>
                                <th v-if="game.gameOptions.escapeVelocityMode" class="clock-icon tooltip tooltip-top" data-tooltip="Escape Velocity penalty">&#x23F3;</th>
                                <th class="game-end-total"><div class="game-end-total-column">Total</div></th>
                                <th><div class="mc-icon"></div></th>
                                <th v-if="game.gameOptions.showTimers" class="clock-icon">&#x1F551;</th>
                                <th><div class="table-red-arrow tooltip tooltip-top" data-tooltip="Actions taken this game"></div></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="p in getSortedPlayers()" :key="p.color" :class="getEndGamePlayerRowColorClass(p.color)">
                                <td>
                                  <a :href="'/player?id='+p.id+'&noredirect'">{{ p.name }}</a>
                                  <div class="column-corporation">{{ p.corporationCard === undefined ? "" : p.corporationCard.name }}</div>
                                </td>
                                <td>{{ p.victoryPointsBreakdown.terraformRating }}</td>
                                <td>{{ p.victoryPointsBreakdown.milestones }}</td>
                                <td>{{ p.victoryPointsBreakdown.awards }}</td>
                                <td>{{ p.victoryPointsBreakdown.greenery }}</td>
                                <td>{{ p.victoryPointsBreakdown.city }}</td>
                                <td v-if="game.moon !== undefined">{{ p.victoryPointsBreakdown.moonRoads }}</td>
                                <td v-if="game.moon !== undefined">{{ p.victoryPointsBreakdown.moonColonies }}</td>
                                <td v-if="game.moon !== undefined">{{ p.victoryPointsBreakdown.moonMines }}</td>
                                <td>{{ p.victoryPointsBreakdown.victoryPoints }}</td>
                                <td v-if="game.gameOptions.escapeVelocityMode">{{ p.victoryPointsBreakdown.escapeVelocity }}</td>
                                <td class="game-end-total">{{ p.victoryPointsBreakdown.total }}</td>
                                <td class="game-end-mc">
                                  <div>{{ p.megaCredits }}</div>
                                </td>
                                <td>
                                  <div v-if="game.gameOptions.showTimers" class="game-end-timer">{{ getTimer(p) }}</div>
                                </td>
                                <td><div class="game-end-timer">{{ p.actionsTakenThisGame }}</div></td>
                            </tr>
                        </tbody>
                    </table>
                    <br/>
                    <h2 v-i18n>Victory points details</h2>
                    <div class="game-end-flexrow">
                        <div v-for="p in getSortedPlayers()" :key="p.color" class="game-end-column">
                            <div class="game-end-winer-scorebreak-player-title">
                                <div :class="'game-end-player ' + getEndGamePlayerRowColorClass(p.color)"><a :href="'/player?id='+p.id+'&noredirect'">{{p.name}}</a></div>
                            </div>
                            <div v-for="v in p.victoryPointsBreakdown.detailsCards" :key="v.cardName">
                              <div class="game-end-column-row">
                                <div class="game-end-column-vp">{{v.victoryPoint}}</div>
                                <div class="game-end-column-text">{{v.cardName}}</div>
                              </div>
                            </div>
                            <div class="game-end-column-row">
                              <div class="game-end-column-vp">&nbsp;</div>
                              <div class="game-end-column-text">&nbsp;</div>
                            </div>
                            <div v-for="v in p.victoryPointsBreakdown.detailsMilestones" :key="v">
                              <div class="game-end-column-row">
                                <div class="game-end-column-vp">{{v.split(':', 2)[1]}}</div>
                                <div class="game-end-column-text">{{v.split(':', 2)[0]}}</div>
                              </div>
                            </div>
                            <div v-for="v in p.victoryPointsBreakdown.detailsAwards" :key="v">
                              <div class="game-end-column-row">
                                <div class="game-end-column-vp">{{v.split(':', 2)[1]}}</div>
                                <div class="game-end-column-text">{{v.split(':', 2)[0]}}</div>
                              </div>
                            </div>
                            <div v-for="v in p.victoryPointsBreakdown.detailsPlanetaryTracks" :key="v.tag">
                              <div class="game-end-column-row">
                                <div class="game-end-column-vp">{{v.points}}</div>
                                <div class="game-end-column-text">Most tags on the {{v.tag}} track</div>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="game-end-flexrow">
                <div class="game_end_block--board game-end-column">
                    <h2 v-i18n>Final situation on the board</h2>
                    <board
                        :spaces="game.spaces"
                        :venusNextExtension="game.gameOptions.venusNextExtension"
                        :venusScaleLevel="game.venusScaleLevel"
                        :aresExtension="game.gameOptions.aresExtension"
                        :pathfindersExpansion="game.gameOptions.pathfindersExpansion"
                        :altVenusBoard="game.gameOptions.altVenusBoard"
                        :boardName ="game.gameOptions.boardName"
                        :oceans_count="game.oceans"
                        :oxygen_level="game.oxygenLevel"
                        :temperature="game.temperature"></board>
                  <MoonBoard v-if="game.gameOptions.moonExpansion" :model="game.moon"></MoonBoard>
                  <div v-if="game.gameOptions.pathfindersExpansion">
                    <PlanetaryTracks :tracks="game.pathfinders" :gameOptions="game.gameOptions"/>
                  </div>
                </div>
                <div class="game_end_block--log game-end-column">
                  <log-panel :color="color" :generation="game.generation" :id="viewModel.id" :lastSoloGeneration="game.lastSoloGeneration" :players="players"></log-panel>
                </div>
              </div>
            </div>
        </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {GameModel} from '@/models/GameModel';
import {PlayerViewModel, PublicPlayerModel, ViewModel} from '@/models/PlayerModel';
import Board from '@/client/components/Board.vue';
import MoonBoard from '@/client/components/moon/MoonBoard.vue';
import PlanetaryTracks from '@/client/components/pathfinders/PlanetaryTracks.vue';
import LogPanel from '@/client/components/LogPanel.vue';
import Button from '@/client/components/common/Button.vue';
import {playerColorClass} from '@/utils/utils';
import {Timer} from '@/Timer';


import * as constants from '@/constants';
import {SpectatorModel} from '@/models/SpectatorModel';
import {Color} from '@/Color';

function getViewModel(playerView: ViewModel | undefined, spectator: ViewModel | undefined): ViewModel {
  if (playerView !== undefined) return playerView;
  if (spectator !== undefined) return spectator;
  throw new Error('Neither playerView nor spectator are defined');
}

export default Vue.extend({
  name: 'game-end',
  props: {
    playerView: {
      type: Object as () => PlayerViewModel | undefined,
    },
    spectator: {
      type: Object as () => SpectatorModel | undefined,
    },
  },
  computed: {
    viewModel(): ViewModel {
      return getViewModel(this.playerView, this.spectator);
    },
    game(): GameModel {
      return getViewModel(this.playerView, this.spectator).game;
    },
    players(): Array<PublicPlayerModel> {
      return getViewModel(this.playerView, this.spectator).players;
    },
    color(): Color {
      if (this.playerView !== undefined) return this.playerView.thisPlayer.color;
      if (this.spectator !== undefined) return this.spectator.color;
      throw new Error('Neither playerView nor spectator are defined');
    },
  },
  data() {
    return {
      constants,
    };
  },
  components: {
    'board': Board,
    'log-panel': LogPanel,
    Button,
    MoonBoard,
    PlanetaryTracks,
  },
  methods: {
    getEndGamePlayerRowColorClass(color: string): string {
      return playerColorClass(color.toLowerCase(), 'bg_transparent');
    },
    getTimer(p: PublicPlayerModel): string {
      return Timer.toString(p.timer);
    },
    getSortedPlayers() {
      const copy = [...this.viewModel.players];
      copy.sort(function(a:PublicPlayerModel, b:PublicPlayerModel) {
        if (a.victoryPointsBreakdown.total < b.victoryPointsBreakdown.total) return -1;
        if (a.victoryPointsBreakdown.total > b.victoryPointsBreakdown.total) return 1;
        if (a.megaCredits < b.megaCredits) return -1;
        if (a.megaCredits > b.megaCredits) return 1;
        return 0;
      });
      return copy.reverse();
    },
    getWinners() {
      const sortedPlayers = this.getSortedPlayers();
      const firstWinner = sortedPlayers[0];
      const winners: PublicPlayerModel[] = [firstWinner];
      for (let i = 1; i < sortedPlayers.length; i++) {
        if (sortedPlayers[i].victoryPointsBreakdown.total === firstWinner.victoryPointsBreakdown.total &&
                    sortedPlayers[i].megaCredits === firstWinner.megaCredits) {
          winners.push(sortedPlayers[i]);
        }
      }
      return winners;
    },
    isSoloGame(): boolean {
      return this.players.length === 1;
    },
  },
});

</script>
