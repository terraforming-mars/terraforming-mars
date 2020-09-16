import Vue from "vue";

import { Board } from "./Board";
import { Card } from "./Card";
import { Milestone } from "./Milestone";
import { Award } from "./Award";
import { OtherPlayer } from "./OtherPlayer";
import { PlayersOverview } from "./overview/PlayersOverview";
import { PlayerResources } from "./overview/PlayerResources";
import { WaitingFor } from "./WaitingFor";
import { Preferences } from "./Preferences";
import { PlayerModel } from "../models/PlayerModel";
import { Colony } from "./Colony";
import { LogPanel } from "./LogPanel";
import { PlayerMixin } from "./PlayerMixin";
import { TagCount } from "./TagCount";
import { Turmoil } from "./Turmoil";
import { TagOverview } from "./TagOverview";
import { playerBgColorClass } from "../utils/utils";

const dialogPolyfill = require("dialog-polyfill");

export const hidePlayerData = (root: any, player: PlayerModel) => {
    (root as any).setVisibilityState("other_player_" + player.id, false);
};

export const PlayerHome = Vue.component("player-home", {
    props: ["player"],
    components: {
        "board": Board,
        "card": Card,
        "other-player": OtherPlayer,
        "player-resources": PlayerResources,
        "players-overview": PlayersOverview,
        "waiting-for": WaitingFor,
        "milestone": Milestone,
        "award": Award,
        "tags": TagOverview,
        "preferences": Preferences,
        "colony": Colony,
        "log-panel": LogPanel,
        "tag-count": TagCount,
        "turmoil": Turmoil,
    },
    mixins: [PlayerMixin],
    methods: {
        getPlayerCssForTurnOrder: (
            player: PlayerModel,
            highlightActive: boolean
        ): string => {
            let classes = ["highlighter_box"];

            if (highlightActive) {
                if (
                    player.needsToDraft ||
                    (player.needsToDraft === undefined && player.isActive)
                ) {
                    classes.push("player_is_active");
                }
                classes.push(playerBgColorClass(player.color));
            }
            return classes.join(" ");
        },
        showPlayerDetails: function (player: PlayerModel) {
            if (player.id === this.player.id) return;

            (this.$root as any).setVisibilityState(
                "other_player_" + player.id,
                true
            );
        },
        getFleetsCountRange: function (player: PlayerModel): Array<number> {
            const fleetsRange: Array<number> = [];
            for (let i = 0; i < player.fleetSize - player.tradesThisTurn; i++) {
                fleetsRange.push(i);
            }
            return fleetsRange;
        },
    },
    mounted: function () {
        dialogPolyfill.default.registerDialog(
            document.getElementById("dialog-default")
        );
    },
    template: `
        <div id="player-home" :class="player.turmoil ? 'with-turmoil': ''">
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

            <preferences v-trim-whitespace :player_name="player.name" :player_color="player.color" :generation="player.generation" :coloniesCount="player.colonies.length">
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
                </div>
                
                <players-overview class="player_home_block player_home_block--players nofloat:" :player="player" v-trim-whitespace />
                 
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

                <div class="player_home_block player_home_block--log player_home_block--hide_log nofloat" v-if="player.gameLog.length > 0">
                    <h2 :class="'player_color_'+ player.color"><span v-i18n>Game log</span><span class="label-additional">generation {{ player.generation }}</span></h2>
                    <log-panel :messages="player.gameLog" :players="player.players"></log-panel>
                </div>

                <a name="cards" class="player_home_anchor"></a>
                <div class="player_home_block player_home_block--hand" v-if="player.cardsInHand.length > 0">
                    <h2 :class="'player_color_'+ player.color"> <span v-i18n>Cards In Hand</span><span class="label-additional">{{ player.cardsInHandNbr }}</span></h2>
                    <div v-for="card in player.cardsInHand" :key="card.name" class="cardbox">
                        <card :card="card"></card>
                    </div>
                </div>

                <div class="player_home_block player_home_block--cards">
                    <h2 :class="'player_color_'+ player.color"><span v-i18n>Played Cards</span><span class="label-additional">{{ getPlayerCardsPlayed(player, true) }}</span></h2>

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

                <div v-for="card in player.dealtProjectCards" :key="card.name" class="cardbox" v-if="player.initialDraft">
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
                <a name="colonies" class="player_home_anchor"></a>
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
    `,
});
