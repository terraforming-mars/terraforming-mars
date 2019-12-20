
import Vue from "vue";
import { HowToPay } from "../inputs/HowToPay";

interface SelectHowToPayModel {
    heat: number;
    megaCredits: number;
    steel: number;
    titanium: number;
    microbes: number;
    warning: string | undefined;
}

export const SelectHowToPay = Vue.component("select-how-to-pay", {
    props: ["player", "playerinput", "onsave", "showtitle"],
    data: function () {
        return {
            heat: 0,
            megaCredits: 0,
            steel: 0,
            titanium: 0,
            microbes: 0,
            warning: undefined
        } as SelectHowToPayModel;
    },
    methods: {
        hasWarning: function () {
            return this.$data.warning !== undefined;
        },
        pay: function () {
            const htp: HowToPay = {
                heat: this.$data.heat,
                megaCredits: this.$data.megaCredits,
                steel: this.$data.steel,
                titanium: this.$data.titanium,
                microbes: this.$data.microbes
            };
            if (htp.megaCredits > this.player.megaCredits) {
                this.$data.warning = "You don't have that many mega credits";
                return;
            }
            if (htp.microbes > this.player.microbes) {
                this.$data.warning = "You don't have enough microbes";
                return;
            }
            if (htp.heat > this.player.heat) {
                this.$data.warning = "You don't have enough heat";
                return;
            }
            if (htp.titanium > this.player.titanium) {
                this.$data.warning = "You don't have enough titanium";
                return;
            }
            if (htp.steel > this.player.steel) {
                this.$data.warning = "You don't have enough steel";
                return;
            }
            if (this.playerinput.amount > 0 && htp.heat + htp.megaCredits + (htp.steel * this.player.steelValue) + (htp.titanium * this.player.titaniumValue) < this.playerinput.amount) {
                this.$data.warning = "Haven't spent enough";
                return;
            }
            this.onsave([[JSON.stringify(htp)]]);
        }
    },
    template: `
<div>
  <div v-if="showtitle === true">{{playerinput.title}}</div>
  <div v-if="playerinput.canUseSteel" class="nes-field">
    <label>Steel:</label>
    <input class="nes-input" type="number" value="0" min="0" max="100" v-model.number="steel" />
  </div>
  <div v-if="playerinput.canUseTitanium" class="nes-field">
    <label>Titanium:</label>
    <input class="nes-input" type="number" value="0" min="0" max="100" v-model.number="titanium" />
  </div>
  <div v-if="playerinput.canUseHeat" class="nes-field">
    <label>Heat:</label>
    <input class="nes-input" type="number" value="0" min="0" max="100" v-model.number="heat" />
  </div>
  <div v-if="playerinput.canUseMicrobes" class="nes-field">
    <label>Microbes:</label>
    <input class="nes-input" type="number" value="0" min="0" max="100" v-model.number="microbes" />
  </div>
  <div class="nes-field">
    <label>Mega Credit:</label>
    <input class="nes-input" type="number" value="0" min="0" max="100" v-model.number="megaCredits" />
  </div>
  <div v-if="hasWarning()" class="nes-container is-rounded">
    <span class="nes-text is-warning">{{ warning }}</span>
  </div>
  <button class="nes-btn" v-on:click="pay">Save</button>
</div>
`
});

