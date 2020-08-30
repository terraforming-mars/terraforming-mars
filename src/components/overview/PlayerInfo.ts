import Vue from "vue";
import { PlayerResources } from "./PlayerResources";
import { PlayerTags } from "./PlayerTags";
import { PlayerStatus } from "./PlayerStatus";

export const PlayerInfo = Vue.component("player-info", {
    props: ["player"],
    components: {
        "player-resources": PlayerResources,
        "player-tags": PlayerTags,
        "player-status": PlayerStatus,
    },
    methods: {},
    mounted: function () {
        console.log(this.player);
    },
    template: `
        <div class="player-info">
            <player-status :player="player" v-trim-whitespace />
            <player-resources :player="player" v-trim-whitespace />
            <player-tags :player="player" v-trim-whitespace />
        </div>
    `,
});
