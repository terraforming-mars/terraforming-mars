
import Vue from "vue";
import { FundedAwardModel } from "../models/FundedAwardModel";
import { PlayerModel } from "../models/PlayerModel";

export const FundedAward = Vue.component("claimed-milestone", {
    props: ["players", "fundedaward"],
    data: function () {
        return {};
    },
    render: function (createElement) {
        const players: Array<PlayerModel> = this.players as Array<PlayerModel>;
        const fundedAward: FundedAwardModel = this.fundedaward as FundedAwardModel;
        const player: PlayerModel | undefined = players.find((p) => p.id === fundedAward.player);
        if (player === undefined) {
            return createElement("span", { domProps: { innerHTML: "Unknown Player" } });
        }
        return createElement("span", { domProps: { innerHTML: fundedAward.award + " " + player.name + " " } });
    }
});

