import Vue from "vue";
import { ActionLabel } from "./ActionLabel";

export const PlayerStatus = Vue.component("player-status", {
    props: ["player", "firstForGen", "actionLabel"],
    methods: {
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
    },
    template: `
        <div class="player-status">
            <div class="top-row">
                <div class="player-view-status" />
                <div class="player-name">{{ player.name }}</div>
                <div class="icon-first-player-offset icon-first-player" v-if="firstForGen">1</div>
            </div>
            <div class="player-corp">{{ player.corporationCard.name }}</div>
            <div v-if="showLabel()" :class="getLabelClasses()">{{ actionLabel }}</div>
        </div>
    `,
});
