import Vue from "vue";
import { ActionLabel } from "./ActionLabel";
import { PlayerModel } from "../../models/PlayerModel";

export const PlayerStatus = Vue.component("player-status", {
    props: ["player", "activePlayerId", "firstForGen", "actionLabel"],
    methods: {
        showPlayerDetails: function (player: PlayerModel) {
            if (player.id === this.activePlayerId) return;

            (this.$root as any).setVisibilityState(
                "other_player_" + player.id,
                true
            );
        },
        showLabel: function (): boolean {
            return this.actionLabel !== ActionLabel.NONE;
        },
        getLabelClasses: function (): string {
            let classes = [];
            const baseClass = "player-action-status";
            classes.push(baseClass);
            if (this.actionLabel === ActionLabel.PASSED) {
                classes.push(`${baseClass}--passed`);
            } else if (this.actionLabel === ActionLabel.ACTIVE) {
                classes.push(`${baseClass}--active`);
            }
            return classes.join(" ");
        },
        getPlayerNameClasses: function (player: PlayerModel): string {
            let classes = [];
            const baseClass = "player-name";
            classes.push(baseClass);
            if (player.id === this.activePlayerId) {
                classes.push(`${baseClass}--inactive`);
            }
            return classes.join(" ");
        },
    },
    template: `
        <div class="player-status">
            <div class="top-row">
                <div class="player-view-status" />
                <div :class="getPlayerNameClasses(player)" v-on:click.prevent="showPlayerDetails(player)" >{{ player.name }}</div>
                <div class="icon-first-player-offset icon-first-player" v-if="firstForGen">1</div>
            </div>
            <div class="player-corp">{{ player.corporationCard.name }}</div>
            <div v-if="showLabel()" :class="getLabelClasses()">{{ actionLabel }}</div>
        </div>
    `,
});
