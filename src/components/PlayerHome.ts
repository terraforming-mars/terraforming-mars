import Vue from "vue";

import { Board } from "./Board";
import { Card } from "./Card";
import { Milestone } from "./Milestone";
import { Award } from "./Award";
import { OtherPlayer } from "./OtherPlayer";
import { PlayerResources } from "./PlayerResources";
import { WaitingFor } from "./WaitingFor";
import { Preferences } from "./Preferences"
import { PlayerModel } from "../models/PlayerModel";
import { Colony } from "./Colony";
import { LogPanel } from "./LogPanel";
import { PlayerMixin } from "./PlayerMixin";
import { TagCount } from "./TagCount";
import { Turmoil } from "./Turmoil";
import { TagOverview } from "./TagOverview";

const dialogPolyfill = require("dialog-polyfill");
const isPinned = (root: any, player: PlayerModel): boolean => {
    return (root as any).getVisibilityState("show_pin_" + player.id);
}
const showPlayerData = (root: any, player: PlayerModel) => {
    (root as any).setVisibilityState("show_pin_" + player.id, true);
    (root as any).setVisibilityState("other_player_" + player.id, true);
}
export const hidePlayerData = (root: any, player: PlayerModel) => {
    (root as any).setVisibilityState("show_pin_" + player.id, false);
    (root as any).setVisibilityState("other_player_" + player.id, false);
}

export const PlayerHome = Vue.component("player-home", {
    props: ["player"],
    components: {
        "board": Board,
        "card": Card,
        "other-player": OtherPlayer,
        "player-resources": PlayerResources,
        "waiting-for": WaitingFor,
        "milestone": Milestone,
        "award": Award,
        "tags": TagOverview,
        "preferences": Preferences,
        "colony": Colony,
        "log-panel": LogPanel,
        "tag-count": TagCount,
        "turmoil": Turmoil
    }, 
    mixins: [PlayerMixin],
    methods: { 
        getPlayerCssForTurnOrder: (player: PlayerModel, highlightActive: boolean): string => {
            var ret: string = "highlighter_box player_bg_color_" + player.color;
            if (highlightActive) {
                if (player.needsToDraft || (player.needsToDraft === undefined && player.isActive)) {
                    ret += " player_is_active";
                }
            }
            return ret;
        },
        showPlayerDetails: function (player: PlayerModel) {
            if (player.id === this.player.id) return;

            (this.$root as any).setVisibilityState("other_player_" + player.id, true);
        },
        pinPlayer: function(player: PlayerModel) {
             
            let hiddenPlayers: Array<PlayerModel> = [];
            let playerPinned = isPinned(this.$root, player);

            // if player is already pinned, on unpin add to hidden players
            if(playerPinned) {
                hiddenPlayers = this.player.players;
            } else {
                showPlayerData(this.$root, player);

                for(i =0; i< this.player.players.length; i++) {
                    let p = this.player.players[i];
                    if(p.id === this.player.id || player.id !== p.id) {
                        hiddenPlayers.push(p);
                    }
                }
            }
             
            for(var i=0; i< hiddenPlayers.length; i++) {
                hidePlayerData(this.$root, hiddenPlayers[i]);
            }
            
        },
        hasPinIcon: function(player: PlayerModel): boolean { 
            return player.id !== this.player.id;
        },
        getPinIsActiveClass: function(player: PlayerModel): string {
            return isPinned(this.$root, player) ? "player_pin_selected": "player_pin_not_selected";;
        },
        getFleetsCountRange: function(player: PlayerModel): Array<number> {
            const fleetsRange: Array<number> = [];
            for (let i=0; i < player.fleetSize - player.tradesThisTurn; i++) {
                fleetsRange.push(i);
            }
            return fleetsRange
        }
    },
    mounted: function () {
        dialogPolyfill.default.registerDialog(document.getElementById("dialog-default"));
    },
    template: `
        <div id="player-home" :class="player.turmoil ? 'with-turmoil': ''">
            <h2 :class="'game-title player_color_'+ player.color" v-i18n>Terraforming Mars</h2>
            <section>
                <dialog id="dialog-default">
                    <form method="dialog">
                        <p class="title" v-i18n>Error with input</p>
                        <p id="dialog-default-message"></p>
                        <menu class="dialog-menu">
                            <button class="btn btn-lg btn-primary">OK</button>
                        </menu>
                    </form>
                </dialog>
            </section>
            
            <div v-if="player.phase === 'end'">
                <div class="player_home_block">
                    <h2 v-i18n>This game is over!</h2>
                    <a :href="'/the-end?id='+ player.id" v-i18n>Go to game results</a>
                </div>
            </div>

            <preferences v-trim-whitespace>
                <div class="deck-size">{{ player.deckSize }}</div>
            </preferences>

            <div v-if="player.corporationCard">

                <div class="player_home_block">
                    <a name="board" class="player_home_anchor"></a>
                    <board 
                        :spaces="player.spaces" 
                        :venusNextExtension="player.venusNextExtension" 
                        :venusScaleLevel="player.venusScaleLevel" 
                        :boardName ="player.boardName"
                        :oceans_count="player.oceans" 
                        :oxygen_level="player.oxygenLevel" 
                        :temperature="player.temperature"
                        :shouldNotify="true"></board>

                    <turmoil v-if="player.turmoil" :turmoil="player.turmoil"></turmoil>

                    <div v-if="player.players.length > 1" class="player_home_block--milestones-and-awards">
                        <milestone :milestones_list="player.milestones" />
                        <award :awards_list="player.awards" />
                    </div>
                    
                    <div v-if="player.players.length > 1" class="tag-overview-cont">
                        <details class="accordion">
                            <summary class="accordion-header">
                                <div class="is-action">
                                    <i class="icon icon-arrow-right mr-1"></i>
                                    <span v-i18n>Tag Overview</span>
                                </div>
                            </summary>
                            <div class="accordion-body">
                                <div v-if="player.players.length > 1" class="player_home_block" >
                                  <tags :player="player" />
                                </div>
                            </div>
                        </details>
                    </div>
                </div>

                <div class="player_home_block player_home_block--turnorder nofloat" v-if="player.players.length>1">
                    <h2 :class="'player_color_'+ player.color">
                        <span v-i18n>Turn order</span>
                        <span class="help_tip" v-i18n>(click on player name to see details)</span>
                    </h2>
                    <div class="player_item" v-for="(p, idx) in player.players" v-trim-whitespace>
                        <span>
                            <div class="player_name_cont" :class="getPlayerCssForTurnOrder(p, true)">
                                <span class="player_number">{{ idx+1 }}.</span><a v-on:click.prevent="showPlayerDetails(p)" class="player_name" :class="getPlayerCssForTurnOrder(p, false)" href="#">{{ p.name }}</a>
                                <div class="player_home_block--corp-names corporation-name-cont">
                                <span class="corporation-name" v-if="p.corporationCard">{{ p.corporationCard.name }}</span>
                            </div>
                            </div>
                            <div class="player_pin" :class="getPinIsActiveClass(p)" v-on:click.prevent="pinPlayer(p)" v-if="hasPinIcon(p)"><div class="pin_icon"></div></div>
                            <div class="player_separator" v-if="idx !== player.players.length - 1">⟶</div>
                        </span> 
                        
                    </div>
                    <div class="other_player" v-if="player.players.length > 1">
                        <div v-for="otherPlayer in player.players" :key="otherPlayer.id">
                            <other-player v-if="otherPlayer.id !== player.id" :player="otherPlayer"></other-player>
                        </div>
                    </div>
                </div>

                <div class="tag-display tags_item_cont tag-display-tags" v-if="player.tags.length > 0">
                    <div v-for="tag in player.tags">
                        <tag-count v-if="tag.count > 0" :tag="tag.tag" :count="tag.count"> </tag-count>
                    </div>
                </div>
                <div class="tag-display tags_item_cont" :class="player.tags.length > 0 ? 'tag-display-vp': ''">
                    <div>
                        <div class="tag-display">
                            <div class="tag-count icon-vp">{{player.victoryPointsBreakdown.total}}</div>
                        </div>
                    </div>
                </div>

                <div class="player_home_block player_home_block--resources nofloat">
                    <player-resources :player="player" v-trim-whitespace></player-resources>
                </div>

                <div class="player_home_block player_home_block--actions nofloat">
                    <a name="actions" class="player_home_anchor"></a>
                    <h2 :class="'player_color_'+ player.color" v-i18n>Actions</h2>
                    <waiting-for v-if="player.phase !== 'end'" :players="player.players" :player="player" :waitingfor="player.waitingFor"></waiting-for>
                </div>

                <div class="player_home_block player_home_block--hand" v-if="player.draftedCards.length > 0">
                    <h2 v-i18n>Drafted Cards</h2>
                    <div v-for="card in player.draftedCards" :key="card.name" class="cardbox">
                        <card :card="card"></card>
                    </div>
                </div>

                <div class="player_home_block player_home_block--log nofloat" v-if="player.players.length > 1 && player.gameLog.length > 0">
                    <h2 :class="'player_color_'+ player.color" v-i18n>Last Actions</h2>
                    <log-panel :messages="player.gameLog" :players="player.players"></log-panel>
                </div>

                <a name="cards" class="player_home_anchor"></a>
                <div class="player_home_block player_home_block--hand" v-if="player.cardsInHand.length > 0">
                    <h2 :class="'player_color_'+ player.color" v-i18n>Cards In Hand</h2>
                    <div v-for="card in player.cardsInHand" :key="card.name" class="cardbox">
                        <card :card="card"></card>
                    </div>
                </div>

                <div class="player_home_block player_home_block--cards">
                    <h2 :class="'player_color_'+ player.color" v-i18n>Played Cards</h2>

                    <div v-if="player.corporationCard !== undefined" class="cardbox">
                        <card :card="player.corporationCard" :actionUsed="isCardActivated(player.corporationCard, player)"></card>
                    </div>
                    <div v-for="card in getCardsByType(player.playedCards, [getActiveCardType()])" :key="card.name" class="cardbox">
                        <card :card="card" :actionUsed="isCardActivated(card, player)"> </card>
                    </div>

                    <stacked-cards class="player_home_block--non_blue_cards" :cards="getCardsByType(player.playedCards, [getAutomatedCardType(), getPreludeCardType()])" ></stacked-cards>
                    <stacked-cards class="player_home_block--non_blue_cards" :cards="getCardsByType(player.playedCards, [getEventCardType()])" ></stacked-cards>                    
                </div>

                <div v-if="player.selfReplicatingRobotsCards.length > 0" class="player_home_block">
                    <h2 :class="'player_color_'+ player.color" v-i18n>Self-Replicating Robots cards</h2>
                    <div>
                        <div v-for="card in getCardsByType(player.selfReplicatingRobotsCards, [getActiveCardType()])" :key="card.name" class="cardbox">
                            <card :card="card"></card>
                        </div>
                    </div>
                </div>

            </div>

            <div class="player_home_block player_home_block--setup nofloat"  v-if="!player.corporationCard">

                <div v-for="card in player.dealtCorporationCards" :key="card.name" class="cardbox" v-if="player.initialDraft">
                    <card :card="card"></card>
                </div>

                <div v-for="card in player.dealtPreludeCards" :key="card.name" class="cardbox" v-if="player.initialDraft">
                    <card :card="card"></card>
                </div> 

                <div class="player_home_block player_home_block--hand" v-if="player.draftedCards.length > 0">              
                    <h2 v-i18n>Drafted Cards</h2>
                    <div v-for="card in player.draftedCards" :key="card.name" class="cardbox">
                        <card :card="card"></card>
                    </div>
                </div>

                <h2 :class="'player_color_'+ player.color" v-i18n>Select initial cards:</h2>

                <waiting-for v-if="player.phase !== 'end'" :players="player.players" :player="player" :waitingfor="player.waitingFor"></waiting-for>

                <h2 :class="'player_color_'+ player.color" v-i18n>Game details</h2>

                <div class="player_home_block" v-if="player.players.length > 1">
                    <milestone :milestones_list="player.milestones" />
                    <award :awards_list="player.awards" />
                </div>

                <div class="player_home_block player_home_block--turnorder nofloat" v-if="player.players.length>1">
                    <h2 :class="'player_color_'+ player.color">
                        <span v-i18n>Turn order</span>
                    </h2>
                    <div class="player_item" v-for="(p, idx) in player.players" v-trim-whitespace>
                        <div class="player_name_cont" :class="getPlayerCssForTurnOrder(p, true)">
                            <span class="player_number">{{ idx+1 }}.</span><span class="player_name" :class="getPlayerCssForTurnOrder(p, false)" href="#">{{ p.name }}</span>
                        </div>
                        <div class="player_separator" v-if="idx !== player.players.length - 1">⟶</div>
                    </div>
                </div>

                <details class="accordion">
                    <summary class="accordion-header">
                        <div class="is-action">
                            <i class="icon icon-arrow-right mr-1"></i>
                            <span v-i18n>Board</span>
                        </div>
                    </summary>
                    <div class="accordion-body">
                        <board :spaces="player.spaces" :venusNextExtension="player.venusNextExtension" :venusScaleLevel="player.venusScaleLevel" :boardName ="player.boardName"></board>
                        <turmoil v-if="player.turmoil" :turmoil="player.turmoil"></turmoil>
                    </div>
                </details>
            </div>

            <div v-if="player.colonies.length > 0" class="player_home_block">
                <h2 :class="'player_color_'+ player.color" v-i18n>Colonies</h2>
                <div class="colonies-fleets-cont" v-if="player.corporationCard">
                    <div class="colonies-player-fleets" v-for="colonyPlayer in player.players">
                        <div :class="'colonies-fleet colonies-fleet-'+ colonyPlayer.color" v-for="idx in getFleetsCountRange(colonyPlayer)"></div>
                    </div>
                </div>
                <div class="player_home_colony_cont">
                    <div class="player_home_colony" v-for="colony in player.colonies" :key="colony.name">
                        <colony :colony="colony"></colony>
                    </div>
                </div>
            </div>
        </div>
    `
});
