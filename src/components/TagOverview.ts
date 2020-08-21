import Vue from "vue";
import {Tags} from "../cards/Tags";
import {PlayerModel} from "../models/PlayerModel";

export const TagOverview = Vue.component("tags", {
    props: ["player"],
    methods: {
        getTags: function () {
            return Tags;
        },
        getTagCount: function (player: PlayerModel, iTag: Tags) {
            let tagCount = player.tags.find(({tag}) => tag === iTag);

            if (tagCount) {
                return tagCount.count;
            }
            return "-";
        },
        getCardCount: function (player: PlayerModel){
            if (player.cardsInHandNbr){
                return player.cardsInHandNbr;
            }
            return "0";
        },
        getVpCount: function (player: PlayerModel){
            if (this.showVpCount(player)){
                return player.victoryPointsBreakdown.total;
            }
            return "";
        },
        showVpCount: function (player: PlayerModel){
            return player.showOtherPlayersVP;
        }
    },
    template: `
    <div class="tags_cont" v-trim-whitespace>
        <div class="tags-grid">
            <div>
                <span>Player</span>
            </div>
            
            <div v-for="tag in getTags()" class="tag-count" :class="'tag-'+ tag"></div>
            <div class="tag-count card-count"></div>
            <div class="tag-count vp-count" :class="{'hide_tag' : !showVpCount(player) }"><span>VP</span></div>
            
            <template v-for="player in player.players">
             <div class="player_name_cont highlighter_box" :class="'player_bg_color_'+player.color">
                <span class="player_name" >{{player.name}}</span>
             </div>
                <template v-for="tag in getTags()">
                    <div class="grid-item" :class="'player_tag_bg_color_'+player.color"><span>{{getTagCount(player, tag)}}</span></div>
                </template>
                
                <div class="grid-item" :class="[{'grid_end' : !showVpCount(player) },'player_tag_bg_color_'+player.color]"><span>{{getCardCount(player)}}</span></div>
                
                <div class="grid-item" :class="[{'grid_end' : showVpCount(player) }, {'hide_tag' : !showVpCount(player) }, 'player_tag_bg_color_'+player.color]"><span>{{getVpCount(player)}}</span></div>
            </template>
        </div>
    </div>
    `
});

