import Vue from "vue";
import { CorporationGroup } from "../../CorporationName";

export const CardExpansion = Vue.component("CardExpansion", {
    props: {
        expansion: {
            type: String,
            required: true,
        },
    },
    methods: {
        getClasses: function (): string {
            const classes = ["card-expansion", "project-icon"];
            if (this.expansion === CorporationGroup.PROMO) {
                classes.push("promo-icon");
            } else if (this.expansion === CorporationGroup.COLONIES) {
                classes.push("colonies-icon");
            } else if (this.expansion === CorporationGroup.VENUS_NEXT) {
                classes.push("venus-icon");
            } else if (this.expansion === CorporationGroup.TURMOIL) {
                classes.push("turmoil-icon");
            } else if (this.expansion === CorporationGroup.COMMUNITY) {
                classes.push("community-icon");
            } else if (this.expansion === CorporationGroup.PRELUDE) {
                classes.push("prelude-icon");
            } else if (this.expansion === CorporationGroup.CORPORATION) {
                classes.push("corporate-icon");
            }

            return classes.join(" ");
        },
    },
    template: `
        <div :class="getClasses()"></div>
    `,
});
