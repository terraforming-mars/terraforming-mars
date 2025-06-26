<template>
  <div id="game-end" class="game_end_cont">
      <h1 v-i18n>{{ constants.APP_NAME }} - Game finished!</h1>
      <div class="game_end">
          <div v-if="isSoloGame">
              <div v-if="game.isSoloModeWin">
                  <div class="game_end_success">
                      <h2 v-i18n>You win!</h2>
                      <div class="game_end_solo_img">
                          <img src="assets/solo_win.png" />
                      </div>
                      <div class="game_end_notice">
                        <span v-i18n>But it isn't the reason to stop making Mars better.</span>
                      </div>
                      <ul class="game_end_list">
                          <li v-i18n>Try to win with expansions enabled</li>
                          <li v-i18n>Try to win before the last generation</li>
                          <li><span v-i18n>Can you get</span> {{ players[0].victoryPointsBreakdown.total + 10 }}<span v-i18n>+ Victory Points?</span></li>
                      </ul>
                  </div>
              </div>
              <div v-else>
                  <div class="game_end_fail">
                      <h2 v-i18n>Sorry, you lose.</h2>
                      <div class="game_end_notice">
                        <span v-i18n>Next time you will get more luck!</span><br>
                        <span v-i18n>Also, take into account these small hints to win:</span>
                      </div>
                      <ul class="game_end_list" v-i18n>
                          <li>Concentrate more on Global parameters, not on Victory Points</li>
                          <li>Don't be greedy with card selection</li>
                          <li>Try to increase heat production, not Megacredits</li>
                          <li>Try starting with the Beginner corporation</li>
                      </ul>
                  </div>
              </div>
          </div>
          <div class="game_end_navigation">
            <div>
              <a href="new-game">
                  <AppButton size="big" type="back" />
                  <span v-i18n>Create New Game</span>
              </a>

              <a href=".">
                  <AppButton size="big" type="back" />
                  <span v-i18n>Go to main page</span>
              </a>
            </div>
          </div>
          <div v-if="!isSoloGame || game.isSoloModeWin" class="game-end-winer-announcement">
              <span v-for="p in winners" :key="p.color"><span :class="'log-player ' + getEndGamePlayerRowColorClass(p.color)">{{ p.name }}</span></span> <span v-i18n>won!</span>
          </div>
          <div class="game_end_victory_points">
              <h2><span v-i18n>Victory point breakdown after</span> {{game.generation}} <span v-i18n>generations</span></h2>
              <table class="table game_end_table">
                  <thead>
                      <tr v-i18n>
                          <th><div class="card-delegate"></div></th>
                          <th><div class="tr"></div></th>
                          <th><div class="m-and-a tooltip tooltip-top" :data-tooltip="$t('Milestones points')">M</div></th>
                          <th><div class="m-and-a tooltip tooltip-top" :data-tooltip="$t('Awards points')">A</div></th>
                          <th><div class="table-forest-tile"></div></th>
                          <th><div class="table-city-tile"></div></th>
                          <th v-if="game.moon !== undefined"><div class="table-moon-road-tile"></div></th>
                          <th v-if="game.moon !== undefined"><div class="table-moon-colony-tile"></div></th>
                          <th v-if="game.moon !== undefined"><div class="table-moon-mine-tile"></div></th>
                          <th v-if="game.pathfinders !== undefined"><div class="table-planetary-track"></div></th>
                          <th><div class="vp">VP</div></th>
                          <th v-if="game.gameOptions.escapeVelocityMode" class="clock-icon tooltip tooltip-top" :data-tooltip="$t('Escape Velocity penalty')">&#x23F3;</th>
                          <th class="game-end-total"><div class="game-end-total-column">Total</div></th>
                          <th><div class="mc-icon"></div></th>
                          <th v-if="game.gameOptions.showTimers" class="clock-icon">&#x1F551;</th>
                          <th><div class="table-red-arrow tooltip tooltip-top" :data-tooltip="$t('Actions taken this game')"></div></th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr v-for="p in playersInPlace" :key="p.color" :class="getEndGamePlayerRowColorClass(p.color)">
                          <td>
                            <a :href="'player?id='+p.id+'&noredirect'">{{ p.name }}</a>
                            <div class="column-corporation">
                              <div v-for="(corporationName, index) in getCorporationName(p)" :key="index" v-i18n>{{ corporationName }}</div>
                            </div>
                          </td>
                          <td>{{ p.victoryPointsBreakdown.terraformRating }}</td>
                          <td>{{ p.victoryPointsBreakdown.milestones }}</td>
                          <td>{{ p.victoryPointsBreakdown.awards }}</td>
                          <td>{{ p.victoryPointsBreakdown.greenery }}</td>
                          <td>{{ p.victoryPointsBreakdown.city }}</td>
                          <td v-if="game.moon !== undefined">{{ p.victoryPointsBreakdown.moonRoads }}</td>
                          <td v-if="game.moon !== undefined">{{ p.victoryPointsBreakdown.moonHabitats }}</td>
                          <td v-if="game.moon !== undefined">{{ p.victoryPointsBreakdown.moonMines }}</td>
                          <td v-if="game.pathfinders !== undefined"> {{ p.victoryPointsBreakdown.planetaryTracks}}</td>
                          <td>{{ p.victoryPointsBreakdown.victoryPoints }}</td>
                          <td v-if="game.gameOptions.escapeVelocityMode">{{ p.victoryPointsBreakdown.escapeVelocity }}</td>
                          <td class="game-end-total">{{ p.victoryPointsBreakdown.total }}</td>
                          <td class="game-end-mc">
                            <div>{{ p.megaCredits }}</div>
                          </td>
                          <td v-if="game.gameOptions.showTimers"><div class="game-end-timer">{{ getTimer(p) }}</div></td>
                          <td><div class="game-end-timer">{{ p.actionsTakenThisGame }}</div></td>
                      </tr>
                  </tbody>
              </table>
              <br/>
              <h2 v-i18n>Victory points details</h2>
              <victory-point-chart
                :datasets="vpDataset"
                :generation="game.generation"
                :animation="true"
                :id="'victory-point-chart'"
                ></victory-point-chart>
              <div class="game-end-flexrow">
                  <div v-for="p in playersInPlace" :key="p.color" class="game-end-column">
                      <div class="game-end-winer-scorebreak-player-title">
                          <div :class="'game-end-player ' + getEndGamePlayerRowColorClass(p.color)"><a :href="'player?id='+p.id+'&noredirect'">{{p.name}}</a></div>
                      </div>
                      <div v-for="v in p.victoryPointsBreakdown.detailsCards" :key="v.cardName">
                        <div class="game-end-column-row">
                          <div class="game-end-column-vp">{{v.victoryPoint}}</div>
                          <div class="game-end-column-text" v-i18n>{{v.cardName}}</div>
                        </div>
                      </div>
                      <div class="game-end-column-row">
                        <div class="game-end-column-vp">&nbsp;</div>
                        <div class="game-end-column-text">&nbsp;</div>
                      </div>
                      <div v-for="v in p.victoryPointsBreakdown.detailsMilestones" :key="v">
                        <div class="game-end-column-row">
                          <div class="game-end-column-vp">{{v.victoryPoint}}</div>
                          <div class="game-end-column-text">{{translateMilestoneDetails(v)}}</div>
                        </div>
                      </div>
                      <div v-for="v in p.victoryPointsBreakdown.detailsAwards" :key="v">
                        <div class="game-end-column-row">
                          <div class="game-end-column-vp">{{v.victoryPoint}}</div>
                          <div class="game-end-column-text">{{translateAwardDetails(v)}}</div>
                        </div>
                      </div>
                      <div v-for="v in p.victoryPointsBreakdown.detailsPlanetaryTracks" :key="v.tag">
                        <div class="game-end-column-row">
                          <div class="game-end-column-vp">{{v.points}}</div>
                          <div class="game-end-column-text" v-i18n>Most tags on the {{v.tag}} track</div>
                        </div>
                      </div>
                  </div>
              </div>
          </div>
          <div class="game-end-flexrow">
          <div class="game_end_block--board game-end-column">
              <victory-point-chart
                :datasets="globalsDataset"
                :generation="game.generation"
                :animation="true"
                :id="'global-parameter-chart'"
                :yAxisLabel="'% completed'"
              ></victory-point-chart>
              <h2 v-i18n>Final situation on the board</h2>
              <board
                  :spaces="game.spaces"
                  :expansions="game.gameOptions.expansions"
                  :venusScaleLevel="game.venusScaleLevel"
                  :altVenusBoard="game.gameOptions.altVenusBoard"
                  :boardName ="game.gameOptions.boardName"
                  :oceans_count="game.oceans"
                  :oxygen_level="game.oxygenLevel"
                  :temperature="game.temperature"></board>
            <MoonBoard v-if="game.gameOptions.expansions.moon" :model="game.moon"></MoonBoard>
            <div v-if="game.gameOptions.expansions.pathfinders">
              <PlanetaryTracks :tracks="game.pathfinders" :gameOptions="game.gameOptions"/>
            </div>
          </div>
          <div class="game_end_block--log game-end-column">
            <log-panel :color="color" :generation="game.generation" v-if="viewModel.id !== undefined" :id="viewModel.id" :lastSoloGeneration="game.lastSoloGeneration" :players="players"></log-panel>
            <a :href="downloadLogUrl" target="_blank" v-i18n>Download game log</a>
          </div>
        </div>
      </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import * as constants from '@/common/constants';
import {paths} from '@/common/app/paths';
import {GameModel} from '@/common/models/GameModel';
import {PlayerViewModel, PublicPlayerModel, ViewModel} from '@/common/models/PlayerModel';
import Board from '@/client/components/Board.vue';
import MoonBoard from '@/client/components/moon/MoonBoard.vue';
import PlanetaryTracks from '@/client/components/pathfinders/PlanetaryTracks.vue';
import LogPanel from '@/client/components/logpanel/LogPanel.vue';
import AppButton from '@/client/components/common/AppButton.vue';
import VictoryPointChart, {DataSet} from '@/client/components/gameend/VictoryPointChart.vue';
import {playerColorClass} from '@/common/utils/utils';
import {Timer} from '@/common/Timer';
import {SpectatorModel} from '@/common/models/SpectatorModel';
import {Color} from '@/common/Color';
import {CardType} from '@/common/cards/CardType';
import {getCard} from '@/client/cards/ClientCardManifest';
import {GlobalParameter} from '@/common/GlobalParameter';
import {$t, translateTextWithParams, translateMessage} from '@/client/directives/i18n';
import {Message} from '@/common/logs/Message';
import {LogMessageDataType} from '@/common/logs/LogMessageDataType';
import {MADetail} from '@/common/game/VictoryPointsBreakdown';
import {AwardName} from '@/common/ma/AwardName';

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
    downloadLogUrl() {
      const id = this.playerView?.id || this.spectator?.id;
      if (id === undefined) {
        return undefined;
      }
      return `${paths.API_GAME_LOGS}?id=${id}&full=true`;
    },
    playersInPlace(): Array<PublicPlayerModel> {
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
    winners() {
      const sortedPlayers = this.playersInPlace;
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
    vpDataset(): ReadonlyArray<DataSet> {
      return this.players.map((player) => {
        return {
          label: player.name,
          data: player.victoryPointsByGeneration,
          color: player.color,
        };
      });
    },
    globalsDataset(): ReadonlyArray<DataSet> {
      const dataset: Array<DataSet> = [];

      const gpg = this.game.globalsPerGeneration;
      function getValues(param: GlobalParameter, min: number, max: number): ReadonlyArray<number> {
        return gpg.map((entry) => {
          const val = entry[param] ?? min;
          return 100 * (val - min) / (max - min);
        });
      }

      dataset.push({label: $t('Temperature'), color: 'red', data: getValues(GlobalParameter.TEMPERATURE, -30, 8)});
      dataset.push({label: $t('Oxygen'), color: 'green', data: getValues(GlobalParameter.OXYGEN, 0, 14)});
      dataset.push({label: $t('Oceans'), color: 'blue', data: getValues(GlobalParameter.OCEANS, 0, 9)});
      if (this.game.gameOptions.expansions.venus === true) {
        dataset.push({label: $t('Venus'), color: 'yellow', data: getValues(GlobalParameter.VENUS, 0, 30)});
      }
      if (this.game.gameOptions.expansions.moon === true) {
        dataset.push({label: $t('L. Habitat'), color: 'orange', data: getValues(GlobalParameter.MOON_HABITAT_RATE, 0, 8)});
        dataset.push({label: $t('L. Mining'), color: 'pink', data: getValues(GlobalParameter.MOON_MINING_RATE, 0, 8)});
        dataset.push({label: $t('L. Logistics'), color: 'purple', data: getValues(GlobalParameter.MOON_LOGISTICS_RATE, 0, 8)});
      }
      return dataset;
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
    AppButton,
    MoonBoard,
    PlanetaryTracks,
    VictoryPointChart,
  },
  methods: {
    getEndGamePlayerRowColorClass(color: Color): string {
      return playerColorClass(color, 'bg_transparent');
    },
    getTimer(p: PublicPlayerModel): string {
      return Timer.toString(p.timer);
    },
    getCorporationName(p: PublicPlayerModel): string[] {
      const cards = p.tableau;
      const corporationCards = cards
        .filter((card) => getCard(card.name)?.type === CardType.CORPORATION)
        .map((card) => card.name);
      return corporationCards.length === 0 ? [''] : corporationCards;
    },
    translateMilestoneDetails(data: MADetail): string {
      const args = (data.messageArgs || []).map($t);
      return translateTextWithParams(data.message, args);
    },
    translateAwardDetails(data: MADetail): string {
      if ( ! data.messageArgs || data.messageArgs.length < 3) {
        console.error( // data.message: ${0} place for ${1} award (funded by ${2})
          `Award detail has not enought data.
          It must contain at least 3 arguments:
          1) a Player's place in the race for the award
          2) translatable Award name
          3) not translatable Player name
          `,
        );
        return this.translateMilestoneDetails(data);
      }
      const message: Message = {
        message: data.message,
        data: [
          {
            type: LogMessageDataType.STRING,
            value: data.messageArgs[0],
          },
          {
            type: LogMessageDataType.AWARD,
            value: data.messageArgs[1] as AwardName,
          },
          {
            type: LogMessageDataType.PLAYER,
            value: data.messageArgs[2] as Color,
          },
        ],
      };
      return translateMessage(message);
    },
  },
});

</script>
