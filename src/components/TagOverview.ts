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
            return 0;
        }
    },
    template: `
    <div class="tags_cont" v-trim-whitespace>
        <div class="tags-grid">
            <div>
                <span>Player</span>
            </div>
            
            <div v-for="tag in getTags()" class="tag-count" :class="'tag-'+ tag"></div>
            
            <template v-for="player in player.players">
             <div class="player_name_cont highlighter_box" :class="'player_bg_color_'+player.color">
                <span class="player_name" >{{player.name}}</span>
             </div>
                <template v-for="tag in getTags()">
                    <div class="grid-item" :class="'player_tag_bg_color_'+player.color"><span>{{getTagCount(player, tag)}}</span></div>
                </template>
            </template>
        </div>
    </div>
    `
});

