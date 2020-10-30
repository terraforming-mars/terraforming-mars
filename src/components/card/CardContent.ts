import Vue from "vue";
import { CardMetadata } from "../../cards/CardMetadata";
import { CardRequirementsComponent } from "./CardRequirementsComponent";
import { CardPoints } from "./CardVictoryPoints";
import { CardDescription } from "./CardDescription";

export const CardContent = Vue.component("CardContent", {
    props: {
        metadata: {
            type: Object as () => CardMetadata,
            required: true,
        },
    },
    components: {
        CardRequirementsComponent,
        CardPoints,
        CardDescription,
    },
    methods: {
        getClasses: function (): string {
            const classes: Array<string> = ["content"];
            return classes.join(" ");
        },
    },
    template: `
        <div :class="getClasses()">
            <CardVictoryPoints v-if="metadata.victoryPoints !== undefined" :amount="metadata.victoryPoints" />
            <CardRequirementsComponent v-if="metadata.requirements !== undefined" :requirements="metadata.requirements"/>
            <CardDescription v-if="metadata.description !== undefined" :text="metadata.description" />
        </div>
    `,
});
