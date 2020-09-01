import Vue from "vue";

export const PlayerStatus = Vue.component("player-status", {
    props: ["player", "firstForGen"],
    methods: {
        getActionStatus: function (): string {
            return "passed";
        },
    },
    template: `
        <div class="player-status">
            <div class="top-row">
                <div class="player-view-status" />
                <div class="player-name">{{player.name}}</div>
                <div class="icon-first-player-offset icon-first-player" v-if="firstForGen">1</div>
            </div>
            <div class="player-corp">{{player.corporationCard.name}}</div>
            <div class="player-action-status">{{getActionStatus()}}</div>
        </div>
    `,
});
