import Vue from "vue";
import { PlayerModel } from "../models/PlayerModel";

export const GameEnd = Vue.component("game-end", {
    props: ["player", "game"],
    data: function () {
        return {}
    },
    methods: {
        isSoloGame: function (): boolean {
            return this.player.players.length === 1;
        },
        getPlayerColorStyle: function (player: PlayerModel): string {
            return "color: " + player.color;
        }
    },
    template: `
        <div id="game-end" class="game_end_cont">
            <h1>Terraforming Mars - Game finished!</h1>
            <div class="game_end">
                <div v-if="isSoloGame()">
                    <div v-if="player.isSoloModeWin">
                        <div class="game_end_success">
                            <h2>You win!</h2>
                            <div class="game_end_solo_img">
                                <img src="/assets/solo_win.png" />
                            </div>
                            <div class="game_end_notice">
                                But it isn't the reason to stop making Mars better.
                            </div>
                            <ul class="game_end_list">
                                <li>Try to win with extensions enabled</li>
                                <li>Try to win faster then last generation comes</li>
                                <li>Can you get 90+ Victory Points?</li>
                            </ul>
                        </div>
                    </div>
                    <div v-else>
                        <div class="game_end_fail">
                            <h2>Sorry, you lose.</h2>
                            <div class="game_end_notice">
                                Next time you will get more luck!
                                <br>
                                Also, take into count these small hints to win:
                            </div>
                            <ul class="game_end_list">
                                <li>Concentrate more on Global parameters, not on Victory Points</li>
                                <li>Don't be greedy on cards selection</li>
                                <li>Try to increase Heating production, not Megacredits</li>
                                <li>Try to start with Beginner corporation</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="game_end_victory_points">
                    <h2>Victory points breakdown</h2>
                    <table class="nes-table is-bordered is-centered">
                        <thead>
                            <tr>
                                <th>Player</th>
                                <th>Corporation</th>
                                <th>TR</th>
                                <th>Milestones</th>
                                <th>Awards</th>
                                <th>Greenery</th>
                                <th>City</th>
                                <th>VP</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="p in player.players">
                                <td><span :style="getPlayerColorStyle(p)">{{ p.name }}</span></td>
                                <td>{{ p.corporationCard }}</td>
                                <td>{{ p.victoryPointsBreakdown.terraformRating }}</td>
                                <td>{{ p.victoryPointsBreakdown.milestones }}</td>
                                <td>{{ p.victoryPointsBreakdown.awards }}</td>
                                <td>{{ p.victoryPointsBreakdown.greenery }}</td>
                                <td>{{ p.victoryPointsBreakdown.city }}</td>
                                <td>{{ p.victoryPointsBreakdown.victoryPoints }}</td>
                                <td>{{ p.victoryPointsBreakdown.total }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
});