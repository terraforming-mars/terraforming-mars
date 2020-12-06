
import Vue from 'vue';
import {$t} from '../directives/i18n';
import {Button} from '../components/common/Button';

interface SelectHowToPayForCardModel {
    card: string;
    cards: Array<CardModel>;
    cost: number;
    heat: number;
    megaCredits: number;
    steel: number;
    titanium: number;
    microbes: number;
    floaters: number;
    warning: string | undefined;
}

import {HowToPay} from '../inputs/HowToPay';
import {getProjectCardByName, Card} from './card/Card';
import {Tags} from '../cards/Tags';
import {CardModel} from '../models/CardModel';
import {CardOrderStorage} from './CardOrderStorage';
import {PaymentWidgetMixin} from './PaymentWidgetMixin';
import {PlayerInputModel} from '../models/PlayerInputModel';
import {PlayerModel} from '../models/PlayerModel';
import {PreferencesManager} from './PreferencesManager';

export const SelectHowToPayForCard = Vue.component('select-how-to-pay-for-card', {
  props: {
    player: {
      type: Object as () => PlayerModel,
    },
    playerinput: {
      type: Object as () => PlayerInputModel,
    },
    onsave: {
      type: Function as unknown as () => (out: Array<Array<string>>) => void,
    },
    showsave: {
      type: Boolean,
    },
    showtitle: {
      type: Boolean,
    },
  },
  data: function(): SelectHowToPayForCardModel {
    let cards: Array<CardModel> = [];
    let card: string | undefined;
    if (this.playerinput !== undefined &&
            this.playerinput.cards !== undefined &&
            this.playerinput.cards.length > 0) {
      cards = CardOrderStorage.getOrdered(
        CardOrderStorage.getCardOrder(this.player.id),
        this.playerinput.cards,
      );
      card = cards[0].name;
    }
    if (card === undefined) {
      throw new Error('no card provided in player input');
    }
    return {
      card,
      cards,
      cost: 0,
      heat: 0,
      megaCredits: 0,
      steel: 0,
      titanium: 0,
      microbes: 0,
      floaters: 0,
      warning: undefined,
    } as SelectHowToPayForCardModel;
  },
  components: {
    Card,
    Button,
  },
  mixins: [PaymentWidgetMixin],
  mounted: function() {
    const app = this;
    Vue.nextTick(function() {
      app.$data.cost = app.getCardCost();
      app.$data.megaCredits = (app as unknown as typeof PaymentWidgetMixin.methods).getMegaCreditsMax();

      app.setDefaultMicrobesValue();
      app.setDefaultFloatersValue();
      app.setDefaultSteelValue();
      app.setDefaultTitaniumValue();
      app.setDefaultHeatValue();
    });
  },
  methods: {
    getCardCost: function() {
      const cards = this.player.cardsInHand.concat(this.player.selfReplicatingRobotsCards);
      for (const icard of cards) {
        if (this.card === icard.name) {
          return icard.calculatedCost;
        }
      }
      throw new Error(`card not found ${this.card}`);
    },
    getTitle: function() {
      return $t(this.playerinput.title);
    },
    setDefaultMicrobesValue: function() {
      // automatically use available microbes to pay if not enough MC
      if (!this.canAffordWithMcOnly() && this.canUseMicrobes()) {
        const remainingCostToPay = this.cost - this.player.megaCredits;
        const requiredMicrobes = Math.ceil(remainingCostToPay / 2);

        if (this.playerinput.microbes !== undefined && requiredMicrobes > this.playerinput.microbes) {
          this.microbes = this.playerinput.microbes;
        } else {
          this.microbes = requiredMicrobes;
        }

        const discountedCost = this.cost - (this.microbes * 2);
        this.megaCredits = Math.max(discountedCost, 0);
      } else {
        this.microbes = 0;
      }
    },
    setDefaultFloatersValue: function() {
      // automatically use available floaters to pay if not enough MC
      if (!this.canAffordWithMcOnly() && this.canUseFloaters()) {
        const remainingCostToPay = this.cost - this.player.megaCredits - (this.microbes * 2);
        const requiredFloaters = Math.ceil(Math.max(remainingCostToPay, 0) / 3);

        if (this.playerinput.floaters !== undefined && requiredFloaters > this.playerinput.floaters) {
          this.floaters = this.playerinput.floaters;
        } else {
          this.floaters = requiredFloaters;
        }

        const discountedCost = this.cost - (this.microbes * 2) - (this.floaters * 3);
        this.megaCredits = Math.max(discountedCost, 0);
      } else {
        this.floaters = 0;
      }
    },
    setDefaultSteelValue: function() {
      // automatically use available steel to pay if not enough MC
      if (!this.canAffordWithMcOnly() && this.canUseSteel()) {
        const remainingCostToPay = this.cost - this.player.megaCredits - (this.microbes * 2) - (this.floaters * 3);
        let requiredSteelQty = Math.ceil(Math.max(remainingCostToPay, 0) / this.player.steelValue);

        if (requiredSteelQty > this.player.steel) {
          this.steel = this.player.steel;
        } else {
          // use as much steel as possible without overpaying by default
          let currentSteelValue = requiredSteelQty * this.player.steelValue;
          while (currentSteelValue <= remainingCostToPay + this.player.megaCredits - this.player.steelValue && requiredSteelQty < this.player.steel) {
            requiredSteelQty++;
            currentSteelValue = requiredSteelQty * this.player.steelValue;
          }

          this.steel = requiredSteelQty;
        }

        const discountedCost = this.cost - (this.microbes * 2) - (this.floaters * 3) - (this.steel * this.player.steelValue);
        this.megaCredits = Math.max(discountedCost, 0);
      } else {
        this.steel = 0;
      }
    },
    setDefaultTitaniumValue: function() {
      // automatically use available titanium to pay if not enough MC
      if (!this.canAffordWithMcOnly() && this.canUseTitanium()) {
        const remainingCostToPay = this.cost - this.player.megaCredits - (this.microbes * 2) - (this.floaters * 3) - (this.steel * this.player.steelValue);
        let requiredTitaniumQty = Math.ceil(Math.max(remainingCostToPay, 0) / this.player.titaniumValue);

        if (requiredTitaniumQty > this.player.titanium) {
          this.titanium = this.player.titanium;
        } else {
          // use as much titanium as possible without overpaying by default
          let currentTitaniumValue = requiredTitaniumQty * this.player.titaniumValue;
          while (currentTitaniumValue <= remainingCostToPay + this.player.megaCredits - this.player.titaniumValue && requiredTitaniumQty < this.player.titanium) {
            requiredTitaniumQty++;
            currentTitaniumValue = requiredTitaniumQty * this.player.titaniumValue;
          }

          this.titanium = requiredTitaniumQty;
        }

        const discountedCost = this.cost - (this.microbes * 2) - (this.floaters * 3) - (this.steel * this.player.steelValue) - (this.titanium * this.player.titaniumValue);
        this.megaCredits = Math.max(discountedCost, 0);
      } else {
        this.titanium = 0;
      }
    },
    setDefaultHeatValue: function() {
      // automatically use available heat for Helion if not enough MC
      if (!this.canAffordWithMcOnly() && this.canUseHeat()) {
        const remainingCostToPay = this.cost - this.player.megaCredits - (this.microbes * 2) - (this.floaters * 3) - (this.steel * this.player.steelValue) - (this.titanium * this.player.titaniumValue);
        const requiredHeat = Math.max(remainingCostToPay, 0);

        if (requiredHeat > this.player.heat) {
          this.heat = this.player.heat;
        } else {
          this.heat = requiredHeat;
        }

        const discountedCost = this.cost - (this.microbes * 2) - (this.floaters * 3) - (this.steel * this.player.steelValue) - (this.titanium * this.player.titaniumValue) - this.heat;
        this.megaCredits = Math.max(discountedCost, 0);
      } else {
        this.heat = 0;
      }
    },
    canAffordWithMcOnly: function() {
      return this.player.megaCredits >= this.cost;
    },
    canUseHeat: function() {
      return this.playerinput.canUseHeat && this.player.heat > 0;
    },
    canUseSteel: function() {
      if (this.card !== undefined && this.player.steel > 0) {
        const card = getProjectCardByName(this.card);
        if (card !== undefined) {
          if (card.tags.find((tag) => tag === Tags.STEEL) !== undefined) {
            return true;
          }
        }
      }
      return false;
    },
    canUseTitanium: function() {
      if (this.card !== undefined && this.player.titanium > 0) {
        const card = getProjectCardByName(this.card);
        if (card !== undefined) {
          if (card.tags.find((tag) => tag === Tags.SPACE) !== undefined) {
            return true;
          }
        }
      }
      return false;
    },
    canUseMicrobes: function() {
      if (this.card !== undefined && this.playerinput.microbes !== undefined && this.playerinput.microbes > 0) {
        const card = getProjectCardByName(this.card);
        if (card !== undefined) {
          if (card.tags.find((tag) => tag === Tags.PLANT) !== undefined) {
            return true;
          }
        }
      }
      return false;
    },
    canUseFloaters: function() {
      if (this.card !== undefined && this.playerinput.floaters !== undefined && this.playerinput.floaters > 0) {
        const card = getProjectCardByName(this.card);
        if (card !== undefined) {
          if (card.tags.find((tag) => tag === Tags.VENUS) !== undefined) {
            return true;
          }
        }
      }
      return false;
    },
    cardChanged: function() {
      this.cost = this.getCardCost();
      this.megaCredits = (this as unknown as typeof PaymentWidgetMixin.methods).getMegaCreditsMax();

      this.setDefaultMicrobesValue();
      this.setDefaultFloatersValue();
      this.setDefaultSteelValue();
      this.setDefaultTitaniumValue();
      this.setDefaultHeatValue();
    },
    hasWarning: function() {
      return this.warning !== undefined;
    },
    saveData: function() {
      const htp: HowToPay = {
        heat: this.heat,
        megaCredits: this.megaCredits,
        steel: this.steel,
        titanium: this.titanium,
        microbes: this.microbes,
        floaters: this.floaters,
        isResearchPhase: false,
      };
      if (htp.megaCredits > this.player.megaCredits) {
        this.warning = 'You don\'t have that many mega credits';
        return;
      }
      if (this.playerinput.microbes !== undefined && htp.microbes > this.playerinput.microbes) {
        this.warning = 'You don\'t have enough microbes';
        return;
      }
      if (this.playerinput.floaters !== undefined && htp.floaters > this.playerinput.floaters) {
        this.warning = 'You don\'t have enough floaters';
        return;
      }
      if (htp.heat > this.player.heat) {
        this.warning = 'You don\'t have enough heat';
        return;
      }
      if (htp.titanium > this.player.titanium) {
        this.warning = 'You don\'t have enough titanium';
        return;
      }
      if (htp.steel > this.player.steel) {
        this.warning = 'You don\'t have enough steel';
        return;
      }

      const totalSpentAmt = (3 * htp.floaters) + (2 * htp.microbes) + htp.heat + htp.megaCredits + (htp.steel * this.player.steelValue) + (htp.titanium * this.player.titaniumValue);

      if (totalSpentAmt < this.getCardCost()) {
        this.warning = 'Haven\'t spent enough';
        return;
      }

      if (totalSpentAmt > this.getCardCost()) {
        const diff = totalSpentAmt - this.getCardCost();
        if (htp.titanium && diff >= this.player.titaniumValue) {
          this.warning = 'You cannot overspend titanium';
          return;
        }
        if (htp.steel && diff >= this.player.steelValue) {
          this.warning = 'You cannot overspend steel';
          return;
        }
        if (htp.floaters && diff >= 3) {
          this.warning = 'You cannot overspend floaters';
          return;
        }
        if (htp.microbes && diff >= 2) {
          this.warning = 'You cannot overspend microbes';
          return;
        }
        if (htp.heat && diff >= 1) {
          this.warning = 'You cannot overspend heat';
          return;
        }
        if (htp.megaCredits && diff >= 1) {
          this.warning = 'You cannot overspend megaCredits';
          return;
        }
      }

      const showAlert = PreferencesManager.loadValue('show_alerts') === '1';

      if (totalSpentAmt > this.getCardCost() && showAlert) {
        const diff = totalSpentAmt - this.getCardCost();

        if (confirm('Warning: You are overpaying by ' + diff + ' MC')) {
          this.onsave([[
            this.card,
            JSON.stringify(htp),
          ]]);
        } else {
          this.warning = 'Please adjust payment amount';
          return;
        }
      } else {
        this.onsave([[
          this.card,
          JSON.stringify(htp),
        ]]);
      }
    },
  },
  template: `<div class="payments_cont">

  <div v-if="showtitle === true">{{ getTitle() }}</div>

  <label v-for="availableCard in cards" class="payments_cards">
    <input class="hidden" type="radio" v-model="card" v-on:change="cardChanged()" :value="availableCard.name" />
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
</div>`,
});

