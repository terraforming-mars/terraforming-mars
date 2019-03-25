
import Vue from "vue";

export const CorporationCard = Vue.component("corporation-card", {
    props: ["card"],
    data: function () {
        return {};
    },
    render: function (createElement) {
        return createElement("div", this.card);
    }
});

