
import Vue from "vue";
import { HowToPay } from "../inputs/HowToPay";
import { PaymentWidgetMixin } from "./PaymentWidgetMixin";

interface SelectHowToPayModel {
    heat: number;
    megaCredits: number;
    steel: number;
    titanium: number;
    microbes: number;
    floaters: number;
    warning: string | undefined;
}

export const SelectHowToPay = Vue.component("select-how-to-pay", {
    props: ["player", "playerinput", "onsave", "showsave", "showtitle"],
    data: function () {
        return {
            cost: 0,
            heat: 0,
            megaCredits: 0,
            steel: 0,
            titanium: 0,
            microbes: 0,
            floaters: 0,
            warning: undefined
        } as SelectHowToPayModel;
    },
    mixins: [PaymentWidgetMixin],
    mounted: function () {
      let app = this;
      Vue.nextTick(function () {
        app.$data.cost = app.playerinput.amount;
        app.$data.megaCredits = (app as any).getMegaCreditsMax();
      });
    },
    methods: {
        hasWarning: function () {
            return this.$data.warning !== undefined;
        },
        saveData: function () {
            const htp: HowToPay = {
                heat: this.$data.heat,
                megaCredits: this.$data.megaCredits,
                steel: this.$data.steel,
                titanium: this.$data.titanium,
                microbes: 0,
                floaters: 0
            };
            if (htp.megaCredits > this.player.megaCredits) {
                this.$data.warning = "You don't have that many mega credits";
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
            if (this.playerinput.amount > 0 &&
                htp.heat +
                htp.megaCredits +
                (htp.steel * this.player.steelValue) +
                (htp.titanium * this.player.titaniumValue) +
                (htp.microbes * 2) +
                (htp.floaters * 3)
                < this.playerinput.amount) {
                this.$data.warning = "Haven't spent enough";
                return;
            }
            this.onsave([[JSON.stringify(htp)]]);
        }
    },
    template: `<div class="payments_cont">
  <section v-trim-whitespace>

    <h3 class="payments_title">{{playerinput.title}}</h3>

    <div class="payments_type input-group" v-if="playerinput.canUseSteel">

      <i class="resource_icon resource_icon--steel payments_type_icon" title="Pay by Steel"></i>
      <button class="btn btn-primary" v-on:click="reduceValue('steel', 1)" :class="getCssClassFor('<', 'steel')"><i class="icon icon-minus" /></button>
      <input class="form-input form-inline payments_input" v-model.number="steel" />
      <button class="btn btn-primary" v-on:click="addValue('steel', 1)" :class="getCssClassFor('>', 'steel')"><i class="icon icon-plus" /></button>
    </div>

    <div class="payments_type input-group" v-if="playerinput.canUseTitanium">
      <i class="resource_icon resource_icon--titanium payments_type_icon" title="Pay by Titanium"></i>
      <button class="btn btn-primary" v-on:click="reduceValue('titanium', 1)" :class="getCssClassFor('<', 'titanium')"><i class="icon icon-minus" /></button>
      <input class="form-input form-inline payments_input" v-model.number="titanium" />
      <button class="btn btn-primary" v-on:click="addValue('titanium', 1)" :class="getCssClassFor('>', 'titanium')"><i class="icon icon-plus" /></button>
    </div>

    <div class="payments_type input-group" v-if="playerinput.canUseHeat">
      <i class="resource_icon resource_icon--heat payments_type_icon" title="Pay by Heat"></i>
      <button class="btn btn-primary" v-on:click="reduceValue('heat', 1)" :class="getCssClassFor('<', 'heat')"><i class="icon icon-minus" /></button>
      <input class="form-input form-inline payments_input" v-model.number="heat" />
      <button class="btn btn-primary" v-on:click="addValue('heat', 1)" :class="getCssClassFor('>', 'heat')"><i class="icon icon-plus" /></button>
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

