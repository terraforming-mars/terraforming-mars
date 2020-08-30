import Vue from "vue";

export const PlayerStatus = Vue.component("player-status", {
    props: ["player"],
    methods: {
        getActionStatus: function (): string {
            return "passed";
        },
        isPlayerTurn: function (): boolean {
            return true;
        },
    },
    template: `
        <div class="player-status">
            <div class="top-row">
                <div class="player-view-status" />
                <div class="player-name">{{player.name}}</div>
                <div class="player-turn-indicator" v-if="isPlayerTurn()" />
            </div>
            <div class="player-corp">{{player.corporationCard.name}}</div>
            <div class="player-action-status">{{getActionStatus()}}</div>
        </div>
    `,
});
