import Vue from "vue";
import { Tags } from "../cards/Tags";
import { PlayerModel } from "../models/PlayerModel";

export const TagOverview = Vue.component("tags", {
    props: ["player"],
    methods: {
        toggleMe: function () {
            let currentState: boolean = this.isVisible();
            (this.$root as any).setVisibilityState(
                "tags_overview",
                !currentState
            );
        },
        isVisible: function () {
            return (this.$root as any).getVisibilityState("tags_overview");
        },
        getTags: function () {
            return Tags;
        },
        getTagCount: function (player: PlayerModel, iTag: Tags) {
            let tagCount = player.tags.find(({ tag }) => tag === iTag);

            if (tagCount) {
                return tagCount.count;
            }
            return "-";
        },
        getNoTagsCount: function (player: PlayerModel) {
            let tagCount: number = player.noTagsCount;

            if (tagCount > 0) return tagCount;
            return "-";
        },
        getCityCount: function (player: PlayerModel) {
            let cityCount: number = player.citiesCount;

            if (cityCount > 0) return cityCount;
            return "-";
        },
        getColonyCount: function (player: PlayerModel) {
            let coloniesCount: number = player.coloniesCount;

            if (coloniesCount > 0) return coloniesCount;
            return "-";
        },
        getInfluence: function (player: PlayerModel) {
            let influence: number = player.influence;

            if (influence > 0) return influence;
            return "-";
        },
        getCardCount: function (player: PlayerModel) {
            if (player.cardsInHandNbr) {
                return player.cardsInHandNbr;
            }
            return "0";
        },
        getRT: function (player: PlayerModel): string {
            return player.terraformRating.toString();
        },
        getVpCount: function (player: PlayerModel) {
            if (this.showVpCount(player)) {
                return player.victoryPointsBreakdown.total;
            }
            return "";
        },
        showVpCount: function (player: PlayerModel) {
            return player.showOtherPlayersVP;
        },
        showColonyCount: function (player: PlayerModel) {
            return player.coloniesExtension;
        },
        showInfluence: function (player: PlayerModel) {
            return player.turmoil;
        },
    },
    template: `
    <div v-if="player.players.length > 1" class="tag-overview-cont">
        <div class="tag-overview">
            <a class="ma-clickable" href="#" v-on:click.prevent="toggleMe()" v-i18n>Tags Overview</a>
        </div>
        <div v-show="isVisible()">
            <div class="tags_cont" v-trim-whitespace>
                <div class="tags-grid" :class="[{'hide-colony-count' : !showColonyCount(player) && showInfluence(player)}, {'hide-influence-count' : !showInfluence(player) && showColonyCount(player)}, {'hide-colony-influence-counts' : !showInfluence(player) && !showColonyCount(player)}]">
                    <div>
                        <span v-i18n>Player</span>
                    </div>

                    <div class="tag-count card-count"></div>
                    <div v-for="tag in getTags()" class="tag-count" :class="'tag-'+ tag"></div>
                    <div class="tag-count tag-none"></div>
                    <div class="tag-count city-count"></div>
                    <div v-if="showColonyCount(player)" class="tag-count colony-count"></div>
                    <div v-if="showInfluence(player)" class="tag-count influence-count"></div>
                    <div class="tag-count rt-count"></div>
                    <div class="tag-count vp-count" :class="{'hide_tag' : !showVpCount(player) }"><span>VP</span></div>

                    <template v-for="player in player.players">
                        <div class="player_name_cont highlighter_box" :class="'player_bg_color_'+player.color">
                            <span class="player_name" >{{player.name}}</span>
                        </div>

                        <div class="grid-item" :class="'player_tag_bg_color_'+player.color">
                            <span>{{getCardCount(player)}}</span>
                        </div>

                        <template v-for="tag in getTags()">
                            <div class="grid-item" :class="'player_tag_bg_color_'+player.color"><span>{{getTagCount(player, tag)}}</span></div>
                        </template>

                        <div class="grid-item" :class="'player_tag_bg_color_'+player.color">
                            <span>{{getNoTagsCount(player)}}</span>
                        </div>

                        <div class="grid-item" :class="'player_tag_bg_color_'+player.color">
                            <span>{{getCityCount(player)}}</span>
                        </div>

                        <div v-if="showColonyCount(player)" class="grid-item" :class="'player_tag_bg_color_'+player.color">
                            <span>{{getColonyCount(player)}}</span>
                        </div>

                        <div v-if="showInfluence(player)" class="grid-item" :class="'player_tag_bg_color_'+player.color">
                            <span>{{getInfluence(player)}}</span>
                        </div>

                        <div class="grid-item" :class="[{'grid_end' : !showVpCount(player) },'player_tag_bg_color_'+player.color]">
                            <span>{{getRT(player)}}</span>
                        </div>

                        <div class="grid-item" :class="[{'grid_end' : showVpCount(player) }, {'hide_tag' : !showVpCount(player) }, 'player_tag_bg_color_'+player.color]">
                            <span>{{getVpCount(player)}}</span>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
    `,
});
