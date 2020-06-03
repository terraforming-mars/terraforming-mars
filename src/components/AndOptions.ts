
import Vue, { VNode } from "vue";
import { PlayerInputFactory } from "./PlayerInputFactory";
import { PlayerInputModel } from "../models/PlayerInputModel";

export const AndOptions = Vue.component("and-options", {
    props: ["player", "players", "playerinput", "onsave", "showsave", "showtitle"],
    data: function () {
        return {
        };
    },
    methods: {
        saveData: function () {
            for (var i = 0; i < this.$data.childComponents.length; i++) {
                const componentInstance = this.$data.childComponents[i].componentInstance;
                if (componentInstance !== undefined) {
                    if ((componentInstance as any).saveData instanceof Function) {
                        (componentInstance as any).saveData();
                    }
                }
            }
            const res: Array<Array<string>> = [];
            for (let i = 0; i < this.playerinput.options.length; i++) {
                res.push(this.$data.responded["" + i]);
            }
            this.onsave(res);
        }
    },
    render: function(createElement) {
        const playerInput: PlayerInputModel = this.playerinput as PlayerInputModel;
        const children: Array<VNode> = [];
        this.$data.childComponents = [];
        this.$data.responded = [];
        if (this.showtitle) {
            children.push(createElement("div", {"class": "wf-title"}, playerInput.title));
        }
        if (playerInput.options !== undefined) {
            const options = playerInput.options;
            options.forEach((option, idx: number) => {
                if (this.$data.responded[idx] === undefined) {
                    children.push(new PlayerInputFactory().getPlayerInput(createElement, this.players, this.player, option, (out: Array<Array<string>>) => {
                        this.$data.responded[idx] = out[0];
                    }, false, true));
                    this.$data.childComponents.push(children[children.length - 1]);
                }
            });
        }
        if (this.showsave) {
            const saveBtn = createElement(
                "button", 
                {
                    domProps: { className: "btn btn-primary" }, 
                    on: { click: () => { this.saveData(); } } 
                }, 
                "Save"
            );
            children.push(
                createElement("div", {"class": "wf-action"}, [saveBtn])
            );
        }
        return createElement("div", {"class": "wf-options"}, children);
    }
});


