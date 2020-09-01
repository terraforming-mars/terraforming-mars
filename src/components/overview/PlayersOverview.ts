import Vue from "vue";
import { PlayerInfo } from "./PlayerInfo";
import { OverviewSettings } from "./OverviewSettings";
import { Player } from "../../Player";

export const PlayersOverview = Vue.component("players-overview", {
    props: ["player"],
    components: {
        "player-info": PlayerInfo,
        "overview-settings": OverviewSettings,
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
            let currentPlayerIndex: number = 0;
            this.player.players.forEach((p: Player, index: number) => {
                if (p.id === player.id) {
                    currentPlayerIndex = index;
                }
            });

            return currentPlayerIndex === 0;
        },
        getPlayersInOrder: function (): Array<Player> {
            const players = this.player.players;
            const currentPlayerId: string = this.player.id;
            let result: Array<Player> = [];
            let currentPlayerIndex: number = 0;
            let currentPlayerOffset: number = 0;

            players.forEach((p: Player, index: number) => {
                if (p.id === currentPlayerId) {
                    currentPlayerIndex = index;
                }
            });

            // shift the array by putting the player on focus at the tail
            currentPlayerOffset = currentPlayerIndex + 1;
            result = players
                .slice(currentPlayerOffset)
                .concat(players.slice(0, currentPlayerOffset));
            // return all but the focused user
            return result.slice(0, -1);
        },
    },
    mounted: function () {
        console.log(this.player);
    },
    template: `
        <div class="players-overview" v-if="hasPlayers()">
            <overview-settings /> 
            <player-info v-for="player in getPlayersInOrder()" :player="player" :key="player.id" :firstForGen="getIsFirstForGen(player)"/>
            <div class="player-divider" />
            <player-info :player="getPlayerOnFocus()" :key="player.players.length - 1" :firstForGen="getIsFirstForGen(player)"/>
        </div>
    `,
});
