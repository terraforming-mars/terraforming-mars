
import Vue from "vue";
import { ClaimedMilestoneModel } from "../models/ClaimedMilestoneModel";
import { PlayerModel } from "../models/PlayerModel";

export const ClaimedMilestone = Vue.component("claimed-milestone", {
    props: ["players", "claimedmilestone"],
    data: function () {
        return {};
    },
    render: function (createElement) {
        const players: Array<PlayerModel> = this.players as Array<PlayerModel>;
        const claimedMilestone: ClaimedMilestoneModel = this.claimedmilestone as ClaimedMilestoneModel;
        const player: PlayerModel | undefined = players.find((p) => p.id === claimedMilestone.player);
        if (player === undefined) {
            return createElement("span", { domProps: { innerHTML: "Unknown Player" } });
        }
        return createElement("span", { domProps: { innerHTML: claimedMilestone.milestone + " " + player.name + " "} });
    }
});

