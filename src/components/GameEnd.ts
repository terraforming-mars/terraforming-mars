import Vue from "vue";
import { PlayerModel } from "../models/PlayerModel";
import { Board } from "./Board";
import { LogPanel } from './LogPanel';

export const GameEnd = Vue.component("game-end", {
    props: ["player", "game"],
    data: function () {
        return {}
    },
    components: {
        "board": Board,
        "log-panel": LogPanel,
    },
    methods: {
        isSoloGame: function (): boolean {
            return this.player.players.length === 1;
        },
        getPlayerColorStyle: function (player: PlayerModel): string {
            return "color: " + player.color;
        },
        getSortedPlayers: function () {
            this.player.players.sort(function (a:PlayerModel, b:PlayerModel){
                if (a.victoryPointsBreakdown.total < b.victoryPointsBreakdown.total) return -1;
                if (a.victoryPointsBreakdown.total > b.victoryPointsBreakdown.total) return 1;
                if (a.megaCredits < b.megaCredits) return -1;
                if (a.megaCredits > b.megaCredits) return 1;
                return 0;
            });
            return this.player.players.reverse();
        }
    },
    template: `
        <div id="game-end" class="game_end_cont">
            <h1>Terraforming Mars - Game finished!</h1>
            <div class="game_end">
                <div v-if="isSoloGame()">
                    <div v-if="player.isSoloModeWin">
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
                                <li v-i18n>Can you get 90+ Victory Points?</li>
                            </ul>
                        </div>
                    </div>
                    <div v-else>
                        <div class="game_end_fail">
                            <h2 v-i18n>Sorry, you lose.</h2>
                            <div class="game_end_notice" v-i18n>
                                Next time you will get more luck!<br>
                                Also, take into count these small hints to win:
                            </div>
                            <ul class="game_end_list" v-i18n>
                                <li>Concentrate more on Global parameters, not on Victory Points</li>
                                <li>Don't be greedy on cards selection</li>
                                <li>Try to increase Heating production, not Megacredits</li>
                                <li>Try to start with Beginner corporation</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="game_end_victory_points">
                    <h2 v-i18n>Victory points breakdown after<span> {{player.generation}} </span>generations</h2>
                    <table class="table game_end_table">
                        <thead>
                            <tr v-i18n>
                                <th>Player</th>
                                <th>Corporation</th>
                                <th>TR</th>
                                <th>Milestones</th>
                                <th>Awards</th>
                                <th>Greenery</th>
                                <th>City</th>
                                <th>VP</th>
                                <th>MC</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="p in getSortedPlayers()">
                                <td><a :href="'/player?id='+p.id+'&noredirect'" :style="getPlayerColorStyle(p)">{{ p.name }}</a></td>
                                <td v-i18n>{{ p.corporationCard.name }}</td>
                                <td>{{ p.victoryPointsBreakdown.terraformRating }}</td>
                                <td>{{ p.victoryPointsBreakdown.milestones }}</td>
                                <td>{{ p.victoryPointsBreakdown.awards }}</td>
                                <td>{{ p.victoryPointsBreakdown.greenery }}</td>
                                <td>{{ p.victoryPointsBreakdown.city }}</td>
                                <td>{{ p.victoryPointsBreakdown.victoryPoints }}</td>
                                <td>{{ p.megaCredits }}</td>
                                <td>{{ p.victoryPointsBreakdown.total }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <br/>
                    <div v-for="p in getSortedPlayers()">
                        <h2 v-i18n>Victory points details for <span> {{p.name}}</span></h2>
                        <div v-for="v in p.victoryPointsBreakdown.detailsCards">
                            {{v}}
                        </div>
                        <div v-for="v in p.victoryPointsBreakdown.detailsMilestones">
                            {{v}}
                        </div>
                        <div v-for="v in p.victoryPointsBreakdown.detailsAwards">
                            {{v}}
                        </div>
                        <br/>
                    </div>
                </div>
                <div class="game_end_block--board">
                    <h2 v-i18n>Final situation on the board</h2>
                    <board 
                        :spaces="player.spaces" 
                        :venusNextExtension="player.venusNextExtension" 
                        :venusScaleLevel="player.venusScaleLevel" 
                        :boardName ="player.boardName"
                        :oceans_count="player.oceans" 
                        :oxygen_level="player.oxygenLevel" 
                        :temperature="player.temperature"
                        :shouldNotify="false"></board>
                </div>
                <br/>
                <div class="game_end_block--log">
                    <h2 v-i18n>Final game log</h2>
                    <log-panel :messages="player.gameLog" :players="player.players"></log-panel>
                </div>
            </div>
        </div>
    `
});