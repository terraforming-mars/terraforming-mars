
import Vue from "vue";

import { AndOptions } from "./AndOptions";
import { OrOptions } from "./OrOptions";
import { PlayerInputFactory } from "./PlayerInputFactory";
import { SelectAmount } from "./SelectAmount";
import { SelectCard } from "./SelectCard";
import { SelectHowToPay } from "./SelectHowToPay";
import { SelectHowToPayForCard } from "./SelectHowToPayForCard";
import { SelectOption } from "./SelectOption";
import { SelectPlayer } from "./SelectPlayer";
import { SelectSpace } from "./SelectSpace";

export const WaitingFor = Vue.component("waiting-for", {
    props: ["player", "players", "waitingfor"],
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
        "select-how-to-pay-for-card": SelectHowToPayForCard,
        "select-player": SelectPlayer,
        "select-space": SelectSpace
    },
    render: function (createElement) {
        if (this.waitingfor === undefined) {
            return createElement("div", "Not your turn to take any actions");
        }
        return new PlayerInputFactory().getPlayerInput(createElement, this.players, this.player, this.waitingfor, (out: Array<Array<string>>) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/player/input?id=" + (this.$parent as any).player.id);
            xhr.responseType = "json";
            xhr.onload = () => {
                if (xhr.status === 200) {
                    (this.$root as any).$data.screen = "empty";
                    (this.$root as any).$data.player = xhr.response;
                    (this.$root as any).$data.playerkey++;
                    (this.$root as any).$data.screen = "player-home";
                } else if (xhr.status === 400 && xhr.responseType === 'json') {
                    const element: HTMLElement | null = document.getElementById("dialog-default");
                    const message: HTMLElement | null = document.getElementById("dialog-default-message");
                    if (message !== null && element !== null && (element as HTMLDialogElement).showModal !== undefined) {
                        message.innerHTML = xhr.response.message;
                        (element as HTMLDialogElement).showModal();
                    } else {
                        alert(xhr.response.message);
                    }
                } else {
                    alert("Error sending input");
                }
            }
            xhr.send(JSON.stringify(out));  
        }, true);
    }
});

