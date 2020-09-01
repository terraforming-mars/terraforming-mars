import Vue from "vue";
import { TagCount } from "../TagCount";

export const PlayerTags = Vue.component("player-tags", {
    props: ["player"],
    components: {
        "tag-count": TagCount,
    },
    methods: {
        getCardCount: function (): number {
            if (this.player.cardsInHandNbr) {
                return this.player.cardsInHandNbr;
            }
            return 0;
        },
        getTR: function (): number {
            return this.player.terraformRating;
        },
        getVpCount: function (): number {
            return this.player.victoryPointsBreakdown.total;
        },
        showVpCount: function (): boolean {
            return this.player.showOtherPlayersVP;
        },
    },
    template: `
        <div class="player-tags">
            <tag-count :tag="'tr'" :count="getTR()" :size="'big'" />
            <tag-count v-if="showVpCount()" :tag="'vp'" :count="getVpCount()" :size="'big'" />
            <tag-count :tag="'cards'" :count="getCardCount()" :size="'big'" />
            <tag-count v-for="tag in player.tags" :tag="tag.tag" :count="tag.count" :size="'big'" />
        </div>
    `,
});
