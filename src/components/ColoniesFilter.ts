import Vue from "vue";
import { Callisto } from "../colonies/Callisto";
import { Ceres } from "../colonies/Ceres";
import { Europa } from "../colonies/Europa";
import { Ganymede } from "../colonies/Ganymede";
import { Io } from "../colonies/Io";
import { Luna } from "../colonies/Luna";
import { Miranda } from "../colonies/Miranda";
import { Pluto } from "../colonies/Pluto";
import { Titan } from "../colonies/Titan";
import { Triton } from "../colonies/Triton";
import { Enceladus } from "../colonies/Enceladus";
import { ColonyName } from "../colonies/ColonyName";


let allColonies = [
    new Callisto(),
    new Ceres(),
    new Enceladus(),
    new Europa(),
    new Ganymede(),
    new Io(),
    new Luna(),
    new Miranda(),
    new Pluto(),
    new Titan(),
    new Triton()

];

export const ColoniesFilter = Vue.component("colonies-filter", {
    data: function () {
        return {
            allColonies: allColonies.slice(),
            selectedColonies: allColonies.slice()
        }
    },
    watch: {
        selectedColonies: function (value) {
            let colonyNames: Array<ColonyName> = [];
            value.forEach(function (el: any) { colonyNames.push(el.name)} );
            this.$emit("colonies-list-changed", colonyNames);
        },
    },
    template: `
    <div class="colonies-filter">
        <div>
            <h2 v-i18n>Colonies</h2>
        </div>
        <div class="colonies-filter-list">
            <label class="form-checkbox" v-for="colony in allColonies">
                <input type="checkbox" v-model="selectedColonies" :value="colony"/>
                <i class="form-icon"></i><span v-i18n>{{ colony.name }} - ({{ colony.description }})</span>
            </label>    
        </div>
    </div>
    `
})
