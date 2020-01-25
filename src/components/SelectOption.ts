
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
    template: `<div>
  <div v-if="showtitle === true">{{playerinput.title}}</div>
  <button v-if="showsave === true" class="nes-btn" v-on:click="saveData">Select</button>
</div>`
});

