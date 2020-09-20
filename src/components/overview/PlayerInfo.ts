import Vue from "vue";
import { PlayerResources } from "./PlayerResources";
import { PlayerTags } from "./PlayerTags";
import { PlayerStatus } from "./PlayerStatus";
import { playerBgColorClass } from "../../utils/utils";

export const PlayerInfo = Vue.component("player-info", {
    props: ["player", "activePlayer", "firstForGen", "actionLabel"],
    components: {
        "player-resources": PlayerResources,
        "player-tags": PlayerTags,
        "player-status": PlayerStatus,
    },
    methods: {
        getClasses: function (): string {
            let classes = ["player-info"];
            classes.push(playerBgColorClass(this.player.color));
            return classes.join(" ");
        },
        getPlayerStatusAndResClasses: function (): string {
            let classes = ["player-status-and-res"];
            return classes.join(" ");
        },
        getIsActivePlayer: function (): boolean {
            return this.player.id === this.activePlayer.id;
        }
    },
    template: ` 
        <div :class="getClasses()">
            <div :class="getPlayerStatusAndResClasses()">
                <player-status :player="player" :activePlayer="activePlayer" :firstForGen="firstForGen" v-trim-whitespace :actionLabel="actionLabel"/>
                <player-resources :player="player" v-trim-whitespace />
            </div>
            <player-tags :player="player" v-trim-whitespace :isActivePlayer="getIsActivePlayer()"/> 
        </div>
    `,
});
