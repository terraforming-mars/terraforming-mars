
import Vue from "vue";

interface SelectHowToPayForCardModel {
    card: string | undefined;
    heat: number;
    megaCredits: number;
    steel: number;
    titanium: number;
	microbes: number;
}

import { HowToPay } from "../inputs/HowToPay";
import { getProjectCardByName, Card } from "./Card";
import { Tags } from "../cards/Tags";

export const SelectHowToPayForCard = Vue.component("select-how-to-pay-for-card", {
    props: ["player", "playerinput", "onsave", "showtitle"],
    data: function () {
        return {
            card: "",
            heat: 0,
            megaCredits: 0,
            steel: 0,
            titanium: 0,
            microbes: 0
        } as SelectHowToPayForCardModel;
    },
    components: {
        "card": Card
    },
    methods: {
        getCardCost: function () {
            if (this.$data.card !== undefined) {
                const card = getProjectCardByName(this.$data.card);
                if (card !== undefined) {
                    return card.cost;
                }
            }
            return 36; // max card cost;
        },
        canUseHeat: function () {
            return this.playerinput.canUseHeatAsMegaCredits;
        },
        canUseSteel: function () {
            if (this.$data.card !== undefined && this.player.steel > 0) {
                const card = getProjectCardByName(this.$data.card);
                if (card !== undefined) {
                    if (card.tags.find((tag) => tag === Tags.STEEL) !== undefined) {
                        return true;
                    }
                }
            }
            return false;
        },
        canUseTitanium: function () {
            if (this.$data.card !== undefined && this.player.titanium > 0) {
                const card = getProjectCardByName(this.$data.card);
                if (card !== undefined) {
                    if (card.tags.find((tag) => tag === Tags.SPACE) !== undefined) {
                        return true;
                    }
                }
            }
            return false;
		},	
        canUseMicrobes: function () {
            if (this.$data.card !== undefined && this.player.canUseMicrobesAsMegaCreditsForPlants) {
                const card = getProjectCardByName(this.$data.card);
                if (card !== undefined) {
                    if (card.tags.find((tag) => tag === Tags.PLANT) !== undefined) {
                        return true;
                    }
                }
            }
            return false;			
        },
        save: function () {
            const htp: HowToPay = {
                heat: parseInt(this.$data.heat),
                megaCredits: parseInt(this.$data.megaCredits),
                steel: parseInt(this.$data.steel),
                titanium: parseInt(this.$data.titanium),
                microbes: parseInt(this.$data.microbes)
            };
            this.onsave([[
                this.$data.card,
                JSON.stringify(htp)
            ]]);
        }
    },
    template: `
        <div>
            <div v-if="showtitle === true">{{playerinput.title}}</div>
            <label v-for="availableCard in playerinput.cards" :key="availableCard" style="display:block;font-size:12px">
                <input class="nes-radio" type="radio" v-model="card" :value="availableCard" />
                <card :card="availableCard"></card>
            </label>
            <div v-if="canUseSteel()" class="nes-field">
                <label>Steel:</label>
                <input class="nes-input" type="number" value="0" min="0" max="100" v-model="steel" />
            </div>
            <div v-if="canUseTitanium()" class="nes-field">
                <label>Titanium:</label>
                <input class="nes-input" type="number" value="0" min="0" max="100" v-model="titanium" />
            </div>
            <div v-if="canUseHeat()" class="nes-field">
                <label>Heat:</label>
                <input class="nes-input" type="number" value="0" min="0" max="100" v-model="heat" />
            </div>
            <div v-if="canUseMicrobes()" class="nes-field">
                <label>Microbes:</label>
                <input class="nes-input" type="number" value="0" min="0" max="100" v-model="microbes" />
            </div>			
            <div class="nes-field">
                <label>Mega Credit:</label>
                <input class="nes-input" type="number" value="0" min="0" :max="getCardCost()" v-model="megaCredits" />
            </div>
            <button class="nes-btn" v-on:click="save">Save</button>
        </div>
    `
});

