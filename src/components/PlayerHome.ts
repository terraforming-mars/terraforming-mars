
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
        "award": Award
    },
    data: function () {
        return {}
    },
    template: `
        <div id="player-home">
            <h1 :style="'color:' + player.color">Teraforming Mars - {{player.name}}</h1>
            <section>
                <dialog class="nes-dialog" id="dialog-default">
                    <form method="dialog">
                        <p class="title">Error with input</p>
                        <p id="dialog-default-message"></p>
                        <menu class="dialog-menu">
                            <button class="nes-btn is-primary">OK</button>
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

            <div v-if="player.corporationCard">
                <div class="player_home_block player_home_block--resources nofloat">
                    <player-resources :player="player" v-trim-whitespace></player-resources>
                </div>

                <div class="player_home_block nofloat">
                    <board :spaces="player.spaces"></board>

                    <global-parameters :oceans_count="player.oceans" :oxygen_level="player.oxygenLevel" :temperature="player.temperature"></global-parameters>
                    <div v-if="player.players.length > 1">
                        <milestone/>
                        <award/>
                    </div>
                </div>

                <div class="player_home_block player_home_block--actions nofloat">
                    <h2>Actions</h2>
                    <waiting-for v-if="player.phase !== 'end'" :players="player.players" :player="player" :waitingfor="player.waitingFor"></waiting-for>
                </div>


                <div class="player_home_block nofloat" v-if="player.players.length > 1 && player.gameLog">
                    <h2>Last Actions</h2>
                    <div v-for="message in player.gameLog">
                        {{message}}
                    </div>
                </div>

                <div class="player_home_block">
                    <h2>Corporation Card</h2>
                    <card :card="player.corporationCard"></card>
                </div>
  
                <div v-if="player.playedCards.length > 0" class="player_home_block">
                    <h2>Played Cards</h2>
                    <div v-for="card in player.playedCards" :key="card.name" class="cardbox">
                        <card :card="card.name" :resources="card.resources"></card>
                    </div>
                </div>

                <div class="player_home_block nofloat" v-if="player.cardsInHand.length > 0">
                    <h2>Cards In Hand</h2>
                    <div v-for="card in player.cardsInHand" :key="card.name" class="cardbox">
                        <card :card="card.name" :resources="card.resources"></card>
                    </div>
                </div>


                <div class="player_home_block" v-if="player.claimedMilestones.length > 0">
                    <h2>Claimed Milestones</h2>
                    <div class="player_home_block--claimed_milesones">
                        <claimed-milestone v-for="claimedMilestone in player.claimedMilestones" :key="claimedMilestone.milestone" :players="player.players" :claimedmilestone="claimedMilestone"></claimed-milestone>
                    </div>
                </div>

                <div class="player_home_block" v-if="player.fundedAwards.length > 0">
                    <h2>Funded Awards</h2>
                    <div>
                        <funded-award v-for="fundedAward in player.fundedAwards" :key="fundedAward.award" :players="player.players" :fundedaward="fundedAward"></funded-award>
                    </div>
                </div>

                <div class="player_home_block nofloat" v-if="player.players.length > 1">
                    <h2>Other Players</h2>
                    <div v-for="otherPlayer in player.players" :key="otherPlayer.id">
                        <other-player v-if="otherPlayer.id !== player.id" :player="otherPlayer"></other-player>
                    </div>
                </div>
            </div>

            <div class="player_home_block player_home_block--actions nofloat"  v-if="!player.corporationCard">
                <h2>Actions</h2>
                <waiting-for v-if="player.phase !== 'end'" :players="player.players" :player="player" :waitingfor="player.waitingFor"></waiting-for>
            </div>
        </div>
    `
});
