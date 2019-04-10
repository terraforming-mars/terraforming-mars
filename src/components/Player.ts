
import Vue from "vue";

export const Player = Vue.component("player", {
    props: ["player"],
    data: function () {
        return {};
    },
    render: function (createElement) {
        return createElement("span", { domProps: { innerHTML: this.player } });
    }
});

