
import Vue from "vue";

export const SelectOption = Vue.component("select-option", {
    props: ["playerinput", "onsave", "showsave", "showtitle"],
    data: function () {
        return {};
    },
    methods: {
        saveData: function () {
            this.onsave([["1"]]);
        }
    },
    template: `<div class="wf-component wf-component--select-option">
        <div v-if="showtitle === true" class="wf-component-title">{{playerinput.title}}</div>
        <button v-if="showsave === true" class="btn btn-lg btn-primary" v-on:click="saveData">Select</button>
    </div>`
});

