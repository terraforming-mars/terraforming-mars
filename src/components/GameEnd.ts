import Vue from "vue";
import { PlayerModel } from "../models/PlayerModel";
import { Board } from "./Board";
import { LogPanel } from "./LogPanel";
import { Button } from "../components/common/Button";

declare function _l<T>(arg1: Array<T>, arg2: (item2: T) => Vue.VNode): Vue.VNode;

export const GameEnd = Vue.component("game-end", {
    props: {
        player: {
            type: Object as () => PlayerModel
        }
    },
    data: function () {
        return {}
    },
    components: {
        "board": Board,
        "log-panel": LogPanel,
        "Button": Button
    },
    methods: {
        fillMeIn: function () {
            const _c = function () { } as any;
            const _e = function () { } as any;
            const _m = function () { } as any;
            const _s = function () { } as any;
            const _v = function () { } as any;
            const player = this.player;
            const getEndGamePlayerColorClass = this.getEndGamePlayerColorClass;
            const getSortedPlayers = this.getSortedPlayers;
            const isSoloGame = this.isSoloGame;
            
                return _c('div',{staticClass:"game_end_cont",attrs:{"id":"game-end"}},[_c('h1',[_v("Terraforming Mars - Game finished!")]),_v(" "),_c('div',{staticClass:"game_end"},[(isSoloGame())?_c('div',[(player.isSoloModeWin)?_c('div',[_c('div',{staticClass:"game_end_success"},[_c('h2',{directives:[{name:"i18n",rawName:"v-i18n"}]},[_v("You win!")]),_v(" "),_m(0),_v(" "),_c('div',{directives:[{name:"i18n",rawName:"v-i18n"}],staticClass:"game_end_notice"},[_v("                                But it isn't the reason to stop making Mars better.                            ")]),_v(" "),_c('ul',{staticClass:"game_end_list"},[_c('li',{directives:[{name:"i18n",rawName:"v-i18n"}]},[_v("Try to win with expansions enabled")]),_v(" "),_c('li',{directives:[{name:"i18n",rawName:"v-i18n"}]},[_v("Try to win before the last generation comes")]),_v(" "),_c('li',[_c('span',{directives:[{name:"i18n",rawName:"v-i18n"}]},[_v("Can you get")]),_v(" "+_s(player.victoryPointsBreakdown.total + 10)),_c('span',{directives:[{name:"i18n",rawName:"v-i18n"}]},[_v("+ Victory Points?")])])])])]):_c('div',[_c('div',{staticClass:"game_end_fail"},[_c('h2',{directives:[{name:"i18n",rawName:"v-i18n"}]},[_v("Sorry, you lose.")]),_v(" "),_c('div',{directives:[{name:"i18n",rawName:"v-i18n"}],staticClass:"game_end_notice"},[_v("                                Next time you will get more luck!"),_c('br'),_v("                                Also, take into account these small hints to win:                            ")]),_v(" "),_c('ul',{directives:[{name:"i18n",rawName:"v-i18n"}],staticClass:"game_end_list"},[_c('li',[_v("Concentrate more on Global parameters, not on Victory Points")]),_v(" "),_c('li',[_v("Don't be greedy on cards selection")]),_v(" "),_c('li',[_v("Try to increase Heat production, not Megacredits")]),_v(" "),_c('li',[_v("Try to start with Beginner corporation")])])])])]):_e(),_v(" "),_c('div',{staticClass:"game_end_go_home"},[_c('a',{directives:[{name:"i18n",rawName:"v-i18n"}],attrs:{"href":"/"}},[_c('Button',{attrs:{"size":"big","type":"back"}}),_v("                        Go to main page                    ")],1)]),_v(" "),_c('div',{staticClass:"game_end_victory_points"},[_c('h2',{directives:[{name:"i18n",rawName:"v-i18n"}]},[_v("Victory points breakdown after"),_c('span',[_v(" "+_s(player.generation)+" ")]),_v("generations")]),_v(" "),_c('table',{staticClass:"table game_end_table"},[_c('thead',[_c('tr',{directives:[{name:"i18n",rawName:"v-i18n"}]},[_c('th',[_v("Player")]),_v(" "),_c('th',[_v("Corporation")]),_v(" "),_c('th',[_v("TR")]),_v(" "),_c('th',[_v("Milestones")]),_v(" "),_c('th',[_v("Awards")]),_v(" "),_c('th',[_v("Greenery")]),_v(" "),_c('th',[_v("City")]),_v(" "),_c('th',[_v("VP")]),_v(" "),_c('th',[_v("MC")]),_v(" "),_c('th',[_v("Total")])])]),_v(" "),_c('tbody',_l((getSortedPlayers()),function(p){return _c('tr',[_c('td',[_c('log-player',{class:getEndGamePlayerColorClass(p)},[_v(_s(p.name))])],1),_v(" "),_c('td',{directives:[{name:"i18n",rawName:"v-i18n"}]},[_v(_s(p.corporationCard.name))]),_v(" "),_c('td',[_v(_s(p.victoryPointsBreakdown.terraformRating))]),_v(" "),_c('td',[_v(_s(p.victoryPointsBreakdown.milestones))]),_v(" "),_c('td',[_v(_s(p.victoryPointsBreakdown.awards))]),_v(" "),_c('td',[_v(_s(p.victoryPointsBreakdown.greenery))]),_v(" "),_c('td',[_v(_s(p.victoryPointsBreakdown.city))]),_v(" "),_c('td',[_v(_s(p.victoryPointsBreakdown.victoryPoints))]),_v(" "),_c('td',[_v(_s(p.megaCredits))]),_v(" "),_c('td',[_v(_s(p.victoryPointsBreakdown.total))])])}),0)]),_v(" "),_c('br'),_v(" "),_l((getSortedPlayers()),function(p){return _c('div',[_c('h2',{directives:[{name:"i18n",rawName:"v-i18n"}]},[_v("Victory points details for "),_c('span',[_v(" "+_s(p.name))])]),_v(" "),_l((p.victoryPointsBreakdown.detailsCards),function(v){return _c('div',[_v("                            "+_s(v)+"                        ")])}),_v(" "),_l((p.victoryPointsBreakdown.detailsMilestones),function(v){return _c('div',[_v("                            "+_s(v)+"                        ")])}),_v(" "),_l((p.victoryPointsBreakdown.detailsAwards),function(v){return _c('div',[_v("                            "+_s(v)+"                        ")])}),_v(" "),_c('br')],2)})],2),_v(" "),_c('div',{staticClass:"game_end_block--board"},[_c('h2',{directives:[{name:"i18n",rawName:"v-i18n"}]},[_v("Final situation on the board")]),_v(" "),_c('board',{attrs:{"spaces":player.spaces,"venusNextExtension":player.venusNextExtension,"venusScaleLevel":player.venusScaleLevel,"boardName":player.boardName,"oceans_count":player.oceans,"oxygen_level":player.oxygenLevel,"temperature":player.temperature,"shouldNotify":false}})],1),_v(" "),_c('br'),_v(" "),_c('div',{staticClass:"game_end_block--log"},[_c('h2',{directives:[{name:"i18n",rawName:"v-i18n"}]},[_v("Final game log")]),_v(" "),_c('log-panel',{attrs:{"id":player.id,"players":player.players}})],1)])])
        },
        isSoloGame: function (): boolean {
            return this.player.players.length === 1;
        },
        getEndGamePlayerColorClass: function (player: PlayerModel): string {
            return "player_bg_color_" + player.color;
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
                                <li><span v-i18n>Can you get</span> {{ player.victoryPointsBreakdown.total + 10 }}<span v-i18n>+ Victory Points?</span></li>
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
                                <td><log-player :class="getEndGamePlayerColorClass(p)">{{ p.name }}</log-player></td>
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
                    <log-panel :id="player.id" :players="player.players"></log-panel>
                </div>
            </div>
        </div>
    `
});
