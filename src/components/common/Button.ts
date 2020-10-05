import Vue from "vue";

export const Button = Vue.component("Button", {
    props: {
        title: {
            type: String,
            required: true,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        size: {
            type: String,
            default: "normal",
            validator: (item) =>
                ["small", "normal", "big", "jumbo"].includes(item),
        },
        disableOnServerBusy: {
            type: Boolean,
            default: true,
        },
        type: {
            type: String,
            default: "normal",
            validator: (item) =>
                ["normal", "action", "max", "success", "error"].includes(item),
        },
        onClick: {
            type: Function,
            default: () => {},
        },
    },
    methods: {
        getClasses: function (): string {
            const classes: Array<String> = ["btn"];
            //size
            if (this.size === "small") {
                classes.push("btn-sm");
            } else if (this.size === "big") {
                classes.push("btn-lg");
            }
            //type
            if (this.type === "max") {
                classes.push("btn-max"); //#TODO max_button?
            } else if (this.size === "success") {
                classes.push("btn-success");
            } else if (this.size === "error") {
                classes.push("btn-error");
            } else if (this.size === "action") {
                classes.push("btn-action");
            }
            //disabled
            if (this.disableOnServerBusy) {
                if ((this.$root as any).isServerSideRequestInProgress) {
                    classes.push("loading");
                }
            }

            return classes.join(" ");
        },
        getDisabled: function (): boolean {
            if (this.disableOnServerBusy) {
                return (
                    this.disabled ||
                    (this.$root as any).isServerSideRequestInProgress
                );
            }
            return this.disabled;
        },
    },
    template: `
        <button v-on:click.prevent="onClick()" :class="getClasses()" :disabled="getDisabled()" v-i18n>{{ title }}</button>
    `,
});
