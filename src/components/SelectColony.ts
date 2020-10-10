import Vue from "vue";

import { Colony } from "./Colony";
import { Button } from "../components/common/Button";

export const SelectColony = Vue.component("select-colony", {
    props: ["playerinput", "onsave", "showsave", "showtitle"],
    data: function () {
        return {
          selectedColony: undefined
        };
    },
    components: {
        "colony": Colony,
        "Button": Button
    },
    methods: {
        saveData: function () {
            this.onsave([[this.$data.selectedColony]]);
        },
    },
    template: `<div class="wf-component wf-component--select-card">
        <div v-if="showtitle === true" class="nofloat wf-component-title" v-i18n>{{playerinput.title}}</div>
        <label v-for="colony in playerinput.coloniesModel" class="cardbox" :key="colony.name">
            <input type="radio" v-model="selectedColony" :value="colony.name" />
            <colony :colony="colony"></colony>
        </label>
        <div v-if="showsave === true" class="nofloat">
            <Button :onClick="saveData" :title="playerinput.buttonLabel" /> 
        </div>
    </div>`
});

