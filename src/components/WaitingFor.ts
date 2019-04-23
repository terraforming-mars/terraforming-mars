
import Vue from "vue";

import { AndOptions } from "./AndOptions";
import { OrOptions } from "./OrOptions";
import { PlayerInputFactory } from "./PlayerInputFactory";
import { SelectAmount } from "./SelectAmount";
import { SelectCard } from "./SelectCard";
import { SelectHowToPay } from "./SelectHowToPay";
import { SelectOption } from "./SelectOption";
import { SelectPlayer } from "./SelectPlayer";
import { SelectSpace } from "./SelectSpace";

export const WaitingFor = Vue.component("waiting-for", {
    props: ["players", "waitingfor"],
    data: function () {
        return {}
    },
    components: {
        "and-options": AndOptions,
        "or-options": OrOptions,
        "select-amount": SelectAmount,
        "select-card": SelectCard,
        "select-option": SelectOption,
        "select-how-to-pay": SelectHowToPay,
        "select-player": SelectPlayer,
        "select-space": SelectSpace
    },
    render: function (createElement) {
        if (this.waitingfor === undefined) {
            return createElement("div", "Not your turn to take any actions");
        }
        return new PlayerInputFactory().getPlayerInput(createElement, this.players, this.waitingfor, (out: Array<Array<string>>) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/player/input?id=" + (this.$parent as any).player.id);
            xhr.responseType = "json";
            xhr.onload = () => {
                if (xhr.status === 200) {
                    (this.$root as any).$data.screen = "empty";
                    (this.$root as any).$data.player = xhr.response;
                    (this.$root as any).$data.playerkey++;
                    (this.$root as any).$data.screen = "player-home";
                } else {
                    alert("Error sending input");
                }
            }
            xhr.send(JSON.stringify(out));  
        });
    }
});

