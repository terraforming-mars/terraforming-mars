
import Vue from 'vue';
import {HowToPay} from '../inputs/HowToPay';
import {PaymentWidgetMixin} from './PaymentWidgetMixin';
import {PlayerInputModel} from '../models/PlayerInputModel';
import {PlayerModel} from '../models/PlayerModel';
import {PreferencesManager} from './PreferencesManager';
import {Button} from '../components/common/Button';
import {TranslateMixin} from './TranslateMixin';

interface SelectHowToPayModel {
    cost: number;
    heat: number;
    megaCredits: number;
    steel: number;
    titanium: number;
    microbes: number;
    floaters: number;
    warning: string | undefined;
}

export const SelectHowToPay = Vue.component('select-how-to-pay', {
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
  components: {
    'Button': Button,
  },
  data: function() {
    return {
      cost: 0,
      heat: 0,
      megaCredits: 0,
      steel: 0,
      titanium: 0,
      microbes: 0,
      floaters: 0,
      warning: undefined,
    } as SelectHowToPayModel;
  },
  mixins: [PaymentWidgetMixin, TranslateMixin],
  mounted: function() {
    Vue.nextTick(() => {
      this.setInitialCost();
      this.$data.megaCredits = (this as any).getMegaCreditsMax();

      this.setDefaultSteelValue();
      this.setDefaultTitaniumValue();
      this.setDefaultHeatValue();
    });
  },
  methods: {
    hasWarning: function() {
      return this.$data.warning !== undefined;
    },
    setInitialCost: function() {
      this.$data.cost = this.playerinput.amount;
    },
    setDefaultSteelValue: function() {
      // automatically use available steel to pay if not enough MC
      if (!this.canAffordWithMcOnly() && this.canUseSteel()) {
        let requiredSteelQty = Math.ceil(Math.max(this.$data.cost - this.player.megaCredits, 0) / this.player.steelValue);

        if (requiredSteelQty > this.player.steel) {
          this.$data.steel = this.player.steel;
        } else {
          // use as much steel as possible without overpaying by default
          let currentSteelValue = requiredSteelQty * this.player.steelValue;
          while (currentSteelValue <= this.$data.cost - this.player.steelValue && requiredSteelQty < this.player.steel) {
            requiredSteelQty++;
            currentSteelValue = requiredSteelQty * this.player.steelValue;
          }

          this.$data.steel = requiredSteelQty;
        }

        const discountedCost = this.$data.cost - (this.$data.steel * this.player.steelValue);
        this.$data.megaCredits = Math.max(discountedCost, 0);
      } else {
        this.$data.steel = 0;
      }
    },
    setDefaultTitaniumValue: function() {
      // automatically use available titanium to pay if not enough MC
      if (!this.canAffordWithMcOnly() && this.canUseTitanium()) {
        let requiredTitaniumQty = Math.ceil(Math.max(this.$data.cost - this.player.megaCredits - (this.$data.steel * this.player.steelValue), 0) / this.player.titaniumValue);

        if (requiredTitaniumQty > this.player.titanium) {
          this.$data.titanium = this.player.titanium;
        } else {
          // use as much titanium as possible without overpaying by default
          let currentTitaniumValue = requiredTitaniumQty * this.player.titaniumValue;
          while (currentTitaniumValue <= this.$data.cost - this.player.titaniumValue && requiredTitaniumQty < this.player.titanium) {
            requiredTitaniumQty++;
            currentTitaniumValue = requiredTitaniumQty * this.player.titaniumValue;
          }

          this.$data.titanium = requiredTitaniumQty;
        }

        const discountedCost = this.$data.cost - (this.$data.steel * this.player.steelValue) - (this.$data.titanium * this.player.titaniumValue);
        this.$data.megaCredits = Math.max(discountedCost, 0);
      } else {
        this.$data.titanium = 0;
      }
    },
    setDefaultHeatValue: function() {
      // automatically use available heat for Helion if not enough MC
      if (!this.canAffordWithMcOnly() && this.canUseHeat()) {
        this.$data.heat = Math.max(this.$data.cost - this.player.megaCredits - (this.$data.steel * this.player.steelValue) - (this.$data.titanium * this.player.titaniumValue), 0);
      } else {
        this.$data.heat = 0;
      }
      const discountedCost = this.$data.cost - (this.$data.steel * this.player.steelValue) - (this.$data.titanium * this.player.titaniumValue) - this.$data.heat;
      this.$data.megaCredits = Math.max(discountedCost, 0);
    },
    canAffordWithMcOnly: function() {
      return this.player.megaCredits >= this.$data.cost;
    },
    canUseHeat: function() {
      return this.playerinput.canUseHeat && this.player.heat > 0;
    },
    canUseSteel: function() {
      return this.playerinput.canUseSteel && this.player.steel > 0;
    },
    canUseTitanium: function() {
      return this.playerinput.canUseTitanium && this.player.titanium > 0;
    },
    saveData: function() {
      const htp: HowToPay = {
        heat: this.$data.heat,
        megaCredits: this.$data.megaCredits,
        steel: this.$data.steel,
        titanium: this.$data.titanium,
        microbes: 0,
        floaters: 0,
      };

      if (htp.megaCredits > this.player.megaCredits) {
        this.$data.warning = 'You don\'t have that many M€';
        return;
      }
      if (htp.heat > this.player.heat) {
        this.$data.warning = 'You don\'t have enough heat';
        return;
      }
      if (htp.titanium > this.player.titanium) {
        this.$data.warning = 'You don\'t have enough titanium';
        return;
      }
      if (htp.steel > this.player.steel) {
        this.$data.warning = 'You don\'t have enough steel';
        return;
      }

      const requiredAmt = this.playerinput.amount || 0;
      const totalSpentAmt = htp.heat + htp.megaCredits + (htp.steel * this.player.steelValue) + (htp.titanium * this.player.titaniumValue) + (htp.microbes * 2) + (htp.floaters * 3);

      if (requiredAmt > 0 && totalSpentAmt < requiredAmt) {
        this.$data.warning = 'Haven\'t spent enough';
        return;
      }

      if (requiredAmt === 0) {
        htp.heat = 0;
        htp.megaCredits = 0;
      }

      if (requiredAmt > 0 && totalSpentAmt > requiredAmt) {
        const diff = totalSpentAmt - requiredAmt;
        if (htp.titanium && diff >= this.player.titaniumValue) {
          this.$data.warning = 'You cannot overspend titanium';
          return;
        }
        if (htp.steel && diff >= this.player.steelValue) {
          this.$data.warning = 'You cannot overspend steel';
          return;
        }
        if (htp.heat && diff >= 1) {
          this.$data.warning = 'You cannot overspend heat';
          return;
        }
        if (htp.megaCredits && diff >= 1) {
          this.$data.warning = 'You cannot overspend megaCredits';
          return;
        }
      }

      const showAlert = PreferencesManager.load('show_alerts') === '1';

      if (requiredAmt > 0 && totalSpentAmt > requiredAmt && showAlert) {
        const diff = totalSpentAmt - requiredAmt;

        if (confirm('Warning: You are overpaying by ' + diff + ' M€')) {
          this.onsave([[JSON.stringify(htp)]]);
        } else {
          this.$data.warning = 'Please adjust payment amount';
          return;
        }
      } else {
        this.onsave([[JSON.stringify(htp)]]);
      }
    },
  },
  template: `<div class="payments_cont">
  <section v-trim-whitespace>

    <h3 class="payments_title">{{ $t(playerinput.title) }}</h3>

    <div class="payments_type input-group" v-if="playerinput.canUseSteel">
      <i class="resource_icon resource_icon--steel payments_type_icon" :title="$t('Pay by Steel')"></i>
      <Button type="minus" :onClick="_=>reduceValue('steel', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="steel" />
      <Button type="plus" :onClick="_=>addValue('steel', 1)" />
      <Button type="max" :onClick="_=>setMaxValue('steel')" title="MAX" />
    </div>

    <div class="payments_type input-group" v-if="playerinput.canUseTitanium">
      <i class="resource_icon resource_icon--titanium payments_type_icon" :title="$t('Pay by Titanium')"></i>
      <Button type="minus" :onClick="_=>reduceValue('titanium', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="titanium" />
      <Button type="plus" :onClick="_=>addValue('titanium', 1)" />
      <Button type="max" :onClick="_=>setMaxValue('titanium')" title="MAX" />
    </div>

    <div class="payments_type input-group" v-if="playerinput.canUseHeat">
      <i class="resource_icon resource_icon--heat payments_type_icon" :title="$t('Pay by Heat')"></i>
      <Button type="minus" :onClick="_=>reduceValue('heat', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="heat" />
      <Button type="plus" :onClick="_=>addValue('heat', 1)" />
      <Button type="max" :onClick="_=>setMaxValue('heat')" title="MAX" />
    </div>

    <div class="payments_type input-group">
      <i class="resource_icon resource_icon--megacredits payments_type_icon" :title="$t('Pay by Megacredits')"></i>
      <Button type="minus" :onClick="_=>reduceValue('megaCredits', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="megaCredits" />
      <Button type="plus" :onClick="_=>addValue('megaCredits', 1)" />
    </div>

    <div v-if="hasWarning()" class="tm-warning">
      <label class="label label-error">{{ $t(warning) }}</label>
    </div>

    <div v-if="showsave === true" class="payments_save">
      <Button size="big" :onClick="saveData" :title="$t(playerinput.buttonLabel)" />
    </div>

  </section>
</div>`,
});

