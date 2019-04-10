
import Vue from "vue";
import { PlayerModel } from "../models/PlayerModel";

export const Player = Vue.component("player", {
    props: ["player"],
    data: function () {
        return {};
    },
    render: function (createElement) {
        const player: PlayerModel = this.player as PlayerModel;
        return createElement("span", { domProps: { innerHTML: player.name } });
    }
});

