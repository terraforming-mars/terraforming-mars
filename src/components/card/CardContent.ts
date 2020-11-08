import Vue from "vue";
import { CardMetadata } from "../../cards/CardMetadata";
import { CardRequirementsComponent } from "./CardRequirementsComponent";
import { CardVictoryPoints } from "./CardVictoryPoints";
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
        CardVictoryPoints,
        CardDescription,
    },
    methods: {
        getClasses: function (): string {
            const classes: Array<string> = ["card-content"];
            return classes.join(" ");
        },
    },
    template: `
        <div :class="getClasses()">
            <CardRequirementsComponent v-if="metadata.requirements !== undefined" :requirements="metadata.requirements"/>
            <CardDescription v-if="metadata.description !== undefined" :text="metadata.description" />
            <CardVictoryPoints v-if="metadata.victoryPoints !== undefined" :amount="metadata.victoryPoints" />
        </div>
    `,
});
