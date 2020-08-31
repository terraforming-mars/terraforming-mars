import Vue from "vue";
import { TagCount } from "../TagCount";

export const PlayerTags = Vue.component("player-tags", {
    props: ["player"],
    components: {
        "tag-count": TagCount,
    },
    template: `
        <div class="player-tags">
            <div v-for="tag in player.tags">
                <tag-count v-if="tag.count > 0" :tag="tag.tag" :count="tag.count" :size="'big'"/>
            </div>
        </div>
    `,
});
