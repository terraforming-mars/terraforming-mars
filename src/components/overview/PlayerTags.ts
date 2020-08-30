import Vue from "vue";

export const PlayerTags = Vue.component("player-tags", {
    props: ["player"],
    template: `
        <div class="player-tags">
            Player tags
        </div>
    `,
});
