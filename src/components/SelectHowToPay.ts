
import Vue, { VNode } from "vue";
import { HowToPay } from "../inputs/HowToPay";

export const SelectHowToPay = Vue.component("select-how-to-pay", {
    props: ["playerinput", "onsave"],
    data: function () {
        return {
            heat: 0,
            megaCredits: 0,
            steel: 0,
            titanium: 0
        };
    },
    render: function (createElement) {
        const children: Array<VNode> = [];
        children.push(createElement("div", this.playerinput.title));
        if (this.playerinput.canUseSteel) {
            children.push(createElement("label", "Steel: "));
            children.push(createElement("input", { domProps: { type: "number", value: "0", min: "0", max: "100" }, on: { change: (event: any) => { this.steel = parseInt(event.target.value); } }}));
        }
        if (this.playerinput.canUseTitanium) {
            children.push(createElement("label", "Titanium: "));
            children.push(createElement("input", { domProps: { type: "number", value: "0", min: "0", max: "100" }, on: { change: (event: any) => { this.titanium = parseInt(event.target.value); } }}));
        }
        if (this.playerinput.canUseHeat) {
            children.push(createElement("label", "Heat: "));
            children.push(createElement("input", { domProps: { type: "number", value: "0", min: "0", max: "100" }, on: { change: (event: any) => { this.heat = parseInt(event.target.value); } }}));
        }
        children.push(createElement("label", "Mega Credit: "));
        children.push(createElement("input", { domProps: { type: "number", value: "0", min: "0", max: "100" }, on: { change: (event: any) => { this.megaCredits = parseInt(event.target.value); } }}));
        children.push(createElement("button", { on: { click: () => {
            const htp: HowToPay = {
                heat: this.heat,
                megaCredits: this.megaCredits,
                steel: this.steel,
                titanium: this.titanium
            };
            this.onsave([[JSON.stringify(htp)]]);
        } } }, "Save"));
        return createElement("div", children);
    }
});


