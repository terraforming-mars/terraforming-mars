
import Vue from "vue";
import { HowToPay } from "../inputs/HowToPay";

export const SelectHowToPay = Vue.component("select-how-to-pay", {
    props: ["playerinput", "onsave"],
    data: function () {
        return {
            heat: 0,
            megaCredits: 0,
            steel: 0,
            titanium: 0
        };
    },
    methods: {
        pay: function () {
            const htp: HowToPay = {
                heat: parseInt(this.$data.heat),
                megaCredits: parseInt(this.$data.megaCredits),
                steel: parseInt(this.$data.steel),
                titanium: parseInt(this.$data.titanium)
            };
            this.onsave([[JSON.stringify(htp)]]);
        }
    },
    template: `
        <div>
            <div>{{playerinput.title}}</div>
            <div v-if="playerinput.canUseSteel" class="nes-field">
                <label>Steel:</label>
                <input class="nes-input" type="number" value="0" min="0" max="100" v-model="steel" />
            </div>
            <div v-if="playerinput.canUseTitanium" class="nes-field">
                <label>Titanium:</label>
                <input class="nes-input" type="number" value="0" min="0" max="100" v-model="titanium" />
            </div>
            <div v-if="playerinput.canUseHeat" class="nes-field">
                <label>Heat:</label>
                <input class="nes-input" type="number" value="0" min="0" max="100" v-model="heat" />
            </div>
            <div class="nes-field">
                <label>Mega Credit:</label>
                <input class="nes-input" type="number" value="0" min="0" max="100" v-model="megaCredits" />
            </div>
            <button class="nes-btn" v-on:click="pay">Save</button>
        </div>
    `
});


