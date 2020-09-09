import Vue from "vue";

export const isTagsViewConcise = (root: any): boolean => {
    return (root as any).getVisibilityState("tags_concise");
};

export const OverviewSettings = Vue.component("overview-settings", {
    methods: {
        toggleTagsView: function () {
            (this.$root as any).setVisibilityState(
                "tags_concise",
                !(this.$root as any).getVisibilityState("tags_concise")
            );
        },
        getTagToggleLabel: function (): string {
            return isTagsViewConcise(this.$root) ? "full" : "concise";
        },
    },
    template: `
        <div class="players-overview-settings">
            <div class="setting-label">toggle tags view:</div>
            <div class="setting-button" v-on:click.prevent="toggleTagsView()">{{ getTagToggleLabel() }}</div>
        </div>
    `,
});
