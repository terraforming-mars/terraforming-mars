
import Vue from "vue";

export const ProjectCard = Vue.component("project-card", {
    props: ["card"],
    data: function () {
        return {};
    },
    render: function (createElement) {
        return createElement("div", this.card);
    }
});

