import Vue from "vue";
import { PlayerResources } from "./PlayerResources";
import { PlayerTags } from "./PlayerTags";
import { PlayerStatus } from "./PlayerStatus";
import { playerBgColorClass } from "../../utils/utils";

export const PlayerInfo = Vue.component("player-info", {
    props: ["player", "firstForGen", "actionLabel"],
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
    },
    mounted: function () {
        // console.log(this.player, "1");
    },
    template: ` 
        <div :class="getClasses()">
            <player-status :player="player" :firstForGen="firstForGen" v-trim-whitespace :actionLabel="actionLabel"/>
            <player-resources :player="player" v-trim-whitespace />
            <player-tags v-if="player.tags.length > 0" :player="player" v-trim-whitespace />
        </div>
    `,
});
