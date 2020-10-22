import Vue from "vue";
//#TODO implement points per tag
export const CardDescription = Vue.component("CardDescription", {
    props: {
        text: {
            type: String,
            required: true,
        },
    },
    template: `
        <div class="card-description">({{ text }})</div>
    `,
});
