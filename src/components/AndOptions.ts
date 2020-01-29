
import Vue, { VNode } from "vue";
import { PlayerInputFactory } from "./PlayerInputFactory";
import { PlayerInputModel } from "../models/PlayerInputModel";

export const AndOptions = Vue.component("and-options", {
    props: ["player", "players", "playerinput", "onsave", "showtitle"],
    data: function () {
        return {
            responded: {} as {[x: string]: Array<string>}
        };
    },
    methods: {
        saveData: function (inputChildren: Array<VNode>) {
            for (var i = 0; i < inputChildren.length; i++) {
                const componentInstance = inputChildren[i].componentInstance;
                if (componentInstance !== undefined) {
                    if ((componentInstance as any).selectCards instanceof Function) {
                        (componentInstance as any).selectCards();
                    }
                }
            }
        }
    },
    render: function(createElement) {
        const playerInput: PlayerInputModel = this.playerinput as PlayerInputModel;
        const children: Array<VNode> = [];
        const inputChildren: Array<VNode> = [];
        if (this.showtitle) {
            children.push(createElement("div", playerInput.title));
        }
        if (playerInput.options !== undefined) {
            const options = playerInput.options;
            options.forEach((option, idx: number) => {
                if (this.responded[idx] === undefined) {
                    children.push(new PlayerInputFactory().getPlayerInput(createElement, this.players, this.player, option, (out: Array<Array<string>>) => {
                        this.responded[idx] = out[0];
                        if (Object.keys(this.responded).length === options.length) {
                            let res: Array<Array<string>> = [];
                            for (let i = 0; i < options.length; i++) {
                                res.push(this.responded["" + i]);
                            }
                            this.onsave(res);
                        }
                    }, false, true));
                    inputChildren.push(children[children.length - 1]);
                }
            });
        }
        children.push(createElement("div", [createElement("button", { domProps: { className: "nes-btn" }, on: { click: () => { this.saveData(inputChildren); } } }, "Save")]));
        return createElement("div", children);
    }
});


