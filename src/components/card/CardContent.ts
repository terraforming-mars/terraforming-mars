import Vue from "vue";
import { CardMetadata } from "../../cards/CardMetadata";
import { CardRequirementsComponent } from "./CardRequirementsComponent";
import { CardDescription } from "./CardDescription";
import { CardOnPlayData } from "./CardOnPlayData";
import { CardVictoryPoints } from "./CardVictoryPoints";

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
        CardOnPlayData,
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
            <CardOnPlayData v-if="metadata.onPlay !== undefined" :data="metadata.onPlay" />
            <CardDescription v-if="metadata.description !== undefined" :text="metadata.description" />
            <CardVictoryPoints v-if="metadata.victoryPoints !== undefined" :amount="metadata.victoryPoints" />
        </div>
    `,
});
