
import Vue from "vue";
import { Button } from "../components/common/Button";

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
import { getProjectCardByName, Card } from "./card/Card";
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
        Card,
        "Button": Button   
    },
    mixins: [PaymentWidgetMixin],
    mounted: function () {
        const app = this;
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
            const cards = this.player.cardsInHand.concat(this.player.selfReplicatingRobotsCards);
            for (const icard of cards) {
                if (this.$data.card.name === icard.name) {
                    return icard.calculatedCost
                }
            }
        },
        setDefaultMicrobesValue: function() {
            // automatically use available microbes to pay if not enough MC
            if (!this.canAffordWithMcOnly() && this.canUseMicrobes()) {
                const remainingCostToPay = this.$data.cost - this.player.megaCredits;
                const requiredMicrobes = Math.ceil(remainingCostToPay / 2);

                if (requiredMicrobes > this.playerinput.microbes) {
                    this.$data.microbes = this.playerinput.microbes;
                } else {
                    this.$data.microbes = requiredMicrobes;
                }

                const discountedCost = this.$data.cost - (this.$data.microbes * 2);
                this.$data.megaCredits = Math.max(discountedCost, 0);
            } else {
                this.$data.microbes = 0;
            }
        },
        setDefaultFloatersValue: function() {
            // automatically use available floaters to pay if not enough MC
            if (!this.canAffordWithMcOnly() && this.canUseFloaters()) {
                const remainingCostToPay = this.$data.cost - this.player.megaCredits - (this.$data.microbes * 2);
                const requiredFloaters = Math.ceil(Math.max(remainingCostToPay, 0) / 3)

                if (requiredFloaters > this.playerinput.floaters) {
                    this.$data.floaters = this.playerinput.floaters;
                } else {
                    this.$data.floaters = requiredFloaters;
                }

                const discountedCost = this.$data.cost - (this.$data.microbes * 2) - (this.$data.floaters * 3);
                this.$data.megaCredits = Math.max(discountedCost, 0);
            } else {
                this.$data.floaters = 0;
            }
        },
        setDefaultSteelValue: function() {
            // automatically use available steel to pay if not enough MC
            if (!this.canAffordWithMcOnly() && this.canUseSteel()) {
                const remainingCostToPay = this.$data.cost - this.player.megaCredits - (this.$data.microbes * 2) - (this.$data.floaters * 3);
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

                const discountedCost = this.$data.cost - (this.$data.microbes * 2) - (this.$data.floaters * 3) - (this.$data.steel * this.player.steelValue);
                this.$data.megaCredits = Math.max(discountedCost, 0);
            } else {
                this.$data.steel = 0;
            }
        },
        setDefaultTitaniumValue: function() {
            // automatically use available titanium to pay if not enough MC
            if (!this.canAffordWithMcOnly() && this.canUseTitanium()) {
                const remainingCostToPay = this.$data.cost - this.player.megaCredits - (this.$data.microbes * 2) - (this.$data.floaters * 3) - (this.$data.steel * this.player.steelValue);
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

                const discountedCost = this.$data.cost - (this.$data.microbes * 2) - (this.$data.floaters * 3) - (this.$data.steel * this.player.steelValue) - (this.$data.titanium * this.player.titaniumValue);
                this.$data.megaCredits = Math.max(discountedCost, 0);
            } else {
                this.$data.titanium = 0;
            }
        },
        setDefaultHeatValue: function() {
            // automatically use available heat for Helion if not enough MC
            if (!this.canAffordWithMcOnly() && this.canUseHeat()) {
                const remainingCostToPay = this.$data.cost - this.player.megaCredits - (this.$data.microbes * 2) - (this.$data.floaters * 3) - (this.$data.steel * this.player.steelValue) - (this.$data.titanium * this.player.titaniumValue);
                const requiredHeat = Math.max(remainingCostToPay, 0);
                
                if (requiredHeat > this.player.heat) {
                    this.$data.heat = this.player.heat;
                } else {
                    this.$data.heat = requiredHeat;
                }

                const discountedCost = this.$data.cost - (this.$data.microbes * 2) - (this.$data.floaters * 3) - (this.$data.steel * this.player.steelValue) - (this.$data.titanium * this.player.titaniumValue) - this.$data.heat;
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

            if (totalSpentAmt > this.getCardCost()) {
                const diff = totalSpentAmt - this.getCardCost();
                if (htp.titanium && diff >= this.player.titaniumValue) {
                    this.$data.warning = "You cannot overspend titanium";
                    return;
                }
                if (htp.steel && diff >= this.player.steelValue) {
                    this.$data.warning = "You cannot overspend steel";
                    return;
                }
                if (htp.floaters && diff >= 3) {
                    this.$data.warning = "You cannot overspend floaters";
                    return;
                }
                if (htp.microbes && diff >= 2) {
                    this.$data.warning = "You cannot overspend microbes";
                    return;
                }
                if (htp.heat && diff >= 1) {
                    this.$data.warning = "You cannot overspend heat";
                    return;
                }
                if (htp.megaCredits && diff >= 1) {
                    this.$data.warning = "You cannot overspend megaCredits";
                    return;
                }
            }

            const showAlert = PreferencesManager.loadValue("show_alerts") === "1";
            
            if (totalSpentAmt > this.getCardCost() && showAlert) {
                const diff = totalSpentAmt - this.getCardCost();
  
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
    <Card class="cardbox" :card="availableCard" />
  </label>

  <section v-trim-whitespace>

    <h3 class="payments_title">How to pay?</h3>

    <div class="payments_type input-group" v-if="canUseSteel()">
      <i class="resource_icon resource_icon--steel payments_type_icon" title="Pay by Steel"></i>
      <Button type="minus" :onClick="_=>reduceValue('steel', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="steel" />
      <Button type="plus" :onClick="_=>addValue('steel', 1)" />
      <Button type="max" :onClick="_=>setMaxValue('steel')" title="MAX" />
    </div>

    <div class="payments_type input-group" v-if="canUseTitanium()">
      <i class="resource_icon resource_icon--titanium payments_type_icon" title="Pay by Titanium"></i>
      <Button type="minus" :onClick="_=>reduceValue('titanium', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="titanium" />
      <Button type="plus" :onClick="_=>addValue('titanium', 1)" />
      <Button type="max" :onClick="_=>setMaxValue('titanium')" title="MAX" />   
    </div>

    <div class="payments_type input-group" v-if="canUseHeat()">
      <i class="resource_icon resource_icon--heat payments_type_icon" title="Pay by Heat"></i>
      <Button type="minus" :onClick="_=>reduceValue('heat', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="heat" />
      <Button type="plus" :onClick="_=>addValue('heat', 1)" />
      <Button type="max" :onClick="_=>setMaxValue('heat')" title="MAX" /> 
    </div>

    <div class="payments_type input-group" v-if="canUseMicrobes()">
      <i class="resource_icon resource_icon--microbe payments_type_icon" title="Pay by Microbes"></i>
      <Button type="minus" :onClick="_=>reduceValue('microbes', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="microbes" />
      <Button type="plus" :onClick="_=>addValue('microbes', 1)" />
      <Button type="max" :onClick="_=>setMaxValue('microbes')" title="MAX" /> 
    </div>

    <div class="payments_type input-group" v-if="canUseFloaters()">
      <i class="resource_icon resource_icon--floater payments_type_icon" title="Pay by Floaters"></i>
      <Button type="minus" :onClick="_=>reduceValue('floaters', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="floaters" />
      <Button type="plus" :onClick="_=>addValue('floaters', 1)" />
      <Button type="max" :onClick="_=>setMaxValue('floaters')" title="MAX" />
    </div>

    <div class="payments_type input-group">
      <i class="resource_icon resource_icon--megacredits payments_type_icon" title="Pay by Megacredits"></i>
      <Button type="minus" :onClick="_=>reduceValue('megaCredits', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="megaCredits" />
      <Button type="plus" :onClick="_=>addValue('megaCredits', 1)" />
    </div>

    <div v-if="hasWarning()" class="tm-warning">
      <label class="label label-error">{{ warning }}</label>
    </div>

    <div v-if="showsave === true" class="payments_save">
      <Button size="big" :onClick="saveData" :title="playerinput.buttonLabel" />
    </div>
  </section>
</div>`
});

