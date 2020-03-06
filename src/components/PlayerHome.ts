
import Vue from "vue";

import { Board } from "./Board";
import { Card } from "./Card";
import { Milestone } from "./Milestone";
import { Award } from "./Award";
import { ClaimedMilestone } from "./ClaimedMilestone";
import { FundedAward } from "./FundedAward";
import { OtherPlayer } from "./OtherPlayer";
import { PlayerResources } from "./PlayerResources";
import { WaitingFor } from "./WaitingFor";
import { GlobalParameters } from "./GlobalParameters"
import { Preferences } from "./Preferences"
import { PlayerModel } from "../models/PlayerModel";
import { Colony } from './Colony';
import { LogPanel } from './LogPanel';

const dialogPolyfill = require("dialog-polyfill");

export const PlayerHome = Vue.component("player-home", {
    props: ["player"],
    components: {
        "board": Board,
        "card": Card,
        "claimed-milestone": ClaimedMilestone,
        "funded-award": FundedAward,
        "other-player": OtherPlayer,
        "player-resources": PlayerResources,
        "waiting-for": WaitingFor,
        "global-parameters": GlobalParameters,
        "milestone": Milestone,
        "award": Award,
        "preferences": Preferences,
        "colony": Colony,
        "log-panel": LogPanel
    },
    data: function () {
        return {}
    },
    methods: {
        getPlayerCssForTurnOrder: (player: PlayerModel, hilightActive: boolean): string => {
            var ret: string = "player_color_" + player.color;
            if (hilightActive && player.isActive) ret += " player_is_active";
            return ret;
        },
        showPlayerDetails: function (player: PlayerModel) {
            if (player.id === this.player.id) return;
            
            (this.$root as any).setOtherPlayerVisibility(player.id, true);
        }  
    },
    mounted: function () {
        dialogPolyfill.default.registerDialog(document.getElementById("dialog-default"));
    },
    template: `
        <div id="player-home">
            <h1 :style="'color:' + player.color">Terraforming Mars - {{player.name}}</h1>
            <section>
                <dialog class="nes-dialog" id="dialog-default">
                    <form method="dialog">
                        <p class="title">Error with input</p>
                        <p id="dialog-default-message"></p>
                        <menu class="dialog-menu">
                            <button class="btn btn-lg btn-primary">OK</button>
                        </menu>
                    </form>
                </dialog>
            </section>

            <div v-if="player.phase === 'end'">
                <div class="player_home_block">
                    <h2>This game is over!</h2>
                    <div v-for="otherPlayer in player.players">
                        <div :style="'color:' + otherPlayer.color">{{otherPlayer.name}} - {{otherPlayer.victoryPoints}}</div>
                    </div>
                </div>
            </div>

            <preferences v-if="player.corporationCard" v-trim-whitespace></preferences>

            <div v-if="player.corporationCard">

                <div class="player_home_block player_home_block--resources nofloat">
                    <player-resources :player="player" v-trim-whitespace></player-resources>
                </div>

                <div class="player_home_block">
                    <a name="board" class="player_home_anchor"></a>
                    <board :spaces="player.spaces" :venusNextExtension="player.venusNextExtension" :venusScaleLevel="player.venusScaleLevel" :boardName ="player.boardName"></board>

                    <global-parameters :oceans_count="player.oceans" :oxygen_level="player.oxygenLevel" :temperature="player.temperature" v-trim-whitespace></global-parameters>

                    <div v-if="player.players.length > 1" class="player_home_block--millestones-and-awards">
                        <milestone :milestones_list="player.milestones" />
                        <award :awards_list="player.awards" />
                    </div>
                </div>

                <div class="player_home_block player_home_block--turnorder nofloat" v-if="player.players.length>1">
                    <h3>Turn order <span class="help_tip">(click on player name to see details)</span></h3>
                    <div class="player_item" v-for="(p, idx) in player.players" v-trim-whitespace>
                        <div class="player_name_cont" :class="getPlayerCssForTurnOrder(p, false)">
                            <span class="player_number">{{ idx+1 }}.</span><a v-on:click.prevent="showPlayerDetails(p)" class="player_name" :class="getPlayerCssForTurnOrder(p, true)" href="#">{{ p.name }}</a>
                        </div>
                        <div class="player_separator" v-if="idx !== player.players.length - 1">⟶</div>
                    </div>
                    <div v-if="player.players.length > 1">
                        <div v-for="otherPlayer in player.players" :key="otherPlayer.id">
                            <other-player v-if="otherPlayer.id !== player.id" :player="otherPlayer"></other-player>
                        </div>
                    </div>
                </div>

                <div class="player_home_block player_home_block--actions nofloat">
                    <a name="actions" class="player_home_anchor"></a>
                    <h2>Actions</h2>
                    <waiting-for v-if="player.phase !== 'end'" :players="player.players" :player="player" :waitingfor="player.waitingFor"></waiting-for>
                </div>

                <div class="player_home_block player_home_block--log nofloat" v-if="player.players.length > 1 && player.gameLog.length > 0">
                    <h2>Last Actions</h2>
                    <log-panel :messages="player.gameLog"></log-panel>
                </div>

                <div class="player_home_block player_home_block--corporation">
                    <h2>Corporation Card</h2>
                    <card :card="player.corporationCard" :resources="player.corporationCardResources"></card>
                </div>
  
                <a name="cards" class="player_home_anchor"></a>
                <div class="player_home_block player_home_block--hand" v-if="player.cardsInHand.length > 0">
                    <h2>Cards In Hand</h2>
                    <div v-for="card in player.cardsInHand" :key="card.name" class="cardbox">
                        <card :card="card.name" :resources="card.resources"></card>
                    </div>
                </div>

                <div v-if="player.playedCards.length > 0" class="player_home_block player_home_block--cards">
                    <h2>Played Cards</h2>
                    <div v-for="card in player.playedCards" :key="card.name" class="cardbox">
                        <card :card="card.name" :resources="card.resources"></card>
                    </div>
                </div>

                <div class="player_home_block player_home_block--milestones" v-if="player.claimedMilestones.length > 0">
                    <h2>Claimed Milestones</h2>
                    <div class="player_home_block--claimed_milestones">
                        <claimed-milestone v-for="claimedMilestone in player.claimedMilestones" :key="claimedMilestone.milestone" :players="player.players" :claimedmilestone="claimedMilestone"></claimed-milestone>
                    </div>
                </div>

                <div class="player_home_block player_home_block--awards" v-if="player.fundedAwards.length > 0">
                    <h2>Funded Awards</h2>
                    <div>
                        <funded-award v-for="fundedAward in player.fundedAwards" :key="fundedAward.award" :players="player.players" :fundedaward="fundedAward"></funded-award>
                    </div>
                </div>
            </div>

            <div class="player_home_block player_home_block--setup nofloat"  v-if="!player.corporationCard">
                <h2>Select initial cards:</h2>
                <waiting-for v-if="player.phase !== 'end'" :players="player.players" :player="player" :waitingfor="player.waitingFor"></waiting-for>
            </div>

            <div v-if="player.colonies.length > 0" class="player_home_block">
                <h2>Colonies</h2>
                <div class="player_home_colony_cont">
                    <div class="player_home_colony" v-for="colony in player.colonies" :key="colony.name">
                        <colony :colony="colony" :player="player"></colony>
                    </div>
                </div>
            </div>

        </div>
    `
});
