
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
import { PreferencesManager } from "./PreferencesManager";

export const SelectHowToPayForCard = Vue.component("select-how-to-pay-for-card", {
    props: ["player", "playerinput", "onsave", "showsave", "showtitle"],
    data: function () {
        return {
            card: this.playerinput.cards[0],
            cost: 0,
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
            app.$data.cost = app.getCardCost();
            app.$data.megaCredits = (app as any).getMegaCreditsMax();

            app.setDefaultMicrobesValue();
            app.setDefaultFloatersValue();
            app.setDefaultSteelValue();
            app.setDefaultTitaniumValue();
            app.setDefaultHeatValue();
        });
    },
    methods: {
        getCardCost: function () {
            let cards = this.player.cardsInHand.concat(this.player.selfReplicatingRobotsCards);
            for (const icard of cards) {
                if (this.$data.card.name === icard.name) {
                    return icard.calculatedCost
                }
            }
        },
        setDefaultMicrobesValue: function() {
            // automatically use available microbes to pay if not enough MC
            if (!this.canAffordWithMcOnly() && this.canUseMicrobes()) {
                let remainingCostToPay = this.$data.cost - this.player.megaCredits;
                let requiredMicrobes = Math.ceil(remainingCostToPay / 2);

                if (requiredMicrobes > this.playerinput.microbes) {
                    this.$data.microbes = this.playerinput.microbes;
                } else {
                    this.$data.microbes = requiredMicrobes;
                }

                let discountedCost = this.$data.cost - (this.$data.microbes * 2);
                this.$data.megaCredits = Math.max(discountedCost, 0);
            } else {
                this.$data.microbes = 0;
            }
        },
        setDefaultFloatersValue: function() {
            // automatically use available floaters to pay if not enough MC
            if (!this.canAffordWithMcOnly() && this.canUseFloaters()) {
                let remainingCostToPay = this.$data.cost - this.player.megaCredits - (this.$data.microbes * 2);
                let requiredFloaters = Math.ceil(Math.max(remainingCostToPay, 0) / 3)

                if (requiredFloaters > this.playerinput.floaters) {
                    this.$data.floaters = this.playerinput.floaters;
                } else {
                    this.$data.floaters = requiredFloaters;
                }

                let discountedCost = this.$data.cost - (this.$data.microbes * 2) - (this.$data.floaters * 3);
                this.$data.megaCredits = Math.max(discountedCost, 0);
            } else {
                this.$data.floaters = 0;
            }
        },
        setDefaultSteelValue: function() {
            // automatically use available steel to pay if not enough MC
            if (!this.canAffordWithMcOnly() && this.canUseSteel()) {
                let remainingCostToPay = this.$data.cost - this.player.megaCredits - (this.$data.microbes * 2) - (this.$data.floaters * 3);
                let requiredSteelQty = Math.ceil(Math.max(remainingCostToPay, 0) / this.player.steelValue);
                
                if (requiredSteelQty > this.player.steel) {
                    this.$data.steel = this.player.steel;
                } else {
                    // use as much steel as possible without overpaying by default
                    let currentSteelValue = requiredSteelQty * this.player.steelValue;
                    while (currentSteelValue <= remainingCostToPay + this.player.megaCredits - this.player.steelValue && requiredSteelQty < this.player.steel) {
                        requiredSteelQty++;
                        currentSteelValue = requiredSteelQty * this.player.steelValue;
                    }

                    this.$data.steel = requiredSteelQty;
                }

                let discountedCost = this.$data.cost - (this.$data.microbes * 2) - (this.$data.floaters * 3) - (this.$data.steel * this.player.steelValue);
                this.$data.megaCredits = Math.max(discountedCost, 0);
            } else {
                this.$data.steel = 0;
            }
        },
        setDefaultTitaniumValue: function() {
            // automatically use available titanium to pay if not enough MC
            if (!this.canAffordWithMcOnly() && this.canUseTitanium()) {
                let remainingCostToPay = this.$data.cost - this.player.megaCredits - (this.$data.microbes * 2) - (this.$data.floaters * 3) - (this.$data.steel * this.player.steelValue);
                let requiredTitaniumQty = Math.ceil(Math.max(remainingCostToPay, 0) / this.player.titaniumValue);
                
                if (requiredTitaniumQty > this.player.titanium) {
                    this.$data.titanium = this.player.titanium;
                } else {
                    // use as much titanium as possible without overpaying by default
                    let currentTitaniumValue = requiredTitaniumQty * this.player.titaniumValue;
                    while (currentTitaniumValue <= remainingCostToPay + this.player.megaCredits - this.player.titaniumValue && requiredTitaniumQty < this.player.titanium) {
                        requiredTitaniumQty++;
                        currentTitaniumValue = requiredTitaniumQty * this.player.titaniumValue;
                    }

                    this.$data.titanium = requiredTitaniumQty;
                }

                let discountedCost = this.$data.cost - (this.$data.microbes * 2) - (this.$data.floaters * 3) - (this.$data.steel * this.player.steelValue) - (this.$data.titanium * this.player.titaniumValue);
                this.$data.megaCredits = Math.max(discountedCost, 0);
            } else {
                this.$data.titanium = 0;
            }
        },
        setDefaultHeatValue: function() {
            // automatically use available heat for Helion if not enough MC
            if (!this.canAffordWithMcOnly() && this.canUseHeat()) {
                let remainingCostToPay = this.$data.cost - this.player.megaCredits - (this.$data.microbes * 2) - (this.$data.floaters * 3) - (this.$data.steel * this.player.steelValue) - (this.$data.titanium * this.player.titaniumValue);
                let requiredHeat = Math.max(remainingCostToPay, 0);
                
                if (requiredHeat > this.player.heat) {
                    this.$data.heat = this.player.heat;
                } else {
                    this.$data.heat = requiredHeat;
                }

                let discountedCost = this.$data.cost - (this.$data.microbes * 2) - (this.$data.floaters * 3) - (this.$data.steel * this.player.steelValue) - (this.$data.titanium * this.player.titaniumValue) - this.$data.heat;
                this.$data.megaCredits = Math.max(discountedCost, 0);
            } else {
                this.$data.heat = 0;
            }
        },
        canAffordWithMcOnly: function() {
            return this.player.megaCredits >= this.$data.cost;
        },
        canUseHeat: function () {
            return this.playerinput.canUseHeat && this.player.heat > 0;
        },
        canUseSteel: function () {
            if (this.$data.card !== undefined && this.player.steel > 0) {
                const card = getProjectCardByName(this.$data.card.name);
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
                const card = getProjectCardByName(this.$data.card.name);
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
                const card = getProjectCardByName(this.$data.card.name);
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
                const card = getProjectCardByName(this.$data.card.name);
                if (card !== undefined) {
                    if (card.tags.find((tag) => tag === Tags.VENUS) !== undefined) {
                        return true;
                    }
                }
            }
            return false;
        },
        cardChanged: function () {
            this.$data.cost = this.getCardCost();
            this.$data.megaCredits = (this as any).getMegaCreditsMax();

            this.setDefaultMicrobesValue();
            this.setDefaultFloatersValue();
            this.setDefaultSteelValue();
            this.setDefaultTitaniumValue();
            this.setDefaultHeatValue();
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
                floaters: this.$data.floaters,
                isResearchPhase: false
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

            const totalSpentAmt = (3 * htp.floaters) + (2 * htp.microbes) + htp.heat + htp.megaCredits + (htp.steel * this.player.steelValue) + (htp.titanium * this.player.titaniumValue);

            if (totalSpentAmt < this.getCardCost()) {
                this.$data.warning = "Haven't spent enough";
                return;
            }

            const showAlert = PreferencesManager.loadValue("show_alerts") === "1";
            
            if (totalSpentAmt > this.getCardCost() && showAlert) {
                let diff = totalSpentAmt - this.getCardCost();
  
                if (confirm("Warning: You are overpaying by " + diff + " MC")) {
                    this.onsave([[
                        this.$data.card.name,
                        JSON.stringify(htp)
                    ]]);
                } else {
                    this.$data.warning = "Please adjust payment amount";
                    return;
                }
            } else {
                this.onsave([[
                    this.$data.card.name,
                    JSON.stringify(htp)
                ]]);
            }
        }
    },
    template: `<div class="payments_cont">

  <div v-if="showtitle === true">{{playerinput.title}}</div>

  <label v-for="availableCard in playerinput.cards" class="payments_cards">
    <input class="hidden" type="radio" v-model="card" v-on:change="cardChanged()" :value="availableCard" />
    <card class="cardbox" :card="availableCard"></card>
  </label>

  <section v-trim-whitespace>

    <h3 class="payments_title">How to pay?</h3>

    <div class="payments_type input-group" v-if="canUseSteel()">
      <i class="resource_icon resource_icon--steel payments_type_icon" title="Pay by Steel"></i>
      <button class="btn btn-primary" v-on:click="reduceValue('steel', 1)" :class="getCssClassFor('<', 'steel')"><i class="icon icon-minus" /></button>
      <input class="form-input form-inline payments_input" v-model.number="steel" />
      <button class="btn btn-primary" v-on:click="addValue('steel', 1)" :class="getCssClassFor('>', 'steel')"><i class="icon icon-plus" /></button>
    </div>

    <div class="payments_type input-group" v-if="canUseTitanium()">
      <i class="resource_icon resource_icon--titanium payments_type_icon" title="Pay by Titanium"></i>
      <button class="btn btn-primary" v-on:click="reduceValue('titanium', 1)" :class="getCssClassFor('<', 'titanium')"><i class="icon icon-minus" /></button>
      <input class="form-input form-inline payments_input" v-model.number="titanium" />
      <button class="btn btn-primary" v-on:click="addValue('titanium', 1)" :class="getCssClassFor('>', 'titanium')"><i class="icon icon-plus" /></button>
    </div>

    <div class="payments_type input-group" v-if="canUseHeat()">
      <i class="resource_icon resource_icon--heat payments_type_icon" title="Pay by Heat"></i>
      <button class="btn btn-primary" v-on:click="reduceValue('heat', 1)" :class="getCssClassFor('<', 'heat')"><i class="icon icon-minus" /></button>
      <input class="form-input form-inline payments_input" v-model.number="heat" />
      <button class="btn btn-primary" v-on:click="addValue('heat', 1)" :class="getCssClassFor('>', 'heat')"><i class="icon icon-plus" /></button>
    </div>

    <div class="payments_type input-group" v-if="canUseMicrobes()">
      <i class="resource_icon resource_icon--microbe payments_type_icon" title="Pay by Microbes"></i>
      <button class="btn btn-primary" v-on:click="reduceValue('microbes', 1)" :class="getCssClassFor('<', 'microbes')"><i class="icon icon-minus" /></button>
      <input class="form-input form-inline payments_input" v-model.number="microbes" />
      <button class="btn btn-primary" v-on:click="addValue('microbes', 1)" :class="getCssClassFor('>', 'microbes')"><i class="icon icon-plus" /></button>
    </div>

    <div class="payments_type input-group" v-if="canUseFloaters()">
      <i class="resource_icon resource_icon--floater payments_type_icon" title="Pay by Floaters"></i>
      <button class="btn btn-primary" v-on:click="reduceValue('floaters', 1)" :class="getCssClassFor('<', 'floaters')"><i class="icon icon-minus" /></button>
      <input class="form-input form-inline payments_input" v-model.number="floaters" />
      <button class="btn btn-primary" v-on:click="addValue('floaters', 1)" :class="getCssClassFor('>', 'floaters')"><i class="icon icon-plus" /></button>
    </div>

    <div class="payments_type input-group">
      <i class="resource_icon resource_icon--megacredits payments_type_icon" title="Pay by Megacredits"></i>
      <button class="btn btn-primary" v-on:click="reduceValue('megaCredits', 1)" :class="getCssClassFor('<', 'megaCredits')"><i class="icon icon-minus" /></button>
      <input class="form-input form-inline payments_input" v-model.number="megaCredits" />
      <button class="btn btn-primary" v-on:click="addValue('megaCredits', 1)" :class="getCssClassFor('>', 'megaCredits')"><i class="icon icon-plus" /></button>
    </div>

    <div v-if="hasWarning()" class="tm-warning">
      <label class="label label-error">{{ warning }}</label>
    </div>

    <div v-if="showsave === true" class="payments_save">
      <button class="btn btn-lg btn-primary" v-on:click="saveData">Save</button>
    </div>
  </section>
</div>`
});

