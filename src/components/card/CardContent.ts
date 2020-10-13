import Vue from "vue";
import { CardMetadata } from "../../cards/CardMetadata";
import { CardRequirementsComponent } from "./CardRequirementsComponent";
import { CardPoints } from "./CardPoints";
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
        CardDescription
    },
    methods: {
        getClasses: function (): string {
            const classes: Array<string> = ["content"];
            return classes.join(" ");
        },
    },
    template: `
        <div :class="getClasses()">
            <CardPoints v-if="metadata.points !== undefined" :amount="metadata.pints" />
            <CardRequirementsComponent v-if="metadata.requirements !== undefined" :requirements="metadata.requirements"/>
            <div class="description">{{ metadata.description }}</div>
        </div>
    `,
});
