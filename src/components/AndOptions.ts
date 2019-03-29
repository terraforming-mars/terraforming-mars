
import Vue, { VNode } from "vue";
import { PlayerInputFactory } from "./PlayerInputFactory";

export const AndOptions = Vue.component("and-options", {
    props: ["playerinput", "onsave"],
    data: function () {
        return {
            responded: {} as {[x: string]: Array<string>}
        };
    },
    render: function(createElement) {
        const children: Array<VNode> = [];
        const elMessage = createElement("div", this.playerinput.message);
        children.push(elMessage);
        this.playerinput.options.forEach((option: any, idx: number) => {
            if (this.responded[idx] === undefined) {
            children.push(new PlayerInputFactory().getPlayerInput(createElement, option, (out: Array<Array<string>>) => {
                this.responded[idx] = out[0];
                if (Object.keys(this.responded).length === this.playerinput.options.length) {
                    let res: Array<Array<string>> = [];
                    for (let i = 0; i < this.playerinput.options.length; i++) {
                        res.push(this.responded["" + i]);
                    }
                    this.onsave(res);
                }
            }));
            }
        });
        return createElement("div", children);
    }
});


