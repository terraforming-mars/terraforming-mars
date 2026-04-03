<template>
  <div id="game-end" class="game_end_cont">
      <h1 v-i18n>{{ constants.APP_NAME }} - Game finished!</h1>
      <div class="game_end">
          <div v-if="isAutomaGame && game.marsBot">
              <div v-if="game.marsBot.instantWin" class="game_end_fail">
                  <h2><span v-i18n>MarsBot wins!</span> (<span v-i18n>Generation</span> {{game.generation}} <span v-i18n>reached</span>)</h2>
              </div>
              <div v-else-if="automaHumanWins" class="game_end_success">
                  <h2><span v-i18n>You beat MarsBot!</span> ({{players[0].victoryPointsBreakdown.total}} vs {{game.marsBot.vpBreakdown?.total || 0}})</h2>
              </div>
              <div v-else class="game_end_fail">
                  <h2><span v-i18n>MarsBot wins!</span> ({{game.marsBot.vpBreakdown?.total || 0}} vs {{players[0].victoryPointsBreakdown.total}})</h2>
                  <div class="game_end_notice" v-if="game.marsBot.vpBreakdown?.total === players[0].victoryPointsBreakdown.total">
                    <span v-i18n>Tie goes to MarsBot!</span>
                  </div>
              </div>
          </div>
          <div v-else-if="isSoloGame">
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
          <div v-if="!isAutomaGame && (!isSoloGame || game.isSoloModeWin)" class="game-end-winer-announcement">
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
                          <th v-if="game.gameOptions.escapeVelocity" class="clock-icon tooltip tooltip-top" :data-tooltip="$t('Escape Velocity penalty')">&#x23F3;</th>
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
                          <td v-if="game.gameOptions.escapeVelocity">{{ p.victoryPointsBreakdown.escapeVelocity }}</td>
                          <td class="game-end-total">{{ p.victoryPointsBreakdown.total }}</td>
                          <td class="game-end-mc">
                            <div>{{ p.megacredits }}</div>
                          </td>
                          <td v-if="game.gameOptions.showTimers"><div class="game-end-timer">{{ getTimer(p) }}</div></td>
                          <td><div class="game-end-timer">{{ p.actionsTakenThisGame }}</div></td>
                      </tr>
                      <tr v-if="isAutomaGame && game.marsBot?.vpBreakdown" :class="getEndGamePlayerRowColorClass(game.marsBot.color)">
                          <td>{{ game.marsBot.name }} ({{game.marsBot.difficulty}})
                            <div v-if="game.marsBot.corpName" class="column-corporation"><div v-i18n>{{ game.marsBot.corpName }}</div></div>
                          </td>
                          <td>{{game.marsBot.vpBreakdown.terraformRating}}</td>
                          <td>{{game.marsBot.vpBreakdown.milestones}}</td>
                          <td>{{game.marsBot.vpBreakdown.awards}}</td>
                          <td>{{game.marsBot.vpBreakdown.greenery}}</td>
                          <td>{{game.marsBot.vpBreakdown.cityAdjacentGreenery}}</td>
                          <td v-if="game.moon !== undefined">-</td>
                          <td v-if="game.moon !== undefined">-</td>
                          <td v-if="game.moon !== undefined">-</td>
                          <td v-if="game.pathfinders !== undefined">-</td>
                          <td>{{game.marsBot.vpBreakdown.neuralInstance + game.marsBot.vpBreakdown.mcToVP}}</td>
                          <td v-if="game.gameOptions.escapeVelocity">-</td>
                          <td class="game-end-total">{{game.marsBot.vpBreakdown.total}}</td>
                          <td class="game-end-mc">{{game.marsBot.mcSupply}}</td>
                          <td v-if="game.gameOptions.showTimers">-</td>
                          <td>-</td>
                      </tr>
                  </tbody>
              </table>
              <!-- MarsBot VP detail shown in the column section below -->
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
                      <div v-for="v in p.victoryPointsBreakdown.detailsMilestones" :key="v.message">
                        <div class="game-end-column-row">
                          <div class="game-end-column-vp">{{v.victoryPoint}}</div>
                          <div class="game-end-column-text">{{translateMilestoneDetails(v)}}</div>
                        </div>
                      </div>
                      <div v-for="v in p.victoryPointsBreakdown.detailsAwards" :key="v.message">
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
                  <div v-if="isAutomaGame && game.marsBot?.vpBreakdown" class="game-end-column">
                      <div class="game-end-winer-scorebreak-player-title">
                          <div :class="'game-end-player ' + getEndGamePlayerRowColorClass(game.marsBot.color)">{{ game.marsBot.name }}</div>
                      </div>
                      <div v-for="(v, i) in game.marsBot.vpBreakdown.detailsMilestones" :key="'m'+i">
                        <div class="game-end-column-row">
                          <div class="game-end-column-vp">{{v.victoryPoint}}</div>
                          <div class="game-end-column-text">{{translateMilestoneDetails(v)}}</div>
                        </div>
                      </div>
                      <div v-for="(v, i) in game.marsBot.vpBreakdown.detailsAwards" :key="'a'+i">
                        <div class="game-end-column-row">
                          <div class="game-end-column-vp">{{v.victoryPoint}}</div>
                          <div class="game-end-column-text">{{translateAwardDetails(v)}}</div>
                        </div>
                      </div>
                      <div class="game-end-column-row">
                        <div class="game-end-column-vp">&nbsp;</div>
                        <div class="game-end-column-text">&nbsp;</div>
                      </div>
                      <div v-if="game.marsBot.vpBreakdown.neuralInstance > 0" class="game-end-column-row">
                        <div class="game-end-column-vp">{{game.marsBot.vpBreakdown.neuralInstance}}</div>
                        <div class="game-end-column-text" v-i18n>Neural Instance</div>
                      </div>
                      <div v-if="game.marsBot.vpBreakdown.mcToVP > 0" class="game-end-column-row">
                        <div class="game-end-column-vp">{{game.marsBot.vpBreakdown.mcToVP}}</div>
                        <div class="game-end-column-text"><span v-i18n>MC to VP</span> ({{game.marsBot.mcPerVP || '?'}} MC/VP)</div>
                      </div>
                      <div v-if="game.marsBot.vpBreakdown.cardVP > 0" class="game-end-column-row">
                        <div class="game-end-column-vp">{{game.marsBot.vpBreakdown.cardVP}}</div>
                        <div class="game-end-column-text" v-i18n>Card VP (hard mode)</div>
                      </div>
                  </div>
              </div>
          </div>
          <div class="game_end_victory_points">
              <h2 v-i18n>Global Parameter Contributions</h2>
              <table class="table game_end_table">
                  <thead>
                      <tr>
                          <th><div class="card-delegate"></div></th>
                          <th><div class="tile temperature-tile"></div></th>
                          <th><div class="tile oxygen-tile"></div></th>
                          <th><div class="tile ocean-tile"></div></th>
                          <th v-if="game.gameOptions.expansions.venus"><div class="tile venus-tile"></div></th>
                          <th v-if="game.gameOptions.expansions.moon"><div class="table-moon-colony-tile"></div></th>
                          <th v-if="game.gameOptions.expansions.moon"><div class="table-moon-mine-tile"></div></th>
                          <th v-if="game.gameOptions.expansions.moon"><div class="table-moon-road-tile"></div></th>
                          <th><div class="game-end-total-column">Total</div></th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr v-for="data in playerContributionsData" :key="data.color" :class="getEndGamePlayerRowColorClass(data.color)">
                          <td>{{ data.player }}</td>
                          <td>{{ data.temp }}</td>
                          <td>{{ data.oxygen }}</td>
                          <td>{{ data.oceans }}</td>
                          <td v-if="game.gameOptions.expansions.venus">{{ data.venus }}</td>
                          <td v-if="game.gameOptions.expansions.moon">{{ data.moonHabitat }}</td>
                          <td v-if="game.gameOptions.expansions.moon">{{ data.moonMining }}</td>
                          <td v-if="game.gameOptions.expansions.moon">{{ data.moonLogistics }}</td>
                          <td class="game-end-total">{{ data.total }}</td>
                      </tr>
                  </tbody>
              </table>
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
            <MoonBoard v-if="game.moon !== undefined" :model="game.moon"></MoonBoard>
            <div v-if="game.gameOptions.expansions.pathfinders">
              <PlanetaryTracks :tracks="game.pathfinders" :gameOptions="game.gameOptions"/>
            </div>
          </div>
          <div class="game_end_block--log game-end-column">
            <log-panel :color="color" :viewModel="viewModel"></log-panel>
            <a :href="downloadLogUrl" target="_blank" v-i18n>Download game log</a>
          </div>
        </div>
      </div>
  </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
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

export default defineComponent({
  name: 'game-end',
  props: {
    playerView: {
      type: Object as () => PlayerViewModel | undefined,
      required: true,
    },
    spectator: {
      type: Object as () => SpectatorModel | undefined,
      required: true,
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
        if (a.megacredits < b.megacredits) return -1;
        if (a.megacredits > b.megacredits) return 1;
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
                    sortedPlayers[i].megacredits === firstWinner.megacredits) {
          winners.push(sortedPlayers[i]);
        }
      }
      return winners;
    },
    isSoloGame(): boolean {
      if (this.isAutomaGame) return false;
      return this.players.length === 1;
    },
    isAutomaGame(): boolean {
      return this.game.marsBot !== undefined;
    },
    automaHumanWins(): boolean {
      if (!this.game.marsBot?.vpBreakdown) return false;
      if (this.game.marsBot.instantWin) return false;
      // Tie = MarsBot wins
      return this.players[0].victoryPointsBreakdown.total > this.game.marsBot.vpBreakdown.total;
    },
    vpDataset(): ReadonlyArray<DataSet> {
      const datasets = this.players.map((player) => {
        return {
          label: player.name,
          data: player.victoryPointsByGeneration,
          color: player.color,
        };
      });
      const marsBot = this.game.marsBot;
      if (marsBot?.vpByGeneration && marsBot.vpByGeneration.length > 0) {
        datasets.push({
          label: marsBot.name,
          data: marsBot.vpByGeneration,
          color: marsBot.color,
        });
      }
      return datasets;
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
    playerContributionsData(): Array<{player: string, color: Color, temp: number, oxygen: number, oceans: number, venus?: number, moonHabitat?: number, moonMining?: number, moonLogistics?: number, total: number}> {
      const extract = (name: string, color: Color, steps: Partial<Record<GlobalParameter, number>>) => {
        const temp = steps[GlobalParameter.TEMPERATURE] || 0;
        const oxygen = steps[GlobalParameter.OXYGEN] || 0;
        const oceans = steps[GlobalParameter.OCEANS] || 0;
        const venus = steps[GlobalParameter.VENUS] || 0;
        const moonHabitat = steps[GlobalParameter.MOON_HABITAT_RATE] || 0;
        const moonMining = steps[GlobalParameter.MOON_MINING_RATE] || 0;
        const moonLogistics = steps[GlobalParameter.MOON_LOGISTICS_RATE] || 0;
        return {player: name, color, temp, oxygen, oceans, venus, moonHabitat, moonMining, moonLogistics,
          total: temp + oxygen + oceans + venus + moonHabitat + moonMining + moonLogistics};
      };
      const data = this.players.map((p) => extract(p.name, p.color, p.globalParameterSteps || {}));
      if (this.game.marsBot?.globalParameterSteps) {
        data.push(extract(this.game.marsBot.name, this.game.marsBot.color, this.game.marsBot.globalParameterSteps));
      }
      return data;
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
  mounted() {
    document.title = `End of Game | ${constants.APP_NAME}`;
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
