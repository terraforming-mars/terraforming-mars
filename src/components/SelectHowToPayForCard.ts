
import Vue from "vue";

interface SelectHowToPayForCardModel {
    card: string | undefined;
    heat: number;
    megaCredits: number;
    steel: number;
    titanium: number;
    microbes: number;
    warning: string | undefined;
}

import { HowToPay } from "../inputs/HowToPay";
import { getProjectCardByName, Card } from "./Card";
import { Tags } from "../cards/Tags";

export const SelectHowToPayForCard = Vue.component("select-how-to-pay-for-card", {
    props: ["player", "playerinput", "onsave", "showtitle"],
    data: function () {
        return {
            card: this.playerinput.cards[0],
            heat: 0,
            megaCredits: 0,
            steel: 0,
            titanium: 0,
            microbes: 0,
            warning: undefined
        } as SelectHowToPayForCardModel;
    },
    components: {
        "card": Card
    },
    mounted: function () {
        this.$data.megaCredits = this.getCardCost();
    },
    methods: {
        getCardCost: function () {
            for (const icard of this.player.cardsInHand) {
                if (this.$data.card === icard.name) {
                    return icard.calculatedCost
                }
            }
            // We should always find a card
            // It may make more sense to throw
            // an error here that the card wasn't found
            return 41; // max card cost
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
        cardChanged: function () {
            this.$data.megaCredits = this.getCardCost();
        },
        hasWarning: function () {
            return this.$data.warning !== undefined;
        },
        save: function () {
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
            if (htp.heat + htp.megaCredits + (htp.steel * this.player.steelValue) + (htp.titanium * this.player.titaniumValue) < this.getCardCost()) {
                this.$data.warning = "Haven't spent enough";
                return;
            }
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
    <input class="nes-radio" type="radio" v-model="card" v-on:change="cardChanged()" :value="availableCard" />
    <card class="cardbox" :card="availableCard"></card>
  </label>
  <div class="nofloat nes-field" v-if="canUseSteel()">
    <label class="nofloat">Steel:</label>
    <input class="nes-input" type="number" value="0" min="0" :max="player.steel" v-model.number="steel" />
  </div>
  <div v-if="canUseTitanium()" class="nes-field">
    <label class="nofloat">Titanium:</label>
    <input class="nes-input" type="number" value="0" min="0" :max="player.titanium" v-model.number="titanium" />
  </div>
  <div v-if="canUseHeat()" class="nes-field">
    <label class="nofloat">Heat:</label>
    <input class="nes-input" type="number" value="0" min="0" :max="player.heat" v-model.number="heat" />
  </div>
  <div v-if="canUseMicrobes()" class="nes-field">
    <label class="nofloat">Microbes:</label>
    <input class="nes-input" type="number" value="0" min="0" :max="player.microbes" v-model.number="microbes" />
  </div>
  <div class="nofloat nes-field">
    <label class="nofloat">Mega Credit:</label>
    <input class="nes-input" type="number" min="0" :max="getCardCost()" v-model.number="megaCredits" />
  </div>
  <div v-if="hasWarning()" class="nes-container is-rounded">
    <span class="nes-text is-warning">{{ warning }}</span>
  </div>
  <button class="nes-btn" v-on:click="save">Save</button>
</div>
`
});

