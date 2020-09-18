
import Vue from "vue";

import { Colony } from "./Colony";
import { ColonyName } from "../colonies/ColonyName";

export const SelectColony = Vue.component("select-colony", {
    props: ["player", "playerinput", "onsave", "showsave", "showtitle"],
    data: function () {
        return {
          selectedColony: ColonyName
        };
    },
    components: {
        "colony": Colony
    },
    methods: {
        saveData: function () {
            this.onsave([[this.$data.selectedColony]]);
        },
        checkColony: function(colonyName: ColonyName): boolean {
            for (let index = 0; index < this.playerinput.colonies.length; index++) {
                if (this.playerinput.colonies[index].name === colonyName) return true;
            }
            return false;
        },
    },
    template: `<div class="wf-component wf-component--select-card">
        <div v-if="showtitle === true" class="nofloat wf-component-title" v-i18n>{{playerinput.title}}</div>
        <label v-for="colony in player.colonies" class="cardbox" :key="colony.name">
            <input type="radio" v-model="selectedColony" :value="colony.name" />
            <colony v-if="checkColony(colony.name)" :colony="colony"></colony>
        </label>
        <div v-if="showsave === true" class="nofloat">
            <button class="btn btn-primary" v-on:click="saveData">{{playerinput.buttonLabel}}</button>
        </div>
    </div>`
});

