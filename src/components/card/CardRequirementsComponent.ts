import Vue from "vue";
import { CardRequirements } from "../../cards/CardRequirements";

export const CardRequirementsComponent = Vue.component("CardRequirements", {
    props: {
        requirements: {
            type: Object as () => CardRequirements,
            required: true,
        },
    },
    methods: {
        getClasses: function (): string {
            const classes: Array<string> = ["requirements"];
            if (this.requirements.hasMax()) {
                classes.push("requirements-max");
            }
            return classes.join(" ");
        },
    },
    template: `
        <div :class="getClasses()">{{ requirements.getRequirementsText() }}</div>
    `,
});
