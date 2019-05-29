
import Vue, { VNode } from "vue";
import { PlayerInputFactory } from "./PlayerInputFactory";
import { PlayerInputModel } from "../models/PlayerInputModel";

export const AndOptions = Vue.component("and-options", {
    props: ["players", "playerinput", "onsave", "showtitle"],
    data: function () {
        return {
            responded: {} as {[x: string]: Array<string>}
        };
    },
    render: function(createElement) {
        const playerInput: PlayerInputModel = this.playerinput as PlayerInputModel;
        const children: Array<VNode> = [];
        if (this.showtitle) {
            children.push(createElement("div", playerInput.title));
        }
        if (playerInput.options !== undefined) {
            const options = playerInput.options;
            options.forEach((option, idx: number) => {
                if (this.responded[idx] === undefined) {
                    children.push(new PlayerInputFactory().getPlayerInput(createElement, this.players, option, (out: Array<Array<string>>) => {
                        this.responded[idx] = out[0];
                        if (Object.keys(this.responded).length === options.length) {
                            let res: Array<Array<string>> = [];
                            for (let i = 0; i < options.length; i++) {
                                res.push(this.responded["" + i]);
                            }
                            this.onsave(res);
                        }
                    }));
                }
            });
        }
        return createElement("div", children);
    }
});


