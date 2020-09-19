import Vue from "vue";
import { PlayerInfo } from "./PlayerInfo";
import { OverviewSettings } from "./OverviewSettings";
import { Player } from "../../Player";
import { OtherPlayer } from "../OtherPlayer";
import { PlayerModel } from "../../models/PlayerModel";
import { ActionLabel } from "./ActionLabel";

const SHOW_NEXT_LABEL_MIN = 2;

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

            if (isNext && this.player.players.length > SHOW_NEXT_LABEL_MIN) {
                return ActionLabel.NEXT;
            }

            return ActionLabel.NONE;
        },
    },
    template: `
        <div class="players-overview" v-if="hasPlayers()">
            <overview-settings />
            <div class="other_player" v-if="player.players.length > 1">
                <div v-for="otherPlayer in player.players" :key="otherPlayer.id">
                    <other-player v-if="otherPlayer.id !== player.id" :player="otherPlayer" />
                </div>
            </div>
            <player-info v-for="p in getPlayersInOrder()" :activePlayer="player" :player="p"  :key="p.id" :firstForGen="getIsFirstForGen(p)" :actionLabel="getActionLabel(p)"/>
            <div v-if="player.players.length > 1" class="player-divider" />
            <player-info :player="getPlayerOnFocus()" :activePlayer="player" :key="player.players.length - 1" :firstForGen="getIsFirstForGen(player)" :actionLabel="getActionLabel(player)"/>
        </div>
    `,
});
