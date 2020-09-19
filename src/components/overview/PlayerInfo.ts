import Vue from "vue";
import { PlayerResources } from "./PlayerResources";
import { PlayerTags } from "./PlayerTags";
import { PlayerStatus } from "./PlayerStatus";
import { playerBgColorClass } from "../../utils/utils";

const BREAKPOINT = 1740;

export const PlayerInfo = Vue.component("player-info", {
    props: ["player", "activePlayer", "firstForGen", "actionLabel"],
    components: {
        "player-resources": PlayerResources,
        "player-tags": PlayerTags,
        "player-status": PlayerStatus,
    },
    data: function () {
        return {
            width: 0,
        };
    },
    created: function () {
        window.addEventListener("resize", this.handleResize);
        this.handleResize();
    },
    destroyed() {
        window.removeEventListener("resize", this.handleResize);
    },
    methods: {
        getClasses: function (): string {
            let classes = ["player-info"];
            classes.push(playerBgColorClass(this.player.color));
            if (this.width < BREAKPOINT) {
                classes.push("stack-tags-under");
            }
            return classes.join(" ");
        },
        getPlayerStatusAndResClasses: function (): string {
            let classes = ["player-status-and-res"];
            if (this.width < BREAKPOINT) {
                classes.push("stats-and-res-separator");
            }
            return classes.join(" ");
        },
        handleResize: function () {
            this.width = window.innerWidth;
        },
    },
    template: ` 
        <div :class="getClasses()">
            <div :class="getPlayerStatusAndResClasses()">
                <player-status :player="player" :activePlayer="activePlayer" :firstForGen="firstForGen" v-trim-whitespace :actionLabel="actionLabel"/>
                <player-resources :player="player" v-trim-whitespace />
            </div>
            <player-tags :player="player" v-trim-whitespace /> 
        </div>
    `,
});
