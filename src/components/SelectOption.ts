
import Vue, { VNode } from "vue";

export const SelectOption = Vue.component("select-option", {
    props: ["playerinput", "onsave"],
    data: function () {
        return {};
    },
    render: function (createElement) {
        const children: Array<VNode> = [];
        children.push(createElement("div", this.playerinput.title));
        children.push(createElement("div", this.playerinput.message));
        children.push(createElement("button", { domProps: { className: "nes-btn" }, on: { click: () => { this.onsave([["1"]]); } } }, "Select"));
        return createElement("div", children);
    }
});


