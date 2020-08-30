import Vue from "vue";
import { PlayerInfo } from "./PlayerInfo";
import { OverviewSettings } from "./OverviewSettings";

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
    },
    template: `
        <div class="players-overview" v-if="hasPlayers()">
            <overview-settings />
            <div v-for="player in player.players">
                <player-info  :player="player" :key="player.id"/>
            </div>
        </div>
    `,
});
