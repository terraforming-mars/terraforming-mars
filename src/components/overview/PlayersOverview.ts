import Vue from "vue";
import { PlayerInfo } from "./PlayerInfo";
import { OverviewSettings } from "./OverviewSettings";
import { Player } from "../../Player";
import { OtherPlayer } from "../OtherPlayer";
import { PlayerModel } from "../../models/PlayerModel";
import { ActionLabel } from "./ActionLabel";

export const getCurrentPlayerIndex = (
    player: Player | PlayerModel,
    players: Array<Player>
): number => {
    let currentPlayerIndex: number = 0;
    players.forEach((p: Player, index: number) => {
        if (p.id === player.id) {
            currentPlayerIndex = index;
        }
    });
    return currentPlayerIndex;
};

export const PlayersOverview = Vue.component("players-overview", {
    props: ["player"],
    components: {
        "player-info": PlayerInfo,
        "overview-settings": OverviewSettings,
        "other-player": OtherPlayer,
    },
    data: function () {
        return {};
    },
    methods: {
        hasPlayers: function (): boolean {
            return this.player.players.length > 0;
        },
        getPlayerOnFocus: function (): Player {
            return this.player.players.filter(
                (p: Player) => p.id === this.player.id
            )[0];
        },
        getIsFirstForGen: function (player: Player): boolean {
            return getCurrentPlayerIndex(player, this.player.players) === 0;
        },
        getPlayersInOrder: function (): Array<Player> {
            const players = this.player.players;
            let result: Array<Player> = [];
            let currentPlayerOffset: number = 0;
            let currentPlayerIndex: number = getCurrentPlayerIndex(
                this.player,
                this.player.players
            );

            // shift the array by putting the player on focus at the tail
            currentPlayerOffset = currentPlayerIndex + 1;
            result = players
                .slice(currentPlayerOffset)
                .concat(players.slice(0, currentPlayerOffset));
            // return all but the focused user
            return result.slice(0, -1);
        },
        getActionLabel(player: PlayerModel): string {
            if (this.player.passedPlayers.includes(player.id))
                return ActionLabel.PASSED;
            if (player.isActive) return ActionLabel.ACTIVE;
            const notPassedPlayers = this.player.players.filter(
                (p: Player) => !this.player.passedPlayers.includes(p.id)
            );

            let currentPlayerIndex: number = getCurrentPlayerIndex(
                player,
                notPassedPlayers
            );
            const prevPlayerIndex =
                currentPlayerIndex === 0
                    ? notPassedPlayers.length - 1
                    : currentPlayerIndex - 1;
            const isNext = notPassedPlayers[prevPlayerIndex].isActive;

            /* TODO -> this will come once we get the values for actions w/o reset
            if (player.actionsTakenThisRound === 1)
                return isNext ? `${ActionLabel.NEXT} (1)` : ActionLabel.ONE;
            if (player.actionsTakenThisRound === 2)
                return isNext ? `${ActionLabel.NEXT} (2)` : ActionLabel.TWO; */

            if (isNext) {
                return ActionLabel.NEXT;
            }

            return ActionLabel.NONE;
        },
        getActivePlayerId: function (): number {
            return this.player.id;
        },
    },
    mounted: function () {
        // console.log(this.player);
    },
    template: `
        <div class="players-overview" v-if="hasPlayers()">
            <overview-settings />
            <div class="other_player" v-if="player.players.length > 1">
                <div v-for="otherPlayer in player.players" :key="otherPlayer.id">
                    <other-player v-if="otherPlayer.id !== player.id" :player="otherPlayer" />
                </div>
            </div>
            <player-info v-for="p in getPlayersInOrder()" :activePlayerId="getActivePlayerId()" :player="p"  :key="p.id" :firstForGen="getIsFirstForGen(p)" :actionLabel="getActionLabel(p)"/>
            <div class="player-divider" />
            <player-info :player="getPlayerOnFocus()" :key="player.players.length - 1" :firstForGen="getIsFirstForGen(player)" :actionLabel="getActionLabel(player)"/>
        </div>
    `,
});
