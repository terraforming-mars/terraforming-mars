
import Vue from "vue";

interface SelectHowToPayForCardModel {
    card: string | undefined;
    heat: number;
    megaCredits: number;
    steel: number;
    titanium: number;
    microbes: number;
    floaters: number;
    warning: string | undefined;
}

import { HowToPay } from "../inputs/HowToPay";
import { getProjectCardByName, Card } from "./Card";
import { Tags } from "../cards/Tags";
import { PaymentWidgetMixin } from "./PaymentWidgetMixin";

export const SelectHowToPayForCard = Vue.component("select-how-to-pay-for-card", {
    props: ["player", "playerinput", "onsave", "showsave", "showtitle"],
    data: function () {
        return {
            card: this.playerinput.cards[0],
            heat: 0,
            megaCredits: 0,
            steel: 0,
            titanium: 0,
            microbes: 0,
            floaters: 0,
            warning: undefined
        } as SelectHowToPayForCardModel;
    },
    components: {
        "card": Card
    },
    mixins: [PaymentWidgetMixin],
    mounted: function () {
        let app = this;
        Vue.nextTick(function () {
            app.$data.megaCredits = app.getCardCost();
        });
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
            return this.playerinput.canUseHeat && this.player.heat > 0;
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
            if (this.$data.card !== undefined && this.playerinput.microbes > 0) {
                const card = getProjectCardByName(this.$data.card);
                if (card !== undefined) {
                    if (card.tags.find((tag) => tag === Tags.PLANT) !== undefined) {
                        return true;
                    }
                }
            }
            return false;			
        },
        canUseFloaters: function () {
            if (this.$data.card !== undefined && this.playerinput.floaters > 0) {
                const card = getProjectCardByName(this.$data.card);
                if (card !== undefined) {
                    if (card.tags.find((tag) => tag === Tags.VENUS) !== undefined) {
                        return true;
                    }
                }
            }
            return false;			
        },
        cardChanged: function () {
            this.$data.megaCredits = this.getCardCost();
            
            this.titanium = 0;
            this.steel = 0;
            this.heat = 0;
            this.microbes = 0;
            this.floaters = 0;
        },
        hasWarning: function () {
            return this.$data.warning !== undefined;
        },
        saveData: function () {
            const htp: HowToPay = {
                heat: this.$data.heat,
                megaCredits: this.$data.megaCredits,
                steel: this.$data.steel,
                titanium: this.$data.titanium,
                microbes: this.$data.microbes,
                floaters: this.$data.floaters
            };
            if (htp.megaCredits > this.player.megaCredits) {
                this.$data.warning = "You don't have that many mega credits";
                return;
            }
            if (htp.microbes > this.playerinput.microbes) {
                this.$data.warning = "You don't have enough microbes";
                return;
            }
            if (htp.floaters > this.playerinput.floaters) {
                this.$data.warning = "You don't have enough floaters";
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
            if ( (3 * htp.floaters) + (2 * htp.microbes) + htp.heat + htp.megaCredits + (htp.steel * this.player.steelValue) + (htp.titanium * this.player.titaniumValue) < this.getCardCost()) {
                this.$data.warning = "Haven't spent enough";
                return;
            }
            this.onsave([[
                this.$data.card,
                JSON.stringify(htp)
            ]]);
        }
    },
    template: `<div class="payments_cont">
  <div v-if="showtitle === true">{{playerinput.title}}</div>
  <label v-for="availableCard in playerinput.cards" :key="availableCard" class="payments_cards">
    <input class="nes-radio" type="radio" v-model="card" v-on:change="cardChanged()" :value="availableCard" />
    <card class="cardbox" :card="availableCard"></card>
  </label>
  <section class="nes-container with-title" v-trim-whitespace>
    <h3 class="payments_title">How to pay?</h3>
    <div class="payments_type" v-if="canUseSteel()">
      <i class="resource_icon resource_icon--steel payments_type_icon" title="Pay by Steel"></i>
      <button class="nes-btn" v-on:click="reduceValue('steel', 1)" :class="getCssClassFor('<', 'steel')"><</button>
      <input class="nes-input payments_input" v-model.number="steel" />
      <button class="nes-btn" v-on:click="addValue('steel', 1)" :class="getCssClassFor('>', 'steel')">></button>
    </div>
    <div class="payments_type" v-if="canUseTitanium()">
      <i class="resource_icon resource_icon--titanium payments_type_icon" title="Pay by Titanium"></i>
      <button class="nes-btn" v-on:click="reduceValue('titanium', 1)" :class="getCssClassFor('<', 'titanium')">&lt;</button>
      <input class="nes-input payments_input" v-model.number="titanium" />
      <button class="nes-btn" v-on:click="addValue('titanium', 1)" :class="getCssClassFor('>', 'titanium')">></button>
    </div>
    <div class="payments_type" v-if="canUseHeat()">
      <i class="resource_icon resource_icon--heat payments_type_icon" title="Pay by Heat"></i>
      <button class="nes-btn" v-on:click="reduceValue('heat', 1)" :class="getCssClassFor('<', 'heat')"><</button>
      <input class="nes-input payments_input" v-model.number="heat" />
      <button class="nes-btn" v-on:click="addValue('heat', 1)" :class="getCssClassFor('>', 'heat')">></button>
    </div>
    <div class="payments_type" v-if="canUseMicrobes()">
      <i class="resource_icon resource_icon--microbe payments_type_icon" title="Pay by Microbes"></i>
      <button class="nes-btn" v-on:click="reduceValue('microbes', 1)" :class="getCssClassFor('<', 'microbes')"><</button>
      <input class="nes-input payments_input" v-model.number="microbes" />
      <button class="nes-btn" v-on:click="addValue('microbes', 1)" :class="getCssClassFor('>', 'microbes')">></button>
    </div>
    <div class="payments_type" v-if="canUseFloaters()">
      <i class="resource_icon resource_icon--floater payments_type_icon" title="Pay by Floaters"></i>
      <button class="nes-btn" v-on:click="reduceValue('floaters', 1)" :class="getCssClassFor('<', 'floaters')"><</button>
      <input class="nes-input payments_input" v-model.number="floaters" />
      <button class="nes-btn" v-on:click="addValue('floaters', 1)" :class="getCssClassFor('>', 'floaters')">></button>
    </div>
    <div class="payments_type">
      <i class="resource_icon resource_icon--megacredits payments_type_icon" title="Pay by Megacredits"></i>
      <button class="nes-btn" v-on:click="reduceValue('megaCredits', 1)" :class="getCssClassFor('<', 'megaCredits')"><</button>
      <input class="nes-input payments_input" v-model.number="megaCredits" />
      <button class="nes-btn" v-on:click="addValue('megaCredits', 1)" :class="getCssClassFor('>', 'megaCredits')">&gt;</button>
    </div>
    <div v-if="hasWarning()" class="nes-container is-rounded">
      <span class="nes-text is-warning">{{ warning }}</span>
    </div>
    <div v-if="showsave === true" class="payments_save">
      <button class="nes-btn" v-on:click="saveData">Save</button>
    </div>
  </section>
</div>`
});

